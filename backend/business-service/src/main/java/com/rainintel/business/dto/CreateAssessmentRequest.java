package com.rainintel.business.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateAssessmentRequest {

    @NotBlank(message = "Building name is required")
    private String buildingName;

    @NotBlank(message = "Building type is required")
    private String buildingType;

    private String address;
    private String districtName;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotNull(message = "Roof area is required")
    private Double roofAreaSqFt;

    private String roofMaterial;
    private Double roofSlope;
    private Double waterDemandLpd;
    private String purpose;

    public CreateAssessmentRequest() {}

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

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
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

    public Double getRoofSlope() {
        return roofSlope;
    }

    public void setRoofSlope(Double roofSlope) {
        this.roofSlope = roofSlope;
    }

    public Double getWaterDemandLpd() {
        return waterDemandLpd;
    }

    public void setWaterDemandLpd(Double waterDemandLpd) {
        this.waterDemandLpd = waterDemandLpd;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }
}
