package com.rainintel.business.service;

import com.rainintel.business.entity.*;
import org.springframework.stereotype.Service;

@Service
public class CalculationService {

    public RwhResult calculateRwh(FieldAssessment assessment, Double annualRainfallMm, AssessmentSoil soil) {
        RwhResult result = new RwhResult();
        result.setAssessment(assessment);
        
        // Annual Rainfall
        double rainfall = annualRainfallMm != null ? annualRainfallMm : 1108.0; // Chennai/Vijayawada average default
        result.setAnnualRainfallMm(rainfall);

        // Runoff Coefficient based on Roof Material
        double runoffCoeff = getRunoffCoefficient(assessment.getRoofMaterial());
        result.setRunoffCoefficient(runoffCoeff);

        // Harvestable Water: Area (m2) * Rainfall (mm) * Runoff Coefficient
        // 1 m2 * 1 mm * coeff = 1 Liter * coeff
        double roofAreaM2 = assessment.getRoofAreaM2() != null ? assessment.getRoofAreaM2() : 0.0;
        double harvestableWaterL = roofAreaM2 * rainfall * runoffCoeff;
        result.setHarvestableWaterL(Math.round(harvestableWaterL * 100.0) / 100.0);

        // Recharge potential calculation based on Soil properties
        double rechargeEfficiency = 0.40; // Default fallback
        if (soil != null) {
            double sandy = soil.getSandyFraction() != null ? soil.getSandyFraction() : 0.0;
            double loamy = soil.getLoamyFraction() != null ? soil.getLoamyFraction() : 0.0;
            double clayey = soil.getClayeyFraction() != null ? soil.getClayeyFraction() : 0.0;

            rechargeEfficiency = (sandy * 0.65) + (loamy * 0.45) + (clayey * 0.15);
            if (rechargeEfficiency <= 0.0) {
                rechargeEfficiency = 0.40;
            }
        }
        double rechargePotentialL = harvestableWaterL * rechargeEfficiency;
        result.setRechargePotentialL(Math.round(rechargePotentialL * 100.0) / 100.0);

        // Recommended Storage (L) based on daily demand and harvestable limits
        double dailyDemandL = assessment.getWaterDemandLpd() != null ? assessment.getWaterDemandLpd() : 500.0;
        double targetStorageL = dailyDemandL * 30.0; // 30 days buffer
        
        // Cap recommended storage at total harvestable water
        double recommendedStorageL = Math.min(targetStorageL, harvestableWaterL);
        // Round to standard tank capacities
        if (recommendedStorageL <= 1000.0) {
            recommendedStorageL = 1000.0;
        } else {
            recommendedStorageL = Math.max(1000.0, Math.round(recommendedStorageL / 5000.0) * 5000.0);
        }
        result.setRecommendedStorageL(recommendedStorageL);
        result.setCalculationMethod("STANDARD_METRIC_HYBRID");

        return result;
    }

    public RwhRecommendation generateRecommendation(FieldAssessment assessment, RwhResult result, AssessmentSoil soil) {
        RwhRecommendation rec = new RwhRecommendation();
        rec.setAssessment(assessment);

        double dailyDemandL = assessment.getWaterDemandLpd() != null ? assessment.getWaterDemandLpd() : 500.0;
        double annualDemandL = dailyDemandL * 365.0;
        double harvestableL = result.getHarvestableWaterL();

        // 1. System Type
        String systemType;
        if (annualDemandL < harvestableL * 0.5) {
            systemType = "Rooftop Storage System";
        } else if (annualDemandL > harvestableL * 1.5) {
            systemType = "Rooftop Recharge System";
        } else {
            systemType = "Hybrid Storage + Recharge";
        }
        rec.setSystemType(systemType);
        rec.setStorageCapacityL(result.getRecommendedStorageL());

        // 2. Recharge Type
        double sandy = 0.0, clayey = 0.0;
        if (soil != null) {
            sandy = soil.getSandyFraction() != null ? soil.getSandyFraction() : 0.0;
            clayey = soil.getClayeyFraction() != null ? soil.getClayeyFraction() : 0.0;
        }
        String rechargeType;
        if (sandy > 0.5) {
            rechargeType = "Recharge Pit (Rapid Infiltration)";
        } else if (clayey > 0.4) {
            rechargeType = "Recharge Shaft (Deep Clay Penetration)";
        } else {
            rechargeType = "Filter Bed Recharge Pit";
        }
        rec.setRechargeType(rechargeType);

        // 3. Filter Type
        String mat = assessment.getRoofMaterial() != null ? assessment.getRoofMaterial().toLowerCase() : "";
        String filterType;
        if (mat.contains("concrete") || mat.contains("rcc")) {
            filterType = "Dual Media Sand-Gravel Filter";
        } else if (mat.contains("metal") || mat.contains("sheet") || mat.contains("gi")) {
            filterType = "First-Flush + Pop-up Filter";
        } else {
            filterType = "Multi-stage Carbon Filter";
        }
        rec.setFilterType(filterType);

        // 4. Confidence Score
        double confidence = 96.0;
        if (soil == null) {
            confidence -= 8.0;
        }
        rec.setConfidenceScore(confidence);

        // 5. Reason
        String materialText = assessment.getRoofMaterial() != null ? assessment.getRoofMaterial() : "RCC";
        String reason = String.format("Optimized for %s roof with %.0f%% runoff efficiency. recommended storage tank matches 30 days water demand, capped by total harvest. Recharge configuration set to %s matching the local soil profile.",
                materialText, result.getRunoffCoefficient() * 100.0, rechargeType);
        rec.setRecommendationReason(reason);

        return rec;
    }

    private double getRunoffCoefficient(String material) {
        if (material == null) return 0.80;
        String mat = material.toLowerCase();
        if (mat.contains("concrete") || mat.contains("rcc")) {
            return 0.85;
        } else if (mat.contains("tile")) {
            return 0.80;
        } else if (mat.contains("metal") || mat.contains("sheet") || mat.contains("gi")) {
            return 0.90;
        } else if (mat.contains("gravel") || mat.contains("soil")) {
            return 0.25;
        }
        return 0.80;
    }
}
