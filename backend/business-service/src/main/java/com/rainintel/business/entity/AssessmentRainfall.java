package com.rainintel.business.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.hibernate.annotations.JdbcTypeCode;

@Entity
@Table(name = "ASSESSMENT_RAINFALL")
public class AssessmentRainfall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ASSESSMENT_RAINFALL_ID")
    private Long assessmentRainfallId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ASSESSMENT_ID", nullable = false, unique = true)
    private FieldAssessment assessment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RAINFALL_RECORD_ID")
    private RainfallRecord rainfallRecord;

    @Column(name = "OBSERVATION_DATE")
    private LocalDate observationDate;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "ACTUAL_MM")
    private Double actualMm;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "NORMAL_MM")
    private Double normalMm;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "DEPARTURE_PERCENT")
    private Double departurePercent;

    @Column(name = "CATEGORY", length = 50)
    private String category;

    @Column(name = "CREATED_AT", nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT SYSTIMESTAMP")
    private LocalDateTime createdAt;

    public AssessmentRainfall() {}

    public Long getAssessmentRainfallId() {
        return assessmentRainfallId;
    }

    public void setAssessmentRainfallId(Long assessmentRainfallId) {
        this.assessmentRainfallId = assessmentRainfallId;
    }

    public FieldAssessment getAssessment() {
        return assessment;
    }

    public void setAssessment(FieldAssessment assessment) {
        this.assessment = assessment;
    }

    public RainfallRecord getRainfallRecord() {
        return rainfallRecord;
    }

    public void setRainfallRecord(RainfallRecord rainfallRecord) {
        this.rainfallRecord = rainfallRecord;
    }

    public LocalDate getObservationDate() {
        return observationDate;
    }

    public void setObservationDate(LocalDate observationDate) {
        this.observationDate = observationDate;
    }

    public Double getActualMm() {
        return actualMm;
    }

    public void setActualMm(Double actualMm) {
        this.actualMm = actualMm;
    }

    public Double getNormalMm() {
        return normalMm;
    }

    public void setNormalMm(Double normalMm) {
        this.normalMm = normalMm;
    }

    public Double getDeparturePercent() {
        return departurePercent;
    }

    public void setDeparturePercent(Double departurePercent) {
        this.departurePercent = departurePercent;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
