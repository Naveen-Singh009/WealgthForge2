package com.portfolioservice.service;

import com.portfolioservice.dto.HoldingResponse;
import com.portfolioservice.dto.OverallPerformanceResponse;
import com.portfolioservice.dto.PerformanceResponse;
import com.portfolioservice.model.Portfolio;
import com.portfolioservice.model.Transaction;
import com.portfolioservice.model.TransactionType;
import com.portfolioservice.repository.PortfolioRepository;
import com.portfolioservice.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PerformanceService {

    private static final BigDecimal ZERO = BigDecimal.ZERO.setScale(6, RoundingMode.HALF_UP);

    private final PortfolioService portfolioService;
    private final HoldingService holdingService;
    private final PortfolioRepository portfolioRepository;
    private final TransactionRepository transactionRepository;

    // Calculate portfolio performance: includes realized + unrealized P/L.
    public PerformanceResponse getPerformance(Long portfolioId) {
        Portfolio portfolio = portfolioService.getPortfolioEntity(portfolioId);
        List<HoldingResponse> holdings = holdingService.getHoldingsForPortfolio(portfolioId);

        BigDecimal totalInvested = ZERO;
        BigDecimal currentValue = ZERO;

        for (HoldingResponse h : holdings) {
            BigDecimal invested = scale(valueOrZero(h.getAveragePrice()).multiply(valueOrZero(h.getQuantity())));
            totalInvested = scale(totalInvested.add(invested));
            currentValue = scale(currentValue.add(valueOrZero(h.getCurrentValue())));
        }

        RealizedPnlSummary realized = calculateRealizedPnlForPortfolio(portfolioId);
        BigDecimal unrealizedProfit = scale(currentValue.subtract(totalInvested));
        BigDecimal profitLoss = scale(unrealizedProfit.add(realized.realizedProfit()));

        BigDecimal denominator = scale(totalInvested.add(realized.realizedCostBasis()));
        BigDecimal gainPercent = ZERO;
        if (denominator.compareTo(BigDecimal.ZERO) > 0) {
            gainPercent = scale(divide(profitLoss, denominator).multiply(new BigDecimal("100")));
        }

        return PerformanceResponse.builder()
                .portfolioId(portfolio.getId())
                .portfolioName(portfolio.getName())
                .totalInvested(totalInvested)
                .currentValue(currentValue)
                .profitLoss(profitLoss)
                .gainPercent(gainPercent.setScale(2, RoundingMode.HALF_UP))
                .holdings(holdings)
                .build();
    }

    // Includes realized gains from closed trades, not only open holdings.
    public OverallPerformanceResponse getOverallPerformance(Long investorId) {
        List<Portfolio> portfolios = portfolioRepository.findByInvestorId(investorId);

        BigDecimal totalInvested = ZERO;
        BigDecimal currentMarketValue = ZERO;
        BigDecimal cashBalance = ZERO;
        BigDecimal realizedProfit = ZERO;
        BigDecimal realizedCostBasis = ZERO;

        for (Portfolio portfolio : portfolios) {
            cashBalance = scale(cashBalance.add(valueOrZero(portfolio.getBalance())));

            List<HoldingResponse> holdings = holdingService.getHoldingsForPortfolio(portfolio.getId());
            for (HoldingResponse h : holdings) {
                BigDecimal invested = scale(valueOrZero(h.getAveragePrice()).multiply(valueOrZero(h.getQuantity())));
                totalInvested = scale(totalInvested.add(invested));
                currentMarketValue = scale(currentMarketValue.add(valueOrZero(h.getCurrentValue())));
            }

            RealizedPnlSummary realized = calculateRealizedPnlForPortfolio(portfolio.getId());
            realizedProfit = scale(realizedProfit.add(realized.realizedProfit()));
            realizedCostBasis = scale(realizedCostBasis.add(realized.realizedCostBasis()));
        }

        BigDecimal unrealizedProfit = scale(currentMarketValue.subtract(totalInvested));
        BigDecimal profitLoss = scale(unrealizedProfit.add(realizedProfit));

        BigDecimal denominator = scale(totalInvested.add(realizedCostBasis));
        BigDecimal gainPercent = ZERO;
        if (denominator.compareTo(BigDecimal.ZERO) > 0) {
            gainPercent = scale(divide(profitLoss, denominator).multiply(new BigDecimal("100")));
        }

        BigDecimal netWorth = scale(currentMarketValue.add(cashBalance));

        return OverallPerformanceResponse.builder()
                .totalPortfolios(portfolios.size())
                .totalInvested(totalInvested)
                .currentMarketValue(currentMarketValue)
                .cashBalance(cashBalance)
                .netWorth(netWorth)
                .profitLoss(profitLoss)
                .gainPercent(gainPercent.setScale(2, RoundingMode.HALF_UP))
                .build();
    }

    private RealizedPnlSummary calculateRealizedPnlForPortfolio(Long portfolioId) {
        List<Transaction> transactions = transactionRepository.findByPortfolioIdOrderByTimestampAsc(portfolioId);
        Map<String, PositionTracker> positions = new HashMap<>();

        BigDecimal realizedProfit = ZERO;
        BigDecimal realizedCostBasis = ZERO;

        for (Transaction tx : transactions) {
            if (tx.getType() == null || tx.getAssetSymbol() == null || tx.getAssetSymbol().isBlank()) {
                continue;
            }

            BigDecimal qty = valueOrZero(tx.getQuantity());
            BigDecimal amount = valueOrZero(tx.getAmount());
            if (qty.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            String symbol = tx.getAssetSymbol().trim().toUpperCase();
            PositionTracker tracker = positions.computeIfAbsent(symbol, s -> new PositionTracker());

            if (tx.getType() == TransactionType.BUY) {
                BigDecimal unitPrice = divide(amount, qty);
                BigDecimal existingCost = scale(tracker.averagePrice.multiply(tracker.quantity));
                BigDecimal buyCost = scale(unitPrice.multiply(qty));
                BigDecimal newQty = scale(tracker.quantity.add(qty));

                if (newQty.compareTo(BigDecimal.ZERO) > 0) {
                    tracker.averagePrice = divide(existingCost.add(buyCost), newQty);
                    tracker.quantity = newQty;
                }
                continue;
            }

            if (tx.getType() == TransactionType.SELL) {
                BigDecimal matchedQty = tracker.quantity.compareTo(qty) < 0 ? tracker.quantity : qty;
                if (matchedQty.compareTo(BigDecimal.ZERO) < 0) {
                    matchedQty = ZERO;
                }

                BigDecimal costBasis = scale(tracker.averagePrice.multiply(matchedQty));
                realizedCostBasis = scale(realizedCostBasis.add(costBasis));
                realizedProfit = scale(realizedProfit.add(amount.subtract(costBasis)));

                BigDecimal remainingQty = scale(tracker.quantity.subtract(qty));
                if (remainingQty.compareTo(BigDecimal.ZERO) <= 0) {
                    positions.remove(symbol);
                } else {
                    tracker.quantity = remainingQty;
                }
            }
        }

        return new RealizedPnlSummary(realizedProfit, realizedCostBasis);
    }

    private BigDecimal valueOrZero(BigDecimal value) {
        return value == null ? ZERO : scale(value);
    }

    private BigDecimal divide(BigDecimal numerator, BigDecimal denominator) {
        if (denominator == null || denominator.compareTo(BigDecimal.ZERO) == 0) {
            return ZERO;
        }
        return numerator.divide(denominator, 6, RoundingMode.HALF_UP);
    }

    private BigDecimal scale(BigDecimal value) {
        return value.setScale(6, RoundingMode.HALF_UP);
    }

    private static class PositionTracker {
        private BigDecimal quantity = ZERO;
        private BigDecimal averagePrice = ZERO;
    }

    private record RealizedPnlSummary(
            BigDecimal realizedProfit,
            BigDecimal realizedCostBasis) {
    }
}
