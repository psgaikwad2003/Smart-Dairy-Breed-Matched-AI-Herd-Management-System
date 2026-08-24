package com.smartdairy.cattle.service;

import com.smartdairy.cattle.entity.Bull;
import com.smartdairy.cattle.entity.SemenStraw;
import com.smartdairy.cattle.repository.BullRepository;
import com.smartdairy.cattle.repository.SemenStrawRepository;
import com.smartdairy.common.enums.CattleBreed;
import com.smartdairy.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BullService {

    private final BullRepository bullRepository;
    private final SemenStrawRepository semenStrawRepository;

    public Page<Bull> getAllBulls(Pageable pageable) {
        return bullRepository.findAll(pageable);
    }

    public Bull getBullById(Long id) {
        return bullRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bull", "id", id));
    }

    public List<Bull> getBullsByBreed(CattleBreed breed) {
        return bullRepository.findByBreed(breed);
    }

    @Transactional
    public Bull createBull(Bull bull) {
        return bullRepository.save(bull);
    }

    @Transactional
    public Bull updateBull(Long id, Bull updated) {
        Bull existing = getBullById(id);
        existing.setName(updated.getName());
        existing.setBreed(updated.getBreed());
        existing.setSourceSemenStation(updated.getSourceSemenStation());
        existing.setBreedingValueJson(updated.getBreedingValueJson());
        existing.setRegistrationNo(updated.getRegistrationNo());
        return bullRepository.save(existing);
    }

    // ---- Semen Straw CRUD ----

    public Page<SemenStraw> getAllStraws(Pageable pageable) {
        return semenStrawRepository.findAll(pageable);
    }

    public SemenStraw getStrawById(Long id) {
        return semenStrawRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SemenStraw", "id", id));
    }

    @Transactional
    public SemenStraw createStraw(SemenStraw straw) {
        return semenStrawRepository.save(straw);
    }

    @Transactional
    public SemenStraw updateStraw(Long id, SemenStraw updated) {
        SemenStraw existing = getStrawById(id);
        existing.setBatchNo(updated.getBatchNo());
        existing.setBreed(updated.getBreed());
        existing.setProductionDate(updated.getProductionDate());
        existing.setExpiryDate(updated.getExpiryDate());
        existing.setSemenStationName(updated.getSemenStationName());
        existing.setStationGrade(updated.getStationGrade());
        return semenStrawRepository.save(existing);
    }
    // ---- Controller-facing API ----

    public List<Bull> findAllBulls() {
        return bullRepository.findAll();
    }

    public List<Bull> findBullsByBreed(CattleBreed breed) {
        return bullRepository.findByBreed(breed);
    }

    @Transactional
    public Bull saveBull(Bull bull) {
        return bullRepository.save(bull);
    }

    public List<SemenStraw> findAllStraws() {
        return semenStrawRepository.findAll();
    }

    @Transactional
    public SemenStraw saveStraw(SemenStraw straw) {
        return semenStrawRepository.save(straw);
    }
}
