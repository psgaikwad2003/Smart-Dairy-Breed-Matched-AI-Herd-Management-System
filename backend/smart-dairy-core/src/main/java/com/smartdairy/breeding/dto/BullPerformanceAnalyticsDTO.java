package com.smartdairy.breeding.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BullPerformanceAnalyticsDTO {
    private Long bullId;
    private String bullName;
    private String registrationNo;
    private String breed;
    private BigDecimal predictedPtaMilkKg;
    private BigDecimal realizedDaughterAvgYieldKg;
    private Integer totalDaughtersRecorded;
    private BigDecimal accuracyPercentage;
    private String performanceRating;
}
