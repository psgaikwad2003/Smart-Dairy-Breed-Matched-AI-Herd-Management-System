package com.smartdairy.cattle.controller;

import com.smartdairy.cattle.entity.Cow;
import com.smartdairy.cattle.service.CowService;
import com.smartdairy.common.dto.ApiResponse;
import com.smartdairy.common.enums.CattleBreed;
import com.smartdairy.common.enums.CowStatus;
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
import java.util.Map;

/**
 * REST controller for Cow (cattle herd) management.
 */
@RestController
@RequestMapping("/api/cows")
@RequiredArgsConstructor
@Tag(name = "Cows", description = "Cattle herd management")
@SecurityRequirement(name = "bearerAuth")
public class CowController {

    private final CowService cowService;

    @GetMapping
    @Operation(summary = "List all cows (paginated)")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN', 'FARMER')")
    public ResponseEntity<ApiResponse<Page<Cow>>> getAllCows(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(ApiResponse.success(cowService.findAll(pageable), "Cows retrieved"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get cow by ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN', 'FARMER')")
    public ResponseEntity<ApiResponse<Cow>> getCowById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(cowService.findById(id), "Cow retrieved"));
    }

    @GetMapping("/farmer/{farmerId}")
    @Operation(summary = "Get all cows for a specific farmer")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN', 'FARMER')")
    public ResponseEntity<ApiResponse<List<Cow>>> getCowsByFarmer(@PathVariable Long farmerId) {
        return ResponseEntity.ok(ApiResponse.success(cowService.findByFarmerId(farmerId), "Cows retrieved"));
    }

    @GetMapping("/farmer/{farmerId}/active")
    @Operation(summary = "Get active cows for a farmer")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN', 'FARMER')")
    public ResponseEntity<ApiResponse<List<Cow>>> getActiveCows(@PathVariable Long farmerId) {
        return ResponseEntity.ok(ApiResponse.success(
                cowService.findByFarmerAndStatus(farmerId, CowStatus.ACTIVE), "Active cows retrieved"));
    }

    @GetMapping("/tag/{tagNumber}")
    @Operation(summary = "Look up cow by ear tag number")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN', 'FARMER')")
    public ResponseEntity<ApiResponse<Cow>> getCowByTag(@PathVariable String tagNumber) {
        return ResponseEntity.ok(ApiResponse.success(cowService.findByTagNumber(tagNumber), "Cow retrieved"));
    }

    @GetMapping("/breed-distribution/{farmerId}")
    @Operation(summary = "Breed distribution count for a farmer's herd")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN', 'FARMER')")
    public ResponseEntity<ApiResponse<List<Object[]>>> getBreedDistribution(@PathVariable Long farmerId) {
        return ResponseEntity.ok(ApiResponse.success(
                cowService.getBreedDistribution(farmerId), "Breed distribution retrieved"));
    }

    @PostMapping
    @Operation(summary = "Register a new cow")
    @PreAuthorize("hasAnyRole('ADMIN', 'AI_TECHNICIAN', 'FARMER')")
    public ResponseEntity<ApiResponse<Cow>> createCow(@Valid @RequestBody Cow cow) {
        return ResponseEntity.ok(ApiResponse.success(cowService.save(cow), "Cow registered"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update cow details")
    @PreAuthorize("hasAnyRole('ADMIN', 'AI_TECHNICIAN', 'FARMER')")
    public ResponseEntity<ApiResponse<Cow>> updateCow(@PathVariable Long id, @Valid @RequestBody Cow cow) {
        cow.setId(id);
        return ResponseEntity.ok(ApiResponse.success(cowService.save(cow), "Cow updated"));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update cow status (ACTIVE, DRY, SOLD, DECEASED)")
    @PreAuthorize("hasAnyRole('ADMIN', 'AI_TECHNICIAN', 'FARMER')")
    public ResponseEntity<ApiResponse<Cow>> updateStatus(
            @PathVariable Long id,
            @RequestParam CowStatus status) {
        return ResponseEntity.ok(ApiResponse.success(cowService.updateStatus(id, status), "Status updated"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove cow from herd")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCow(@PathVariable Long id) {
        cowService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Cow removed"));
    }
}
