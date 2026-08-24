package com.smartdairy.breeding.dto;

import com.smartdairy.common.enums.CompatibilityStatus;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SireSimulationResponseDTO {
    private Long cowId;
    private String cowTagNumber;
    private String cowBreed;
    private BigDecimal cowCurrentYield;
    private BigDecimal cowExoticBloodPct;

    private Long bullId;
    private String bullName;
    private String bullBreed;
    private String strawBatchNo;

    // Predicted Offspring Traits
    private BigDecimal predictedCalfYieldPotentialKg;
    private BigDecimal predictedCalfExoticBloodPct;
    private Boolean isA2A2Guaranteed;
    private BigDecimal estimatedInbreedingPct;
    private CompatibilityStatus compatibilityStatus;
    private String suitabilityVerdict;
    private String detailedRationale;
}
