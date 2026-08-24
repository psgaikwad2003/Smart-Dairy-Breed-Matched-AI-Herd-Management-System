package com.smartdairy.breeding.dto;

import com.smartdairy.common.enums.CattleBreed;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request payload for breed compatibility validation.
 * Sent by the AI technician before confirming an insemination.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BreedValidationRequest {

    @NotNull(message = "Cow ID is required")
    private Long cowId;

    @NotNull(message = "Semen straw ID is required")
    private Long semenStrawId;

    /**
     * Farmer's breeding goal — influences whether crossbreeding is recommended.
     * Values: "MAXIMIZE_MILK_YIELD", "MAINTAIN_PUREBRED", "GENERAL"
     */
    @Builder.Default
    private String breedingGoal = "GENERAL";

    /**
     * If the technician wants to override a BLOCKED result,
     * they must provide a reason in this field.
     */
    private String overrideReason;
}
