package com.rainintel.business.repository;

import com.rainintel.business.entity.District;
import com.rainintel.business.entity.FieldAssessment;
import com.rainintel.business.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FieldAssessmentRepository extends JpaRepository<FieldAssessment, Long> {
    List<FieldAssessment> findByEngineer(User engineer);
    List<FieldAssessment> findByDistrict(District district);
    long countByDistrict_DistrictId(Long districtId);
}
