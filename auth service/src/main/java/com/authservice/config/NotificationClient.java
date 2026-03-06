package com.authservice.config;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.authservice.dto.NotificationRequest;

@FeignClient(name = "notification-service", url = "http://localhost:8087")
public interface NotificationClient {

    @PostMapping("/api/notifications/send-otp")
    String sendOtp(@RequestBody NotificationRequest request);

    @PostMapping("/api/notifications/send-registration")
    String sendRegistration(@RequestBody NotificationRequest request);
}