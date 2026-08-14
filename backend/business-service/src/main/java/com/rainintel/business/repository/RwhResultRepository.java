package com.rainintel.business.repository;

import com.rainintel.business.entity.FieldAssessment;
import com.rainintel.business.entity.RwhResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

@Repository
public interface RwhResultRepository extends JpaRepository<RwhResult, Long> {
    Optional<RwhResult> findByAssessment(FieldAssessment assessment);

    @Query("SELECT SUM(r.harvestableWaterL) FROM RwhResult r")
    Double sumHarvestableWater();

    @Query("SELECT r.assessment.district.districtName, COUNT(r), SUM(r.harvestableWaterL) FROM RwhResult r GROUP BY r.assessment.district.districtName ORDER BY SUM(r.harvestableWaterL) DESC")
    List<Object[]> getDistrictRanking();

    @Query("SELECT SUM(r.harvestableWaterL) FROM RwhResult r WHERE r.assessment.district.districtId = :districtId")
    Double sumHarvestableWaterByDistrictId(@org.springframework.data.repository.query.Param("districtId") Long districtId);

    @Query("SELECT r.assessment.district.districtName, COUNT(r), SUM(r.harvestableWaterL) FROM RwhResult r WHERE r.assessment.district.districtId = :districtId GROUP BY r.assessment.district.districtName")
    List<Object[]> getDistrictRankingByDistrictId(@org.springframework.data.repository.query.Param("districtId") Long districtId);
}
