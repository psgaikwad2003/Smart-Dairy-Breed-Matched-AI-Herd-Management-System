package com.smartdairy.cattle.service;

import com.smartdairy.cattle.entity.SemenStraw;
import com.smartdairy.cattle.repository.SemenStrawRepository;
import com.smartdairy.common.enums.AlertType;
import com.smartdairy.common.enums.CattleBreed;
import com.smartdairy.common.exception.ResourceNotFoundException;
import com.smartdairy.notification.service.NotificationService;
import jakarta.persistence.OptimisticLockException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Real-Time Semen Inventory Service.
 *
 * Handles atomic stock decrement with optimistic locking, publishes
 * Redis events for real-time WebSocket fan-out, and triggers low-stock alerts.
 */
import org.springframework.beans.factory.annotation.Autowired;

@Service
@RequiredArgsConstructor
@Slf4j
public class SemenInventoryService {

    private final SemenStrawRepository semenStrawRepository;
    @Autowired(required = false)
    private RedisTemplate<String, String> redisTemplate;
    private final NotificationService notificationService;

    private static final int LOW_STOCK_THRESHOLD = 10;
    private static final int MAX_RETRY_ATTEMPTS = 3;
    private static final String REDIS_STOCK_CHANNEL = "stock-updates";

    /**
     * Decrement straw stock atomically. Uses @Version-based optimistic locking.
     * On concurrent update conflict, retries up to MAX_RETRY_ATTEMPTS.
     *
     * @param strawId  the semen straw to decrement
     * @param quantity number of straws used (usually 1)
     * @return updated SemenStraw entity
     * @throws ResourceNotFoundException if straw not found
     * @throws IllegalStateException if stock insufficient or all retries exhausted
     */
    @Transactional
    public SemenStraw decrementStock(Long strawId, int quantity) {
        return decrementWithRetry(strawId, quantity, 0);
    }

    private SemenStraw decrementWithRetry(Long strawId, int quantity, int attempt) {
        try {
            SemenStraw straw = semenStrawRepository.findById(strawId)
                    .orElseThrow(() -> new ResourceNotFoundException("SemenStraw", "id", strawId));

            if (straw.getStockQty() < quantity) {
                throw new IllegalStateException(
                        String.format("Insufficient stock for straw %s (batch: %s). Available: %d, Requested: %d",
                                strawId, straw.getBatchNo(), straw.getStockQty(), quantity));
            }

            straw.setStockQty(straw.getStockQty() - quantity);
            SemenStraw saved = semenStrawRepository.save(straw);

            // Publish stock update event to Redis for real-time fan-out
            publishStockUpdate(saved);

            // Check low-stock threshold and trigger alert
            if (saved.getStockQty() <= LOW_STOCK_THRESHOLD) {
                triggerLowStockAlert(saved);
            }

            log.info("Stock decremented: straw={}, batch={}, remaining={}, station={}",
                    strawId, saved.getBatchNo(), saved.getStockQty(), saved.getSemenStationName());

            return saved;

        } catch (OptimisticLockException e) {
            if (attempt < MAX_RETRY_ATTEMPTS) {
                log.warn("Optimistic lock conflict on straw {}. Retry attempt {}/{}",
                        strawId, attempt + 1, MAX_RETRY_ATTEMPTS);
                return decrementWithRetry(strawId, quantity, attempt + 1);
            }
            throw new IllegalStateException(
                    "Failed to update stock after " + MAX_RETRY_ATTEMPTS + " retries due to concurrent updates.", e);
        }
    }

    /**
     * Add stock (e.g., new batch delivery from semen station).
     */
    @Transactional
    public SemenStraw addStock(Long strawId, int quantity) {
        SemenStraw straw = semenStrawRepository.findById(strawId)
                .orElseThrow(() -> new ResourceNotFoundException("SemenStraw", "id", strawId));

        straw.setStockQty(straw.getStockQty() + quantity);
        SemenStraw saved = semenStrawRepository.save(straw);

        publishStockUpdate(saved);

        log.info("Stock added: straw={}, batch={}, newTotal={}", strawId, saved.getBatchNo(), saved.getStockQty());
        return saved;
    }

    /**
     * Get all semen straws below the low-stock threshold.
     */
    public List<SemenStraw> getLowStockStraws() {
        return semenStrawRepository.findLowStock(LOW_STOCK_THRESHOLD);
    }

    /**
     * Get available straws for a specific breed.
     */
    public List<SemenStraw> getAvailableByBreed(CattleBreed breed) {
        return semenStrawRepository.findAvailableByBreed(breed);
    }

    /** Alias used by InventoryController */
    public List<SemenStraw> getAvailableStraws(CattleBreed breed) {
        return getAvailableByBreed(breed);
    }

    /** Get straws below a given threshold (used by InventoryController) */
    public List<SemenStraw> getLowStockStraws(int threshold) {
        return semenStrawRepository.findLowStock(threshold);
    }

    /**
     * Publish stock update event to Redis channel for WebSocket fan-out.
     * All connected clients watching this station's inventory will receive the update.
     */
    private void publishStockUpdate(SemenStraw straw) {
        if (redisTemplate == null) {
            return;
        }
        try {
            String message = String.format("{\"strawId\":%d,\"batchNo\":\"%s\",\"breed\":\"%s\","
                            + "\"stockQty\":%d,\"station\":\"%s\"}",
                    straw.getId(), straw.getBatchNo(), straw.getBreed(),
                    straw.getStockQty(), straw.getSemenStationName());

            redisTemplate.convertAndSend(REDIS_STOCK_CHANNEL, message);
            log.debug("Published stock update to Redis: {}", message);
        } catch (Exception e) {
            // Redis failure should not block the stock update — log and continue
            log.error("Failed to publish stock update to Redis for straw {}: {}", straw.getId(), e.getMessage());
        }
    }

    /**
     * Trigger low-stock alert to admin/technician users.
     */
    private void triggerLowStockAlert(SemenStraw straw) {
        String alertMessage = String.format("⚠️ LOW STOCK ALERT: %s (Batch: %s) at %s has only %d straws remaining.",
                straw.getBreed().getDisplayName(), straw.getBatchNo(),
                straw.getSemenStationName(), straw.getStockQty());

        notificationService.sendAlertToAdminsAndTechnicians(AlertType.LOW_STOCK, alertMessage);
        log.warn("Low stock alert triggered: straw={}, batch={}, qty={}", straw.getId(), straw.getBatchNo(), straw.getStockQty());
    }
}
