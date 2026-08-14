package com.rainintel.business.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;

@Entity
@Table(name = "SOIL_GRID_CELLS")
public class SoilGridCell {

    @Id
    @Column(name = "GRID_CELL_ID")
    private Long gridCellId;

    @Column(name = "GRID_ROW", nullable = false)
    private Integer gridRow;

    @Column(name = "GRID_COLUMN", nullable = false)
    private Integer gridColumn;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "X_COORDINATE", nullable = false)
    private Double xCoordinate;

    @JdbcTypeCode(java.sql.Types.NUMERIC)
    @Column(name = "Y_COORDINATE", nullable = false)
    private Double yCoordinate;

    @Column(name = "SOURCE_ID", nullable = false)
    private Long sourceId;

    public SoilGridCell() {}

    public Long getGridCellId() {
        return gridCellId;
    }

    public void setGridCellId(Long gridCellId) {
        this.gridCellId = gridCellId;
    }

    public Integer getGridRow() {
        return gridRow;
    }

    public void setGridRow(Integer gridRow) {
        this.gridRow = gridRow;
    }

    public Integer getGridColumn() {
        return gridColumn;
    }

    public void setGridColumn(Integer gridColumn) {
        this.gridColumn = gridColumn;
    }

    public Double getxCoordinate() {
        return xCoordinate;
    }

    public void setxCoordinate(Double xCoordinate) {
        this.xCoordinate = xCoordinate;
    }

    public Double getyCoordinate() {
        return yCoordinate;
    }

    public void setyCoordinate(Double yCoordinate) {
        this.yCoordinate = yCoordinate;
    }

    public Long getSourceId() {
        return sourceId;
    }

    public void setSourceId(Long sourceId) {
        this.sourceId = sourceId;
    }
}
