package com.smartdairy.cattle.service;

import com.smartdairy.cattle.entity.Cow;
import com.smartdairy.cattle.repository.CowRepository;
import com.smartdairy.common.enums.CowStatus;
import com.smartdairy.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CowService {

    private final CowRepository cowRepository;

    // ---- Controller-facing API ----

    public Page<Cow> findAll(Pageable pageable) {
        return cowRepository.findAll(pageable);
    }

    public Cow findById(Long id) {
        return cowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cow", "id", id));
    }

    public List<Cow> findByFarmerId(Long farmerId) {
        return cowRepository.findByFarmerId(farmerId);
    }

    public List<Cow> findByFarmerAndStatus(Long farmerId, CowStatus status) {
        return cowRepository.findByFarmerIdAndStatus(farmerId, status);
    }

    public Cow findByTagNumber(String tagNumber) {
        return cowRepository.findByTagNumber(tagNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Cow", "tagNumber", tagNumber));
    }

    public java.util.List<Object[]> getBreedDistribution(Long farmerId) {
        return cowRepository.countByBreedForFarmer(farmerId);
    }

    @Transactional
    public Cow save(Cow cow) {
        return cowRepository.save(cow);
    }

    @Transactional
    public Cow updateStatus(Long id, CowStatus status) {
        Cow cow = findById(id);
        cow.setStatus(status);
        return cowRepository.save(cow);
    }

    @Transactional
    public void delete(Long id) {
        if (!cowRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cow", "id", id);
        }
        cowRepository.deleteById(id);
    }

    // ---- Legacy methods (kept for backward compatibility) ----

    public Page<Cow> getCowsByFarmer(Long farmerId, Pageable pageable) {
        return cowRepository.findByFarmerId(farmerId, pageable);
    }

    public Cow getCowById(Long id) { return findById(id); }

    public Cow getCowByTag(String tagNumber) { return findByTagNumber(tagNumber); }

    public List<Cow> getActiveCowsByFarmer(Long farmerId) {
        return cowRepository.findByFarmerIdAndStatus(farmerId, CowStatus.ACTIVE);
    }

    @Transactional
    public Cow createCow(Cow cow) { return cowRepository.save(cow); }

    @Transactional
    public Cow updateCow(Long id, Cow updated) {
        Cow existing = findById(id);
        existing.setTagNumber(updated.getTagNumber());
        existing.setBreed(updated.getBreed());
        existing.setDateOfBirth(updated.getDateOfBirth());
        existing.setLactationCount(updated.getLactationCount());
        existing.setCurrentMilkYieldLitres(updated.getCurrentMilkYieldLitres());
        existing.setStatus(updated.getStatus());
        return cowRepository.save(existing);
    }

    @Transactional
    public void deleteCow(Long id) { delete(id); }
}
