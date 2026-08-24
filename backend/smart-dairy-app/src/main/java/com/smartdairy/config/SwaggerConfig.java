package com.smartdairy.config;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.*;
import io.swagger.v3.oas.models.security.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI 3 / Swagger configuration.
 * Access at: http://localhost:8080/swagger-ui.html
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI smartDairyOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Smart Dairy API")
                        .description("""
                                **Smart Dairy — Breed-Matched AI & Herd Management System**
                                
                                A real-time cattle breeding and artificial insemination management platform
                                for dairy farmers, AI technicians, and veterinarians.
                                
                                **Authentication:** Use the `/api/auth/login` endpoint to get a Bearer token,
                                then click the 🔓 Authorize button and paste `Bearer <your-token>`.
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Smart Dairy Team")
                                .email("support@smartdairy.in"))
                        .license(new License().name("MIT License")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter your JWT token (without 'Bearer' prefix)")));
    }
}
