package com.rainintel.business.repository;

import com.rainintel.business.entity.AssessmentRainfall;
import com.rainintel.business.entity.FieldAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AssessmentRainfallRepository extends JpaRepository<AssessmentRainfall, Long> {
    Optional<AssessmentRainfall> findByAssessment(FieldAssessment assessment);
}
