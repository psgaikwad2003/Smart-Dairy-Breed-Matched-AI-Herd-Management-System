package com.smartdairy.analytics.controller;

import com.smartdairy.breeding.dto.BullPerformanceAnalyticsDTO;
import com.smartdairy.breeding.service.SireRecommendationEngine;
import com.smartdairy.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST Controller for Bull Genetic Performance Analytics
 */
@RestController
@RequestMapping("/api/analytics/bull-performance")
@RequiredArgsConstructor
@Tag(name = "Analytics - Bull Performance", description = "Bull PTA vs Realized Daughter Yield Analytics")
@SecurityRequirement(name = "bearerAuth")
public class BullPerformanceController {

    private final SireRecommendationEngine recommendationEngine;

    /**
     * GET /api/analytics/bull-performance
     * Compares realized daughter yield vs predicted PTA across bulls to show model precision over time.
     */
    @GetMapping
    @Operation(
        summary = "Get Bull Genetic Performance Analytics",
        description = "Compares predicted PTA milk yield vs realized daughter average yield across bulls"
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'VET')")
    public ResponseEntity<ApiResponse<List<BullPerformanceAnalyticsDTO>>> getBullPerformance() {
        List<BullPerformanceAnalyticsDTO> performance = recommendationEngine.getBullPerformanceAnalytics();
        return ResponseEntity.ok(ApiResponse.success(performance, "Bull performance analytics retrieved"));
    }
}
