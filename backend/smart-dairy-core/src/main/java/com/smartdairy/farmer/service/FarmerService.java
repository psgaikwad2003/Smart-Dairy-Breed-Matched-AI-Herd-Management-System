package com.smartdairy.farmer.service;

import com.smartdairy.common.exception.ResourceNotFoundException;
import com.smartdairy.farmer.entity.Farmer;
import com.smartdairy.farmer.repository.FarmerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FarmerService {

    private final FarmerRepository farmerRepository;

    // ---- Controller-facing API ----

    public java.util.List<Farmer> findAll() {
        return farmerRepository.findAll();
    }

    public Farmer findById(Long id) {
        return farmerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer", "id", id));
    }

    @Transactional
    public Farmer save(Farmer farmer) {
        if (farmer.getId() == null && farmerRepository.existsByPhone(farmer.getPhone())) {
            throw new IllegalArgumentException("Farmer with phone " + farmer.getPhone() + " already exists.");
        }
        return farmerRepository.save(farmer);
    }

    @Transactional
    public void delete(Long id) {
        if (!farmerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Farmer", "id", id);
        }
        farmerRepository.deleteById(id);
    }

    // ---- Legacy methods ----

    public Page<Farmer> getAllFarmers(Pageable pageable) {
        return farmerRepository.findAll(pageable);
    }

    public Farmer getFarmerById(Long id) { return findById(id); }

    @Transactional
    public Farmer createFarmer(Farmer farmer) { return save(farmer); }

    @Transactional
    public Farmer updateFarmer(Long id, Farmer updated) {
        Farmer existing = findById(id);
        existing.setName(updated.getName());
        existing.setPhone(updated.getPhone());
        existing.setVillage(updated.getVillage());
        existing.setDistrict(updated.getDistrict());
        existing.setState(updated.getState());
        existing.setLatitude(updated.getLatitude());
        existing.setLongitude(updated.getLongitude());
        return farmerRepository.save(existing);
    }

    @Transactional
    public void deleteFarmer(Long id) { delete(id); }
}
