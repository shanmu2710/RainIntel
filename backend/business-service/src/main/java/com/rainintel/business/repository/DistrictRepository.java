package com.rainintel.business.repository;

import com.rainintel.business.entity.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DistrictRepository extends JpaRepository<District, Long> {
    Optional<District> findByDistrictNameIgnoreCase(String districtName);
}
