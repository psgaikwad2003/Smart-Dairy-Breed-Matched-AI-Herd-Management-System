package com.smartdairy.cattle.repository;

import com.smartdairy.cattle.entity.Cow;
import com.smartdairy.common.enums.CattleBreed;
import com.smartdairy.common.enums.CowStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CowRepository extends JpaRepository<Cow, Long> {

    Page<Cow> findByFarmerId(Long farmerId, Pageable pageable);

    List<Cow> findByFarmerId(Long farmerId);

    List<Cow> findByFarmerIdAndStatus(Long farmerId, CowStatus status);

    Optional<Cow> findByTagNumber(String tagNumber);

    long countByBreed(CattleBreed breed);

    long countByStatus(CowStatus status);

    long countByFarmerIdAndStatus(Long farmerId, CowStatus status);

    @org.springframework.data.jpa.repository.Query(
        "SELECT c.breed, COUNT(c) FROM Cow c WHERE c.farmer.id = :farmerId GROUP BY c.breed")
    List<Object[]> countByBreedForFarmer(@org.springframework.data.repository.query.Param("farmerId") Long farmerId);
}
