package com.smartdairy.breeding.service;

import com.smartdairy.breeding.dto.BreedValidationRequest;
import com.smartdairy.breeding.dto.BreedValidationResponse;
import com.smartdairy.breeding.dto.BreedingConfirmRequest;
import com.smartdairy.breeding.engine.BreedCompatibilityEngine;
import com.smartdairy.breeding.entity.BreedingRecord;
import com.smartdairy.breeding.repository.BreedingRecordRepository;
import com.smartdairy.cattle.entity.Cow;
import com.smartdairy.cattle.entity.SemenStraw;
import com.smartdairy.cattle.repository.CowRepository;
import com.smartdairy.cattle.repository.SemenStrawRepository;
import com.smartdairy.cattle.service.SemenInventoryService;
import com.smartdairy.auth.entity.User;
import com.smartdairy.auth.repository.UserRepository;
import com.smartdairy.common.enums.BreedingOutcome;
import com.smartdairy.common.enums.CompatibilityStatus;
import com.smartdairy.common.exception.BreedMismatchException;
import com.smartdairy.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class BreedingService {

    private final BreedCompatibilityEngine compatibilityEngine;
    private final BreedingRecordRepository breedingRecordRepository;
    private final CowRepository cowRepository;
    private final SemenStrawRepository semenStrawRepository;
    private final UserRepository userRepository;
    private final SemenInventoryService semenInventoryService;

    /** Average cattle gestation period in days */
    private static final int GESTATION_DAYS = 282;

    /**
     * Step 1: Validate breed compatibility before insemination.
     * Must be called and pass before confirm() is allowed.
     */
    public BreedValidationResponse validateBreeding(BreedValidationRequest request) {
        Cow cow = cowRepository.findById(request.getCowId())
                .orElseThrow(() -> new ResourceNotFoundException("Cow", "id", request.getCowId()));

        SemenStraw straw = semenStrawRepository.findById(request.getSemenStrawId())
                .orElseThrow(() -> new ResourceNotFoundException("SemenStraw", "id", request.getSemenStrawId()));

        return compatibilityEngine.validate(cow.getBreed(), straw.getBreed(), request.getBreedingGoal());
    }

    /** Alias used by BreedingController */
    public BreedValidationResponse validateBreed(BreedValidationRequest request) {
        return validateBreeding(request);
    }

    /**
     * Step 2: Confirm insemination — only allowed after validate() returns MATCH or OVERRIDE.
     * Decrements straw stock atomically and creates the breeding record.
     */
    @Transactional
    public BreedingRecord confirmBreeding(BreedingConfirmRequest request) {
        Cow cow = cowRepository.findById(request.getCowId())
                .orElseThrow(() -> new ResourceNotFoundException("Cow", "id", request.getCowId()));

        SemenStraw straw = semenStrawRepository.findById(request.getSemenStrawId())
                .orElseThrow(() -> new ResourceNotFoundException("SemenStraw", "id", request.getSemenStrawId()));

        User technician = userRepository.findById(request.getTechnicianId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getTechnicianId()));

        // Re-validate before confirming (safety check)
        BreedValidationResponse validation = compatibilityEngine.validate(
                cow.getBreed(), straw.getBreed(), "GENERAL");

        CompatibilityStatus finalStatus = request.getCompatibilityStatus();
        if (finalStatus == null) {
            finalStatus = validation.getStatus();
        }

        // Block if BLOCKED and no override reason provided
        if (finalStatus == CompatibilityStatus.BLOCKED) {
            throw new BreedMismatchException(cow.getBreed().getDisplayName(), straw.getBreed().getDisplayName());
        }

        if (finalStatus == CompatibilityStatus.OVERRIDE && (request.getOverrideReason() == null || request.getOverrideReason().isBlank())) {
            throw new IllegalArgumentException("Override reason is required when overriding a breed mismatch.");
        }

        // Decrement straw stock atomically (1 straw per insemination)
        semenInventoryService.decrementStock(straw.getId(), 1);

        // Create breeding record
        BreedingRecord record = BreedingRecord.builder()
                .cow(cow)
                .semenStraw(straw)
                .technician(technician)
                .inseminationDate(request.getInseminationDate())
                .compatibilityStatus(finalStatus)
                .overrideReason(request.getOverrideReason())
                .outcome(BreedingOutcome.PENDING)
                .expectedCalvingDate(request.getInseminationDate().plusDays(GESTATION_DAYS))
                .build();

        BreedingRecord saved = breedingRecordRepository.save(record);

        log.info("Breeding confirmed: cow={}, straw={}, technician={}, status={}, expectedCalving={}",
                cow.getTagNumber(), straw.getBatchNo(), technician.getFullName(),
                finalStatus, saved.getExpectedCalvingDate());

        return saved;
    }

    /**
     * Get breeding history for a specific cow.
     */
    public Page<BreedingRecord> getBreedingHistory(Long cowId, Pageable pageable) {
        return breedingRecordRepository.findByCowId(cowId, pageable);
    }

    /** Get full cow history (no pagination) */
    public java.util.List<BreedingRecord> getCowHistory(Long cowId) {
        return breedingRecordRepository.findByCowIdOrderByInseminationDateDesc(cowId);
    }

    /** Get all breeding records — paginated */
    public Page<BreedingRecord> findAll(Pageable pageable) {
        return breedingRecordRepository.findAll(pageable);
    }

    /**
     * Update breeding outcome (pregnancy confirmation or failure).
     */
    @Transactional
    public BreedingRecord updateOutcome(Long recordId, BreedingOutcome outcome) {
        BreedingRecord record = breedingRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("BreedingRecord", "id", recordId));

        record.setOutcome(outcome);
        return breedingRecordRepository.save(record);
    }

    /** String-based outcome update used by REST controller */
    @Transactional
    public BreedingRecord updateOutcome(Long recordId, String outcomeStr) {
        BreedingOutcome outcome = BreedingOutcome.valueOf(outcomeStr.toUpperCase());
        return updateOutcome(recordId, outcome);
    }

    /**
     * Get upcoming calvings within the next N days for scheduling reminders.
     */
    public java.util.List<BreedingRecord> getUpcomingCalvings(int daysAhead) {
        LocalDate start = LocalDate.now();
        LocalDate end = start.plusDays(daysAhead);
        return breedingRecordRepository.findUpcomingCalvings(start, end);
    }
}
