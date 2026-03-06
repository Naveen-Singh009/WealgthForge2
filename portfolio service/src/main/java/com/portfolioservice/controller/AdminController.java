package com.portfolioservice.controller;

import com.portfolioservice.dto.ApiResponse;
import com.portfolioservice.dto.PortfolioResponse;
import com.portfolioservice.dto.StockDeletionSettlementRequest;
import com.portfolioservice.dto.StockDeletionSettlementResponse;
import com.portfolioservice.service.PortfolioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/portfolios")
@RequiredArgsConstructor
public class AdminController {

    private final PortfolioService portfolioService;

    //Admin lists every portfolio 

    @GetMapping
    public ResponseEntity<ApiResponse<List<PortfolioResponse>>> getAllPortfolios() {
        List<PortfolioResponse> portfolios = portfolioService.findAll();
        return ResponseEntity.ok(ApiResponse.ok("All portfolios retrieved", portfolios));
    }

    @PostMapping("/holdings/liquidate-deleted-stock")
    public ResponseEntity<ApiResponse<StockDeletionSettlementResponse>> liquidateDeletedStockHoldings(
            @Valid @RequestBody StockDeletionSettlementRequest request) {
        StockDeletionSettlementResponse response =
                portfolioService.settleDeletedStockAcrossPortfolios(request.getSymbol(), request.getSettlementPrice());
        return ResponseEntity.ok(ApiResponse.ok("Deleted stock settled across portfolios", response));
    }
}
