package com.smartdairy.breeding.dto;

import com.smartdairy.common.enums.BreedingOutcome;
import com.smartdairy.common.enums.CompatibilityStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Request payload to confirm an insemination after breed validation passes.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BreedingConfirmRequest {

    @NotNull(message = "Cow ID is required")
    private Long cowId;

    @NotNull(message = "Semen straw ID is required")
    private Long semenStrawId;

    @NotNull(message = "Technician ID is required")
    private Long technicianId;

    @NotNull(message = "Insemination date is required")
    private LocalDate inseminationDate;

    /** Set when compatibility was BLOCKED but technician overrides with a reason */
    private CompatibilityStatus compatibilityStatus;

    private String overrideReason;
}
