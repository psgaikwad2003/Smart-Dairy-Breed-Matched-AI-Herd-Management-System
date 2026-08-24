package com.smartdairy.breeding.dto;

import com.smartdairy.common.enums.CompatibilityStatus;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SireRecommendationDTO {
    private Long semenStrawId;
    private String batchNo;
    private Long bullId;
    private String bullName;
    private String bullRegistrationNo;
    private String bullBreed;
    private String semenStationName;
    private String stationGrade;
    private Integer stockQty;

    // Genetic Merit Parameters
    private BigDecimal compositeScore;
    private BigDecimal ptaMilkKg;
    private BigDecimal ptaFatPct;
    private BigDecimal ptaProteinPct;
    private BigDecimal netMeritIndex;
    private BigDecimal sireFertilityIndex;
    private BigDecimal daughterFertilityIndex;
    private BigDecimal estimatedInbreedingPct;
    private Boolean a2a2Status;
    private BigDecimal expectedCalfExoticBloodPct;
    private Integer calvingEaseScore;

    private String recommendationRank;
    private String rationale;
    private CompatibilityStatus compatibilityStatus;
    private List<String> warnings;
}
