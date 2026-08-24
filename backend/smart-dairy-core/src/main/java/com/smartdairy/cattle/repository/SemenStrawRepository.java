package com.smartdairy.cattle.repository;

import com.smartdairy.cattle.entity.SemenStraw;
import com.smartdairy.common.enums.CattleBreed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SemenStrawRepository extends JpaRepository<SemenStraw, Long> {

    List<SemenStraw> findByBreed(CattleBreed breed);

    List<SemenStraw> findByBullId(Long bullId);

    @Query("SELECT s FROM SemenStraw s WHERE s.stockQty <= :threshold")
    List<SemenStraw> findLowStock(@Param("threshold") int threshold);

    @Query("SELECT s FROM SemenStraw s WHERE s.stockQty > 0 AND s.breed = :breed")
    List<SemenStraw> findAvailableByBreed(@Param("breed") CattleBreed breed);

    @Query("SELECT s FROM SemenStraw s WHERE s.semenStationName = :stationName")
    List<SemenStraw> findByStation(@Param("stationName") String stationName);

    @Query("SELECT COUNT(s) FROM SemenStraw s WHERE s.stockQty <= :threshold")
    long countLowStock(@Param("threshold") int threshold);
}
