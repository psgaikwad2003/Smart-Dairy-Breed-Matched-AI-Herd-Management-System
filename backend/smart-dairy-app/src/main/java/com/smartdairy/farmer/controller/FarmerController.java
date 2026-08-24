package com.smartdairy.farmer.controller;

import com.smartdairy.common.dto.ApiResponse;
import com.smartdairy.farmer.entity.Farmer;
import com.smartdairy.farmer.service.FarmerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Farmer management.
 */
@RestController
@RequestMapping("/api/farmers")
@RequiredArgsConstructor
@Tag(name = "Farmers", description = "Farmer profile management")
@SecurityRequirement(name = "bearerAuth")
public class FarmerController {

    private final FarmerService farmerService;

    @GetMapping
    @Operation(summary = "List all farmers", description = "Admin and Vet can see all farmers")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<Farmer>>> getAllFarmers() {
        return ResponseEntity.ok(ApiResponse.success(farmerService.findAll(), "Farmers retrieved"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get farmer by ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN', 'FARMER')")
    public ResponseEntity<ApiResponse<Farmer>> getFarmerById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(farmerService.findById(id), "Farmer retrieved"));
    }

    @PostMapping
    @Operation(summary = "Create a new farmer profile")
    @PreAuthorize("hasAnyRole('ADMIN', 'AI_TECHNICIAN')")
    public ResponseEntity<ApiResponse<Farmer>> createFarmer(@Valid @RequestBody Farmer farmer) {
        return ResponseEntity.ok(ApiResponse.success(farmerService.save(farmer), "Farmer created"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update farmer profile")
    @PreAuthorize("hasAnyRole('ADMIN', 'AI_TECHNICIAN')")
    public ResponseEntity<ApiResponse<Farmer>> updateFarmer(
            @PathVariable Long id,
            @Valid @RequestBody Farmer farmer) {
        farmer.setId(id);
        return ResponseEntity.ok(ApiResponse.success(farmerService.save(farmer), "Farmer updated"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete farmer (soft delete)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteFarmer(@PathVariable Long id) {
        farmerService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Farmer deleted"));
    }
}
