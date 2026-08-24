package com.smartdairy.auth.dto;

import com.smartdairy.common.enums.UserRole;
import lombok.Builder;
import lombok.Data;

/**
 * JWT login response payload.
 */
@Data
@Builder
public class AuthResponse {
    private String token;
    private String tokenType;
    private Long userId;
    private String fullName;
    private String phone;
    private UserRole role;
    private Long farmerId;
}
