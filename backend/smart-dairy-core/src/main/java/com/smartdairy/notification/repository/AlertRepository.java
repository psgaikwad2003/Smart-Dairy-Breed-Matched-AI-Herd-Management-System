package com.smartdairy.notification.repository;

import com.smartdairy.common.enums.AlertType;
import com.smartdairy.notification.entity.Alert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

    Page<Alert> findByTargetUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @Query("SELECT a FROM Alert a WHERE a.targetUser.phone = :phone ORDER BY a.createdAt DESC")
    Page<Alert> findByUserPhone(@Param("phone") String phone, Pageable pageable);

    List<Alert> findByTargetUserIdAndReadStatusFalse(Long userId);

    long countByTargetUserIdAndReadStatusFalse(Long userId);

    @Query("SELECT COUNT(a) FROM Alert a WHERE a.targetUser.phone = :phone AND a.readStatus = false")
    long countUnreadByUserPhone(@Param("phone") String phone);

    List<Alert> findByType(AlertType type);

    @Modifying
    @Query("UPDATE Alert a SET a.readStatus = true WHERE a.id = :alertId")
    void markAsRead(@Param("alertId") Long alertId);

    @Modifying
    @Query("UPDATE Alert a SET a.readStatus = true WHERE a.targetUser.id = :userId")
    void markAllAsRead(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Alert a SET a.readStatus = true WHERE a.targetUser.phone = :phone")
    void markAllReadByUserPhone(@Param("phone") String phone);
}
