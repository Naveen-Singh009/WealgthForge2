# Full Project Details

## 1. Scope and Method
This file is generated from source under src/main/java and each microservice pom.xml in the current repository state.
It documents every dependency, annotation, and interface used in these Java microservices.

## 2. Microservice Overview
| Service | Path | Purpose |
|---|---|---|
| Config Server (config-server) | config-server | Centralized configuration service for all other microservices. |
| Eureka Server (eureka-server) | EurekaServer | Service registry for dynamic discovery between microservices. |
| API Gateway (api-gateway) | api-gateway | Single ingress entry point and route dispatcher to backend services. |
| Auth Service (auth-service) | auth service | User authentication, registration, JWT issuance/validation, OTP and role management. |
| Admin Service (admin-service) | admin-service | Company and stock market data management plus investor/admin operations. |
| Advisor Service (advisor) | advisor\advisor | Advisor registration, investor allocation, and advisory recommendation workflows. |
| Notification Service (notification-service) | notification-service\notification-service | Email and websocket-based notification delivery. |
| Portfolio Service (portfolio-service) | portfolio service | Portfolio, holdings, transaction, transfer, and performance calculations. |
| Investor Service (investor-service) | investor-service\investor-service | Investor-facing orchestration APIs for buy/sell/transfer/history by collaborating with other services. |

## 3. Dependency Catalog (All Microservices)
| Dependency | What it adds | Used by services | Scope(s) | Version and notes |
|---|---|---|---|---|
| com.itextpdf:itext7-core | PDF generation library (itext7) for document/report style outputs. | Notification Service (notification-service) | compile | version=7.2.5; type=pom |
| io.jsonwebtoken:jjwt-api | JWT API contracts used to create, parse, and validate JWT tokens. | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) | compile | version=${jjwt.version} |
| io.jsonwebtoken:jjwt-impl | Runtime implementation for JJWT API internals. | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) | runtime | version=${jjwt.version} |
| io.jsonwebtoken:jjwt-jackson | Jackson serializer/deserializer bridge for JWT claims payload processing. | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) | runtime | version=${jjwt.version} |
| org.postgresql:postgresql | PostgreSQL JDBC driver used at runtime for database connectivity. | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) | runtime | managed by Spring Boot/Cloud BOM |
| org.projectlombok:lombok | Compile-time code generation for boilerplate (getters/setters/builders/constructors/loggers). | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Notification Service (notification-service), Portfolio Service (portfolio-service) | compile | optional=true |
| org.springdoc:springdoc-openapi-starter-webmvc-ui | OpenAPI/Swagger UI generation for documenting auth-service endpoints. | Auth Service (auth-service) | compile | version=2.5.0 |
| org.springframework.boot:spring-boot-starter-actuator | Health/metrics/management endpoints used for observability and service checks. | Admin Service (admin-service), Advisor Service (advisor), API Gateway (api-gateway), Config Server (config-server), Eureka Server (eureka-server), Investor Service (investor-service), Notification Service (notification-service), Portfolio Service (portfolio-service) | compile | managed by Spring Boot/Cloud BOM |
| org.springframework.boot:spring-boot-starter-data-jpa | Spring Data JPA + Hibernate integration for entity/repository persistence. | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) | compile | managed by Spring Boot/Cloud BOM |
| org.springframework.boot:spring-boot-starter-mail | SMTP email support for OTP and notification email workflows. | Auth Service (auth-service), Notification Service (notification-service) | compile | managed by Spring Boot/Cloud BOM |
| org.springframework.boot:spring-boot-starter-security | Spring Security filter chain, authn/authz primitives, and security configuration support. | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) | compile | managed by Spring Boot/Cloud BOM |
| org.springframework.boot:spring-boot-starter-test | Spring Boot testing stack (JUnit, AssertJ, Mockito, test utilities). | Admin Service (admin-service), Advisor Service (advisor), API Gateway (api-gateway), Auth Service (auth-service), Config Server (config-server), Eureka Server (eureka-server), Investor Service (investor-service), Notification Service (notification-service), Portfolio Service (portfolio-service) | test | managed by Spring Boot/Cloud BOM |
| org.springframework.boot:spring-boot-starter-validation | Jakarta Bean Validation runtime for DTO/entity validation annotations. | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Notification Service (notification-service), Portfolio Service (portfolio-service) | compile | managed by Spring Boot/Cloud BOM |
| org.springframework.boot:spring-boot-starter-web | Spring MVC + embedded servlet container for REST HTTP APIs. | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Notification Service (notification-service), Portfolio Service (portfolio-service) | compile | managed by Spring Boot/Cloud BOM |
| org.springframework.boot:spring-boot-starter-websocket | WebSocket/STOMP messaging infrastructure for push notifications. | Notification Service (notification-service) | compile | managed by Spring Boot/Cloud BOM |
| org.springframework.cloud:spring-cloud-config-server | Hosts centralized configuration repository for Spring Cloud clients. | Config Server (config-server) | compile | managed by Spring Boot/Cloud BOM |
| org.springframework.cloud:spring-cloud-starter-config | Consumes externalized configuration from Config Server. | Admin Service (admin-service), Advisor Service (advisor), API Gateway (api-gateway), Auth Service (auth-service), Eureka Server (eureka-server), Investor Service (investor-service), Notification Service (notification-service), Portfolio Service (portfolio-service) | compile | managed by Spring Boot/Cloud BOM |
| org.springframework.cloud:spring-cloud-starter-gateway | Reactive API gateway for route predicates, filters, and edge concerns. | API Gateway (api-gateway) | compile | managed by Spring Boot/Cloud BOM |
| org.springframework.cloud:spring-cloud-starter-loadbalancer | Client-side service instance load balancing for discovered services. | Investor Service (investor-service) | compile | managed by Spring Boot/Cloud BOM |
| org.springframework.cloud:spring-cloud-starter-netflix-eureka-client | Registers service instances with Eureka and enables discovery-based client lookups. | Admin Service (admin-service), Advisor Service (advisor), API Gateway (api-gateway), Auth Service (auth-service), Config Server (config-server), Investor Service (investor-service), Notification Service (notification-service), Portfolio Service (portfolio-service) | compile | managed by Spring Boot/Cloud BOM |
| org.springframework.cloud:spring-cloud-starter-netflix-eureka-server | Runs the Eureka discovery server registry. | Eureka Server (eureka-server) | compile | managed by Spring Boot/Cloud BOM |
| org.springframework.cloud:spring-cloud-starter-openfeign | Declarative HTTP clients for inter-service communication via annotated interfaces. | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) | compile | managed by Spring Boot/Cloud BOM |
| org.springframework.security:spring-security-test | Security-focused testing helpers (mock authentication, role assertions). | Admin Service (admin-service), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) | test | managed by Spring Boot/Cloud BOM |

## 4. Per-Service Dependency Breakdown
### 4.1 Config Server (config-server)
| Dependency | Scope | Why this service needs it |
|---|---|---|
| org.springframework.boot:spring-boot-starter-actuator | compile | Health/metrics/management endpoints used for observability and service checks. |
| org.springframework.boot:spring-boot-starter-test | test | Spring Boot testing stack (JUnit, AssertJ, Mockito, test utilities). |
| org.springframework.cloud:spring-cloud-config-server | compile | Hosts centralized configuration repository for Spring Cloud clients. |
| org.springframework.cloud:spring-cloud-starter-netflix-eureka-client | compile | Registers service instances with Eureka and enables discovery-based client lookups. |

### 4.2 Eureka Server (eureka-server)
| Dependency | Scope | Why this service needs it |
|---|---|---|
| org.springframework.boot:spring-boot-starter-actuator | compile | Health/metrics/management endpoints used for observability and service checks. |
| org.springframework.boot:spring-boot-starter-test | test | Spring Boot testing stack (JUnit, AssertJ, Mockito, test utilities). |
| org.springframework.cloud:spring-cloud-starter-config | compile | Consumes externalized configuration from Config Server. |
| org.springframework.cloud:spring-cloud-starter-netflix-eureka-server | compile | Runs the Eureka discovery server registry. |

### 4.3 API Gateway (api-gateway)
| Dependency | Scope | Why this service needs it |
|---|---|---|
| org.springframework.boot:spring-boot-starter-actuator | compile | Health/metrics/management endpoints used for observability and service checks. |
| org.springframework.boot:spring-boot-starter-test | test | Spring Boot testing stack (JUnit, AssertJ, Mockito, test utilities). |
| org.springframework.cloud:spring-cloud-starter-config | compile | Consumes externalized configuration from Config Server. |
| org.springframework.cloud:spring-cloud-starter-gateway | compile | Reactive API gateway for route predicates, filters, and edge concerns. |
| org.springframework.cloud:spring-cloud-starter-netflix-eureka-client | compile | Registers service instances with Eureka and enables discovery-based client lookups. |

### 4.4 Auth Service (auth-service)
| Dependency | Scope | Why this service needs it |
|---|---|---|
| io.jsonwebtoken:jjwt-api | compile | JWT API contracts used to create, parse, and validate JWT tokens. |
| io.jsonwebtoken:jjwt-impl | runtime | Runtime implementation for JJWT API internals. |
| io.jsonwebtoken:jjwt-jackson | runtime | Jackson serializer/deserializer bridge for JWT claims payload processing. |
| org.projectlombok:lombok | compile | Compile-time code generation for boilerplate (getters/setters/builders/constructors/loggers). |
| org.postgresql:postgresql | runtime | PostgreSQL JDBC driver used at runtime for database connectivity. |
| org.springframework.boot:spring-boot-starter-data-jpa | compile | Spring Data JPA + Hibernate integration for entity/repository persistence. |
| org.springframework.boot:spring-boot-starter-mail | compile | SMTP email support for OTP and notification email workflows. |
| org.springframework.boot:spring-boot-starter-security | compile | Spring Security filter chain, authn/authz primitives, and security configuration support. |
| org.springframework.boot:spring-boot-starter-test | test | Spring Boot testing stack (JUnit, AssertJ, Mockito, test utilities). |
| org.springframework.boot:spring-boot-starter-validation | compile | Jakarta Bean Validation runtime for DTO/entity validation annotations. |
| org.springframework.boot:spring-boot-starter-web | compile | Spring MVC + embedded servlet container for REST HTTP APIs. |
| org.springframework.cloud:spring-cloud-starter-config | compile | Consumes externalized configuration from Config Server. |
| org.springframework.cloud:spring-cloud-starter-netflix-eureka-client | compile | Registers service instances with Eureka and enables discovery-based client lookups. |
| org.springframework.cloud:spring-cloud-starter-openfeign | compile | Declarative HTTP clients for inter-service communication via annotated interfaces. |
| org.springdoc:springdoc-openapi-starter-webmvc-ui | compile | OpenAPI/Swagger UI generation for documenting auth-service endpoints. |
| org.springframework.security:spring-security-test | test | Security-focused testing helpers (mock authentication, role assertions). |

### 4.5 Admin Service (admin-service)
| Dependency | Scope | Why this service needs it |
|---|---|---|
| io.jsonwebtoken:jjwt-api | compile | JWT API contracts used to create, parse, and validate JWT tokens. |
| io.jsonwebtoken:jjwt-impl | runtime | Runtime implementation for JJWT API internals. |
| io.jsonwebtoken:jjwt-jackson | runtime | Jackson serializer/deserializer bridge for JWT claims payload processing. |
| org.projectlombok:lombok | compile | Compile-time code generation for boilerplate (getters/setters/builders/constructors/loggers). |
| org.postgresql:postgresql | runtime | PostgreSQL JDBC driver used at runtime for database connectivity. |
| org.springframework.boot:spring-boot-starter-actuator | compile | Health/metrics/management endpoints used for observability and service checks. |
| org.springframework.boot:spring-boot-starter-data-jpa | compile | Spring Data JPA + Hibernate integration for entity/repository persistence. |
| org.springframework.boot:spring-boot-starter-security | compile | Spring Security filter chain, authn/authz primitives, and security configuration support. |
| org.springframework.boot:spring-boot-starter-test | test | Spring Boot testing stack (JUnit, AssertJ, Mockito, test utilities). |
| org.springframework.boot:spring-boot-starter-validation | compile | Jakarta Bean Validation runtime for DTO/entity validation annotations. |
| org.springframework.boot:spring-boot-starter-web | compile | Spring MVC + embedded servlet container for REST HTTP APIs. |
| org.springframework.cloud:spring-cloud-starter-config | compile | Consumes externalized configuration from Config Server. |
| org.springframework.cloud:spring-cloud-starter-netflix-eureka-client | compile | Registers service instances with Eureka and enables discovery-based client lookups. |
| org.springframework.cloud:spring-cloud-starter-openfeign | compile | Declarative HTTP clients for inter-service communication via annotated interfaces. |
| org.springframework.security:spring-security-test | test | Security-focused testing helpers (mock authentication, role assertions). |

### 4.6 Advisor Service (advisor)
| Dependency | Scope | Why this service needs it |
|---|---|---|
| io.jsonwebtoken:jjwt-api | compile | JWT API contracts used to create, parse, and validate JWT tokens. |
| io.jsonwebtoken:jjwt-impl | runtime | Runtime implementation for JJWT API internals. |
| io.jsonwebtoken:jjwt-jackson | runtime | Jackson serializer/deserializer bridge for JWT claims payload processing. |
| org.projectlombok:lombok | compile | Compile-time code generation for boilerplate (getters/setters/builders/constructors/loggers). |
| org.postgresql:postgresql | runtime | PostgreSQL JDBC driver used at runtime for database connectivity. |
| org.springframework.boot:spring-boot-starter-actuator | compile | Health/metrics/management endpoints used for observability and service checks. |
| org.springframework.boot:spring-boot-starter-data-jpa | compile | Spring Data JPA + Hibernate integration for entity/repository persistence. |
| org.springframework.boot:spring-boot-starter-security | compile | Spring Security filter chain, authn/authz primitives, and security configuration support. |
| org.springframework.boot:spring-boot-starter-test | test | Spring Boot testing stack (JUnit, AssertJ, Mockito, test utilities). |
| org.springframework.boot:spring-boot-starter-validation | compile | Jakarta Bean Validation runtime for DTO/entity validation annotations. |
| org.springframework.boot:spring-boot-starter-web | compile | Spring MVC + embedded servlet container for REST HTTP APIs. |
| org.springframework.cloud:spring-cloud-starter-config | compile | Consumes externalized configuration from Config Server. |
| org.springframework.cloud:spring-cloud-starter-netflix-eureka-client | compile | Registers service instances with Eureka and enables discovery-based client lookups. |
| org.springframework.cloud:spring-cloud-starter-openfeign | compile | Declarative HTTP clients for inter-service communication via annotated interfaces. |

### 4.7 Notification Service (notification-service)
| Dependency | Scope | Why this service needs it |
|---|---|---|
| com.itextpdf:itext7-core | compile | PDF generation library (itext7) for document/report style outputs. |
| org.projectlombok:lombok | compile | Compile-time code generation for boilerplate (getters/setters/builders/constructors/loggers). |
| org.springframework.boot:spring-boot-starter-actuator | compile | Health/metrics/management endpoints used for observability and service checks. |
| org.springframework.boot:spring-boot-starter-mail | compile | SMTP email support for OTP and notification email workflows. |
| org.springframework.boot:spring-boot-starter-test | test | Spring Boot testing stack (JUnit, AssertJ, Mockito, test utilities). |
| org.springframework.boot:spring-boot-starter-validation | compile | Jakarta Bean Validation runtime for DTO/entity validation annotations. |
| org.springframework.boot:spring-boot-starter-web | compile | Spring MVC + embedded servlet container for REST HTTP APIs. |
| org.springframework.boot:spring-boot-starter-websocket | compile | WebSocket/STOMP messaging infrastructure for push notifications. |
| org.springframework.cloud:spring-cloud-starter-config | compile | Consumes externalized configuration from Config Server. |
| org.springframework.cloud:spring-cloud-starter-netflix-eureka-client | compile | Registers service instances with Eureka and enables discovery-based client lookups. |

### 4.8 Portfolio Service (portfolio-service)
| Dependency | Scope | Why this service needs it |
|---|---|---|
| io.jsonwebtoken:jjwt-api | compile | JWT API contracts used to create, parse, and validate JWT tokens. |
| io.jsonwebtoken:jjwt-impl | runtime | Runtime implementation for JJWT API internals. |
| io.jsonwebtoken:jjwt-jackson | runtime | Jackson serializer/deserializer bridge for JWT claims payload processing. |
| org.projectlombok:lombok | compile | Compile-time code generation for boilerplate (getters/setters/builders/constructors/loggers). |
| org.postgresql:postgresql | runtime | PostgreSQL JDBC driver used at runtime for database connectivity. |
| org.springframework.boot:spring-boot-starter-actuator | compile | Health/metrics/management endpoints used for observability and service checks. |
| org.springframework.boot:spring-boot-starter-data-jpa | compile | Spring Data JPA + Hibernate integration for entity/repository persistence. |
| org.springframework.boot:spring-boot-starter-security | compile | Spring Security filter chain, authn/authz primitives, and security configuration support. |
| org.springframework.boot:spring-boot-starter-test | test | Spring Boot testing stack (JUnit, AssertJ, Mockito, test utilities). |
| org.springframework.boot:spring-boot-starter-validation | compile | Jakarta Bean Validation runtime for DTO/entity validation annotations. |
| org.springframework.boot:spring-boot-starter-web | compile | Spring MVC + embedded servlet container for REST HTTP APIs. |
| org.springframework.cloud:spring-cloud-starter-config | compile | Consumes externalized configuration from Config Server. |
| org.springframework.cloud:spring-cloud-starter-netflix-eureka-client | compile | Registers service instances with Eureka and enables discovery-based client lookups. |
| org.springframework.cloud:spring-cloud-starter-openfeign | compile | Declarative HTTP clients for inter-service communication via annotated interfaces. |
| org.springframework.security:spring-security-test | test | Security-focused testing helpers (mock authentication, role assertions). |

### 4.9 Investor Service (investor-service)
| Dependency | Scope | Why this service needs it |
|---|---|---|
| io.jsonwebtoken:jjwt-api | compile | JWT API contracts used to create, parse, and validate JWT tokens. |
| io.jsonwebtoken:jjwt-impl | runtime | Runtime implementation for JJWT API internals. |
| io.jsonwebtoken:jjwt-jackson | runtime | Jackson serializer/deserializer bridge for JWT claims payload processing. |
| org.projectlombok:lombok | compile | Compile-time code generation for boilerplate (getters/setters/builders/constructors/loggers). |
| org.postgresql:postgresql | runtime | PostgreSQL JDBC driver used at runtime for database connectivity. |
| org.springframework.boot:spring-boot-starter-actuator | compile | Health/metrics/management endpoints used for observability and service checks. |
| org.springframework.boot:spring-boot-starter-data-jpa | compile | Spring Data JPA + Hibernate integration for entity/repository persistence. |
| org.springframework.boot:spring-boot-starter-security | compile | Spring Security filter chain, authn/authz primitives, and security configuration support. |
| org.springframework.boot:spring-boot-starter-test | test | Spring Boot testing stack (JUnit, AssertJ, Mockito, test utilities). |
| org.springframework.boot:spring-boot-starter-validation | compile | Jakarta Bean Validation runtime for DTO/entity validation annotations. |
| org.springframework.boot:spring-boot-starter-web | compile | Spring MVC + embedded servlet container for REST HTTP APIs. |
| org.springframework.cloud:spring-cloud-starter-config | compile | Consumes externalized configuration from Config Server. |
| org.springframework.cloud:spring-cloud-starter-loadbalancer | compile | Client-side service instance load balancing for discovered services. |
| org.springframework.cloud:spring-cloud-starter-netflix-eureka-client | compile | Registers service instances with Eureka and enables discovery-based client lookups. |
| org.springframework.cloud:spring-cloud-starter-openfeign | compile | Declarative HTTP clients for inter-service communication via annotated interfaces. |
| org.springframework.security:spring-security-test | test | Security-focused testing helpers (mock authentication, role assertions). |

## 5. Annotation Catalog
Canonicalization note: simple imports (for example Data) and fully-qualified forms (for example lombok.Data) are merged into one canonical annotation entry.

| Canonical annotation | What it does in this project | Raw forms found | Services using it |
|---|---|---|---|
| com.fasterxml.jackson.annotation.JsonProperty | Customizes JSON serialization/deserialization names. | com.fasterxml.jackson.annotation.JsonProperty | Investor Service (investor-service) |
| jakarta.annotation.PostConstruct | Runs initialization logic after bean creation. | jakarta.annotation.PostConstruct | Admin Service (admin-service), Advisor Service (advisor), Investor Service (investor-service) |
| jakarta.persistence.Column | Configures column-level mapping. | Column, jakarta.persistence.Column | Admin Service (admin-service), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| jakarta.persistence.Entity | Marks persistent JPA entities. | Entity, jakarta.persistence.Entity | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| jakarta.persistence.Enumerated | Configures enum persistence strategy. | Enumerated | Auth Service (auth-service), Portfolio Service (portfolio-service) |
| jakarta.persistence.GeneratedValue | Configures generated IDs. | GeneratedValue, jakarta.persistence.GeneratedValue | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Portfolio Service (portfolio-service) |
| jakarta.persistence.Id | Marks entity primary key. | Id, jakarta.persistence.Id | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| jakarta.persistence.PrePersist | Runs callback before first persist. | PrePersist | Portfolio Service (portfolio-service) |
| jakarta.persistence.Table | Configures entity-table mapping. | jakarta.persistence.Table, Table | Admin Service (admin-service), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| jakarta.persistence.UniqueConstraint | Declares database-level uniqueness constraints. | UniqueConstraint | Auth Service (auth-service), Portfolio Service (portfolio-service) |
| jakarta.validation.constraints.DecimalMin | Applies decimal minimum value constraints. | DecimalMin, jakarta.validation.constraints.DecimalMin | Admin Service (admin-service), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| jakarta.validation.constraints.Email | Validates email format. | jakarta.validation.constraints.Email | Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service) |
| jakarta.validation.constraints.Min | Applies integer minimum value constraints. | jakarta.validation.constraints.Min, Min | Admin Service (admin-service), Investor Service (investor-service) |
| jakarta.validation.constraints.NotBlank | Rejects null/blank text values. | jakarta.validation.constraints.NotBlank, NotBlank | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| jakarta.validation.constraints.NotNull | Rejects null values. | jakarta.validation.constraints.NotNull, NotNull | Admin Service (admin-service), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| jakarta.validation.constraints.Positive | Requires positive numeric values. | Positive | Admin Service (admin-service) |
| jakarta.validation.constraints.Size | Applies min/max size constraints. | jakarta.validation.constraints.Size, Size | Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| jakarta.validation.Valid | Triggers bean validation. | jakarta.validation.Valid | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| java.lang.Override | Compile-time method override verification annotation. | Override | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Notification Service (notification-service), Portfolio Service (portfolio-service) |
| lombok.AllArgsConstructor | Generates all-arguments constructor. | AllArgsConstructor, lombok.AllArgsConstructor | Admin Service (admin-service), Auth Service (auth-service), Portfolio Service (portfolio-service) |
| lombok.Builder | Generates builder API for object creation. | Builder, lombok.Builder | Auth Service (auth-service), Portfolio Service (portfolio-service) |
| lombok.Builder.Default | Keeps field defaults when builder values are omitted. | Builder.Default | Auth Service (auth-service) |
| lombok.Data | Generates common boilerplate methods (getters, setters, equals/hashCode, toString). | Data, lombok.Data | Admin Service (admin-service), Auth Service (auth-service), Portfolio Service (portfolio-service) |
| lombok.extern.slf4j.Slf4j | Generates SLF4J logger field. | lombok.extern.slf4j.Slf4j | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| lombok.Getter | Generates getter methods. | Getter, lombok.Getter | Admin Service (admin-service), Portfolio Service (portfolio-service) |
| lombok.NoArgsConstructor | Generates no-argument constructor. | lombok.NoArgsConstructor, NoArgsConstructor | Admin Service (admin-service), Auth Service (auth-service), Portfolio Service (portfolio-service) |
| lombok.RequiredArgsConstructor | Generates constructor for required fields. | lombok.RequiredArgsConstructor | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| lombok.Setter | Generates setter methods. | lombok.Setter, Setter | Admin Service (admin-service), Portfolio Service (portfolio-service) |
| org.hibernate.annotations.CreationTimestamp | Auto-populates creation timestamp fields. | org.hibernate.annotations.CreationTimestamp | Auth Service (auth-service) |
| org.springframework.beans.factory.annotation.Autowired | Dependency injection by type. | org.springframework.beans.factory.annotation.Autowired | Notification Service (notification-service) |
| org.springframework.beans.factory.annotation.Value | Injects externalized configuration values. | org.springframework.beans.factory.annotation.Value | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Notification Service (notification-service), Portfolio Service (portfolio-service) |
| org.springframework.boot.autoconfigure.SpringBootApplication | Application bootstrap for each Spring Boot microservice. | org.springframework.boot.autoconfigure.SpringBootApplication | Admin Service (admin-service), Advisor Service (advisor), API Gateway (api-gateway), Auth Service (auth-service), Config Server (config-server), Eureka Server (eureka-server), Investor Service (investor-service), Notification Service (notification-service), Portfolio Service (portfolio-service) |
| org.springframework.cloud.client.discovery.EnableDiscoveryClient | Enables Eureka discovery registration and lookup. | org.springframework.cloud.client.discovery.EnableDiscoveryClient | Admin Service (admin-service), Advisor Service (advisor), API Gateway (api-gateway), Auth Service (auth-service), Investor Service (investor-service), Notification Service (notification-service), Portfolio Service (portfolio-service) |
| org.springframework.cloud.config.server.EnableConfigServer | Enables config-server behavior. | org.springframework.cloud.config.server.EnableConfigServer | Config Server (config-server) |
| org.springframework.cloud.netflix.eureka.server.EnableEurekaServer | Enables Eureka registry behavior. | org.springframework.cloud.netflix.eureka.server.EnableEurekaServer | Eureka Server (eureka-server) |
| org.springframework.cloud.openfeign.EnableFeignClients | Enables Feign interface proxy generation. | org.springframework.cloud.openfeign.EnableFeignClients | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| org.springframework.cloud.openfeign.FeignClient | Declares inter-service REST client interfaces. | org.springframework.cloud.openfeign.FeignClient | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| org.springframework.context.annotation.Bean | Registers bean-producing methods. | org.springframework.context.annotation.Bean | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| org.springframework.context.annotation.Configuration | Marks Java config classes. | org.springframework.context.annotation.Configuration | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Notification Service (notification-service), Portfolio Service (portfolio-service) |
| org.springframework.security.access.prepost.PreAuthorize | Evaluates authorization expressions before method invocation. | org.springframework.security.access.prepost.PreAuthorize | Auth Service (auth-service), Investor Service (investor-service) |
| org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity | Enables method-level authorization annotations. | org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| org.springframework.security.config.annotation.web.configuration.EnableWebSecurity | Enables web security configuration. | org.springframework.security.config.annotation.web.configuration.EnableWebSecurity | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| org.springframework.stereotype.Component | Generic Spring-managed component marker. | org.springframework.stereotype.Component | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| org.springframework.stereotype.Repository | Repository-layer component marker. | org.springframework.stereotype.Repository | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Portfolio Service (portfolio-service) |
| org.springframework.stereotype.Service | Service-layer component marker. | org.springframework.stereotype.Service | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Notification Service (notification-service), Portfolio Service (portfolio-service) |
| org.springframework.transaction.annotation.Transactional | Defines transaction boundaries for persistence operations. | org.springframework.transaction.annotation.Transactional | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| org.springframework.web.bind.annotation.CrossOrigin | Configures CORS access for browser clients. | CrossOrigin | Admin Service (admin-service) |
| org.springframework.web.bind.annotation.DeleteMapping | Maps HTTP DELETE handlers. | DeleteMapping | Admin Service (admin-service), Advisor Service (advisor), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| org.springframework.web.bind.annotation.ExceptionHandler | Maps exceptions to HTTP responses. | ExceptionHandler, org.springframework.web.bind.annotation.ExceptionHandler | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| org.springframework.web.bind.annotation.GetMapping | Maps HTTP GET handlers. | GetMapping, org.springframework.web.bind.annotation.GetMapping | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| org.springframework.web.bind.annotation.PathVariable | Binds URI path variables. | org.springframework.web.bind.annotation.PathVariable, PathVariable | Admin Service (admin-service), Advisor Service (advisor), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| org.springframework.web.bind.annotation.PostMapping | Maps HTTP POST handlers. | org.springframework.web.bind.annotation.PostMapping, PostMapping | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Notification Service (notification-service), Portfolio Service (portfolio-service) |
| org.springframework.web.bind.annotation.PutMapping | Maps HTTP PUT handlers. | PutMapping | Admin Service (admin-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| org.springframework.web.bind.annotation.RequestBody | Binds request body payloads to parameters. | org.springframework.web.bind.annotation.RequestBody, RequestBody | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Notification Service (notification-service), Portfolio Service (portfolio-service) |
| org.springframework.web.bind.annotation.RequestHeader | Binds HTTP headers. | RequestHeader | Investor Service (investor-service) |
| org.springframework.web.bind.annotation.RequestMapping | Maps base paths and endpoint routes. | org.springframework.web.bind.annotation.RequestMapping, RequestMapping | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Notification Service (notification-service), Portfolio Service (portfolio-service) |
| org.springframework.web.bind.annotation.RequestParam | Binds query parameters. | org.springframework.web.bind.annotation.RequestParam, RequestParam | Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service) |
| org.springframework.web.bind.annotation.ResponseStatus | Sets explicit HTTP status mapping. | org.springframework.web.bind.annotation.ResponseStatus, ResponseStatus | Investor Service (investor-service), Portfolio Service (portfolio-service) |
| org.springframework.web.bind.annotation.RestController | Declares REST controller classes. | org.springframework.web.bind.annotation.RestController, RestController | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Notification Service (notification-service), Portfolio Service (portfolio-service) |
| org.springframework.web.bind.annotation.RestControllerAdvice | Global REST exception advice. | org.springframework.web.bind.annotation.RestControllerAdvice, RestControllerAdvice | Admin Service (admin-service), Advisor Service (advisor), Auth Service (auth-service), Investor Service (investor-service), Portfolio Service (portfolio-service) |
| org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker | Enables websocket message broker configuration. | org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker | Notification Service (notification-service) |

### 5.1 Exact Annotation Usage Locations
#### com.fasterxml.jackson.annotation.JsonProperty
Used in 1 file(s).
- investor-service/investor-service/src/main/java/com/example/demo/dto/CompanyDTO.java

#### jakarta.annotation.PostConstruct
Used in 3 file(s).
- admin-service/src/main/java/com/example/demo/security/JwtUtils.java
- advisor/advisor/src/main/java/com/example/demo/security/JwtUtils.java
- investor-service/investor-service/src/main/java/com/example/demo/security/JwtUtils.java

#### jakarta.persistence.Column
Used in 7 file(s).
- admin-service/src/main/java/com/example/demo/entity/Stock.java
- auth service/src/main/java/com/authservice/model/Role.java
- auth service/src/main/java/com/authservice/model/User.java
- investor-service/investor-service/src/main/java/com/example/demo/entity/Investor.java
- portfolio service/src/main/java/com/portfolioservice/model/Holding.java
- portfolio service/src/main/java/com/portfolioservice/model/Portfolio.java
- portfolio service/src/main/java/com/portfolioservice/model/Transaction.java

#### jakarta.persistence.Entity
Used in 12 file(s).
- admin-service/src/main/java/com/example/demo/entity/Company.java
- admin-service/src/main/java/com/example/demo/entity/Stock.java
- advisor/advisor/src/main/java/com/example/demo/entity/Advice.java
- advisor/advisor/src/main/java/com/example/demo/entity/Advisor.java
- advisor/advisor/src/main/java/com/example/demo/entity/ChatMessage.java
- advisor/advisor/src/main/java/com/example/demo/entity/InvestorAllocation.java
- auth service/src/main/java/com/authservice/model/Role.java
- auth service/src/main/java/com/authservice/model/User.java
- investor-service/investor-service/src/main/java/com/example/demo/entity/Investor.java
- portfolio service/src/main/java/com/portfolioservice/model/Holding.java
- portfolio service/src/main/java/com/portfolioservice/model/Portfolio.java
- portfolio service/src/main/java/com/portfolioservice/model/Transaction.java

#### jakarta.persistence.Enumerated
Used in 3 file(s).
- auth service/src/main/java/com/authservice/model/Role.java
- auth service/src/main/java/com/authservice/model/User.java
- portfolio service/src/main/java/com/portfolioservice/model/Transaction.java

#### jakarta.persistence.GeneratedValue
Used in 11 file(s).
- admin-service/src/main/java/com/example/demo/entity/Company.java
- admin-service/src/main/java/com/example/demo/entity/Stock.java
- advisor/advisor/src/main/java/com/example/demo/entity/Advice.java
- advisor/advisor/src/main/java/com/example/demo/entity/Advisor.java
- advisor/advisor/src/main/java/com/example/demo/entity/ChatMessage.java
- advisor/advisor/src/main/java/com/example/demo/entity/InvestorAllocation.java
- auth service/src/main/java/com/authservice/model/Role.java
- auth service/src/main/java/com/authservice/model/User.java
- portfolio service/src/main/java/com/portfolioservice/model/Holding.java
- portfolio service/src/main/java/com/portfolioservice/model/Portfolio.java
- portfolio service/src/main/java/com/portfolioservice/model/Transaction.java

#### jakarta.persistence.Id
Used in 12 file(s).
- admin-service/src/main/java/com/example/demo/entity/Company.java
- admin-service/src/main/java/com/example/demo/entity/Stock.java
- advisor/advisor/src/main/java/com/example/demo/entity/Advice.java
- advisor/advisor/src/main/java/com/example/demo/entity/Advisor.java
- advisor/advisor/src/main/java/com/example/demo/entity/ChatMessage.java
- advisor/advisor/src/main/java/com/example/demo/entity/InvestorAllocation.java
- auth service/src/main/java/com/authservice/model/Role.java
- auth service/src/main/java/com/authservice/model/User.java
- investor-service/investor-service/src/main/java/com/example/demo/entity/Investor.java
- portfolio service/src/main/java/com/portfolioservice/model/Holding.java
- portfolio service/src/main/java/com/portfolioservice/model/Portfolio.java
- portfolio service/src/main/java/com/portfolioservice/model/Transaction.java

#### jakarta.persistence.PrePersist
Used in 2 file(s).
- portfolio service/src/main/java/com/portfolioservice/model/Portfolio.java
- portfolio service/src/main/java/com/portfolioservice/model/Transaction.java

#### jakarta.persistence.Table
Used in 8 file(s).
- admin-service/src/main/java/com/example/demo/entity/Company.java
- admin-service/src/main/java/com/example/demo/entity/Stock.java
- auth service/src/main/java/com/authservice/model/Role.java
- auth service/src/main/java/com/authservice/model/User.java
- investor-service/investor-service/src/main/java/com/example/demo/entity/Investor.java
- portfolio service/src/main/java/com/portfolioservice/model/Holding.java
- portfolio service/src/main/java/com/portfolioservice/model/Portfolio.java
- portfolio service/src/main/java/com/portfolioservice/model/Transaction.java

#### jakarta.persistence.UniqueConstraint
Used in 2 file(s).
- auth service/src/main/java/com/authservice/model/User.java
- portfolio service/src/main/java/com/portfolioservice/model/Holding.java

#### jakarta.validation.constraints.DecimalMin
Used in 12 file(s).
- admin-service/src/main/java/com/example/demo/dto/StockDeletionSettlementRequest.java
- auth service/src/main/java/com/authservice/dto/AdminCreateUserRequest.java
- auth service/src/main/java/com/authservice/dto/RegisterRequest.java
- investor-service/investor-service/src/main/java/com/example/demo/dto/InvestorRegistrationRequest.java
- investor-service/investor-service/src/main/java/com/example/demo/dto/PortfolioCreateRequest.java
- investor-service/investor-service/src/main/java/com/example/demo/dto/PortfolioTransferRequest.java
- investor-service/investor-service/src/main/java/com/example/demo/dto/PortfolioUpdateRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/CreatePortfolioRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/StockDeletionSettlementRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/TradeRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/TransferRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/UpdatePortfolioRequest.java

#### jakarta.validation.constraints.Email
Used in 5 file(s).
- advisor/advisor/src/main/java/com/example/demo/entity/Advisor.java
- auth service/src/main/java/com/authservice/dto/AdminCreateUserRequest.java
- auth service/src/main/java/com/authservice/dto/LoginRequest.java
- auth service/src/main/java/com/authservice/dto/RegisterRequest.java
- investor-service/investor-service/src/main/java/com/example/demo/dto/InvestorRegistrationRequest.java

#### jakarta.validation.constraints.Min
Used in 3 file(s).
- admin-service/src/main/java/com/example/demo/entity/UpdateQuantity.java
- investor-service/investor-service/src/main/java/com/example/demo/dto/BuyRequestDTO.java
- investor-service/investor-service/src/main/java/com/example/demo/dto/SellRequestDTO.java

#### jakarta.validation.constraints.NotBlank
Used in 14 file(s).
- admin-service/src/main/java/com/example/demo/dto/StockDeletionSettlementRequest.java
- admin-service/src/main/java/com/example/demo/entity/Company.java
- admin-service/src/main/java/com/example/demo/entity/UpdateQuantity.java
- advisor/advisor/src/main/java/com/example/demo/entity/Advisor.java
- auth service/src/main/java/com/authservice/dto/AdminCreateUserRequest.java
- auth service/src/main/java/com/authservice/dto/LoginRequest.java
- auth service/src/main/java/com/authservice/dto/RegisterRequest.java
- investor-service/investor-service/src/main/java/com/example/demo/dto/BuyRequestDTO.java
- investor-service/investor-service/src/main/java/com/example/demo/dto/InvestorRegistrationRequest.java
- investor-service/investor-service/src/main/java/com/example/demo/dto/PortfolioCreateRequest.java
- investor-service/investor-service/src/main/java/com/example/demo/dto/SellRequestDTO.java
- portfolio service/src/main/java/com/portfolioservice/dto/CreatePortfolioRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/StockDeletionSettlementRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/TradeRequest.java

#### jakarta.validation.constraints.NotNull
Used in 14 file(s).
- admin-service/src/main/java/com/example/demo/dto/StockDeletionSettlementRequest.java
- admin-service/src/main/java/com/example/demo/entity/Company.java
- admin-service/src/main/java/com/example/demo/entity/UpdateQuantity.java
- auth service/src/main/java/com/authservice/dto/AdminCreateUserRequest.java
- auth service/src/main/java/com/authservice/dto/RegisterRequest.java
- investor-service/investor-service/src/main/java/com/example/demo/dto/BuyRequestDTO.java
- investor-service/investor-service/src/main/java/com/example/demo/dto/InvestorRegistrationRequest.java
- investor-service/investor-service/src/main/java/com/example/demo/dto/PortfolioCreateRequest.java
- investor-service/investor-service/src/main/java/com/example/demo/dto/PortfolioTransferRequest.java
- investor-service/investor-service/src/main/java/com/example/demo/dto/SellRequestDTO.java
- portfolio service/src/main/java/com/portfolioservice/dto/CreatePortfolioRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/StockDeletionSettlementRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/TradeRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/TransferRequest.java

#### jakarta.validation.constraints.Positive
Used in 1 file(s).
- admin-service/src/main/java/com/example/demo/entity/Company.java

#### jakarta.validation.constraints.Size
Used in 5 file(s).
- auth service/src/main/java/com/authservice/dto/AdminCreateUserRequest.java
- auth service/src/main/java/com/authservice/dto/RegisterRequest.java
- investor-service/investor-service/src/main/java/com/example/demo/dto/PortfolioUpdateRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/CreatePortfolioRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/UpdatePortfolioRequest.java

#### jakarta.validation.Valid
Used in 6 file(s).
- admin-service/src/main/java/com/example/demo/controller/AdminController.java
- advisor/advisor/src/main/java/com/example/demo/controller/AdvisorController.java
- auth service/src/main/java/com/authservice/controller/AuthController.java
- investor-service/investor-service/src/main/java/com/example/demo/controller/InvestorController.java
- portfolio service/src/main/java/com/portfolioservice/controller/AdminController.java
- portfolio service/src/main/java/com/portfolioservice/controller/PortfolioController.java

#### java.lang.Override
Used in 13 file(s).
- admin-service/src/main/java/com/example/demo/security/AuthEntryPointJwt.java
- admin-service/src/main/java/com/example/demo/security/JwtAuthFilter.java
- advisor/advisor/src/main/java/com/example/demo/security/AuthEntryPointJwt.java
- advisor/advisor/src/main/java/com/example/demo/security/JwtAuthFilter.java
- auth service/src/main/java/com/authservice/config/DataSeeder.java
- auth service/src/main/java/com/authservice/security/AuthEntryPointJwt.java
- auth service/src/main/java/com/authservice/security/JwtAuthFilter.java
- auth service/src/main/java/com/authservice/security/UserDetailsServiceImpl.java
- investor-service/investor-service/src/main/java/com/example/demo/security/AuthEntryPointJwt.java
- investor-service/investor-service/src/main/java/com/example/demo/security/JwtAuthFilter.java
- notification-service/notification-service/src/main/java/com/example/demo/config/WebSocketConfig.java
- portfolio service/src/main/java/com/portfolioservice/security/AuthEntryPointJwt.java
- portfolio service/src/main/java/com/portfolioservice/security/JwtAuthFilter.java

#### lombok.AllArgsConstructor
Used in 25 file(s).
- admin-service/src/main/java/com/example/demo/dto/StockDeletionSettlementRequest.java
- admin-service/src/main/java/com/example/demo/entity/Company.java
- admin-service/src/main/java/com/example/demo/entity/Stock.java
- admin-service/src/main/java/com/example/demo/exceptions/ErrorResponse.java
- auth service/src/main/java/com/authservice/dto/AdvisorProfileSyncRequest.java
- auth service/src/main/java/com/authservice/dto/AuthResponse.java
- auth service/src/main/java/com/authservice/dto/InvestorProfileSyncRequest.java
- auth service/src/main/java/com/authservice/dto/MessageResponse.java
- auth service/src/main/java/com/authservice/model/Role.java
- auth service/src/main/java/com/authservice/model/User.java
- portfolio service/src/main/java/com/portfolioservice/dto/ApiResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/CreatePortfolioRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/DeletePortfolioResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/HoldingResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/OverallPerformanceResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/PerformanceResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/PortfolioResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/StockDeletionSettlementRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/StockDeletionSettlementResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/TradeRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/TransferRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/UpdatePortfolioRequest.java
- portfolio service/src/main/java/com/portfolioservice/model/Holding.java
- portfolio service/src/main/java/com/portfolioservice/model/Portfolio.java
- portfolio service/src/main/java/com/portfolioservice/model/Transaction.java

#### lombok.Builder
Used in 13 file(s).
- auth service/src/main/java/com/authservice/dto/AuthResponse.java
- auth service/src/main/java/com/authservice/model/User.java
- portfolio service/src/main/java/com/portfolioservice/dto/ApiResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/DeletePortfolioResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/HoldingResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/OverallPerformanceResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/PerformanceResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/PortfolioResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/StockDeletionSettlementResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/TransactionResponse.java
- portfolio service/src/main/java/com/portfolioservice/model/Holding.java
- portfolio service/src/main/java/com/portfolioservice/model/Portfolio.java
- portfolio service/src/main/java/com/portfolioservice/model/Transaction.java

#### lombok.Builder.Default
Used in 2 file(s).
- auth service/src/main/java/com/authservice/dto/AuthResponse.java
- auth service/src/main/java/com/authservice/model/User.java

#### lombok.Data
Used in 17 file(s).
- admin-service/src/main/java/com/example/demo/dto/InvestorDTO.java
- admin-service/src/main/java/com/example/demo/entity/Company.java
- admin-service/src/main/java/com/example/demo/entity/Stock.java
- admin-service/src/main/java/com/example/demo/entity/UpdatePriceDTO.java
- admin-service/src/main/java/com/example/demo/entity/UpdateQuantity.java
- auth service/src/main/java/com/authservice/dto/AdminCreateUserRequest.java
- auth service/src/main/java/com/authservice/dto/AdvisorProfileSyncRequest.java
- auth service/src/main/java/com/authservice/dto/AuthResponse.java
- auth service/src/main/java/com/authservice/dto/InvestorProfileSyncRequest.java
- auth service/src/main/java/com/authservice/dto/LoginRequest.java
- auth service/src/main/java/com/authservice/dto/MessageResponse.java
- auth service/src/main/java/com/authservice/dto/RegisterRequest.java
- auth service/src/main/java/com/authservice/dto/VerifyOtpRequest.java
- auth service/src/main/java/com/authservice/model/Role.java
- auth service/src/main/java/com/authservice/model/User.java
- portfolio service/src/main/java/com/portfolioservice/dto/AdminStockDTO.java
- portfolio service/src/main/java/com/portfolioservice/dto/TransactionResponse.java

#### lombok.extern.slf4j.Slf4j
Used in 18 file(s).
- admin-service/src/main/java/com/example/demo/security/AuthEntryPointJwt.java
- admin-service/src/main/java/com/example/demo/security/JwtAuthFilter.java
- admin-service/src/main/java/com/example/demo/security/JwtUtils.java
- advisor/advisor/src/main/java/com/example/demo/security/AuthEntryPointJwt.java
- advisor/advisor/src/main/java/com/example/demo/security/JwtAuthFilter.java
- advisor/advisor/src/main/java/com/example/demo/security/JwtUtils.java
- auth service/src/main/java/com/authservice/config/DataSeeder.java
- auth service/src/main/java/com/authservice/security/AuthEntryPointJwt.java
- auth service/src/main/java/com/authservice/security/JwtAuthFilter.java
- auth service/src/main/java/com/authservice/security/JwtUtils.java
- investor-service/investor-service/src/main/java/com/example/demo/security/AuthEntryPointJwt.java
- investor-service/investor-service/src/main/java/com/example/demo/security/JwtAuthFilter.java
- investor-service/investor-service/src/main/java/com/example/demo/security/JwtUtils.java
- investor-service/investor-service/src/main/java/com/example/demo/service/InvestorService.java
- portfolio service/src/main/java/com/portfolioservice/security/AuthEntryPointJwt.java
- portfolio service/src/main/java/com/portfolioservice/security/JwtAuthFilter.java
- portfolio service/src/main/java/com/portfolioservice/security/JwtUtils.java
- portfolio service/src/main/java/com/portfolioservice/service/MarketPriceService.java

#### lombok.Getter
Used in 17 file(s).
- admin-service/src/main/java/com/example/demo/dto/StockDeletionSettlementRequest.java
- admin-service/src/main/java/com/example/demo/exceptions/ErrorResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/ApiResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/CreatePortfolioRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/DeletePortfolioResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/HoldingResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/OverallPerformanceResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/PerformanceResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/PortfolioResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/StockDeletionSettlementRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/StockDeletionSettlementResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/TradeRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/TransferRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/UpdatePortfolioRequest.java
- portfolio service/src/main/java/com/portfolioservice/model/Holding.java
- portfolio service/src/main/java/com/portfolioservice/model/Portfolio.java
- portfolio service/src/main/java/com/portfolioservice/model/Transaction.java

#### lombok.NoArgsConstructor
Used in 24 file(s).
- admin-service/src/main/java/com/example/demo/dto/StockDeletionSettlementRequest.java
- admin-service/src/main/java/com/example/demo/entity/Company.java
- admin-service/src/main/java/com/example/demo/entity/Stock.java
- auth service/src/main/java/com/authservice/dto/AdvisorProfileSyncRequest.java
- auth service/src/main/java/com/authservice/dto/AuthResponse.java
- auth service/src/main/java/com/authservice/dto/InvestorProfileSyncRequest.java
- auth service/src/main/java/com/authservice/dto/MessageResponse.java
- auth service/src/main/java/com/authservice/model/Role.java
- auth service/src/main/java/com/authservice/model/User.java
- portfolio service/src/main/java/com/portfolioservice/dto/ApiResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/CreatePortfolioRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/DeletePortfolioResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/HoldingResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/OverallPerformanceResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/PerformanceResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/PortfolioResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/StockDeletionSettlementRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/StockDeletionSettlementResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/TradeRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/TransferRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/UpdatePortfolioRequest.java
- portfolio service/src/main/java/com/portfolioservice/model/Holding.java
- portfolio service/src/main/java/com/portfolioservice/model/Portfolio.java
- portfolio service/src/main/java/com/portfolioservice/model/Transaction.java

#### lombok.RequiredArgsConstructor
Used in 31 file(s).
- admin-service/src/main/java/com/example/demo/controller/AdminController.java
- admin-service/src/main/java/com/example/demo/security/JwtAuthFilter.java
- admin-service/src/main/java/com/example/demo/security/SecurityConfig.java
- admin-service/src/main/java/com/example/demo/service/AdminService.java
- admin-service/src/main/java/com/example/demo/service/StockService.java
- advisor/advisor/src/main/java/com/example/demo/security/JwtAuthFilter.java
- advisor/advisor/src/main/java/com/example/demo/security/SecurityConfig.java
- auth service/src/main/java/com/authservice/config/DataSeeder.java
- auth service/src/main/java/com/authservice/controller/AuthController.java
- auth service/src/main/java/com/authservice/security/JwtAuthFilter.java
- auth service/src/main/java/com/authservice/security/SecurityConfig.java
- auth service/src/main/java/com/authservice/security/UserDetailsServiceImpl.java
- auth service/src/main/java/com/authservice/service/AdvisorProfileSyncService.java
- auth service/src/main/java/com/authservice/service/AuthService.java
- auth service/src/main/java/com/authservice/service/EmailService.java
- auth service/src/main/java/com/authservice/service/InvestorProfileSyncService.java
- investor-service/investor-service/src/main/java/com/example/demo/controller/InvestorController.java
- investor-service/investor-service/src/main/java/com/example/demo/security/JwtAuthFilter.java
- investor-service/investor-service/src/main/java/com/example/demo/security/SecurityConfig.java
- investor-service/investor-service/src/main/java/com/example/demo/service/InvestorService.java
- portfolio service/src/main/java/com/portfolioservice/controller/AdminController.java
- portfolio service/src/main/java/com/portfolioservice/controller/AdvisorController.java
- portfolio service/src/main/java/com/portfolioservice/controller/PortfolioController.java
- portfolio service/src/main/java/com/portfolioservice/security/SecurityConfig.java
- portfolio service/src/main/java/com/portfolioservice/service/HoldingService.java
- portfolio service/src/main/java/com/portfolioservice/service/MarketPriceService.java
- portfolio service/src/main/java/com/portfolioservice/service/PerformanceService.java
- portfolio service/src/main/java/com/portfolioservice/service/PortfolioService.java
- portfolio service/src/main/java/com/portfolioservice/service/PortfolioTradingService.java
- portfolio service/src/main/java/com/portfolioservice/service/TransactionService.java
- portfolio service/src/main/java/com/portfolioservice/service/TransferService.java

#### lombok.Setter
Used in 16 file(s).
- admin-service/src/main/java/com/example/demo/dto/StockDeletionSettlementRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/ApiResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/CreatePortfolioRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/DeletePortfolioResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/HoldingResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/OverallPerformanceResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/PerformanceResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/PortfolioResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/StockDeletionSettlementRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/StockDeletionSettlementResponse.java
- portfolio service/src/main/java/com/portfolioservice/dto/TradeRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/TransferRequest.java
- portfolio service/src/main/java/com/portfolioservice/dto/UpdatePortfolioRequest.java
- portfolio service/src/main/java/com/portfolioservice/model/Holding.java
- portfolio service/src/main/java/com/portfolioservice/model/Portfolio.java
- portfolio service/src/main/java/com/portfolioservice/model/Transaction.java

#### org.hibernate.annotations.CreationTimestamp
Used in 1 file(s).
- auth service/src/main/java/com/authservice/model/User.java

#### org.springframework.beans.factory.annotation.Autowired
Used in 3 file(s).
- notification-service/notification-service/src/main/java/com/example/demo/controller/NotificationController.java
- notification-service/notification-service/src/main/java/com/example/demo/service/EmailService.java
- notification-service/notification-service/src/main/java/com/example/demo/service/WebSocketService.java

#### org.springframework.beans.factory.annotation.Value
Used in 10 file(s).
- admin-service/src/main/java/com/example/demo/security/JwtUtils.java
- advisor/advisor/src/main/java/com/example/demo/security/JwtUtils.java
- auth service/src/main/java/com/authservice/security/JwtUtils.java
- auth service/src/main/java/com/authservice/service/AdvisorProfileSyncService.java
- auth service/src/main/java/com/authservice/service/InvestorProfileSyncService.java
- investor-service/investor-service/src/main/java/com/example/demo/security/JwtUtils.java
- investor-service/investor-service/src/main/java/com/example/demo/service/InvestorService.java
- notification-service/notification-service/src/main/java/com/example/demo/config/WebSocketConfig.java
- portfolio service/src/main/java/com/portfolioservice/security/JwtAuthFilter.java
- portfolio service/src/main/java/com/portfolioservice/security/JwtUtils.java

#### org.springframework.boot.autoconfigure.SpringBootApplication
Used in 9 file(s).
- admin-service/src/main/java/com/example/demo/AdminServiceApplication.java
- advisor/advisor/src/main/java/com/example/demo/AdvisorApplication.java
- api-gateway/src/main/java/com/wealthforge/apigateway/ApiGatewayApplication.java
- auth service/src/main/java/com/authservice/AuthServiceApplication.java
- config-server/src/main/java/com/wealthforge/configserver/ConfigServerApplication.java
- EurekaServer/src/main/java/com/example/demo/EurekaServerApplication.java
- investor-service/investor-service/src/main/java/com/example/demo/InvestorServiceApplication.java
- notification-service/notification-service/src/main/java/com/example/demo/NotificationServiceApplication.java
- portfolio service/src/main/java/com/portfolioservice/PortfolioServiceApplication.java

#### org.springframework.cloud.client.discovery.EnableDiscoveryClient
Used in 7 file(s).
- admin-service/src/main/java/com/example/demo/AdminServiceApplication.java
- advisor/advisor/src/main/java/com/example/demo/AdvisorApplication.java
- api-gateway/src/main/java/com/wealthforge/apigateway/ApiGatewayApplication.java
- auth service/src/main/java/com/authservice/AuthServiceApplication.java
- investor-service/investor-service/src/main/java/com/example/demo/InvestorServiceApplication.java
- notification-service/notification-service/src/main/java/com/example/demo/NotificationServiceApplication.java
- portfolio service/src/main/java/com/portfolioservice/PortfolioServiceApplication.java

#### org.springframework.cloud.config.server.EnableConfigServer
Used in 1 file(s).
- config-server/src/main/java/com/wealthforge/configserver/ConfigServerApplication.java

#### org.springframework.cloud.netflix.eureka.server.EnableEurekaServer
Used in 1 file(s).
- EurekaServer/src/main/java/com/example/demo/EurekaServerApplication.java

#### org.springframework.cloud.openfeign.EnableFeignClients
Used in 5 file(s).
- admin-service/src/main/java/com/example/demo/AdminServiceApplication.java
- advisor/advisor/src/main/java/com/example/demo/AdvisorApplication.java
- auth service/src/main/java/com/authservice/AuthServiceApplication.java
- investor-service/investor-service/src/main/java/com/example/demo/InvestorServiceApplication.java
- portfolio service/src/main/java/com/portfolioservice/PortfolioServiceApplication.java

#### org.springframework.cloud.openfeign.FeignClient
Used in 9 file(s).
- admin-service/src/main/java/com/example/demo/client/PortfolioClient.java
- admin-service/src/main/java/com/example/demo/InvestorClient.java
- advisor/advisor/src/main/java/com/example/demo/client/PortfolioClient.java
- auth service/src/main/java/com/authservice/config/NotificationClient.java
- investor-service/investor-service/src/main/java/com/example/demo/client/AdminClient.java
- investor-service/investor-service/src/main/java/com/example/demo/client/AdvisorClient.java
- investor-service/investor-service/src/main/java/com/example/demo/client/NotificationClient.java
- investor-service/investor-service/src/main/java/com/example/demo/client/PortfolioClient.java
- portfolio service/src/main/java/com/portfolioservice/client/AdminMarketClient.java

#### org.springframework.context.annotation.Bean
Used in 8 file(s).
- admin-service/src/main/java/com/example/demo/config/FeignClientConfig.java
- admin-service/src/main/java/com/example/demo/security/SecurityConfig.java
- advisor/advisor/src/main/java/com/example/demo/security/SecurityConfig.java
- auth service/src/main/java/com/authservice/security/SecurityConfig.java
- investor-service/investor-service/src/main/java/com/example/demo/config/FeignClientConfig.java
- investor-service/investor-service/src/main/java/com/example/demo/security/SecurityConfig.java
- portfolio service/src/main/java/com/portfolioservice/config/FeignClientConfig.java
- portfolio service/src/main/java/com/portfolioservice/security/SecurityConfig.java

#### org.springframework.context.annotation.Configuration
Used in 9 file(s).
- admin-service/src/main/java/com/example/demo/config/FeignClientConfig.java
- admin-service/src/main/java/com/example/demo/security/SecurityConfig.java
- advisor/advisor/src/main/java/com/example/demo/security/SecurityConfig.java
- auth service/src/main/java/com/authservice/security/SecurityConfig.java
- investor-service/investor-service/src/main/java/com/example/demo/config/FeignClientConfig.java
- investor-service/investor-service/src/main/java/com/example/demo/security/SecurityConfig.java
- notification-service/notification-service/src/main/java/com/example/demo/config/WebSocketConfig.java
- portfolio service/src/main/java/com/portfolioservice/config/FeignClientConfig.java
- portfolio service/src/main/java/com/portfolioservice/security/SecurityConfig.java

#### org.springframework.security.access.prepost.PreAuthorize
Used in 3 file(s).
- auth service/src/main/java/com/authservice/controller/AuthController.java
- auth service/src/main/java/com/authservice/controller/TestController.java
- investor-service/investor-service/src/main/java/com/example/demo/controller/InvestorController.java

#### org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
Used in 5 file(s).
- admin-service/src/main/java/com/example/demo/security/SecurityConfig.java
- advisor/advisor/src/main/java/com/example/demo/security/SecurityConfig.java
- auth service/src/main/java/com/authservice/security/SecurityConfig.java
- investor-service/investor-service/src/main/java/com/example/demo/security/SecurityConfig.java
- portfolio service/src/main/java/com/portfolioservice/security/SecurityConfig.java

#### org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
Used in 5 file(s).
- admin-service/src/main/java/com/example/demo/security/SecurityConfig.java
- advisor/advisor/src/main/java/com/example/demo/security/SecurityConfig.java
- auth service/src/main/java/com/authservice/security/SecurityConfig.java
- investor-service/investor-service/src/main/java/com/example/demo/security/SecurityConfig.java
- portfolio service/src/main/java/com/portfolioservice/security/SecurityConfig.java

#### org.springframework.stereotype.Component
Used in 16 file(s).
- admin-service/src/main/java/com/example/demo/security/AuthEntryPointJwt.java
- admin-service/src/main/java/com/example/demo/security/JwtAuthFilter.java
- admin-service/src/main/java/com/example/demo/security/JwtUtils.java
- advisor/advisor/src/main/java/com/example/demo/security/AuthEntryPointJwt.java
- advisor/advisor/src/main/java/com/example/demo/security/JwtAuthFilter.java
- advisor/advisor/src/main/java/com/example/demo/security/JwtUtils.java
- auth service/src/main/java/com/authservice/config/DataSeeder.java
- auth service/src/main/java/com/authservice/security/AuthEntryPointJwt.java
- auth service/src/main/java/com/authservice/security/JwtAuthFilter.java
- auth service/src/main/java/com/authservice/security/JwtUtils.java
- investor-service/investor-service/src/main/java/com/example/demo/security/AuthEntryPointJwt.java
- investor-service/investor-service/src/main/java/com/example/demo/security/JwtAuthFilter.java
- investor-service/investor-service/src/main/java/com/example/demo/security/JwtUtils.java
- portfolio service/src/main/java/com/portfolioservice/security/AuthEntryPointJwt.java
- portfolio service/src/main/java/com/portfolioservice/security/JwtAuthFilter.java
- portfolio service/src/main/java/com/portfolioservice/security/JwtUtils.java

#### org.springframework.stereotype.Repository
Used in 8 file(s).
- admin-service/src/main/java/com/example/demo/repository/CompanyRepository.java
- admin-service/src/main/java/com/example/demo/repository/StockRepository.java
- advisor/advisor/src/main/java/com/example/demo/repository/AdvisorRepository.java
- auth service/src/main/java/com/authservice/repository/RoleRepository.java
- auth service/src/main/java/com/authservice/repository/UserRepository.java
- portfolio service/src/main/java/com/portfolioservice/repository/HoldingRepository.java
- portfolio service/src/main/java/com/portfolioservice/repository/PortfolioRepository.java
- portfolio service/src/main/java/com/portfolioservice/repository/TransactionRepository.java

#### org.springframework.stereotype.Service
Used in 20 file(s).
- admin-service/src/main/java/com/example/demo/service/AdminService.java
- admin-service/src/main/java/com/example/demo/service/StockService.java
- advisor/advisor/src/main/java/com/example/demo/service/AdvisorService.java
- advisor/advisor/src/main/java/com/example/demo/service/ChatbotService.java
- auth service/src/main/java/com/authservice/security/UserDetailsServiceImpl.java
- auth service/src/main/java/com/authservice/service/AdvisorProfileSyncService.java
- auth service/src/main/java/com/authservice/service/AuthService.java
- auth service/src/main/java/com/authservice/service/EmailService.java
- auth service/src/main/java/com/authservice/service/InvestorProfileSyncService.java
- investor-service/investor-service/src/main/java/com/example/demo/service/InvestorService.java
- notification-service/notification-service/src/main/java/com/example/demo/service/EmailService.java
- notification-service/notification-service/src/main/java/com/example/demo/service/PdfService.java
- notification-service/notification-service/src/main/java/com/example/demo/service/WebSocketService.java
- portfolio service/src/main/java/com/portfolioservice/service/HoldingService.java
- portfolio service/src/main/java/com/portfolioservice/service/MarketPriceService.java
- portfolio service/src/main/java/com/portfolioservice/service/PerformanceService.java
- portfolio service/src/main/java/com/portfolioservice/service/PortfolioService.java
- portfolio service/src/main/java/com/portfolioservice/service/PortfolioTradingService.java
- portfolio service/src/main/java/com/portfolioservice/service/TransactionService.java
- portfolio service/src/main/java/com/portfolioservice/service/TransferService.java

#### org.springframework.transaction.annotation.Transactional
Used in 7 file(s).
- admin-service/src/main/java/com/example/demo/service/StockService.java
- advisor/advisor/src/main/java/com/example/demo/service/AdvisorService.java
- auth service/src/main/java/com/authservice/security/UserDetailsServiceImpl.java
- investor-service/investor-service/src/main/java/com/example/demo/service/InvestorService.java
- portfolio service/src/main/java/com/portfolioservice/service/PortfolioService.java
- portfolio service/src/main/java/com/portfolioservice/service/PortfolioTradingService.java
- portfolio service/src/main/java/com/portfolioservice/service/TransferService.java

#### org.springframework.web.bind.annotation.CrossOrigin
Used in 1 file(s).
- admin-service/src/main/java/com/example/demo/controller/AdminController.java

#### org.springframework.web.bind.annotation.DeleteMapping
Used in 5 file(s).
- admin-service/src/main/java/com/example/demo/controller/AdminController.java
- advisor/advisor/src/main/java/com/example/demo/controller/AdvisorController.java
- investor-service/investor-service/src/main/java/com/example/demo/client/PortfolioClient.java
- investor-service/investor-service/src/main/java/com/example/demo/controller/InvestorController.java
- portfolio service/src/main/java/com/portfolioservice/controller/PortfolioController.java

#### org.springframework.web.bind.annotation.ExceptionHandler
Used in 5 file(s).
- admin-service/src/main/java/com/example/demo/exceptions/GlobalExceptionHandler.java
- advisor/advisor/src/main/java/com/example/demo/exception/GlobalExceptionHandler.java
- auth service/src/main/java/com/authservice/exception/GlobalExceptionHandler.java
- investor-service/investor-service/src/main/java/com/example/demo/exception/GlobalExceptionHandler.java
- portfolio service/src/main/java/com/portfolioservice/exception/GlobalExceptionHandler.java

#### org.springframework.web.bind.annotation.GetMapping
Used in 15 file(s).
- admin-service/src/main/java/com/example/demo/client/PortfolioClient.java
- admin-service/src/main/java/com/example/demo/controller/AdminController.java
- admin-service/src/main/java/com/example/demo/InvestorClient.java
- advisor/advisor/src/main/java/com/example/demo/client/PortfolioClient.java
- advisor/advisor/src/main/java/com/example/demo/controller/AdvisorController.java
- advisor/advisor/src/main/java/com/example/demo/controller/ChatbotController.java
- auth service/src/main/java/com/authservice/controller/TestController.java
- investor-service/investor-service/src/main/java/com/example/demo/client/AdminClient.java
- investor-service/investor-service/src/main/java/com/example/demo/client/AdvisorClient.java
- investor-service/investor-service/src/main/java/com/example/demo/client/PortfolioClient.java
- investor-service/investor-service/src/main/java/com/example/demo/controller/InvestorController.java
- portfolio service/src/main/java/com/portfolioservice/client/AdminMarketClient.java
- portfolio service/src/main/java/com/portfolioservice/controller/AdminController.java
- portfolio service/src/main/java/com/portfolioservice/controller/AdvisorController.java
- portfolio service/src/main/java/com/portfolioservice/controller/PortfolioController.java

#### org.springframework.web.bind.annotation.PathVariable
Used in 10 file(s).
- admin-service/src/main/java/com/example/demo/client/PortfolioClient.java
- admin-service/src/main/java/com/example/demo/controller/AdminController.java
- advisor/advisor/src/main/java/com/example/demo/client/PortfolioClient.java
- advisor/advisor/src/main/java/com/example/demo/controller/AdvisorController.java
- investor-service/investor-service/src/main/java/com/example/demo/client/AdminClient.java
- investor-service/investor-service/src/main/java/com/example/demo/client/PortfolioClient.java
- investor-service/investor-service/src/main/java/com/example/demo/controller/InvestorController.java
- portfolio service/src/main/java/com/portfolioservice/client/AdminMarketClient.java
- portfolio service/src/main/java/com/portfolioservice/controller/AdvisorController.java
- portfolio service/src/main/java/com/portfolioservice/controller/PortfolioController.java

#### org.springframework.web.bind.annotation.PostMapping
Used in 12 file(s).
- admin-service/src/main/java/com/example/demo/client/PortfolioClient.java
- admin-service/src/main/java/com/example/demo/controller/AdminController.java
- advisor/advisor/src/main/java/com/example/demo/controller/AdvisorController.java
- advisor/advisor/src/main/java/com/example/demo/controller/ChatbotController.java
- auth service/src/main/java/com/authservice/config/NotificationClient.java
- auth service/src/main/java/com/authservice/controller/AuthController.java
- investor-service/investor-service/src/main/java/com/example/demo/client/NotificationClient.java
- investor-service/investor-service/src/main/java/com/example/demo/client/PortfolioClient.java
- investor-service/investor-service/src/main/java/com/example/demo/controller/InvestorController.java
- notification-service/notification-service/src/main/java/com/example/demo/controller/NotificationController.java
- portfolio service/src/main/java/com/portfolioservice/controller/AdminController.java
- portfolio service/src/main/java/com/portfolioservice/controller/PortfolioController.java

#### org.springframework.web.bind.annotation.PutMapping
Used in 5 file(s).
- admin-service/src/main/java/com/example/demo/controller/AdminController.java
- investor-service/investor-service/src/main/java/com/example/demo/client/AdminClient.java
- investor-service/investor-service/src/main/java/com/example/demo/client/PortfolioClient.java
- investor-service/investor-service/src/main/java/com/example/demo/controller/InvestorController.java
- portfolio service/src/main/java/com/portfolioservice/controller/PortfolioController.java

#### org.springframework.web.bind.annotation.RequestBody
Used in 13 file(s).
- admin-service/src/main/java/com/example/demo/client/PortfolioClient.java
- admin-service/src/main/java/com/example/demo/controller/AdminController.java
- advisor/advisor/src/main/java/com/example/demo/controller/AdvisorController.java
- advisor/advisor/src/main/java/com/example/demo/controller/ChatbotController.java
- auth service/src/main/java/com/authservice/config/NotificationClient.java
- auth service/src/main/java/com/authservice/controller/AuthController.java
- investor-service/investor-service/src/main/java/com/example/demo/client/AdminClient.java
- investor-service/investor-service/src/main/java/com/example/demo/client/NotificationClient.java
- investor-service/investor-service/src/main/java/com/example/demo/client/PortfolioClient.java
- investor-service/investor-service/src/main/java/com/example/demo/controller/InvestorController.java
- notification-service/notification-service/src/main/java/com/example/demo/controller/NotificationController.java
- portfolio service/src/main/java/com/portfolioservice/controller/AdminController.java
- portfolio service/src/main/java/com/portfolioservice/controller/PortfolioController.java

#### org.springframework.web.bind.annotation.RequestHeader
Used in 1 file(s).
- investor-service/investor-service/src/main/java/com/example/demo/controller/InvestorController.java

#### org.springframework.web.bind.annotation.RequestMapping
Used in 10 file(s).
- admin-service/src/main/java/com/example/demo/controller/AdminController.java
- advisor/advisor/src/main/java/com/example/demo/controller/AdvisorController.java
- advisor/advisor/src/main/java/com/example/demo/controller/ChatbotController.java
- auth service/src/main/java/com/authservice/controller/AuthController.java
- auth service/src/main/java/com/authservice/controller/TestController.java
- investor-service/investor-service/src/main/java/com/example/demo/controller/InvestorController.java
- notification-service/notification-service/src/main/java/com/example/demo/controller/NotificationController.java
- portfolio service/src/main/java/com/portfolioservice/controller/AdminController.java
- portfolio service/src/main/java/com/portfolioservice/controller/AdvisorController.java
- portfolio service/src/main/java/com/portfolioservice/controller/PortfolioController.java

#### org.springframework.web.bind.annotation.RequestParam
Used in 5 file(s).
- advisor/advisor/src/main/java/com/example/demo/controller/AdvisorController.java
- advisor/advisor/src/main/java/com/example/demo/controller/ChatbotController.java
- auth service/src/main/java/com/authservice/controller/AuthController.java
- investor-service/investor-service/src/main/java/com/example/demo/client/AdvisorClient.java
- investor-service/investor-service/src/main/java/com/example/demo/controller/InvestorController.java

#### org.springframework.web.bind.annotation.ResponseStatus
Used in 3 file(s).
- investor-service/investor-service/src/main/java/com/example/demo/exception/GlobalExceptionHandler.java
- portfolio service/src/main/java/com/portfolioservice/exception/InsufficientBalanceException.java
- portfolio service/src/main/java/com/portfolioservice/exception/ResourceNotFoundException.java

#### org.springframework.web.bind.annotation.RestController
Used in 10 file(s).
- admin-service/src/main/java/com/example/demo/controller/AdminController.java
- advisor/advisor/src/main/java/com/example/demo/controller/AdvisorController.java
- advisor/advisor/src/main/java/com/example/demo/controller/ChatbotController.java
- auth service/src/main/java/com/authservice/controller/AuthController.java
- auth service/src/main/java/com/authservice/controller/TestController.java
- investor-service/investor-service/src/main/java/com/example/demo/controller/InvestorController.java
- notification-service/notification-service/src/main/java/com/example/demo/controller/NotificationController.java
- portfolio service/src/main/java/com/portfolioservice/controller/AdminController.java
- portfolio service/src/main/java/com/portfolioservice/controller/AdvisorController.java
- portfolio service/src/main/java/com/portfolioservice/controller/PortfolioController.java

#### org.springframework.web.bind.annotation.RestControllerAdvice
Used in 5 file(s).
- admin-service/src/main/java/com/example/demo/exceptions/GlobalExceptionHandler.java
- advisor/advisor/src/main/java/com/example/demo/exception/GlobalExceptionHandler.java
- auth service/src/main/java/com/authservice/exception/GlobalExceptionHandler.java
- investor-service/investor-service/src/main/java/com/example/demo/exception/GlobalExceptionHandler.java
- portfolio service/src/main/java/com/portfolioservice/exception/GlobalExceptionHandler.java

#### org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
Used in 1 file(s).
- notification-service/notification-service/src/main/java/com/example/demo/config/WebSocketConfig.java

## 6. Interface Catalog
### 6.1 Project-Defined Interfaces
| Service | Interface | Kind | Extends | Methods declared | File | Why it exists |
|---|---|---|---|---|---|---|
| Admin Service (admin-service) | CompanyRepository | Spring Data repository interface | JpaRepository<Company, Long> | findBySymbolIgnoreCase(String symbol) | admin-service/src/main/java/com/example/demo/repository/CompanyRepository.java | Persistence abstraction inheriting CRUD/query derivation from Spring Data JPA. |
| Admin Service (admin-service) | InvestorClient | OpenFeign client interface | - | getAllInvestors() | admin-service/src/main/java/com/example/demo/InvestorClient.java | Declarative HTTP contract used for inter-service REST calls. |
| Admin Service (admin-service) | PortfolioClient | OpenFeign client interface | - | getMyPortfolios(); settleDeletedStockHoldings(@RequestBody StockDeletionSettlementRequest request) | admin-service/src/main/java/com/example/demo/client/PortfolioClient.java | Declarative HTTP contract used for inter-service REST calls. |
| Admin Service (admin-service) | StockRepository | Spring Data repository interface | JpaRepository<Stock, Long> | findBySymbol(String symbol) | admin-service/src/main/java/com/example/demo/repository/StockRepository.java | Persistence abstraction inheriting CRUD/query derivation from Spring Data JPA. |
| Advisor Service (advisor) | AdviceRepository | Spring Data repository interface | JpaRepository<Advice, Long> | findByAdvisorId(Long advisorId) | advisor/advisor/src/main/java/com/example/demo/repository/AdviceRepository.java | Persistence abstraction inheriting CRUD/query derivation from Spring Data JPA. |
| Advisor Service (advisor) | AdvisorRepository | Spring Data repository interface | JpaRepository<Advisor, Long> | inherits methods only (no custom declarations) | advisor/advisor/src/main/java/com/example/demo/repository/AdvisorRepository.java | Persistence abstraction inheriting CRUD/query derivation from Spring Data JPA. |
| Advisor Service (advisor) | ChatMessageRepository | Spring Data repository interface | JpaRepository<ChatMessage, Long> | findByQuestionIgnoreCase(String question) | advisor/advisor/src/main/java/com/example/demo/repository/ChatMessageRepository.java | Persistence abstraction inheriting CRUD/query derivation from Spring Data JPA. |
| Advisor Service (advisor) | InvestorAllocationRepository | Spring Data repository interface | JpaRepository<InvestorAllocation, Long> | findByAdvisorId(Long advisorId); findByInvestorId(Long investorId); findByAdvisorIdAndInvestorId(Long advisorId, Long investorId); deleteByAdvisorIdAndInvestorId(Long advisorId, Long investorId) | advisor/advisor/src/main/java/com/example/demo/repository/InvestorAllocationRepository.java | Persistence abstraction inheriting CRUD/query derivation from Spring Data JPA. |
| Advisor Service (advisor) | PortfolioClient | OpenFeign client interface | - | getMyPortfolios() | advisor/advisor/src/main/java/com/example/demo/client/PortfolioClient.java | Declarative HTTP contract used for inter-service REST calls. |
| Auth Service (auth-service) | NotificationClient | OpenFeign client interface | - | sendOtp(@RequestBody NotificationRequest request); sendRegistration(@RequestBody NotificationRequest request) | auth service/src/main/java/com/authservice/config/NotificationClient.java | Declarative HTTP contract used for inter-service REST calls. |
| Auth Service (auth-service) | RoleRepository | Spring Data repository interface | JpaRepository<Role, Long> | findByName(RoleType name) | auth service/src/main/java/com/authservice/repository/RoleRepository.java | Persistence abstraction inheriting CRUD/query derivation from Spring Data JPA. |
| Auth Service (auth-service) | UserRepository | Spring Data repository interface | JpaRepository<User, Long> | findByEmail(String email); findByOtp(String otp); existsByEmail(String email) | auth service/src/main/java/com/authservice/repository/UserRepository.java | Persistence abstraction inheriting CRUD/query derivation from Spring Data JPA. |
| Investor Service (investor-service) | AdminClient | OpenFeign client interface | - | getAllCompanies(); updateCompanyQuantityBuy(@RequestBody UpdateQuantity request); updateCompanyQuantitySell(@RequestBody UpdateQuantity request); getAllStocks(); updateQuantityBuy(@RequestBody UpdateQuantity request); updateQuantitySell(@RequestBody UpdateQuantity request) | investor-service/investor-service/src/main/java/com/example/demo/client/AdminClient.java | Declarative HTTP contract used for inter-service REST calls. |
| Investor Service (investor-service) | AdvisorClient | OpenFeign client interface | - | getAdvisors() | investor-service/investor-service/src/main/java/com/example/demo/client/AdvisorClient.java | Declarative HTTP contract used for inter-service REST calls. |
| Investor Service (investor-service) | InvestorRepository | Spring Data repository interface | JpaRepository<Investor,Long> | findByEmail(String email) | investor-service/investor-service/src/main/java/com/example/demo/repository/InvestorRepository.java | Persistence abstraction inheriting CRUD/query derivation from Spring Data JPA. |
| Investor Service (investor-service) | NotificationClient | OpenFeign client interface | - | sendNotification(@RequestBody NotificationRequest request) | investor-service/investor-service/src/main/java/com/example/demo/client/NotificationClient.java | Declarative HTTP contract used for inter-service REST calls. |
| Investor Service (investor-service) | PortfolioClient | OpenFeign client interface | - | createPortfolio(@RequestBody PortfolioCreateRequest request); getMyPortfolios(); transferBetweenPortfolios(@RequestBody PortfolioTransferRequest request); getOverallPerformance(); getAllTransactions() | investor-service/investor-service/src/main/java/com/example/demo/client/PortfolioClient.java | Declarative HTTP contract used for inter-service REST calls. |
| Portfolio Service (portfolio-service) | AdminMarketClient | OpenFeign client interface | - | inherits methods only (no custom declarations) | portfolio service/src/main/java/com/portfolioservice/client/AdminMarketClient.java | Declarative HTTP contract used for inter-service REST calls. |
| Portfolio Service (portfolio-service) | HoldingRepository | Spring Data repository interface | JpaRepository<Holding, Long> | findByPortfolioId(Long portfolioId); findByPortfolioIdAndAssetSymbol(Long portfolioId, String assetSymbol); findByAssetSymbolIgnoreCase(String assetSymbol); deleteByAssetSymbolIgnoreCase(String assetSymbol); deleteByPortfolioId(Long portfolioId) | portfolio service/src/main/java/com/portfolioservice/repository/HoldingRepository.java | Persistence abstraction inheriting CRUD/query derivation from Spring Data JPA. |
| Portfolio Service (portfolio-service) | PortfolioRepository | Spring Data repository interface | JpaRepository<Portfolio, Long> | findByInvestorId(Long investorId) | portfolio service/src/main/java/com/portfolioservice/repository/PortfolioRepository.java | Persistence abstraction inheriting CRUD/query derivation from Spring Data JPA. |
| Portfolio Service (portfolio-service) | TransactionRepository | Spring Data repository interface | JpaRepository<Transaction, Long> | findByPortfolioIdOrderByTimestampDesc(Long portfolioId); findByPortfolioIdOrderByTimestampAsc(Long portfolioId); findByPortfolioIdInOrderByTimestampDesc(List<Long> portfolioIds); deleteByPortfolioId(Long portfolioId) | portfolio service/src/main/java/com/portfolioservice/repository/TransactionRepository.java | Persistence abstraction inheriting CRUD/query derivation from Spring Data JPA. |

### 6.2 Framework Interfaces Implemented by Concrete Classes
| Service | Class | Implemented interface(s) | File | Why this implementation is used |
|---|---|---|---|---|
| Admin Service (admin-service) | AuthEntryPointJwt | AuthenticationEntryPoint | admin-service/src/main/java/com/example/demo/security/AuthEntryPointJwt.java | Handles unauthorized response generation in security flow. |
| Advisor Service (advisor) | AuthEntryPointJwt | AuthenticationEntryPoint | advisor/advisor/src/main/java/com/example/demo/security/AuthEntryPointJwt.java | Handles unauthorized response generation in security flow. |
| Auth Service (auth-service) | AuthEntryPointJwt | AuthenticationEntryPoint | auth service/src/main/java/com/authservice/security/AuthEntryPointJwt.java | Handles unauthorized response generation in security flow. |
| Auth Service (auth-service) | DataSeeder | CommandLineRunner | auth service/src/main/java/com/authservice/config/DataSeeder.java | Executes startup seed/bootstrap logic. |
| Auth Service (auth-service) | UserDetailsServiceImpl | UserDetailsService | auth service/src/main/java/com/authservice/security/UserDetailsServiceImpl.java | Loads user credentials/authorities for authentication. |
| Investor Service (investor-service) | AuthEntryPointJwt | AuthenticationEntryPoint | investor-service/investor-service/src/main/java/com/example/demo/security/AuthEntryPointJwt.java | Handles unauthorized response generation in security flow. |
| Notification Service (notification-service) | WebSocketConfig | WebSocketMessageBrokerConfigurer | notification-service/notification-service/src/main/java/com/example/demo/config/WebSocketConfig.java | Configures websocket broker endpoints and messaging settings. |
| Portfolio Service (portfolio-service) | AuthEntryPointJwt | AuthenticationEntryPoint | portfolio service/src/main/java/com/portfolioservice/security/AuthEntryPointJwt.java | Handles unauthorized response generation in security flow. |

### 6.3 Interface Usage Patterns in This Codebase
1. OpenFeign interfaces define inter-service API contracts.
2. JpaRepository interfaces provide persistence operations and query-derivation methods.
3. Security interfaces (AuthenticationEntryPoint, UserDetailsService) integrate custom auth logic.
4. Runtime extension interfaces (CommandLineRunner, WebSocketMessageBrokerConfigurer) plug into startup and messaging setup.

## 7. Key Observations
1. Core stack is consistent across business services: Spring Boot 3, Spring Cloud, Spring Security, Spring Data JPA, and validation.
2. Inter-service calls are interface-driven with OpenFeign, which keeps contracts explicit and testable.
3. Persistence design follows repository interfaces extending JpaRepository, minimizing boilerplate CRUD code.
4. Annotation usage is framework-idiomatic, with strong use of Spring stereotypes/web mappings, Jakarta validation/persistence, and Lombok.
