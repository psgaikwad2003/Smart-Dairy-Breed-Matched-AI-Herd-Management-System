package com.smartdairy.cattle.service;

import com.smartdairy.cattle.entity.Bull;
import com.smartdairy.cattle.entity.SemenStraw;
import com.smartdairy.cattle.repository.SemenStrawRepository;
import com.smartdairy.common.enums.CattleBreed;
import com.smartdairy.common.enums.StationGrade;
import com.smartdairy.common.exception.ResourceNotFoundException;
import com.smartdairy.notification.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the Real-Time Semen Inventory Service.
 * Tests atomic stock decrement, low-stock alerts, and error handling.
 */
@ExtendWith(MockitoExtension.class)
class SemenInventoryServiceTest {

    @Mock
    private SemenStrawRepository semenStrawRepository;

    @Mock
    private RedisTemplate<String, String> redisTemplate;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private SemenInventoryService semenInventoryService;

    private SemenStraw testStraw;

    @BeforeEach
    void setUp() {
        Bull bull = Bull.builder()
                .id(1L)
                .name("HF Sultan")
                .breed(CattleBreed.HOLSTEIN_FRIESIAN)
                .build();

        testStraw = SemenStraw.builder()
                .id(1L)
                .bull(bull)
                .batchNo("HF-2024-0142")
                .breed(CattleBreed.HOLSTEIN_FRIESIAN)
                .stockQty(50)
                .semenStationName("NDDB Sabarmati Ashram, Anand")
                .stationGrade(StationGrade.A)
                .productionDate(LocalDate.of(2024, 1, 15))
                .expiryDate(LocalDate.of(2026, 1, 15))
                .version(0L)
                .build();
    }

    // ============================================================
    // Decrement Stock — Happy Path
    // ============================================================
    @Nested
    @DisplayName("Stock Decrement — Normal Operations")
    class DecrementHappyPath {

        @Test
        @DisplayName("Decrement by 1 should reduce stock and publish Redis event")
        void decrementByOne_shouldReduceStock() {
            when(semenStrawRepository.findById(1L)).thenReturn(Optional.of(testStraw));
            when(semenStrawRepository.save(any(SemenStraw.class))).thenAnswer(inv -> inv.getArgument(0));

            SemenStraw result = semenInventoryService.decrementStock(1L, 1);

            assertThat(result.getStockQty()).isEqualTo(49);
            verify(semenStrawRepository).save(any(SemenStraw.class));
            verify(redisTemplate).convertAndSend(eq("stock-updates"), anyString());
        }

        @Test
        @DisplayName("Stock at exactly 1 should reach 0 after decrement")
        void decrementToZero_shouldSucceed() {
            testStraw.setStockQty(1);
            when(semenStrawRepository.findById(1L)).thenReturn(Optional.of(testStraw));
            when(semenStrawRepository.save(any(SemenStraw.class))).thenAnswer(inv -> inv.getArgument(0));

            SemenStraw result = semenInventoryService.decrementStock(1L, 1);

            assertThat(result.getStockQty()).isEqualTo(0);
        }
    }

    // ============================================================
    // Low-Stock Alert Trigger
    // ============================================================
    @Nested
    @DisplayName("Low-Stock Alert Triggering")
    class LowStockAlerts {

        @Test
        @DisplayName("Stock dropping to threshold (10) should trigger alert")
        void stockAtThreshold_shouldTriggerAlert() {
            testStraw.setStockQty(11); // will become 10 after decrement
            when(semenStrawRepository.findById(1L)).thenReturn(Optional.of(testStraw));
            when(semenStrawRepository.save(any(SemenStraw.class))).thenAnswer(inv -> inv.getArgument(0));

            semenInventoryService.decrementStock(1L, 1);

            verify(notificationService).sendAlertToAdminsAndTechnicians(
                    eq(com.smartdairy.common.enums.AlertType.LOW_STOCK),
                    contains("LOW STOCK ALERT"));
        }

        @Test
        @DisplayName("Stock well above threshold should NOT trigger alert")
        void stockAboveThreshold_shouldNotTriggerAlert() {
            testStraw.setStockQty(50);
            when(semenStrawRepository.findById(1L)).thenReturn(Optional.of(testStraw));
            when(semenStrawRepository.save(any(SemenStraw.class))).thenAnswer(inv -> inv.getArgument(0));

            semenInventoryService.decrementStock(1L, 1);

            verify(notificationService, never()).sendAlertToAdminsAndTechnicians(any(), anyString());
        }

        @Test
        @DisplayName("Low stock alert message includes breed, batch, and station")
        void lowStockAlert_shouldIncludeDetails() {
            testStraw.setStockQty(5); // will become 4 after decrement
            when(semenStrawRepository.findById(1L)).thenReturn(Optional.of(testStraw));
            when(semenStrawRepository.save(any(SemenStraw.class))).thenAnswer(inv -> inv.getArgument(0));

            semenInventoryService.decrementStock(1L, 1);

            ArgumentCaptor<String> messageCaptor = ArgumentCaptor.forClass(String.class);
            verify(notificationService).sendAlertToAdminsAndTechnicians(any(), messageCaptor.capture());

            String alertMsg = messageCaptor.getValue();
            assertThat(alertMsg).contains("Holstein Friesian");
            assertThat(alertMsg).contains("HF-2024-0142");
            assertThat(alertMsg).contains("NDDB Sabarmati Ashram");
        }
    }

    // ============================================================
    // Error Handling
    // ============================================================
    @Nested
    @DisplayName("Error Handling")
    class ErrorHandling {

        @Test
        @DisplayName("Decrement on non-existent straw should throw ResourceNotFoundException")
        void nonExistentStraw_shouldThrow() {
            when(semenStrawRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> semenInventoryService.decrementStock(999L, 1))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("SemenStraw");
        }

        @Test
        @DisplayName("Insufficient stock should throw IllegalStateException")
        void insufficientStock_shouldThrow() {
            testStraw.setStockQty(0);
            when(semenStrawRepository.findById(1L)).thenReturn(Optional.of(testStraw));

            assertThatThrownBy(() -> semenInventoryService.decrementStock(1L, 1))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("Insufficient stock");
        }

        @Test
        @DisplayName("Requesting more than available stock should throw")
        void requestMoreThanAvailable_shouldThrow() {
            testStraw.setStockQty(3);
            when(semenStrawRepository.findById(1L)).thenReturn(Optional.of(testStraw));

            assertThatThrownBy(() -> semenInventoryService.decrementStock(1L, 5))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("Available: 3")
                    .hasMessageContaining("Requested: 5");
        }
    }

    // ============================================================
    // Add Stock
    // ============================================================
    @Nested
    @DisplayName("Add Stock — Replenishment")
    class AddStock {

        @Test
        @DisplayName("Adding stock should increase quantity and publish Redis event")
        void addStock_shouldIncrease() {
            when(semenStrawRepository.findById(1L)).thenReturn(Optional.of(testStraw));
            when(semenStrawRepository.save(any(SemenStraw.class))).thenAnswer(inv -> inv.getArgument(0));

            SemenStraw result = semenInventoryService.addStock(1L, 100);

            assertThat(result.getStockQty()).isEqualTo(150); // 50 + 100
            verify(redisTemplate).convertAndSend(eq("stock-updates"), anyString());
        }
    }

    // ============================================================
    // Redis Failure Resilience
    // ============================================================
    @Nested
    @DisplayName("Redis Failure Resilience")
    class RedisResilience {

        @Test
        @DisplayName("Redis failure should NOT prevent stock update from succeeding")
        void redisFail_shouldNotBlockStockUpdate() {
            when(semenStrawRepository.findById(1L)).thenReturn(Optional.of(testStraw));
            when(semenStrawRepository.save(any(SemenStraw.class))).thenAnswer(inv -> inv.getArgument(0));
            doThrow(new RuntimeException("Redis connection refused"))
                    .when(redisTemplate).convertAndSend(anyString(), anyString());

            // Should NOT throw — Redis failure is non-fatal
            SemenStraw result = semenInventoryService.decrementStock(1L, 1);

            assertThat(result.getStockQty()).isEqualTo(49);
        }
    }
}
