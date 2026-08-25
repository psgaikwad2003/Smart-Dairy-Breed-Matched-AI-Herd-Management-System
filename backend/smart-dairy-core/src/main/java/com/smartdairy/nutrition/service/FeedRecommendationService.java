package com.smartdairy.nutrition.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

/**
 * ICAR & NDDB Standard Nutritional Feed Ration Calculator Service
 */
@Service
public class FeedRecommendationService {

    public Map<String, Object> calculateRation(double bodyWeightKg, double milkYieldLitres, double fatPct) {
        double maintenanceDM = bodyWeightKg * 0.02;
        double productionDM  = milkYieldLitres * 0.4;
        double totalDryMatter = maintenanceDM + productionDM;

        double greenFodderKg = Math.round(totalDryMatter * 1.8);
        double dryFodderKg   = Math.round(totalDryMatter * 0.6);
        double concentrateKg = Math.round((productionDM + 1.2) * 10.0) / 10.0;

        Map<String, Object> response = new HashMap<>();
        response.put("bodyWeightKg", bodyWeightKg);
        response.put("milkYieldLitres", milkYieldLitres);
        response.put("totalDryMatterKg", Math.round(totalDryMatter * 10.0) / 10.0);
        response.put("recommendedGreenFodderKg", greenFodderKg);
        response.put("recommendedDryFodderKg", dryFodderKg);
        response.put("recommendedConcentrateKg", concentrateKg);
        return response;
    }
}
