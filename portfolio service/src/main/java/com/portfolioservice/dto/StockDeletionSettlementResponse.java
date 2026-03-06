package com.portfolioservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockDeletionSettlementResponse {
    private String symbol;
    private int impactedHoldings;
    private int impactedPortfolios;
    private BigDecimal totalAmountCredited;
}
