package com.example.demo.client;

import com.example.demo.config.FeignClientConfig;
import com.example.demo.dto.StockDeletionSettlementRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Feign client for portfolio-service (port 8088).
 * Allows admin-service to view and manage investor portfolios.
 */
@FeignClient(name = "portfolio-service", url = "http://localhost:8088", configuration = FeignClientConfig.class)
public interface PortfolioClient {

    // Get all portfolios for a specific investor
    @GetMapping("/api/portfolios/my")
    ResponseEntity<Map<String, Object>> getMyPortfolios();

    // Get a specific portfolio by ID
    @GetMapping("/api/portfolios/{id}")
    ResponseEntity<Map<String, Object>> getPortfolioById(@PathVariable("id") Long id);

    // Get holdings for a portfolio
    @GetMapping("/api/portfolios/{id}/holdings")
    ResponseEntity<List<Map<String, Object>>> getHoldings(@PathVariable("id") Long id);

    // Get performance analytics for a portfolio
    @GetMapping("/api/portfolios/{id}/performance")
    ResponseEntity<Map<String, Object>> getPerformance(@PathVariable("id") Long id);

    // Settle all investor holdings when admin deletes a stock from master.
    @PostMapping("/api/admin/portfolios/holdings/liquidate-deleted-stock")
    ResponseEntity<Map<String, Object>> settleDeletedStockHoldings(@RequestBody StockDeletionSettlementRequest request);
}
