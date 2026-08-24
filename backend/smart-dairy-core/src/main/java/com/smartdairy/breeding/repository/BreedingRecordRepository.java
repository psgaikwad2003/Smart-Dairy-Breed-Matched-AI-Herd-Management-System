package com.smartdairy.breeding.repository;

import com.smartdairy.breeding.entity.BreedingRecord;
import com.smartdairy.common.enums.BreedingOutcome;
import com.smartdairy.common.enums.CompatibilityStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BreedingRecordRepository extends JpaRepository<BreedingRecord, Long> {

    Page<BreedingRecord> findByCowId(Long cowId, Pageable pageable);

    List<BreedingRecord> findByCowIdOrderByInseminationDateDesc(Long cowId);

    List<BreedingRecord> findByTechnicianId(Long technicianId);

    List<BreedingRecord> findByOutcome(BreedingOutcome outcome);

    long countByOutcome(BreedingOutcome outcome);

    @Query("SELECT br FROM BreedingRecord br WHERE br.compatibilityStatus = :status")
    List<BreedingRecord> findByCompatibilityStatus(@Param("status") CompatibilityStatus status);

    @Query("SELECT br FROM BreedingRecord br WHERE br.expectedCalvingDate BETWEEN :start AND :end")
    List<BreedingRecord> findUpcomingCalvings(@Param("start") LocalDate start, @Param("end") LocalDate end);

    long countByExpectedCalvingDateBetween(LocalDate start, LocalDate end);

    long countByCompatibilityStatus(CompatibilityStatus status);

    @Query("SELECT COUNT(br) FROM BreedingRecord br WHERE br.compatibilityStatus = 'OVERRIDE' " +
           "AND br.inseminationDate >= :firstDayOfMonth")
    long countOverridesThisMonth(@Param("firstDayOfMonth") LocalDate firstDayOfMonth);
}
