package com.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    @Builder.Default
    private String type = "Bearer";
    private String email;
    private String role;
    private String name;

    public AuthResponse(String token, String email, String role) {
        this.token = token;
        this.type = "Bearer";
        this.email = email;
        this.role = role;
    }

    public AuthResponse(String token, String email, String role, String name) {
        this.token = token;
        this.type = "Bearer";
        this.email = email;
        this.role = role;
        this.name = name;
    }
}
