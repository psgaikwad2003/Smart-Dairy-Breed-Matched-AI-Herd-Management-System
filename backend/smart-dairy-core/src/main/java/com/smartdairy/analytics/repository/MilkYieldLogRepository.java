package com.smartdairy.analytics.repository;

import com.smartdairy.analytics.entity.MilkYieldLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MilkYieldLogRepository extends JpaRepository<MilkYieldLog, Long> {

    List<MilkYieldLog> findByCowIdOrderByDateDescSessionDesc(Long cowId);

    List<MilkYieldLog> findByCowIdAndDateBetween(Long cowId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT SUM(m.quantityLitres) FROM MilkYieldLog m WHERE m.cow.id = :cowId AND m.date = :date")
    java.math.BigDecimal getDailyTotal(@Param("cowId") Long cowId, @Param("date") LocalDate date);

    @Query("SELECT AVG(m.quantityLitres) FROM MilkYieldLog m WHERE m.cow.id = :cowId " +
           "AND m.date BETWEEN :start AND :end")
    java.math.BigDecimal getAverageYield(@Param("cowId") Long cowId,
                                          @Param("start") LocalDate start,
                                          @Param("end") LocalDate end);

    @Query("SELECT m.cow.breed, AVG(m.quantityLitres) FROM MilkYieldLog m " +
           "WHERE m.cow.farmer.id = :farmerId GROUP BY m.cow.breed")
    List<Object[]> getAverageYieldByBreed(@Param("farmerId") Long farmerId);

    @Query("SELECT m.date, SUM(m.quantityLitres) FROM MilkYieldLog m " +
           "WHERE m.cow.id = :cowId AND m.date BETWEEN :from AND :to GROUP BY m.date ORDER BY m.date")
    List<Object[]> getDailyTotals(@Param("cowId") Long cowId,
                                   @Param("from") LocalDate from,
                                   @Param("to") LocalDate to);
}
