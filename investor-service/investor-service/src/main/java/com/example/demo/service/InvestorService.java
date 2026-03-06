package com.example.demo.service;

import com.example.demo.client.AdminClient;
import com.example.demo.client.AdvisorClient;
import com.example.demo.client.NotificationClient;
import com.example.demo.client.PortfolioClient;
import com.example.demo.dto.*;
import com.example.demo.entity.Investor;
import com.example.demo.exception.InvalidDataException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.InvestorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class InvestorService {

    private static final BigDecimal DEFAULT_INITIAL_BALANCE = BigDecimal.ZERO;

    private final InvestorRepository repo;
    private final NotificationClient notificationClient;
    private final AdvisorClient advisorClient;
    private final AdminClient adminClient;
    private final PortfolioClient portfolioClient;

    @Value("${app.internal.registration-key:WEALTHFORGE_INTERNAL_KEY}")
    private String internalRegistrationKey;

    @Transactional
    public String buyStock(Long authenticatedInvestorId, BuyRequestDTO dto) {
        validateInvestorOwnership(authenticatedInvestorId, dto.getInvestorId());

        Investor investor = repo.findById(authenticatedInvestorId)
                .orElseThrow(() -> new ResourceNotFoundException("Investor not found"));

        MarketInstrument market = resolveMarketInstrument(dto.getSymbol());
        if ((market.availableQuantity() == null || market.availableQuantity() < dto.getQuantity())
                && market.source() == MarketSource.STOCK) {
            MarketInstrument companyFallback = resolveCompanyInstrument(market.symbol());
            if (companyFallback != null) {
                market = companyFallback;
            }
        }
        if (market.availableQuantity() == null || market.availableQuantity() < dto.getQuantity()) {
            throw new InvalidDataException("Insufficient stock quantity in market");
        }

        UpdateQuantity update = buildQuantityRequest(market.symbol(), dto.getQuantity());
        reserveMarketQuantity(market.source(), update);

        PortfolioTradeRequest tradeRequest = new PortfolioTradeRequest();
        tradeRequest.setAssetSymbol(market.symbol());
        tradeRequest.setQuantity(BigDecimal.valueOf(dto.getQuantity()));
        tradeRequest.setPrice(market.currentPrice());
        tradeRequest.setAssetType("STOCK");

        try {
            portfolioClient.buyInPortfolio(dto.getPortfolioId(), tradeRequest);
        } catch (Exception ex) {
            rollbackMarketQuantitySell(market.source(), update);
            throw new InvalidDataException("Buy failed in portfolio service: " + ex.getMessage());
        }

        BigDecimal total = market.currentPrice().multiply(BigDecimal.valueOf(dto.getQuantity()));
        String message = String.format("""
                Subject: Transaction Confirmation: BUY

                Dear %s,

                Your buy order was executed successfully.
                Portfolio ID: %d
                Asset: %s
                Price: $%.2f
                Quantity: %d
                Total: $%.2f
                Date: %s
                """,
                investor.getInvestorName(),
                dto.getPortfolioId(),
                market.symbol(),
                market.currentPrice().doubleValue(),
                dto.getQuantity(),
                total.doubleValue(),
                LocalDate.now());

        sendNotificationSafe(investor.getEmail(), message);
        return "Stock bought successfully in portfolio " + dto.getPortfolioId();
    }

    @Transactional
    public String sellStock(Long authenticatedInvestorId, SellRequestDTO dto) {
        validateInvestorOwnership(authenticatedInvestorId, dto.getInvestorId());

        Investor investor = repo.findById(authenticatedInvestorId)
                .orElseThrow(() -> new ResourceNotFoundException("Investor not found"));

        MarketInstrument market = resolveMarketInstrument(dto.getAssetName());

        UpdateQuantity update = buildQuantityRequest(market.symbol(), dto.getQuantity());
        returnMarketQuantity(market.source(), update);

        PortfolioTradeRequest tradeRequest = new PortfolioTradeRequest();
        tradeRequest.setAssetSymbol(market.symbol());
        tradeRequest.setQuantity(BigDecimal.valueOf(dto.getQuantity()));
        tradeRequest.setPrice(market.currentPrice());
        tradeRequest.setAssetType("STOCK");

        try {
            portfolioClient.sellInPortfolio(dto.getPortfolioId(), tradeRequest);
        } catch (Exception ex) {
            rollbackMarketQuantityBuy(market.source(), update);
            throw new InvalidDataException("Sell failed in portfolio service: " + ex.getMessage());
        }

        BigDecimal total = market.currentPrice().multiply(BigDecimal.valueOf(dto.getQuantity()));
        String message = String.format("""
                Subject: Transaction Confirmation: SELL

                Dear %s,

                Your sell order was executed successfully.
                Portfolio ID: %d
                Asset: %s
                Price: $%.2f
                Quantity: %d
                Total: $%.2f
                Date: %s
                """,
                investor.getInvestorName(),
                dto.getPortfolioId(),
                market.symbol(),
                market.currentPrice().doubleValue(),
                dto.getQuantity(),
                total.doubleValue(),
                LocalDate.now());

        sendNotificationSafe(investor.getEmail(), message);
        return "Stock sold successfully in portfolio " + dto.getPortfolioId();
    }

    public String transferBetweenPortfolios(Long authenticatedInvestorId, PortfolioTransferRequest request) {
        try {
            Map<String, Object> body = responseBody(
                    portfolioClient.transferBetweenPortfolios(request),
                    "transfer funds between portfolios");
            return extractMessage(body, "Transfer completed successfully");
        } catch (Exception ex) {
            throw new InvalidDataException("Transfer failed: " + ex.getMessage());
        }
    }

    public List<AdvisorDTO> getAdvisorList() {
        return advisorClient.getAdvisors();
    }

    public String getAdvice(String question) {
        return advisorClient.getAdvice(question);
    }

    public List<CompanyDTO> getCompanyList() {
        return adminClient.getAllCompanies();
    }

    public List<StockDTO> getStockList() {
        LinkedHashMap<String, StockDTO> stocksBySymbol = new LinkedHashMap<>();

        try {
            for (StockDTO stock : adminClient.getAllStocks()) {
                if (stock == null || stock.getSymbol() == null || stock.getSymbol().isBlank()) {
                    continue;
                }
                stocksBySymbol.put(normalizeSymbol(stock.getSymbol()), stock);
            }
        } catch (Exception ex) {
            log.warn("Unable to load stocks list from stocks table: {}", ex.getMessage());
        }

        try {
            for (CompanyDTO company : adminClient.getAllCompanies()) {
                if (company == null || company.getSymbol() == null || company.getSymbol().isBlank()) {
                    continue;
                }
                String symbol = normalizeSymbol(company.getSymbol());
                stocksBySymbol.putIfAbsent(symbol, mapCompanyToStock(company, symbol));
            }
        } catch (Exception ex) {
            log.warn("Unable to load fallback stocks list from companies table: {}", ex.getMessage());
        }

        return List.copyOf(stocksBySymbol.values());
    }

    public Map<String, Object> createPortfolio(PortfolioCreateRequest request) {
        return responseBody(portfolioClient.createPortfolio(request), "create portfolio");
    }

    public Map<String, Object> getMyPortfolios() {
        return responseBody(portfolioClient.getMyPortfolios(), "list portfolios");
    }

    public Map<String, Object> getPortfolioById(Long portfolioId) {
        return responseBody(portfolioClient.getPortfolioById(portfolioId), "get portfolio");
    }

    public Map<String, Object> updatePortfolio(Long portfolioId, PortfolioUpdateRequest request) {
        return responseBody(portfolioClient.updatePortfolio(portfolioId, request), "update portfolio");
    }

    public Map<String, Object> deletePortfolio(Long portfolioId) {
        return responseBody(portfolioClient.deletePortfolio(portfolioId), "delete portfolio");
    }

    public Map<String, Object> getPortfolioHoldings(Long portfolioId) {
        return responseBody(portfolioClient.getHoldings(portfolioId), "get holdings");
    }

    public Map<String, Object> getPortfolioPerformance(Long portfolioId) {
        return responseBody(portfolioClient.getPerformance(portfolioId), "get performance");
    }

    public Map<String, Object> transferBetweenPortfolios(PortfolioTransferRequest request) {
        return responseBody(portfolioClient.transferBetweenPortfolios(request), "transfer between portfolios");
    }

    public Map<String, Object> getOverallPerformance() {
        return responseBody(portfolioClient.getOverallPerformance(), "get overall performance");
    }

    public Map<String, Object> getHistory(Long authenticatedInvestorId) {
        repo.findById(authenticatedInvestorId)
                .orElseThrow(() -> new ResourceNotFoundException("Investor not found"));
        return responseBody(portfolioClient.getAllTransactions(), "get transaction history");
    }

    public Map<String, Object> getPortfolioHistory(Long authenticatedInvestorId, Long portfolioId) {
        repo.findById(authenticatedInvestorId)
                .orElseThrow(() -> new ResourceNotFoundException("Investor not found"));
        return responseBody(portfolioClient.getTransactionsForPortfolio(portfolioId), "get portfolio transaction history");
    }

    public List<Investor> listAllInvestors() {
        return repo.findAll();
    }

    public List<InvestorSummaryDTO> listInvestorsByIds(List<Long> investorIds) {
        if (investorIds == null || investorIds.isEmpty()) {
            return List.of();
        }

        List<Long> normalizedIds = investorIds.stream()
                .filter(Objects::nonNull)
                .filter(id -> id > 0)
                .distinct()
                .toList();

        if (normalizedIds.isEmpty()) {
            return List.of();
        }

        Map<Long, Investor> investorsById = repo.findAllById(normalizedIds).stream()
                .collect(Collectors.toMap(Investor::getInvestorId, investor -> investor));

        return normalizedIds.stream()
                .map(investorsById::get)
                .filter(Objects::nonNull)
                .map(this::toInvestorSummary)
                .toList();
    }

    @Transactional
    public Investor registerInvestorProfile(String internalKey, InvestorRegistrationRequest request) {
        if (!Objects.equals(internalRegistrationKey, internalKey)) {
            throw new InvalidDataException("Invalid internal registration key");
        }

        Long investorId = request.getInvestorId();
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        repo.findByEmail(normalizedEmail)
                .filter(existing -> !existing.getInvestorId().equals(investorId))
                .ifPresent(existing -> {
                    throw new InvalidDataException("Email is already linked to another investor");
                });

        Investor investor = repo.findById(investorId).orElseGet(Investor::new);
        boolean isNewInvestor = investor.getInvestorId() == null;

        investor.setInvestorId(investorId);
        investor.setInvestorName(request.getInvestorName().trim());
        investor.setEmail(normalizedEmail);

        if (isNewInvestor) {
            investor.setBalance(defaultInitialBalance(request.getInitialBalance()));
        } else if (investor.getBalance() == null) {
            investor.setBalance(defaultInitialBalance(request.getInitialBalance()));
        }

        return repo.save(investor);
    }

    private void validateInvestorOwnership(Long authenticatedInvestorId, Long requestInvestorId) {
        if (requestInvestorId != null && !requestInvestorId.equals(authenticatedInvestorId)) {
            throw new InvalidDataException("Investor ID in request does not match authenticated user");
        }
    }

    private InvestorSummaryDTO toInvestorSummary(Investor investor) {
        InvestorSummaryDTO dto = new InvestorSummaryDTO();
        dto.setInvestorId(investor.getInvestorId());
        dto.setInvestorName(investor.getInvestorName());
        dto.setEmail(investor.getEmail());
        return dto;
    }

    private void sendNotificationSafe(String email, String message) {
        if (email == null || email.isBlank()) {
            return;
        }
        try {
            NotificationRequest request = new NotificationRequest();
            request.setEmail(email);
            request.setMessage(message);
            notificationClient.sendNotification(request);
        } catch (Exception ex) {
            log.warn("Notification send failed: {}", ex.getMessage());
        }
    }

    private Map<String, Object> responseBody(ResponseEntity<Map<String, Object>> response, String action) {
        if (response == null || response.getBody() == null) {
            throw new InvalidDataException("Unable to " + action + ": empty response from portfolio-service");
        }
        return response.getBody();
    }

    private String extractMessage(Map<String, Object> body, String fallbackMessage) {
        Object message = body.get("message");
        return message instanceof String messageText ? messageText : fallbackMessage;
    }

    private BigDecimal defaultInitialBalance(BigDecimal requestedInitialBalance) {
        return requestedInitialBalance == null ? DEFAULT_INITIAL_BALANCE : requestedInitialBalance;
    }

    private String normalizeSymbol(String symbol) {
        if (symbol == null || symbol.isBlank()) {
            throw new InvalidDataException("Stock symbol is required");
        }
        return symbol.trim().toUpperCase(Locale.ROOT);
    }

    private StockDTO mapCompanyToStock(CompanyDTO company, String normalizedSymbol) {
        StockDTO mapped = new StockDTO();
        mapped.setId(company.getId());
        mapped.setSymbol(normalizedSymbol);
        mapped.setName(company.getCompanyName());
        mapped.setSector(company.getSector());
        mapped.setCurrentPrice(company.getCurrentPrice());
        mapped.setAvailableQuantity(company.getAvailableQuantity());
        return mapped;
    }

    private MarketInstrument resolveMarketInstrument(String rawSymbol) {
        String symbol = normalizeSymbol(rawSymbol);

        try {
            StockDTO stock = adminClient.getStock(symbol);
            if (stock != null && stock.getCurrentPrice() != null) {
                return new MarketInstrument(
                        symbol,
                        stock.getCurrentPrice(),
                        stock.getAvailableQuantity(),
                        MarketSource.STOCK);
            }
        } catch (Exception ex) {
            log.debug("Stock lookup in stocks table failed for {}: {}", symbol, ex.getMessage());
        }

        MarketInstrument companyInstrument = resolveCompanyInstrument(symbol);
        if (companyInstrument != null) {
            return companyInstrument;
        }

        throw new ResourceNotFoundException("Stock not found for symbol: " + symbol);
    }

    private MarketInstrument resolveCompanyInstrument(String symbol) {
        try {
            CompanyDTO company = adminClient.getCompanyBySymbol(symbol);
            if (company != null && company.getCurrentPrice() != null) {
                return new MarketInstrument(
                        symbol,
                        company.getCurrentPrice(),
                        company.getAvailableQuantity(),
                        MarketSource.COMPANY);
            }
        } catch (Exception ex) {
            log.debug("Stock lookup in companies table failed for {}: {}", symbol, ex.getMessage());
        }
        return null;
    }

    private UpdateQuantity buildQuantityRequest(String symbol, int quantity) {
        UpdateQuantity update = new UpdateQuantity();
        update.setSymbol(symbol);
        update.setQuantity(quantity);
        return update;
    }

    private void reserveMarketQuantity(MarketSource source, UpdateQuantity update) {
        try {
            if (source == MarketSource.STOCK) {
                adminClient.updateQuantityBuy(update);
            } else {
                adminClient.updateCompanyQuantityBuy(update);
            }
        } catch (Exception ex) {
            throw new InvalidDataException("Failed to reserve stock quantity in admin-service: " + ex.getMessage());
        }
    }

    private void returnMarketQuantity(MarketSource source, UpdateQuantity update) {
        try {
            if (source == MarketSource.STOCK) {
                adminClient.updateQuantitySell(update);
            } else {
                adminClient.updateCompanyQuantitySell(update);
            }
        } catch (Exception ex) {
            throw new InvalidDataException("Failed to return stock quantity in admin-service: " + ex.getMessage());
        }
    }

    private void rollbackMarketQuantitySell(MarketSource source, UpdateQuantity update) {
        try {
            if (source == MarketSource.STOCK) {
                adminClient.updateQuantitySell(update);
            } else {
                adminClient.updateCompanyQuantitySell(update);
            }
        } catch (Exception rollbackEx) {
            log.error("Failed to rollback admin quantity after buy failure: {}", rollbackEx.getMessage());
        }
    }

    private void rollbackMarketQuantityBuy(MarketSource source, UpdateQuantity update) {
        try {
            if (source == MarketSource.STOCK) {
                adminClient.updateQuantityBuy(update);
            } else {
                adminClient.updateCompanyQuantityBuy(update);
            }
        } catch (Exception rollbackEx) {
            log.error("Failed to rollback admin quantity after sell failure: {}", rollbackEx.getMessage());
        }
    }

    private enum MarketSource {
        STOCK,
        COMPANY
    }

    private record MarketInstrument(
            String symbol,
            BigDecimal currentPrice,
            Long availableQuantity,
            MarketSource source) {
    }
}
