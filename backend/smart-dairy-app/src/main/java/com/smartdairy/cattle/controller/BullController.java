package com.smartdairy.cattle.controller;

import com.smartdairy.breeding.dto.SireRecommendationDTO;
import com.smartdairy.breeding.service.SireRecommendationEngine;
import com.smartdairy.cattle.entity.Bull;
import com.smartdairy.cattle.service.BullService;
import com.smartdairy.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Bull Registry and Sire Recommendation Engine.
 */
@RestController
@RequestMapping("/api/bulls")
@RequiredArgsConstructor
@Tag(name = "Bulls & Sire Genetic Engine", description = "Bull registry and genetic merit sire recommendation endpoints")
@SecurityRequirement(name = "bearerAuth")
public class BullController {

    private final BullService bullService;
    private final SireRecommendationEngine recommendationEngine;

    /**
     * GET /api/bulls
     */
    @GetMapping
    @Operation(summary = "List all bulls", description = "Retrieves all registered bulls")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN', 'FARMER')")
    public ResponseEntity<ApiResponse<List<Bull>>> getAllBulls() {
        return ResponseEntity.ok(ApiResponse.success(bullService.findAllBulls(), "Bulls retrieved successfully"));
    }

    /**
     * GET /api/bulls/recommend?cowId={id}&a2a2Only={bool}
     * Genetic Merit Sire Recommendation Engine endpoint.
     */
    @GetMapping("/recommend")
    @Operation(
        summary = "Get Sire Recommendations for a Cow",
        description = "Ranks available semen straws for a cow using PTA, Net Merit (NM$), Daughter Fertility, Inbreeding %, and Climate Exotic Blood targets."
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN', 'FARMER')")
    public ResponseEntity<ApiResponse<List<SireRecommendationDTO>>> recommendSires(
            @RequestParam Long cowId,
            @RequestParam(defaultValue = "false") Boolean a2a2Only) {
        List<SireRecommendationDTO> recommendations = recommendationEngine.getRecommendationsForCow(cowId, a2a2Only);
        return ResponseEntity.ok(ApiResponse.success(recommendations, "Sire recommendations generated"));
    }

    /**
     * GET /api/bulls/{id}/genetic-profile
     * Full genetic merit card for a bull.
     */
    @GetMapping("/{id}/genetic-profile")
    @Operation(
        summary = "Get Bull Genetic Profile",
        description = "Returns complete genetic merit card (PTA Milk, NM$, SFI, DFI, A2A2, Inbreeding, Calving Ease)"
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN', 'FARMER')")
    public ResponseEntity<ApiResponse<Bull>> getBullGeneticProfile(@PathVariable Long id) {
        Bull bull = bullService.getBullById(id);
        return ResponseEntity.ok(ApiResponse.success(bull, "Bull genetic profile retrieved"));
    }

    /**
     * GET /api/bulls/{id}
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get Bull by ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN', 'FARMER')")
    public ResponseEntity<ApiResponse<Bull>> getBullById(@PathVariable Long id) {
        Bull bull = bullService.getBullById(id);
        return ResponseEntity.ok(ApiResponse.success(bull, "Bull retrieved successfully"));
    }
}
