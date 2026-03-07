package com.authservice.service;

import com.authservice.dto.AuthResponse;
import com.authservice.dto.AdminCreateUserRequest;
import com.authservice.dto.CurrentUserResponse;
import com.authservice.dto.LoginRequest;
import com.authservice.dto.MessageResponse;
import com.authservice.dto.NotificationRequest;
import com.authservice.dto.RegisterRequest;
import com.authservice.config.NotificationClient;
import com.authservice.model.RoleType;
import com.authservice.model.User;
import com.authservice.repository.UserRepository;
import com.authservice.security.JwtUtils;
import com.authservice.security.UserDetailsServiceImpl;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.Locale;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final EmailService emailService;
    private final NotificationClient notificationClient;
    private final UserDetailsServiceImpl userDetailsService;
    private final InvestorProfileSyncService investorProfileSyncService;
    private final AdvisorProfileSyncService advisorProfileSyncService;

    public MessageResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException(
                    "Email already registered: " + request.getEmail());
        }
        if (request.getRole() != RoleType.INVESTOR) {
            throw new IllegalArgumentException("Public registration only supports INVESTOR role");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(RoleType.INVESTOR)
                .enabled(true)
                .mfaEnabled(true)
                .build();

        User savedUser = userRepository.save(user);

        try {
            investorProfileSyncService.createInvestorProfile(
                    savedUser.getId(),
                    savedUser.getName(),
                    savedUser.getEmail(),
                    request.getInitialBalance());
        } catch (Exception ex) {
            userRepository.deleteById(savedUser.getId());
            throw new IllegalStateException("Registration failed while creating investor profile. Please retry.");
        }

        sendRegistrationWithFallback(savedUser);

        return new MessageResponse("User registered successfully!");
    }

    public MessageResponse createUserByAdmin(AdminCreateUserRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("Email already registered: " + normalizedEmail);
        }

        if (request.getRole() != RoleType.ADMIN && request.getRole() != RoleType.ADVISOR) {
            throw new IllegalArgumentException("Admin endpoint supports only ADMIN or ADVISOR role");
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .enabled(true)
                .mfaEnabled(true)
                .build();

        User savedUser = userRepository.save(user);

        try {
            if (request.getRole() == RoleType.ADVISOR) {
                if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
                    throw new IllegalArgumentException("Phone is required for ADVISOR profile creation");
                }
                advisorProfileSyncService.createAdvisorProfile(
                        savedUser.getName(),
                        savedUser.getEmail(),
                        request.getPhone().trim());
            }
        } catch (Exception ex) {
            userRepository.deleteById(savedUser.getId());
            throw new IllegalStateException("User creation failed while syncing profile. Please retry.");
        }

        sendRegistrationWithFallback(savedUser);

        return new MessageResponse("User created successfully with role: " + savedUser.getRole());
    }

    public Object login(LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        boolean shouldUseMfa = Boolean.TRUE.equals(user.getMfaEnabled());
        if (!shouldUseMfa && (user.getRole() == RoleType.INVESTOR || user.getRole() == RoleType.ADVISOR)) {
            // Auto-migrate older investor/advisor accounts created before MFA was enabled by default.
            user.setMfaEnabled(true);
            userRepository.save(user);
            shouldUseMfa = true;
        }

        // IF MFA ENABLED -> SEND OTP
        if (shouldUseMfa) {
            String otp = String.valueOf((int)(Math.random() * 900000) + 100000);
            user.setOtp(otp);
            user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
            userRepository.save(user);

            sendOtpWithFallback(user, otp);
            return new MessageResponse("OTP sent to email. Verify to complete login.");
        }

        // NORMAL LOGIN
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        
        String jwt = jwtUtils.generateToken(userDetails, user.getId());
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        return new AuthResponse(jwt, request.getEmail(), role, user.getName());
    }

    // VERIFY LOGIN OTP (STEP 2)
    public AuthResponse verifyLoginOtp(String email, String otp) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getOtp() == null)
            throw new RuntimeException("OTP not generated");

        if (!user.getOtp().equals(otp))
            throw new RuntimeException("Invalid OTP");

        if (user.getOtpExpiry().isBefore(LocalDateTime.now()))
            throw new RuntimeException("OTP expired");

        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        String jwt = jwtUtils.generateToken(userDetails, user.getId());
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        return new AuthResponse(jwt, email, role, user.getName());
    }

    // ENABLE / DISABLE MFA
    public MessageResponse toggleMfa(String email, boolean enable) {
        User user = userRepository.findByEmail(email).orElseThrow();
        user.setMfaEnabled(enable);
        userRepository.save(user);
        return new MessageResponse("MFA updated");
    }

    public CurrentUserResponse getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return CurrentUserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    // LOGOUT
    public MessageResponse logout() {
        SecurityContextHolder.clearContext();
        return new MessageResponse("Logged out successfully. Remove token from client.");
    }

    private void sendOtpWithFallback(User user, String otp) {
        NotificationRequest request = new NotificationRequest();
        request.setEmail(user.getEmail());
        request.setInvestorName(user.getName());
        request.setTransactionType(user.getRole().name());
        request.setOtp(otp);
        request.setType("OTP");

        try {
            notificationClient.sendOtp(request);
            return;
        } catch (Exception ignored) {
            // Fallback to direct SMTP sender if notification-service is unavailable.
        }

        try {
            emailService.sendOtp(user.getEmail(), otp);
        } catch (Exception mailError) {
            throw new IllegalStateException("Unable to send OTP email right now. Please try again.");
        }
    }

    private void sendRegistrationWithFallback(User user) {
        NotificationRequest request = new NotificationRequest();
        request.setEmail(user.getEmail());
        request.setInvestorName(user.getName());
        request.setTransactionType(user.getRole().name());
        request.setType("REGISTRATION");

        try {
            notificationClient.sendRegistration(request);
            return;
        } catch (Exception ignored) {
            // Fallback to direct SMTP sender if notification-service is unavailable.
        }

        try {
            emailService.sendRegistrationSuccess(user.getEmail(), user.getName(), user.getRole().name());
        } catch (Exception ignored) {
            // Registration is complete; email is best-effort.
        }
    }
}
