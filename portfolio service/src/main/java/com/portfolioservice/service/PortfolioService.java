package com.portfolioservice.service;

import com.portfolioservice.dto.CreatePortfolioRequest;
import com.portfolioservice.dto.DeletePortfolioResponse;
import com.portfolioservice.dto.PortfolioResponse;
import com.portfolioservice.dto.StockDeletionSettlementResponse;
import com.portfolioservice.dto.UpdatePortfolioRequest;
import com.portfolioservice.exception.ResourceNotFoundException;
import com.portfolioservice.model.Holding;
import com.portfolioservice.model.Portfolio;
import com.portfolioservice.model.Transaction;
import com.portfolioservice.model.TransactionType;
import com.portfolioservice.repository.HoldingRepository;
import com.portfolioservice.repository.PortfolioRepository;
import com.portfolioservice.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private static final BigDecimal ZERO = BigDecimal.ZERO.setScale(6, RoundingMode.HALF_UP);

    private final PortfolioRepository portfolioRepository;
    private final HoldingRepository holdingRepository;
    private final TransactionRepository transactionRepository;

    //Create a new portfolio for the given investor
    public PortfolioResponse createPortfolio(Long investorId, CreatePortfolioRequest request) {
        Portfolio portfolio = Portfolio.builder()
                .investorId(investorId)
                .name(request.getName())
                .balance(request.getBalance())
                .build();
        portfolio = portfolioRepository.save(portfolio);
        return mapToResponse(portfolio);
    }

    /**
     * Find a single portfolio by ID.
     */
    public PortfolioResponse findById(Long id) {
        Portfolio portfolio = portfolioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with id: " + id));
        return mapToResponse(portfolio);
    }

    // Find a single portfolio by ID and enforce investor ownership.
    public PortfolioResponse findByIdForInvestor(Long id, Long investorId) {
        Portfolio portfolio = getPortfolioEntityForInvestor(id, investorId);
        return mapToResponse(portfolio);
    }

    /**
     * Find all portfolios belonging to a specific investor.
     */
    public List<PortfolioResponse> findByInvestorId(Long investorId) {
        return portfolioRepository.findByInvestorId(investorId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * List every portfolio in the system (admin use).
     */
    public List<PortfolioResponse> findAll() {
        return portfolioRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get the raw entity (used internally by other services).
     */
    public Portfolio getPortfolioEntity(Long id) {
        return portfolioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with id: " + id));
    }

    public Portfolio getPortfolioEntityForInvestor(Long id, Long investorId) {
        Portfolio portfolio = getPortfolioEntity(id);
        if (!portfolio.getInvestorId().equals(investorId)) {
            throw new ResourceNotFoundException(
                    "Portfolio not found with id: " + id + " for investor: " + investorId);
        }
        return portfolio;
    }

    @Transactional
    public PortfolioResponse updatePortfolio(Long investorId, Long id, UpdatePortfolioRequest request) {
        Portfolio portfolio = getPortfolioEntityForInvestor(id, investorId);

        if (request.getName() != null) {
            String updatedName = request.getName().trim();
            if (updatedName.isEmpty()) {
                throw new IllegalArgumentException("Portfolio name cannot be blank");
            }
            portfolio.setName(updatedName);
        }

        BigDecimal additionalBalance = request.getAdditionalBalance() == null
                ? BigDecimal.ZERO
                : request.getAdditionalBalance();

        if (additionalBalance.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Additional balance cannot be negative");
        }

        portfolio.setBalance(portfolio.getBalance().add(additionalBalance));
        portfolio = portfolioRepository.save(portfolio);

        return mapToResponse(portfolio);
    }

    @Transactional
    public DeletePortfolioResponse deletePortfolio(Long investorId, Long id) {
        Portfolio portfolio = getPortfolioEntityForInvestor(id, investorId);
        BigDecimal holdingsValue = holdingRepository.findByPortfolioId(id).stream()
                .map(holding -> holding.getQuantity().multiply(holding.getAveragePrice()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal transferredAmount = portfolio.getBalance().add(holdingsValue);

        DeletePortfolioResponse response = DeletePortfolioResponse.builder()
                .portfolioId(portfolio.getId())
                .portfolioName(portfolio.getName())
                .transferredAmount(transferredAmount)
                .build();

        holdingRepository.deleteByPortfolioId(id);
        transactionRepository.deleteByPortfolioId(id);
        portfolioRepository.delete(portfolio);

        return response;
    }

    @Transactional
    public StockDeletionSettlementResponse settleDeletedStockAcrossPortfolios(String symbol, BigDecimal settlementPrice) {
        String normalizedSymbol = normalizeSymbol(symbol);
        BigDecimal normalizedPrice = scale(settlementPrice);

        List<Holding> impactedHoldings = holdingRepository.findByAssetSymbolIgnoreCase(normalizedSymbol);
        if (impactedHoldings.isEmpty()) {
            return StockDeletionSettlementResponse.builder()
                    .symbol(normalizedSymbol)
                    .impactedHoldings(0)
                    .impactedPortfolios(0)
                    .totalAmountCredited(ZERO)
                    .build();
        }

        BigDecimal totalCredited = ZERO;
        Set<Long> impactedPortfolioIds = new HashSet<>();

        for (Holding holding : impactedHoldings) {
            Portfolio portfolio = getPortfolioEntity(holding.getPortfolioId());

            BigDecimal holdingCredit = scale(holding.getQuantity().multiply(normalizedPrice));
            portfolio.setBalance(scale(portfolio.getBalance().add(holdingCredit)));
            portfolioRepository.save(portfolio);

            transactionRepository.save(Transaction.builder()
                    .portfolioId(portfolio.getId())
                    .type(TransactionType.SELL)
                    .assetSymbol(normalizedSymbol)
                    .quantity(scale(holding.getQuantity()))
                    .amount(holdingCredit)
                    .build());

            totalCredited = scale(totalCredited.add(holdingCredit));
            impactedPortfolioIds.add(portfolio.getId());
        }

        holdingRepository.deleteByAssetSymbolIgnoreCase(normalizedSymbol);

        return StockDeletionSettlementResponse.builder()
                .symbol(normalizedSymbol)
                .impactedHoldings(impactedHoldings.size())
                .impactedPortfolios(impactedPortfolioIds.size())
                .totalAmountCredited(totalCredited)
                .build();
    }

    private String normalizeSymbol(String symbol) {
        if (symbol == null || symbol.trim().isEmpty()) {
            throw new IllegalArgumentException("Stock symbol is required");
        }
        return symbol.trim().toUpperCase();
    }

    private BigDecimal scale(BigDecimal value) {
        if (value == null) {
            throw new IllegalArgumentException("Amount cannot be null");
        }
        return value.setScale(6, RoundingMode.HALF_UP);
    }

    private PortfolioResponse mapToResponse(Portfolio p) {
        return PortfolioResponse.builder()
                .id(p.getId())
                .investorId(p.getInvestorId())
                .name(p.getName())
                .balance(p.getBalance())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
