package com.rainintel.business.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.JdbcTypeCode;

@Entity
@Table(name = "RWH_RECOMMENDATIONS")
public class RwhRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RECOMMENDATION_ID")
    private Long recommendationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ASSESSMENT_ID", nullable = false)
    private FieldAssessment assessment;

    @Column(name = "SYSTEM_TYPE", length = 150)
    private String systemType;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "STORAGE_CAPACITY_L")
    private Double storageCapacityL;

    @Column(name = "RECHARGE_TYPE", length = 150)
    private String rechargeType;

    @Column(name = "FILTER_TYPE", length = 150)
    private String filterType;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "CONFIDENCE_SCORE")
    private Double confidenceScore;

    @Column(name = "RECOMMENDATION_REASON", length = 1000)
    private String recommendationReason;

    @Column(name = "CREATED_AT", nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT SYSTIMESTAMP")
    private LocalDateTime createdAt;

    public RwhRecommendation() {}

    public Long getRecommendationId() {
        return recommendationId;
    }

    public void setRecommendationId(Long recommendationId) {
        this.recommendationId = recommendationId;
    }

    public FieldAssessment getAssessment() {
        return assessment;
    }

    public void setAssessment(FieldAssessment assessment) {
        this.assessment = assessment;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
