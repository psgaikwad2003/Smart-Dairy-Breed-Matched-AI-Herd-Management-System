package com.smartdairy.cattle.repository;

import com.smartdairy.cattle.entity.Bull;
import com.smartdairy.common.enums.CattleBreed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BullRepository extends JpaRepository<Bull, Long> {

    List<Bull> findByBreed(CattleBreed breed);

    Optional<Bull> findByRegistrationNo(String registrationNo);
}
