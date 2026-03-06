package com.authservice.service;

import com.authservice.dto.AdvisorProfileSyncRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class AdvisorProfileSyncService {

    private final RestTemplateBuilder restTemplateBuilder;

    @Value("${advisor.service.base-url:http://localhost:8084}")
    private String advisorServiceBaseUrl;

    public void createAdvisorProfile(String name, String email, String phone) {
        RestTemplate restTemplate = restTemplateBuilder.build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        AdvisorProfileSyncRequest payload = new AdvisorProfileSyncRequest(name, email, phone);
        HttpEntity<AdvisorProfileSyncRequest> requestEntity = new HttpEntity<>(payload, headers);

        try {
            restTemplate.postForEntity(
                    advisorServiceBaseUrl + "/api/advisor/register",
                    requestEntity,
                    Void.class);
        } catch (RestClientException ex) {
            throw new IllegalStateException("Failed to sync advisor profile to advisor-service", ex);
        }
    }
}
