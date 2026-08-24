package com.smartdairy.analytics.service;

import com.smartdairy.analytics.entity.MilkYieldLog;
import com.smartdairy.analytics.repository.MilkYieldLogRepository;
import com.smartdairy.cattle.entity.Cow;
import com.smartdairy.cattle.repository.CowRepository;
import com.smartdairy.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MilkYieldService {

    private final MilkYieldLogRepository milkYieldLogRepository;
    private final CowRepository cowRepository;

    /**
     * Log a milk yield entry (morning or evening session).
     */
    @Transactional
    public MilkYieldLog logYield(MilkYieldLog yieldLog) {
        MilkYieldLog saved = milkYieldLogRepository.save(yieldLog);

        // Update cow's current yield (daily total for last recorded day)
        BigDecimal dailyTotal = milkYieldLogRepository.getDailyTotal(
                yieldLog.getCow().getId(), yieldLog.getDate());
        if (dailyTotal != null) {
            Cow cow = cowRepository.findById(yieldLog.getCow().getId()).orElse(null);
            if (cow != null) {
                cow.setCurrentMilkYieldLitres(dailyTotal);
                cowRepository.save(cow);
            }
        }

        return saved;
    }

    /**
     * Get yield history for a cow (ordered by date desc).
     */
    public List<MilkYieldLog> getYieldHistory(Long cowId) {
        return milkYieldLogRepository.findByCowIdOrderByDateDescSessionDesc(cowId);
    }

    /**
     * Get yield trend data for a cow over a date range — for charting.
     */
    public List<MilkYieldLog> getYieldTrend(Long cowId, LocalDate startDate, LocalDate endDate) {
        return milkYieldLogRepository.findByCowIdAndDateBetween(cowId, startDate, endDate);
    }

    /**
     * Get average yield for a cow over the last N days.
     */
    public BigDecimal getAverageYield(Long cowId, int days) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(days);
        BigDecimal avg = milkYieldLogRepository.getAverageYield(cowId, start, end);
        return avg != null ? avg : BigDecimal.ZERO;
    }

    /**
     * Get breed-wise average yield for a farmer's herd — answers
     * "which breed produces the best yield on my farm?"
     */
    public List<Map<String, Object>> getBreedWiseYield(Long farmerId) {
        List<Object[]> results = milkYieldLogRepository.getAverageYieldByBreed(farmerId);
        return results.stream().map(row -> {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("breed", row[0].toString());
            entry.put("averageYieldLitres", row[1]);
            return entry;
        }).collect(Collectors.toList());
    }

    // ---- Controller-facing aliases ----

    public List<MilkYieldLog> getCowYieldHistory(Long cowId) {
        return getYieldHistory(cowId);
    }

    public List<Object[]> getDailyYieldTrend(Long cowId, LocalDate from, LocalDate to) {
        return milkYieldLogRepository.getDailyTotals(cowId, from, to);
    }

    public List<Object[]> getBreedWiseAverage(Long farmerId) {
        return milkYieldLogRepository.getAverageYieldByBreed(farmerId);
    }
}
