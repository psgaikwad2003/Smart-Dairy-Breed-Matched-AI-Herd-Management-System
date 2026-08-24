package com.smartdairy.analytics.controller;

import com.smartdairy.analytics.repository.MilkYieldLogRepository;
import com.smartdairy.breeding.repository.BreedingRecordRepository;
import com.smartdairy.cattle.repository.CowRepository;
import com.smartdairy.cattle.repository.SemenStrawRepository;
import com.smartdairy.common.dto.ApiResponse;
import com.smartdairy.common.enums.BreedingOutcome;
import com.smartdairy.common.enums.CowStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Dashboard summary endpoint — aggregates key metrics for the React dashboard.
 */
@RestController
@RequestMapping("/api/analytics/dashboard")
@RequiredArgsConstructor
@Tag(name = "Analytics - Dashboard", description = "Dashboard KPI summary for the main screen")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final CowRepository cowRepository;
    private final BreedingRecordRepository breedingRecordRepository;
    private final SemenStrawRepository semenStrawRepository;
    private final MilkYieldLogRepository milkYieldLogRepository;

    /**
     * GET /api/analytics/dashboard/summary
     * Returns key metrics for the main dashboard card grid.
     */
    @GetMapping("/summary")
    @Operation(summary = "Get dashboard summary KPIs",
               description = "Returns active herd count, total inseminations, low stock alerts, and today's milk yield")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'FARMER', 'AI_TECHNICIAN')")
    public ResponseEntity<ApiResponse<DashboardSummary>> getSummary(
            @RequestParam(required = false) Long farmerId) {

        long activeCows = farmerId != null
                ? cowRepository.countByFarmerIdAndStatus(farmerId, CowStatus.ACTIVE)
                : cowRepository.countByStatus(CowStatus.ACTIVE);

        long pendingBreedings = breedingRecordRepository.countByOutcome(BreedingOutcome.PENDING);
        long confirmedPregnancies = breedingRecordRepository.countByOutcome(BreedingOutcome.CONFIRMED_PREGNANT);
        long lowStockStraws = semenStrawRepository.countLowStock(5);

        // Upcoming calvings in next 30 days
        LocalDate today = LocalDate.now();
        LocalDate in30Days = today.plusDays(30);
        long upcomingCalvings = breedingRecordRepository
                .countByExpectedCalvingDateBetween(today, in30Days);

        // Override audit — how many breed mismatches were overridden this month
        LocalDate firstDayOfMonth = today.withDayOfMonth(1);
        long overridesThisMonth = breedingRecordRepository.countOverridesThisMonth(firstDayOfMonth);

        DashboardSummary summary = DashboardSummary.builder()
                .activeCows(activeCows)
                .pendingBreedings(pendingBreedings)
                .confirmedPregnancies(confirmedPregnancies)
                .upcomingCalvings(upcomingCalvings)
                .lowStockAlerts(lowStockStraws)
                .overridesThisMonth(overridesThisMonth)
                .build();

        return ResponseEntity.ok(ApiResponse.success(summary, "Dashboard summary retrieved"));
    }

    @Data
    @Builder
    public static class DashboardSummary {
        private long activeCows;
        private long pendingBreedings;
        private long confirmedPregnancies;
        private long upcomingCalvings;
        private long lowStockAlerts;
        private long overridesThisMonth;
    }
}
