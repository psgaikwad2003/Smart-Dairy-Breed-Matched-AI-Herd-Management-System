package com.smartdairy.analytics.controller;

import com.smartdairy.analytics.entity.MilkYieldLog;
import com.smartdairy.analytics.service.MilkYieldService;
import com.smartdairy.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST controller for milk yield analytics.
 */
@RestController
@RequestMapping("/api/analytics/milk")
@RequiredArgsConstructor
@Tag(name = "Analytics - Milk Yield", description = "Milk yield logging and analytics")
@SecurityRequirement(name = "bearerAuth")
public class MilkYieldController {

    private final MilkYieldService milkYieldService;

    @PostMapping
    @Operation(summary = "Log milk yield for a session (morning/evening)")
    @PreAuthorize("hasAnyRole('ADMIN', 'FARMER', 'VET')")
    public ResponseEntity<ApiResponse<MilkYieldLog>> logYield(@Valid @RequestBody MilkYieldLog log) {
        return ResponseEntity.ok(ApiResponse.success(milkYieldService.logYield(log), "Yield logged"));
    }

    @GetMapping("/cow/{cowId}")
    @Operation(summary = "Get yield history for a cow")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'FARMER')")
    public ResponseEntity<ApiResponse<List<MilkYieldLog>>> getCowHistory(@PathVariable Long cowId) {
        return ResponseEntity.ok(ApiResponse.success(
                milkYieldService.getCowYieldHistory(cowId), "History retrieved"));
    }

    @GetMapping("/cow/{cowId}/trend")
    @Operation(summary = "Daily yield totals for a cow over a date range (for charting)")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'FARMER')")
    public ResponseEntity<ApiResponse<List<Object[]>>> getDailyTrend(
            @PathVariable Long cowId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(ApiResponse.success(
                milkYieldService.getDailyYieldTrend(cowId, from, to), "Trend retrieved"));
    }

    @GetMapping("/farmer/{farmerId}/breed-comparison")
    @Operation(summary = "Average yield by breed for a farmer's herd (bar chart data)")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'FARMER')")
    public ResponseEntity<ApiResponse<List<Object[]>>> getBreedComparison(@PathVariable Long farmerId) {
        return ResponseEntity.ok(ApiResponse.success(
                milkYieldService.getBreedWiseAverage(farmerId), "Breed comparison retrieved"));
    }
}
