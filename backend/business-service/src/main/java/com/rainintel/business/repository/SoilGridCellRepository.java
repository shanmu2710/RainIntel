package com.rainintel.business.repository;

import com.rainintel.business.entity.SoilGridCell;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SoilGridCellRepository extends JpaRepository<SoilGridCell, Long> {
    Optional<SoilGridCell> findByGridRowAndGridColumn(Integer gridRow, Integer gridColumn);
}
