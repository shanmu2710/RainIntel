package com.rainintel.business.repository;

import com.rainintel.business.entity.SoilGridData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SoilGridDataRepository extends JpaRepository<SoilGridData, Long> {
}
