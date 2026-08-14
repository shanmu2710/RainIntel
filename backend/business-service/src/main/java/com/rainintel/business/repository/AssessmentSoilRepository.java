package com.rainintel.business.repository;

import com.rainintel.business.entity.AssessmentSoil;
import com.rainintel.business.entity.FieldAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AssessmentSoilRepository extends JpaRepository<AssessmentSoil, Long> {
    Optional<AssessmentSoil> findByAssessment(FieldAssessment assessment);
}
