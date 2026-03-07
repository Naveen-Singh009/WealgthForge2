# WealthForge Quick Revision Guide

This is a condensed revision version of `fullProjectdetails.md`.
It is designed for fast re-reading before interviews, demos, or semester/project reviews.

---

## 1. How to Use This File

1. Read Section 2 once to lock the system architecture.
2. Read Section 3 and Section 4 for dependency and annotation memory maps.
3. Read Section 5 for interface contracts (Feign + Repository + framework integrations).
4. Use Section 7 as a final 20-minute recap checklist.

---

## 2. Architecture Memory Map

### 2.1 Service Topology (9 Services)

| Layer | Service | Core Job |
|---|---|---|
| Infrastructure | Config Server | Central config source for all Spring Cloud clients |
| Infrastructure | Eureka Server | Service discovery registry |
| Edge | API Gateway | Single entry point, route forwarding |
| Domain Security | Auth Service | Registration, login, JWT, OTP, roles |
| Domain Admin | Admin Service | Companies/stocks CRUD, investor/admin operational APIs |
| Domain Advisor | Advisor Service | Advisor workflows, investor allocations, suggestions |
| Domain Investor | Investor Service | Investor-facing orchestration (buy/sell/transfer/history) |
| Domain Portfolio | Portfolio Service | Portfolio, holdings, transactions, performance |
| Domain Communication | Notification Service | Email + websocket notifications |

### 2.2 Startup Order to Remember

1. Config Server
2. Eureka Server
3. API Gateway + domain services (auth/admin/advisor/investor/portfolio/notification)

Reason: other services depend on centralized config + discovery.

### 2.3 Runtime Collaboration Pattern

1. Clients typically call API Gateway.
2. Gateway routes request to target service.
3. Business service may call other services using OpenFeign interfaces.
4. Most business services persist state via JPA repositories.
5. Security-enabled services use JWT parsing/validation and custom auth entry points.

---

## 3. Dependency Revision (Fast + Complete)

### 3.1 Overall Stats

1. Total microservices: `9`
2. Unique dependencies across project: `23`
3. Heavily reused dependencies:
   1. `spring-boot-starter-test` in 9 services
   2. `spring-boot-starter-actuator` in 8 services
   3. `spring-cloud-starter-config` in 8 services
   4. `spring-cloud-starter-netflix-eureka-client` in 8 services

### 3.2 Service Complexity Snapshot

| Service | Dependency Count (pom.xml) | Notes |
|---|---:|---|
| config-server | 4 | Minimal infra service |
| eureka-server | 4 | Minimal registry service |
| api-gateway | 5 | Edge routing + discovery |
| auth-service | 16 | Highest complexity: security + JPA + mail + docs |
| admin-service | 15 | CRUD + security + Feign |
| advisor | 14 | JPA + Feign + security |
| notification-service | 10 | mail + websocket + PDF |
| portfolio-service | 15 | heavy domain + persistence + security |
| investor-service | 16 | orchestration-heavy + Feign + loadbalancer |

### 3.3 Common Foundation Stack (Most Important)

| Dependency | Why It Matters in This Project |
|---|---|
| org.springframework.boot:spring-boot-starter-web | REST API controllers for domain services |
| org.springframework.boot:spring-boot-starter-security | JWT/security filter chain |
| org.springframework.boot:spring-boot-starter-data-jpa | Entity + repository persistence model |
| org.springframework.boot:spring-boot-starter-validation | DTO/entity validation |
| org.springframework.boot:spring-boot-starter-actuator | Health and service observability |
| org.springframework.cloud:spring-cloud-starter-config | Centralized config consumption |
| org.springframework.cloud:spring-cloud-starter-netflix-eureka-client | Discovery registration + lookup |
| org.springframework.cloud:spring-cloud-starter-openfeign | Inter-service contract-based HTTP calls |
| org.projectlombok:lombok | Boilerplate elimination in models/config/services |
| org.postgresql:postgresql | Runtime DB driver for business services |

### 3.4 Security and JWT Dependencies

| Dependency | Role |
|---|---|
| io.jsonwebtoken:jjwt-api | JWT API used by token utilities and validation logic |
| io.jsonwebtoken:jjwt-impl | Runtime implementation of JWT internals |
| io.jsonwebtoken:jjwt-jackson | JSON claims serialization/deserialization support |
| org.springframework.security:spring-security-test | Security-specific test utilities |

### 3.5 Infra and Edge Dependencies

| Dependency | Where Used | Why |
|---|---|---|
| org.springframework.cloud:spring-cloud-config-server | config-server | Turns service into config server |
| org.springframework.cloud:spring-cloud-starter-netflix-eureka-server | eureka-server | Turns service into service registry |
| org.springframework.cloud:spring-cloud-starter-gateway | api-gateway | Route predicates + filters at edge |
| org.springframework.cloud:spring-cloud-starter-loadbalancer | investor-service | Client-side LB for discovered instances |

### 3.6 Notification/Documentation Special Dependencies

| Dependency | Where Used | Why |
|---|---|---|
| org.springframework.boot:spring-boot-starter-mail | auth-service, notification-service | OTP and mail notifications |
| org.springframework.boot:spring-boot-starter-websocket | notification-service | Push-style websocket messaging |
| com.itextpdf:itext7-core | notification-service | PDF/report generation features |
| org.springdoc:springdoc-openapi-starter-webmvc-ui | auth-service | Swagger/OpenAPI docs |

### 3.7 Full Dependency Index (All 23)

1. com.itextpdf:itext7-core
2. io.jsonwebtoken:jjwt-api
3. io.jsonwebtoken:jjwt-impl
4. io.jsonwebtoken:jjwt-jackson
5. org.postgresql:postgresql
6. org.projectlombok:lombok
7. org.springdoc:springdoc-openapi-starter-webmvc-ui
8. org.springframework.boot:spring-boot-starter-actuator
9. org.springframework.boot:spring-boot-starter-data-jpa
10. org.springframework.boot:spring-boot-starter-mail
11. org.springframework.boot:spring-boot-starter-security
12. org.springframework.boot:spring-boot-starter-test
13. org.springframework.boot:spring-boot-starter-validation
14. org.springframework.boot:spring-boot-starter-web
15. org.springframework.boot:spring-boot-starter-websocket
16. org.springframework.cloud:spring-cloud-config-server
17. org.springframework.cloud:spring-cloud-starter-config
18. org.springframework.cloud:spring-cloud-starter-gateway
19. org.springframework.cloud:spring-cloud-starter-loadbalancer
20. org.springframework.cloud:spring-cloud-starter-netflix-eureka-client
21. org.springframework.cloud:spring-cloud-starter-netflix-eureka-server
22. org.springframework.cloud:spring-cloud-starter-openfeign
23. org.springframework.security:spring-security-test

---

## 4. Annotation Revision (61 Canonical Annotations)

### 4.1 Stats to Remember

1. Canonical annotations used: `61`
2. Most frequent:
   1. `lombok.RequiredArgsConstructor` (31 files)
   2. `lombok.AllArgsConstructor` (25 files)
   3. `lombok.NoArgsConstructor` (24 files)
   4. `org.springframework.stereotype.Service` (20 files)
   5. `lombok.extern.slf4j.Slf4j` (18 files)

### 4.2 Annotation Families (Mental Grouping)

| Family | Examples | Why Important |
|---|---|---|
| Boot/Cloud bootstrap | `@SpringBootApplication`, `@EnableDiscoveryClient`, `@EnableConfigServer`, `@EnableEurekaServer`, `@EnableFeignClients` | Defines service startup behavior |
| DI and configuration | `@Configuration`, `@Bean`, `@Component`, `@Service`, `@Repository`, `@Value`, `@Autowired` | Controls object wiring and layering |
| Security | `@EnableWebSecurity`, `@EnableMethodSecurity`, `@PreAuthorize` | Role/permission checks and security chain |
| Web API | `@RestController`, `@RequestMapping`, `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@RequestBody`, `@PathVariable`, `@RequestParam`, `@RequestHeader` | Endpoint definitions and request binding |
| Error handling | `@RestControllerAdvice`, `@ExceptionHandler`, `@ResponseStatus` | Standardized exception responses |
| Validation | `@Valid`, `@NotBlank`, `@NotNull`, `@Size`, `@Email`, `@Min`, `@DecimalMin`, `@Positive` | Input/domain safeguards |
| Persistence/JPA | `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@Column`, `@Enumerated`, `@PrePersist`, `@UniqueConstraint`, `@Transactional` | Data model + transactional consistency |
| Lombok | `@Data`, `@Getter`, `@Setter`, `@Builder`, `@Builder.Default`, constructors, `@Slf4j` | Boilerplate reduction |
| Misc | `@JsonProperty`, `@CreationTimestamp`, `@PostConstruct`, `@Override`, `@EnableWebSocketMessageBroker` | Serialization, lifecycle, websocket config |

### 4.3 High-Frequency Annotation Table

| Annotation | Used in Files | Revision Note |
|---|---:|---|
| lombok.RequiredArgsConstructor | 31 | Constructor injection heavy code style |
| lombok.AllArgsConstructor | 25 | DTO/entity convenience constructors |
| lombok.NoArgsConstructor | 24 | JPA/serialization-friendly constructors |
| org.springframework.stereotype.Service | 20 | Service-layer separation is strong |
| lombok.extern.slf4j.Slf4j | 18 | Logging integrated across services |
| lombok.Data | 17 | DTO/entity model boilerplate reduced |
| lombok.Getter | 17 | Encapsulation helpers |
| lombok.Setter | 16 | Mutable DTO/entity fields |
| org.springframework.stereotype.Component | 16 | Utility/config beans |
| org.springframework.web.bind.annotation.GetMapping | 15 | GET-centric read APIs |
| jakarta.validation.constraints.NotBlank | 14 | String validation baseline |
| jakarta.validation.constraints.NotNull | 14 | Null-safety at DTO/entity boundaries |
| java.lang.Override | 13 | Interface contract correctness |
| lombok.Builder | 13 | Fluent object creation |
| org.springframework.web.bind.annotation.RequestBody | 13 | JSON request mapping pattern |
| jakarta.persistence.Entity | 12 | JPA entity-driven model |
| jakarta.persistence.Id | 12 | Explicit primary key mapping |
| jakarta.validation.constraints.DecimalMin | 12 | Monetary/quantity validation |
| org.springframework.web.bind.annotation.PostMapping | 12 | Command-style write APIs |
| jakarta.persistence.GeneratedValue | 11 | Auto key generation |
| org.springframework.beans.factory.annotation.Value | 10 | Externalized config usage |
| org.springframework.web.bind.annotation.PathVariable | 10 | Resource-by-id style routing |
| org.springframework.web.bind.annotation.RequestMapping | 10 | Common base route mapping |
| org.springframework.web.bind.annotation.RestController | 10 | REST controller pattern everywhere |
| org.springframework.boot.autoconfigure.SpringBootApplication | 9 | One bootstrap class per service |

### 4.4 Full Canonical Annotation Index (Grouped)

#### A. Boot and Spring Cloud Startup

1. org.springframework.boot.autoconfigure.SpringBootApplication
2. org.springframework.cloud.client.discovery.EnableDiscoveryClient
3. org.springframework.cloud.config.server.EnableConfigServer
4. org.springframework.cloud.netflix.eureka.server.EnableEurekaServer
5. org.springframework.cloud.openfeign.EnableFeignClients
6. org.springframework.cloud.openfeign.FeignClient

#### B. Dependency Injection and Bean Configuration

1. org.springframework.context.annotation.Configuration
2. org.springframework.context.annotation.Bean
3. org.springframework.stereotype.Component
4. org.springframework.stereotype.Service
5. org.springframework.stereotype.Repository
6. org.springframework.beans.factory.annotation.Autowired
7. org.springframework.beans.factory.annotation.Value
8. jakarta.annotation.PostConstruct

#### C. Security

1. org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
2. org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
3. org.springframework.security.access.prepost.PreAuthorize

#### D. Web and API Mapping

1. org.springframework.web.bind.annotation.RestController
2. org.springframework.web.bind.annotation.RequestMapping
3. org.springframework.web.bind.annotation.GetMapping
4. org.springframework.web.bind.annotation.PostMapping
5. org.springframework.web.bind.annotation.PutMapping
6. org.springframework.web.bind.annotation.DeleteMapping
7. org.springframework.web.bind.annotation.RequestBody
8. org.springframework.web.bind.annotation.RequestParam
9. org.springframework.web.bind.annotation.RequestHeader
10. org.springframework.web.bind.annotation.PathVariable
11. org.springframework.web.bind.annotation.ResponseStatus
12. org.springframework.web.bind.annotation.CrossOrigin
13. org.springframework.web.bind.annotation.RestControllerAdvice
14. org.springframework.web.bind.annotation.ExceptionHandler

#### E. Validation

1. jakarta.validation.Valid
2. jakarta.validation.constraints.NotBlank
3. jakarta.validation.constraints.NotNull
4. jakarta.validation.constraints.Size
5. jakarta.validation.constraints.Email
6. jakarta.validation.constraints.Min
7. jakarta.validation.constraints.DecimalMin
8. jakarta.validation.constraints.Positive

#### F. Persistence and Transactions

1. jakarta.persistence.Entity
2. jakarta.persistence.Table
3. jakarta.persistence.Id
4. jakarta.persistence.GeneratedValue
5. jakarta.persistence.Column
6. jakarta.persistence.Enumerated
7. jakarta.persistence.PrePersist
8. jakarta.persistence.UniqueConstraint
9. org.springframework.transaction.annotation.Transactional
10. org.hibernate.annotations.CreationTimestamp

#### G. Lombok

1. lombok.Data
2. lombok.Getter
3. lombok.Setter
4. lombok.Builder
5. lombok.Builder.Default
6. lombok.NoArgsConstructor
7. lombok.AllArgsConstructor
8. lombok.RequiredArgsConstructor
9. lombok.extern.slf4j.Slf4j

#### H. Miscellaneous

1. com.fasterxml.jackson.annotation.JsonProperty
2. org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
3. java.lang.Override

---

## 5. Interface Revision

### 5.1 Interface Stats

1. Project-defined interfaces: `21`
2. OpenFeign client interfaces: `9`
3. Spring Data repository interfaces: `12`
4. Framework interfaces implemented by classes: `8`

### 5.2 OpenFeign Client Interfaces (Inter-Service Contracts)

| Service | Interface | Key Methods / Intent |
|---|---|---|
| admin-service | InvestorClient | `getAllInvestors()` |
| admin-service | PortfolioClient | `getMyPortfolios()`, stock deletion settlement call |
| advisor | PortfolioClient | `getMyPortfolios()` |
| auth-service | NotificationClient | `sendOtp(...)`, `sendRegistration(...)` |
| investor-service | AdminClient | market/company fetch + quantity update calls |
| investor-service | AdvisorClient | advisor listing |
| investor-service | NotificationClient | send trade notifications |
| investor-service | PortfolioClient | create/get portfolios, transfer, performance, transactions |
| portfolio-service | AdminMarketClient | admin market contract proxy |

Revision takeaway: Feign interfaces are the backbone of service-to-service orchestration.

### 5.3 Repository Interfaces (JPA Contract Layer)

| Service | Repository Interface | Key Custom Query Methods |
|---|---|---|
| admin-service | CompanyRepository | `findBySymbolIgnoreCase(...)` |
| admin-service | StockRepository | `findBySymbol(...)` |
| advisor | AdviceRepository | `findByAdvisorId(...)` |
| advisor | AdvisorRepository | default JpaRepository methods only |
| advisor | ChatMessageRepository | `findByQuestionIgnoreCase(...)` |
| advisor | InvestorAllocationRepository | advisor/investor lookup + delete pair |
| auth-service | RoleRepository | `findByName(...)` |
| auth-service | UserRepository | `findByEmail(...)`, `findByOtp(...)`, `existsByEmail(...)` |
| investor-service | InvestorRepository | `findByEmail(...)` |
| portfolio-service | HoldingRepository | portfolio+symbol lookups, delete operations |
| portfolio-service | PortfolioRepository | `findByInvestorId(...)` |
| portfolio-service | TransactionRepository | timestamp-ordered transaction queries |

Revision takeaway: persistence is repository-first; custom methods mostly use Spring Data query derivation naming.

### 5.4 Framework Interfaces Implemented by Concrete Classes

| Service | Class | Implemented Interface | Why |
|---|---|---|---|
| admin-service | AuthEntryPointJwt | AuthenticationEntryPoint | custom unauthorized HTTP response |
| advisor | AuthEntryPointJwt | AuthenticationEntryPoint | custom unauthorized HTTP response |
| auth-service | AuthEntryPointJwt | AuthenticationEntryPoint | custom unauthorized HTTP response |
| auth-service | DataSeeder | CommandLineRunner | startup data seeding/bootstrap |
| auth-service | UserDetailsServiceImpl | UserDetailsService | custom user loading for auth flow |
| investor-service | AuthEntryPointJwt | AuthenticationEntryPoint | custom unauthorized HTTP response |
| notification-service | WebSocketConfig | WebSocketMessageBrokerConfigurer | websocket broker/endpoint config |
| portfolio-service | AuthEntryPointJwt | AuthenticationEntryPoint | custom unauthorized HTTP response |

### 5.5 Interface Usage Patterns to Memorize

1. If cross-service call exists, look for a Feign interface first.
2. If DB interaction exists, look for a repository interface extending `JpaRepository`.
3. Security extension points are centralized around `AuthenticationEntryPoint` and `UserDetailsService`.
4. Runtime bootstrapping or infra customization uses framework interfaces (`CommandLineRunner`, websocket configurer).

---

## 6. Service-by-Service Last-Minute Revision

### 6.1 Config Server

1. Key annotation: `@EnableConfigServer`.
2. Central source for application properties.
3. Also runs as Eureka client.

### 6.2 Eureka Server

1. Key annotation: `@EnableEurekaServer`.
2. Registry for service discovery.
3. Also consumes external config.

### 6.3 API Gateway

1. Gateway starter + Eureka client + config client.
2. Route-first edge service.
3. No domain persistence logic.

### 6.4 Auth Service

1. Most security-heavy service.
2. Handles registration/login/JWT/OTP flow.
3. Uses JPA repositories for `User` and `Role`.
4. Implements `UserDetailsService` and startup `CommandLineRunner`.
5. Uses Feign to call notification-service for OTP/registration notifications.

### 6.5 Admin Service

1. Manages company/stock domain entities.
2. Uses Feign clients for investor/portfolio coordination.
3. Security entry point customization via `AuthEntryPointJwt`.
4. JPA repositories: `CompanyRepository`, `StockRepository`.

### 6.6 Advisor Service

1. Advisor allocation and advice workflow.
2. Repository-heavy service for advice/chat/allocation persistence.
3. Feign integration to portfolio-service.
4. Security-enabled and transaction-enabled domain operations.

### 6.7 Notification Service

1. Special tech stack: Mail + WebSocket + iText.
2. Websocket config via `WebSocketMessageBrokerConfigurer`.
3. Supports asynchronous user communication patterns.

### 6.8 Portfolio Service

1. Core portfolio state and transaction calculations.
2. Heavy JPA repository usage (portfolio/holding/transaction).
3. Feign to admin market service.
4. Security + validation + transactional logic are central.

### 6.9 Investor Service

1. Orchestration-heavy investor API layer.
2. Feign calls to admin, advisor, portfolio, notification.
3. Uses load balancer dependency.
4. Contains security and persistence for investor profile.

---

## 7. 20-Minute Rapid Recap Checklist

1. Can you explain why Config and Eureka must start first?
2. Can you differentiate Gateway routing vs Feign service-to-service calls?
3. Can you list core cross-cutting dependencies: web, security, JPA, validation, actuator, config, eureka?
4. Can you explain the JJWT triplet (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`)?
5. Can you name where `spring-cloud-starter-openfeign` is used and why?
6. Can you recall the 3 security annotations: `@EnableWebSecurity`, `@EnableMethodSecurity`, `@PreAuthorize`?
7. Can you list main request mapping annotations and binding annotations?
8. Can you explain why `@Valid` + `@NotBlank` + `@NotNull` are critical in API services?
9. Can you describe the difference between `@Entity` and repository interfaces?
10. Can you explain why Lombok is heavily used in this codebase?
11. Can you list all Feign client interfaces and their service purpose?
12. Can you list all repository interfaces and one key query method each?
13. Can you explain repeated `AuthEntryPointJwt` implementations across multiple services?
14. Can you explain where websocket configuration lives and why?
15. Can you walk through one complete business flow: Investor request -> Feign calls -> persistence -> notification?

---

## 8. Pointers

1. Full exhaustive source: `fullProjectdetails.md`
2. This file intentionally omits per-file annotation location listings to stay revision-focused.
3. For exact file-by-file traceability, open the full document.
