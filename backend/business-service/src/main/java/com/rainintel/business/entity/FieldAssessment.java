package com.rainintel.business.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.JdbcTypeCode;

@Entity
@Table(name = "FIELD_ASSESSMENTS")
public class FieldAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ASSESSMENT_ID")
    private Long assessmentId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ENGINEER_ID", nullable = false)
    private User engineer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DISTRICT_ID", nullable = false)
    private District district;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "LATITUDE", nullable = false)
    private Double latitude;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "LONGITUDE", nullable = false)
    private Double longitude;

    @Column(name = "ADDRESS", length = 500)
    private String address;

    @Column(name = "BUILDING_TYPE", length = 100)
    private String buildingType;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "ROOF_AREA_M2")
    private Double roofAreaM2;

    @Column(name = "ROOF_MATERIAL", length = 100)
    private String roofMaterial;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "ROOF_SLOPE")
    private Double roofSlope;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "WATER_DEMAND_LPD")
    private Double waterDemandLpd;

    @Column(name = "PURPOSE", length = 200)
    private String purpose;

    @Column(name = "STATUS", nullable = false, length = 30)
    private String status = "DRAFT";

    @Column(name = "CREATED_AT", nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT SYSTIMESTAMP")
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT", nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT SYSTIMESTAMP")
    private LocalDateTime updatedAt;

    public FieldAssessment() {}

    public Long getAssessmentId() {
        return assessmentId;
    }

    public void setAssessmentId(Long assessmentId) {
        this.assessmentId = assessmentId;
    }

    public User getEngineer() {
        return engineer;
    }

    public void setEngineer(User engineer) {
        this.engineer = engineer;
    }

    public District getDistrict() {
        return district;
    }

    public void setDistrict(District district) {
        this.district = district;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getBuildingType() {
        return buildingType;
    }

    public void setBuildingType(String buildingType) {
        this.buildingType = buildingType;
    }

    public Double getRoofAreaM2() {
        return roofAreaM2;
    }

    public void setRoofAreaM2(Double roofAreaM2) {
        this.roofAreaM2 = roofAreaM2;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
