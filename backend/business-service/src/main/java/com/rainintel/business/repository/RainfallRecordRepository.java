package com.rainintel.business.repository;

import com.rainintel.business.entity.District;
import com.rainintel.business.entity.RainfallRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RainfallRecordRepository extends JpaRepository<RainfallRecord, Long> {
    List<RainfallRecord> findByDistrict(District district);
    Optional<RainfallRecord> findFirstByDistrictOrderByObservationDateDesc(District district);
}
