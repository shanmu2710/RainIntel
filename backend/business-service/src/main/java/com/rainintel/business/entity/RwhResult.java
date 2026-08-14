package com.rainintel.business.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.JdbcTypeCode;

@Entity
@Table(name = "RWH_RESULTS")
public class RwhResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RESULT_ID")
    private Long resultId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ASSESSMENT_ID", nullable = false, unique = true)
    private FieldAssessment assessment;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "ANNUAL_RAINFALL_MM")
    private Double annualRainfallMm;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "RUNOFF_COEFFICIENT")
    private Double runoffCoefficient;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "HARVESTABLE_WATER_L")
    private Double harvestableWaterL;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "RECHARGE_POTENTIAL_L")
    private Double rechargePotentialL;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "RECOMMENDED_STORAGE_L")
    private Double recommendedStorageL;

    @Column(name = "CALCULATION_METHOD", length = 100)
    private String calculationMethod;

    @Column(name = "CALCULATED_AT", nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT SYSTIMESTAMP")
    private LocalDateTime calculatedAt;

    public RwhResult() {}

    public Long getResultId() {
        return resultId;
    }

    public void setResultId(Long resultId) {
        this.resultId = resultId;
    }

    public FieldAssessment getAssessment() {
        return assessment;
    }

    public void setAssessment(FieldAssessment assessment) {
        this.assessment = assessment;
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

    public Double getHarvestableWaterL() {
        return harvestableWaterL;
    }

    public void setHarvestableWaterL(Double harvestableWaterL) {
        this.harvestableWaterL = harvestableWaterL;
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

    public String getCalculationMethod() {
        return calculationMethod;
    }

    public void setCalculationMethod(String calculationMethod) {
        this.calculationMethod = calculationMethod;
    }

    public LocalDateTime getCalculatedAt() {
        return calculatedAt;
    }

    public void setCalculatedAt(LocalDateTime calculatedAt) {
        this.calculatedAt = calculatedAt;
    }
}
