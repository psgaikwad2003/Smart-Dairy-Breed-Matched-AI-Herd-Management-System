package com.smartdairy.analytics.entity;

import com.smartdairy.cattle.entity.Cow;
import com.smartdairy.common.enums.MilkSession;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "milk_yield_logs",
       uniqueConstraints = @UniqueConstraint(
           columnNames = {"cow_id", "date", "session"},
           name = "uk_milk_cow_date_session"))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class MilkYieldLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cow_id", nullable = false)
    private Cow cow;

    @NotNull
    @Column(nullable = false)
    private LocalDate date;

    @NotNull
    @Positive
    @Column(name = "quantity_litres", nullable = false, precision = 6, scale = 2)
    private BigDecimal quantityLitres;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private MilkSession session;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
