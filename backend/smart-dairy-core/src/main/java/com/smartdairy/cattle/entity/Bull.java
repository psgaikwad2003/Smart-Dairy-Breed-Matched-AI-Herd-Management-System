package com.smartdairy.cattle.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonRawValue;
import com.smartdairy.common.enums.CattleBreed;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

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

    /** JSON blob storing breeding values — milk yield EBV, fat %, protein %, etc. */
    @JsonRawValue
    @Column(name = "breeding_value_json", columnDefinition = "TEXT")
    private String breedingValueJson;

    @Column(name = "registration_no", unique = true)
    private String registrationNo;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
