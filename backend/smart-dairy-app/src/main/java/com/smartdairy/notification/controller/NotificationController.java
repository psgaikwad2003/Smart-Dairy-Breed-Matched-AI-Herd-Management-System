package com.smartdairy.notification.controller;

import com.smartdairy.common.dto.ApiResponse;
import com.smartdairy.notification.entity.Alert;
import com.smartdairy.notification.repository.AlertRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for in-app notifications / alerts.
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "User alert and notification management")
@SecurityRequirement(name = "bearerAuth")
public class NotificationController {

    private final AlertRepository alertRepository;

    @GetMapping
    @Operation(summary = "Get paginated alerts for the current user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<Alert>>> getAlerts(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        // Fetch unread first, then older ones
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Alert> alerts = alertRepository.findByUserPhone(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(ApiResponse.success(alerts, "Alerts retrieved"));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread alert count for the current user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @AuthenticationPrincipal UserDetails userDetails) {
        long count = alertRepository.countUnreadByUserPhone(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(count, "Unread count retrieved"));
    }

    @PatchMapping("/{alertId}/read")
    @Operation(summary = "Mark a specific alert as read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long alertId) {
        alertRepository.findById(alertId).ifPresent(alert -> {
            alert.setReadStatus(true);
            alertRepository.save(alert);
        });
        return ResponseEntity.ok(ApiResponse.success(null, "Alert marked as read"));
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Mark all alerts as read for the current user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal UserDetails userDetails) {
        alertRepository.markAllReadByUserPhone(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(null, "All alerts marked as read"));
    }
}
