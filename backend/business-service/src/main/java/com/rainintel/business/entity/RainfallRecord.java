package com.rainintel.business.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import org.hibernate.annotations.JdbcTypeCode;

@Entity
@Table(name = "RAINFALL_RECORDS")
public class RainfallRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RAINFALL_ID")
    private Long rainfallId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DISTRICT_ID", nullable = false)
    private District district;

    @Column(name = "OBSERVATION_DATE", nullable = false)
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

    @Column(name = "SOURCE_ID", nullable = false)
    private Long sourceId;

    public RainfallRecord() {}

    public Long getRainfallId() {
        return rainfallId;
    }

    public void setRainfallId(Long rainfallId) {
        this.rainfallId = rainfallId;
    }

    public District getDistrict() {
        return district;
    }

    public void setDistrict(District district) {
        this.district = district;
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

    public Long getSourceId() {
        return sourceId;
    }

    public void setSourceId(Long sourceId) {
        this.sourceId = sourceId;
    }
}
