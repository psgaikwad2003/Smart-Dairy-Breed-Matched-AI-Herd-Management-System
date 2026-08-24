package com.smartdairy;

import com.smartdairy.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Smart Dairy — Breed-Matched AI & Herd Management System
 *
 * Main application bootstrap. Scans all com.smartdairy.* packages
 * to pick up entities, repositories, services, and controllers
 * from the core module automatically.
 */
@SpringBootApplication
@EnableAsync
@EnableScheduling
public class SmartDairyApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartDairyApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedPasswordFix(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String validHash = passwordEncoder.encode("password123");
            userRepository.findAll().forEach(user -> {
                if (user.getPasswordHash() == null || user.getPasswordHash().startsWith("$2a$10$N9qo")) {
                    user.setPasswordHash(validHash);
                    userRepository.save(user);
                }
            });
        };
    }
}
