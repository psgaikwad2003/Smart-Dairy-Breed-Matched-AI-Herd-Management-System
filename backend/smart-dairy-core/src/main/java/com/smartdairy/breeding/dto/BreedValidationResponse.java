package com.smartdairy.breeding.dto;

import com.smartdairy.common.enums.CattleBreed;
import com.smartdairy.common.enums.CompatibilityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response from the breed compatibility validation engine.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BreedValidationResponse {

    private CompatibilityStatus status;

    private CattleBreed cowBreed;
    private CattleBreed semenBreed;

    /** Human-readable explanation of the validation result */
    private String message;

    /** Suggested alternative breeds if the current match is blocked */
    private List<CattleBreed> suggestedAlternatives;

    /** Whether the technician is allowed to override (only for BLOCKED, not biological incompatibility) */
    private boolean overrideAllowed;
}
