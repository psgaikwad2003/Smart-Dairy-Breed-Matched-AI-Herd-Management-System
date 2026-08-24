package com.smartdairy.breeding.entity;

import com.smartdairy.auth.entity.User;
import com.smartdairy.cattle.entity.Cow;
import com.smartdairy.cattle.entity.SemenStraw;
import com.smartdairy.common.enums.BreedingOutcome;
import com.smartdairy.common.enums.CompatibilityStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "breeding_records")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class BreedingRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cow_id", nullable = false)
    private Cow cow;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semen_straw_id", nullable = false)
    private SemenStraw semenStraw;

    /** The AI technician who performed the insemination */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technician_id", nullable = false)
    private User technician;

    @NotNull
    @Column(name = "insemination_date", nullable = false)
    private LocalDate inseminationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "compatibility_status", nullable = false, length = 10)
    private CompatibilityStatus compatibilityStatus;

    /** Reason provided when technician overrides a BLOCKED mismatch */
    @Column(name = "override_reason", length = 500)
    private String overrideReason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BreedingOutcome outcome = BreedingOutcome.PENDING;

    /** Nullable — set when a calf is born from this breeding */
    @Column(name = "calf_id")
    private Long calfId;

    @Column(name = "expected_calving_date")
    private LocalDate expectedCalvingDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
