package com.rainintel.business.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.JdbcTypeCode;

@Entity
@Table(name = "ASSESSMENT_SOIL")
public class AssessmentSoil {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ASSESSMENT_SOIL_ID")
    private Long assessmentSoilId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ASSESSMENT_ID", nullable = false, unique = true)
    private FieldAssessment assessment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "GRID_CELL_ID")
    private SoilGridCell soilGridCell;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "SANDY_FRACTION")
    private Double sandyFraction;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "LOAMY_FRACTION")
    private Double loamyFraction;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "CLAYEY_FRACTION")
    private Double clayeyFraction;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "CLAYEY_SKELETAL_FRACTION")
    private Double clayeySkeletalFraction;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "DEPTH_0_25_FRACTION")
    private Double depth025Fraction;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "DEPTH_25_50_FRACTION")
    private Double depth2550Fraction;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "DEPTH_50_75_FRACTION")
    private Double depth5075Fraction;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "DEPTH_75_100_FRACTION")
    private Double depth75100Fraction;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "DEPTH_100_150_FRACTION")
    private Double depth100150Fraction;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "DEPTH_150_200_FRACTION")
    private Double depth150200Fraction;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "ORGANIC_CARBON_KG_M2")
    private Double organicCarbonKgM2;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "INORGANIC_CARBON_KG_M2")
    private Double inorganicCarbonKgM2;

    @Column(name = "CREATED_AT", nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT SYSTIMESTAMP")
    private LocalDateTime createdAt;

    public AssessmentSoil() {}

    public Long getAssessmentSoilId() {
        return assessmentSoilId;
    }

    public void setAssessmentSoilId(Long assessmentSoilId) {
        this.assessmentSoilId = assessmentSoilId;
    }

    public FieldAssessment getAssessment() {
        return assessment;
    }

    public void setAssessment(FieldAssessment assessment) {
        this.assessment = assessment;
    }

    public SoilGridCell getSoilGridCell() {
        return soilGridCell;
    }

    public void setSoilGridCell(SoilGridCell soilGridCell) {
        this.soilGridCell = soilGridCell;
    }

    public Double getSandyFraction() {
        return sandyFraction;
    }

    public void setSandyFraction(Double sandyFraction) {
        this.sandyFraction = sandyFraction;
    }

    public Double getLoamyFraction() {
        return loamyFraction;
    }

    public void setLoamyFraction(Double loamyFraction) {
        this.loamyFraction = loamyFraction;
    }

    public Double getClayeyFraction() {
        return clayeyFraction;
    }

    public void setClayeyFraction(Double clayeyFraction) {
        this.clayeyFraction = clayeyFraction;
    }

    public Double getClayeySkeletalFraction() {
        return clayeySkeletalFraction;
    }

    public void setClayeySkeletalFraction(Double clayeySkeletalFraction) {
        this.clayeySkeletalFraction = clayeySkeletalFraction;
    }

    public Double getDepth025Fraction() {
        return depth025Fraction;
    }

    public void setDepth025Fraction(Double depth025Fraction) {
        this.depth025Fraction = depth025Fraction;
    }

    public Double getDepth2550Fraction() {
        return depth2550Fraction;
    }

    public void setDepth2550Fraction(Double depth2550Fraction) {
        this.depth2550Fraction = depth2550Fraction;
    }

    public Double getDepth5075Fraction() {
        return depth5075Fraction;
    }

    public void setDepth5075Fraction(Double depth5075Fraction) {
        this.depth5075Fraction = depth5075Fraction;
    }

    public Double getDepth75100Fraction() {
        return depth75100Fraction;
    }

    public void setDepth75100Fraction(Double depth75100Fraction) {
        this.depth75100Fraction = depth75100Fraction;
    }

    public Double getDepth100150Fraction() {
        return depth100150Fraction;
    }

    public void setDepth100150Fraction(Double depth100150Fraction) {
        this.depth100150Fraction = depth100150Fraction;
    }

    public Double getDepth150200Fraction() {
        return depth150200Fraction;
    }

    public void setDepth150200Fraction(Double depth150200Fraction) {
        this.depth150200Fraction = depth150200Fraction;
    }

    public Double getOrganicCarbonKgM2() {
        return organicCarbonKgM2;
    }

    public void setOrganicCarbonKgM2(Double organicCarbonKgM2) {
        this.organicCarbonKgM2 = organicCarbonKgM2;
    }

    public Double getInorganicCarbonKgM2() {
        return inorganicCarbonKgM2;
    }

    public void setInorganicCarbonKgM2(Double inorganicCarbonKgM2) {
        this.inorganicCarbonKgM2 = inorganicCarbonKgM2;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
