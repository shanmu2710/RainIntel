package com.rainintel.business.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "RAINFALL_DISTRICTS")
public class District {

    @Id
    @Column(name = "DISTRICT_ID")
    private Long districtId;

    @Column(name = "DISTRICT_NAME", nullable = false, length = 150)
    private String districtName;

    @Column(name = "STATE_NAME", length = 150)
    private String stateName;

    public District() {}

    public Long getDistrictId() {
        return districtId;
    }

    public void setDistrictId(Long districtId) {
        this.districtId = districtId;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }

    public String getStateName() {
        return stateName;
    }

    public void setStateName(String stateName) {
        this.stateName = stateName;
    }
}
