package com.rainintel.business.repository;

import com.rainintel.business.entity.FieldAssessment;
import com.rainintel.business.entity.RwhRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import java.util.List;

@Repository
public interface RwhRecommendationRepository extends JpaRepository<RwhRecommendation, Long> {
    List<RwhRecommendation> findByAssessment(FieldAssessment assessment);

    @Query("SELECT AVG(r.confidenceScore) FROM RwhRecommendation r")
    Double avgConfidenceScore();

    @Query("SELECT AVG(r.confidenceScore) FROM RwhRecommendation r WHERE r.assessment.district.districtId = :districtId")
    Double avgConfidenceScoreByDistrictId(@org.springframework.data.repository.query.Param("districtId") Long districtId);
}
