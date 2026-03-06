package com.portfolioservice.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePortfolioRequest {

    @Size(max = 150, message = "Portfolio name cannot exceed 150 characters")
    private String name;

    @DecimalMin(value = "0.0", inclusive = true, message = "Additional balance cannot be negative")
    private BigDecimal additionalBalance;
}
