package com.smartdairy.cattle.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonRawValue;
import com.smartdairy.common.enums.CattleBreed;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bulls")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Bull {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CattleBreed breed;

    @Column(name = "source_semen_station")
    private String sourceSemenStation;

    /** JSON blob storing legacy breeding values */
    @JsonRawValue
    @Column(name = "breeding_value_json", columnDefinition = "TEXT")
    private String breedingValueJson;

    @Column(name = "registration_no", unique = true)
    private String registrationNo;

    // ---- Genetic Merit Parameters for Sire Recommendation Engine ----

    @Column(name = "pta_milk_kg", precision = 8, scale = 2)
    @Builder.Default
    private BigDecimal ptaMilkKg = BigDecimal.ZERO;

    @Column(name = "pta_fat_pct", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal ptaFatPct = BigDecimal.ZERO;

    @Column(name = "pta_protein_pct", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal ptaProteinPct = BigDecimal.ZERO;

    @Column(name = "net_merit_index", precision = 8, scale = 2)
    @Builder.Default
    private BigDecimal netMeritIndex = BigDecimal.ZERO;

    @Column(name = "sire_fertility_index", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal sireFertilityIndex = BigDecimal.valueOf(100.0);

    @Column(name = "daughter_fertility_index", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal daughterFertilityIndex = BigDecimal.valueOf(100.0);

    @Column(name = "inbreeding_coefficient_pct", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal inbreedingCoefficientPct = BigDecimal.ZERO;

    @Column(name = "a2a2_status")
    @Builder.Default
    private Boolean a2a2Status = true;

    @Column(name = "exotic_blood_pct", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal exoticBloodPct = BigDecimal.ZERO;

    @Column(name = "calving_ease_score")
    @Builder.Default
    private Integer calvingEaseScore = 1;

    @Column(name = "productive_life_years", precision = 4, scale = 2)
    @Builder.Default
    private BigDecimal productiveLifeYears = BigDecimal.valueOf(3.5);

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
