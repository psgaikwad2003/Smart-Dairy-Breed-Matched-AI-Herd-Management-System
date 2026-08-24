package com.smartdairy.breeding.controller;

import com.smartdairy.breeding.dto.*;
import com.smartdairy.breeding.entity.BreedingRecord;
import com.smartdairy.breeding.service.BreedingService;
import com.smartdairy.breeding.service.SireRecommendationEngine;
import com.smartdairy.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for the Breeding AI workflow:
 * 1. Validate breed compatibility
 * 2. Simulate sire pairing genetic traits (New Engine)
 * 3. Confirm insemination (creates BreedingRecord, decrements straw stock)
 * 4. Update outcome (CONFIRMED_PREGNANT / FAILED)
 * 5. Query history and upcoming calvings
 */
@RestController
@RequestMapping("/api/breeding")
@RequiredArgsConstructor
@Tag(name = "Breeding", description = "Breed compatibility validation and AI insemination recording")
@SecurityRequirement(name = "bearerAuth")
public class BreedingController {

    private final BreedingService breedingService;
    private final SireRecommendationEngine recommendationEngine;

    /**
     * POST /api/breeding/validate
     * Core breed-matching endpoint — checks if cow+semen combo is valid.
     * Returns MATCH, OVERRIDE (allowed with reason), or BLOCKED.
     */
    @PostMapping("/validate")
    @Operation(
        summary = "Validate breed compatibility",
        description = "Checks cow breed vs semen breed. Returns MATCH, OVERRIDE (with reason), or BLOCKED."
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN')")
    public ResponseEntity<ApiResponse<BreedValidationResponse>> validateBreed(
            @Valid @RequestBody BreedValidationRequest request) {
        BreedValidationResponse result = breedingService.validateBreed(request);
        return ResponseEntity.ok(ApiResponse.success(result, "Breed validation complete"));
    }

    /**
     * POST /api/breeding/simulate
     * Simulates expected calf genetic traits (milk yield potential, exotic blood %, inbreeding)
     * before confirming insemination.
     */
    @PostMapping("/simulate")
    @Operation(
        summary = "Simulate Sire Insemination Pairing",
        description = "Predicts expected calf yield potential, exotic blood %, A2A2 status, and inbreeding coefficient prior to procedure."
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN')")
    public ResponseEntity<ApiResponse<SireSimulationResponseDTO>> simulatePairing(
            @Valid @RequestBody SireSimulationRequestDTO request) {
        SireSimulationResponseDTO result = recommendationEngine.simulateSirePairing(request);
        return ResponseEntity.ok(ApiResponse.success(result, "Sire pairing simulation complete"));
    }

    /**
     * POST /api/breeding/confirm
     * Records a confirmed insemination after breed check.
     * Atomically decrements semen straw inventory.
     */
    @PostMapping("/confirm")
    @Operation(
        summary = "Confirm insemination",
        description = "Records the AI procedure, decrements straw stock, and calculates expected calving date"
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'AI_TECHNICIAN')")
    public ResponseEntity<ApiResponse<BreedingRecord>> confirmBreeding(
            @Valid @RequestBody BreedingConfirmRequest request) {
        BreedingRecord record = breedingService.confirmBreeding(request);
        return ResponseEntity.ok(ApiResponse.success(record, "Insemination recorded"));
    }

    /**
     * GET /api/breeding/cow/{cowId}/history
     * Full breeding history for a specific cow.
     */
    @GetMapping("/cow/{cowId}/history")
    @Operation(summary = "Get breeding history for a cow")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN', 'FARMER')")
    public ResponseEntity<ApiResponse<List<BreedingRecord>>> getCowHistory(@PathVariable Long cowId) {
        return ResponseEntity.ok(ApiResponse.success(
                breedingService.getCowHistory(cowId), "Breeding history retrieved"));
    }

    /**
     * GET /api/breeding/records
     * Paginated list of all breeding records (admin/vet view).
     */
    @GetMapping("/records")
    @Operation(summary = "List all breeding records (paginated)")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET')")
    public ResponseEntity<ApiResponse<Page<BreedingRecord>>> getAllRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("inseminationDate").descending());
        return ResponseEntity.ok(ApiResponse.success(
                breedingService.findAll(pageable), "Records retrieved"));
    }

    /**
     * GET /api/breeding/upcoming-calvings
     * Cows with expected calving dates within the next N days.
     */
    @GetMapping("/upcoming-calvings")
    @Operation(summary = "Get upcoming calvings", description = "Returns cows due within the next N days")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<BreedingRecord>>> getUpcomingCalvings(
            @RequestParam(defaultValue = "30") int daysAhead) {
        return ResponseEntity.ok(ApiResponse.success(
                breedingService.getUpcomingCalvings(daysAhead), "Upcoming calvings retrieved"));
    }

    /**
     * PATCH /api/breeding/{recordId}/outcome
     * Update the breeding outcome after pregnancy confirmation.
     */
    @PatchMapping("/{recordId}/outcome")
    @Operation(summary = "Update breeding outcome (CONFIRMED_PREGNANT or FAILED)")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN')")
    public ResponseEntity<ApiResponse<BreedingRecord>> updateOutcome(
            @PathVariable Long recordId,
            @RequestParam String outcome) {
        return ResponseEntity.ok(ApiResponse.success(
                breedingService.updateOutcome(recordId, outcome), "Outcome updated"));
    }
}
