package com.rainintel.business.dto;

import java.time.LocalDateTime;

public class AssessmentDetailResponse {

    private Long assessmentId;
    private String buildingName;
    private String buildingType;
    private String address;
    private Double latitude;
    private Double longitude;
    private Double roofAreaSqFt;
    private String roofMaterial;
    private Double waterDemandLpd;
    private String status;
    private LocalDateTime createdAt;

    // Calculations
    private Double annualRainfallMm;
    private Double runoffCoefficient;
    private Double harvestPotentialL;
    private Double rechargePotentialL;
    private Double recommendedStorageL;

    // Recommendations
    private String systemType;
    private Double storageCapacityL;
    private String rechargeType;
    private String filterType;
    private Double confidenceScore;
    private String recommendationReason;

    public AssessmentDetailResponse() {}

    public Long getAssessmentId() {
        return assessmentId;
    }

    public void setAssessmentId(Long assessmentId) {
        this.assessmentId = assessmentId;
    }

    public String getBuildingName() {
        return buildingName;
    }

    public void setBuildingName(String buildingName) {
        this.buildingName = buildingName;
    }

    public String getBuildingType() {
        return buildingType;
    }

    public void setBuildingType(String buildingType) {
        this.buildingType = buildingType;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getRoofAreaSqFt() {
        return roofAreaSqFt;
    }

    public void setRoofAreaSqFt(Double roofAreaSqFt) {
        this.roofAreaSqFt = roofAreaSqFt;
    }

    public String getRoofMaterial() {
        return roofMaterial;
    }

    public void setRoofMaterial(String roofMaterial) {
        this.roofMaterial = roofMaterial;
    }

    public Double getWaterDemandLpd() {
        return waterDemandLpd;
    }

    public void setWaterDemandLpd(Double waterDemandLpd) {
        this.waterDemandLpd = waterDemandLpd;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Double getAnnualRainfallMm() {
        return annualRainfallMm;
    }

    public void setAnnualRainfallMm(Double annualRainfallMm) {
        this.annualRainfallMm = annualRainfallMm;
    }

    public Double getRunoffCoefficient() {
        return runoffCoefficient;
    }

    public void setRunoffCoefficient(Double runoffCoefficient) {
        this.runoffCoefficient = runoffCoefficient;
    }

    public Double getHarvestPotentialL() {
        return harvestPotentialL;
    }

    public void setHarvestPotentialL(Double harvestPotentialL) {
        this.harvestPotentialL = harvestPotentialL;
    }

    public Double getRechargePotentialL() {
        return rechargePotentialL;
    }

    public void setRechargePotentialL(Double rechargePotentialL) {
        this.rechargePotentialL = rechargePotentialL;
    }

    public Double getRecommendedStorageL() {
        return recommendedStorageL;
    }

    public void setRecommendedStorageL(Double recommendedStorageL) {
        this.recommendedStorageL = recommendedStorageL;
    }

    public String getSystemType() {
        return systemType;
    }

    public void setSystemType(String systemType) {
        this.systemType = systemType;
    }

    public Double getStorageCapacityL() {
        return storageCapacityL;
    }

    public void setStorageCapacityL(Double storageCapacityL) {
        this.storageCapacityL = storageCapacityL;
    }

    public String getRechargeType() {
        return rechargeType;
    }

    public void setRechargeType(String rechargeType) {
        this.rechargeType = rechargeType;
    }

    public String getFilterType() {
        return filterType;
    }

    public void setFilterType(String filterType) {
        this.filterType = filterType;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public String getRecommendationReason() {
        return recommendationReason;
    }

    public void setRecommendationReason(String recommendationReason) {
        this.recommendationReason = recommendationReason;
    }
}
