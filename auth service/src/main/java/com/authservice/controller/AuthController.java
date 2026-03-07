package com.authservice.controller;

import com.authservice.dto.AdminCreateUserRequest;
import com.authservice.dto.AuthResponse;
import com.authservice.dto.CurrentUserResponse;
import com.authservice.dto.LoginRequest;
import com.authservice.dto.MessageResponse;
import com.authservice.dto.RegisterRequest;
import com.authservice.dto.VerifyOtpRequest;
import com.authservice.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/auth", ""})
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(201)
                .body(authService.register(request));
    }

    @PostMapping("/api/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> createUserByAdmin(@Valid @RequestBody AdminCreateUserRequest request) {
        return ResponseEntity.status(201)
                .body(authService.createUserByAdmin(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Object response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-login-otp")
    public ResponseEntity<AuthResponse> verifyLoginOtp(@RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(
                authService.verifyLoginOtp(request.getEmail(), request.getOtp())
        );
    }

    @GetMapping("/me")
    public ResponseEntity<CurrentUserResponse> me(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        if (!StringUtils.hasText(email)) {
            throw new IllegalArgumentException("Authentication is required");
        }

        return ResponseEntity.ok(authService.getCurrentUserProfile(email));
    }

    @PostMapping("/mfa")
    public ResponseEntity<MessageResponse> toggleMfa(
            Authentication authentication,
            @RequestParam(required = false) String email,
            @RequestParam boolean enable) {
        String targetEmail = authentication != null ? authentication.getName() : email;
        if (!StringUtils.hasText(targetEmail)) {
            throw new IllegalArgumentException("Email is required to toggle MFA");
        }

        return ResponseEntity.ok(
                authService.toggleMfa(targetEmail, enable));
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout() {
        return ResponseEntity.ok(authService.logout());
    }
}
