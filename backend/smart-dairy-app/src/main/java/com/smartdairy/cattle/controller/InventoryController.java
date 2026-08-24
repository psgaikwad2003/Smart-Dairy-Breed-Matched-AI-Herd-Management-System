package com.smartdairy.cattle.controller;

import com.smartdairy.cattle.entity.Bull;
import com.smartdairy.cattle.entity.SemenStraw;
import com.smartdairy.cattle.service.BullService;
import com.smartdairy.cattle.service.SemenInventoryService;
import com.smartdairy.common.dto.ApiResponse;
import com.smartdairy.common.enums.CattleBreed;
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
 * REST controller for Semen Inventory (Bulls + Straws).
 */
@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@Tag(name = "Semen Inventory", description = "Bull profiles and semen straw stock management")
@SecurityRequirement(name = "bearerAuth")
public class InventoryController {

    private final BullService bullService;
    private final SemenInventoryService semenInventoryService;

    // ---- Bulls ----

    @GetMapping("/bulls")
    @Operation(summary = "List all registered bulls")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<Bull>>> getAllBulls() {
        return ResponseEntity.ok(ApiResponse.success(bullService.findAllBulls(), "Bulls retrieved"));
    }

    @GetMapping("/bulls/breed/{breed}")
    @Operation(summary = "Find bulls by breed for compatibility matching")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<Bull>>> getBullsByBreed(@PathVariable CattleBreed breed) {
        return ResponseEntity.ok(ApiResponse.success(bullService.findBullsByBreed(breed), "Bulls retrieved"));
    }

    @PostMapping("/bulls")
    @Operation(summary = "Register a new bull")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET')")
    public ResponseEntity<ApiResponse<Bull>> createBull(@Valid @RequestBody Bull bull) {
        return ResponseEntity.ok(ApiResponse.success(bullService.saveBull(bull), "Bull registered"));
    }

    // ---- Semen Straws ----

    @GetMapping("/straws")
    @Operation(summary = "List all semen straw batches")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<SemenStraw>>> getAllStraws() {
        return ResponseEntity.ok(ApiResponse.success(bullService.findAllStraws(), "Straws retrieved"));
    }

    @GetMapping("/straws/available/{breed}")
    @Operation(summary = "Get available straws for a specific breed")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<SemenStraw>>> getAvailableStraws(@PathVariable CattleBreed breed) {
        return ResponseEntity.ok(ApiResponse.success(
                semenInventoryService.getAvailableStraws(breed), "Available straws retrieved"));
    }

    @GetMapping("/straws/low-stock")
    @Operation(summary = "Get straws with low stock (below threshold)")
    @PreAuthorize("hasAnyRole('ADMIN', 'VET', 'AI_TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<SemenStraw>>> getLowStockStraws(
            @RequestParam(defaultValue = "5") int threshold) {
        return ResponseEntity.ok(ApiResponse.success(
                semenInventoryService.getLowStockStraws(threshold), "Low-stock straws retrieved"));
    }

    @PostMapping("/straws")
    @Operation(summary = "Add a new semen straw batch to inventory")
    @PreAuthorize("hasAnyRole('ADMIN', 'AI_TECHNICIAN')")
    public ResponseEntity<ApiResponse<SemenStraw>> addStraw(@Valid @RequestBody SemenStraw straw) {
        return ResponseEntity.ok(ApiResponse.success(bullService.saveStraw(straw), "Straw batch added"));
    }

    @PatchMapping("/straws/{strawId}/restock")
    @Operation(summary = "Restock a straw batch by adding quantity")
    @PreAuthorize("hasAnyRole('ADMIN', 'AI_TECHNICIAN')")
    public ResponseEntity<ApiResponse<SemenStraw>> restockStraw(
            @PathVariable Long strawId,
            @RequestParam int quantity) {
        return ResponseEntity.ok(ApiResponse.success(
                semenInventoryService.addStock(strawId, quantity), "Straw restocked"));
    }
}
