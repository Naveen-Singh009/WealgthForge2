package com.example.demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.client.PortfolioClient;
import com.example.demo.exceptions.InsufficientStockQuantityException;
import com.example.demo.exceptions.StockNotFoundException;
import com.example.demo.dto.StockDeletionSettlementRequest;
import com.example.demo.entity.Stock;
import com.example.demo.entity.UpdateQuantity;
import com.example.demo.repository.StockRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StockService {

    private final StockRepository stockRepository;
    private final PortfolioClient portfolioClient;

    // ===============================
    // GET STOCK BY SYMBOL
    // ===============================
    public Stock getStock(String symbol) {
        return stockRepository.findBySymbol(symbol)
                .orElseThrow(() ->
                        new StockNotFoundException(
                                "Stock not found with symbol: " + symbol));
    }

    // ===============================
    // UPDATE STOCK PRICE
    // ===============================
    public Stock updateStockPrice(String symbol, double price) {

        Stock stock = getStock(symbol);

        stock.setCurrentPrice(BigDecimal.valueOf(price));
        stock.setLastUpdated(LocalDateTime.now());

        return stockRepository.save(stock);
    }

    // ===============================
    // UPDATE STOCK DETAILS
    // ===============================
    public Stock updateStock(Long id, Stock request) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() ->
                        new StockNotFoundException(
                                "Stock not found with id: " + id));

        stock.setSymbol(request.getSymbol());
        stock.setName(request.getName());
        stock.setSector(request.getSector());
        stock.setCurrentPrice(request.getCurrentPrice());
        stock.setAvailableQuantity(request.getAvailableQuantity());
        stock.setLastUpdated(LocalDateTime.now());

        return stockRepository.save(stock);
    }

    // ===============================
    // GET ALL STOCKS
    // ===============================
    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    // ===============================
    // BUY STOCK (Reduce Quantity)
    // ===============================
    public Stock updateQuantityBuy(UpdateQuantity request) {

        Stock stock = getStock(request.getSymbol());

        if (stock.getAvailableQuantity() < request.getQuantity()) {
            throw new InsufficientStockQuantityException(
                    "Not enough stock available for symbol: " + request.getSymbol());
        }

        stock.setAvailableQuantity(
                stock.getAvailableQuantity() - request.getQuantity());

        stock.setLastUpdated(LocalDateTime.now());

        return stockRepository.save(stock);
    }

    // ===============================
    // SELL STOCK (Increase Quantity)
    // ===============================
    public Stock updateQuantitySell(UpdateQuantity request) {

        Stock stock = getStock(request.getSymbol());

        stock.setAvailableQuantity(
                stock.getAvailableQuantity() + request.getQuantity());

        stock.setLastUpdated(LocalDateTime.now());

        return stockRepository.save(stock);
    }

    // ===============================
    // DELETE STOCK BY SYMBOL
    // ===============================
    @Transactional
    public String deleteStock(String symbol) {

        Stock stock = getStock(symbol);

        settleHoldingsBeforeStockDelete(stock);
        stockRepository.delete(stock);

        return "Stock deleted successfully";
    }

    // ===============================
    // DELETE STOCK BY ID
    // ===============================
    @Transactional
    public String deleteStockById(Long id) {

        Stock stock = stockRepository.findById(id)
                .orElseThrow(() ->
                        new StockNotFoundException(
                                "Stock not found with id: " + id));

        settleHoldingsBeforeStockDelete(stock);
        stockRepository.delete(stock);

        return "Stock deleted successfully";
    }

    // ===============================
    // ADD STOCK
    // ===============================
    public String addStock(Stock stock) {

        stock.setLastUpdated(LocalDateTime.now());

        stockRepository.save(stock);

        return "Stock added successfully";
    }

    // ===============================
    // FIND STOCK BY SYMBOL
    // ===============================
    public Stock findStocksBySymbol(String symbol) {
        return getStock(symbol);
    }

    private void settleHoldingsBeforeStockDelete(Stock stock) {
        if (stock.getCurrentPrice() == null) {
            throw new IllegalArgumentException("Stock price is missing for symbol: " + stock.getSymbol());
        }

        StockDeletionSettlementRequest request = new StockDeletionSettlementRequest(
                stock.getSymbol(),
                stock.getCurrentPrice()
        );

        portfolioClient.settleDeletedStockHoldings(request);
    }
}
