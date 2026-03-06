package com.example.demo.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class PortfolioUpdateRequest {

    @Size(max = 150, message = "Portfolio name cannot exceed 150 characters")
    private String name;

    @DecimalMin(value = "0.0", inclusive = true, message = "Additional balance cannot be negative")
    private BigDecimal additionalBalance;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getAdditionalBalance() {
        return additionalBalance;
    }

    public void setAdditionalBalance(BigDecimal additionalBalance) {
        this.additionalBalance = additionalBalance;
    }
}
