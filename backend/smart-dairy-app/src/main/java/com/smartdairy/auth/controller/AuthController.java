package com.smartdairy.auth.controller;

import com.smartdairy.auth.dto.AuthResponse;
import com.smartdairy.auth.dto.LoginRequest;
import com.smartdairy.auth.dto.RegisterRequest;
import com.smartdairy.auth.entity.User;
import com.smartdairy.auth.repository.UserRepository;
import com.smartdairy.common.dto.ApiResponse;
import com.smartdairy.common.exception.ResourceNotFoundException;
import com.smartdairy.farmer.repository.FarmerRepository;
import com.smartdairy.security.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication controller — register and login endpoints.
 * All endpoints are public (no JWT required).
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Register and login endpoints")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final FarmerRepository farmerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    /**
     * POST /api/auth/login
     * Returns JWT token on successful authentication.
     */
    @PostMapping("/login")
    @Operation(summary = "Login with phone + password", description = "Returns a Bearer JWT token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getPhone(), req.getPassword())
        );

        String token = jwtUtils.generateToken(auth.getName());

        User user = userRepository.findByPhone(req.getPhone())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        AuthResponse response = AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .farmerId(user.getFarmer() != null ? user.getFarmer().getId() : null)
                .build();

        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    /**
     * POST /api/auth/register
     * Creates a new user account.
     */
    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates FARMER, AI_TECHNICIAN, VET, or ADMIN account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByPhone(req.getPhone())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Phone number already registered"));
        }

        User user = new User();
        user.setFullName(req.getFullName());
        user.setPhone(req.getPhone());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setRole(req.getRole());
        user.setActive(true);

        if (req.getFarmerId() != null) {
            user.setFarmer(farmerRepository.findById(req.getFarmerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Farmer not found: " + req.getFarmerId())));
        }

        User saved = userRepository.save(user);
        String token = jwtUtils.generateToken(saved.getPhone());

        AuthResponse response = AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(saved.getId())
                .fullName(saved.getFullName())
                .phone(saved.getPhone())
                .role(saved.getRole())
                .farmerId(saved.getFarmer() != null ? saved.getFarmer().getId() : null)
                .build();

        return ResponseEntity.ok(ApiResponse.success(response, "Registration successful"));
    }
}
