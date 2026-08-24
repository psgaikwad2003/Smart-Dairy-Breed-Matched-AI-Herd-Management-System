package com.smartdairy.cattle.entity;

import com.smartdairy.common.enums.CattleBreed;
import com.smartdairy.common.enums.CowStatus;
import com.smartdairy.farmer.entity.Farmer;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "cows")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Cow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @NotBlank
    @Column(name = "tag_number", nullable = false, unique = true)
    private String tagNumber;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CattleBreed breed;

    @Column(name = "dob")
    private LocalDate dateOfBirth;

    @Column(name = "lactation_count")
    @Builder.Default
    private Integer lactationCount = 0;

    @Column(name = "current_milk_yield_litres", precision = 6, scale = 2)
    @Builder.Default
    private BigDecimal currentMilkYieldLitres = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Builder.Default
    private CowStatus status = CowStatus.ACTIVE;

    // ---- Genetic Merit & Lineage fields ----

    @Column(name = "exotic_blood_pct", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal exoticBloodPct = BigDecimal.ZERO;

    @Column(name = "lineage_bull_ids", length = 500)
    private String lineageBullIds;

    @Column(name = "last_yield_kg_per_day", precision = 6, scale = 2)
    @Builder.Default
    private BigDecimal lastYieldKgPerDay = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
