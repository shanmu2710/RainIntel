package com.rainintel.business.dto;

public class GisLookupResponse {

    private Double latitude;
    private Double longitude;
    private Double xCoordinate;
    private Double yCoordinate;
    private Integer gridRow;
    private Integer gridColumn;
    private String districtName;

    public GisLookupResponse() {}

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
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

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }
}
