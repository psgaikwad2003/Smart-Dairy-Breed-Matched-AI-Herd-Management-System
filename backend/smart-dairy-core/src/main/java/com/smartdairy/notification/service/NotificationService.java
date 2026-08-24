package com.smartdairy.notification.service;

import com.smartdairy.auth.entity.User;
import com.smartdairy.auth.repository.UserRepository;
import com.smartdairy.common.enums.AlertType;
import com.smartdairy.common.enums.UserRole;
import com.smartdairy.notification.entity.Alert;
import com.smartdairy.notification.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Notification Engine — sends real-time alerts via WebSocket and SMS fallback.
 *
 * Strategy:
 * 1. WebSocket push (STOMP) for connected clients — instant
 * 2. Persist alert in DB (so it's visible on next login if user was offline)
 * 3. SMS fallback for critical alerts (low stock, breed mismatch block)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final AlertRepository alertRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final SmsGateway smsGateway;

    /**
     * Send an alert to a specific user — WebSocket + DB persist + optional SMS.
     */
    @Async
    @Transactional
    public void sendAlert(Long userId, AlertType type, String message) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            log.warn("Cannot send alert — user {} not found", userId);
            return;
        }

        // 1. Persist in DB
        Alert alert = Alert.builder()
                .type(type)
                .targetUser(user)
                .message(message)
                .readStatus(false)
                .build();
        alertRepository.save(alert);

        // 2. WebSocket push to user-specific topic
        try {
            messagingTemplate.convertAndSend(
                    "/topic/alerts/" + userId,
                    alert);
            log.debug("WebSocket alert sent to user {}: {}", userId, type);
        } catch (Exception e) {
            log.error("Failed to send WebSocket alert to user {}: {}", userId, e.getMessage());
        }

        // 3. SMS fallback for critical alert types
        if (isCriticalAlert(type)) {
            smsGateway.sendSms(user.getPhone(), message);
        }
    }

    /**
     * Send alert to all ADMIN and AI_TECHNICIAN users.
     * Used for low-stock warnings and system-wide notifications.
     */
    @Async
    @Transactional
    public void sendAlertToAdminsAndTechnicians(AlertType type, String message) {
        List<User> admins = userRepository.findByRole(UserRole.ADMIN);
        List<User> technicians = userRepository.findByRole(UserRole.AI_TECHNICIAN);

        admins.forEach(user -> sendAlert(user.getId(), type, message));
        technicians.forEach(user -> sendAlert(user.getId(), type, message));
    }

    /**
     * Mark an alert as read.
     */
    @Transactional
    public void markAsRead(Long alertId) {
        alertRepository.markAsRead(alertId);
    }

    /**
     * Mark all alerts for a user as read.
     */
    @Transactional
    public void markAllAsRead(Long userId) {
        alertRepository.markAllAsRead(userId);
    }

    /**
     * Get unread alert count for a user (for badge display).
     */
    public long getUnreadCount(Long userId) {
        return alertRepository.countByTargetUserIdAndReadStatusFalse(userId);
    }

    /**
     * Determine if an alert type warrants SMS fallback.
     */
    private boolean isCriticalAlert(AlertType type) {
        return type == AlertType.LOW_STOCK
                || type == AlertType.BREED_MISMATCH_BLOCKED
                || type == AlertType.CALVING_REMINDER;
    }
}
