package com.rainintel.business.controller;

import com.rainintel.business.dto.GisLookupResponse;
import com.rainintel.business.entity.SoilGridCell;
import com.rainintel.business.entity.SoilGridData;
import com.rainintel.business.service.GisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/gis")
public class GisController {

    private final GisService gisService;

    public GisController(GisService gisService) {
        this.gisService = gisService;
    }

    @GetMapping("/lookup")
    public ResponseEntity<Map<String, Object>> lookupCoordinates(@RequestParam Double latitude,
                                                                 @RequestParam Double longitude) {
        Optional<GisLookupResponse> lookupOpt = gisService.lookupCoordinates(latitude, longitude);
        if (lookupOpt.isEmpty()) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "Failed to project coordinates or find district boundaries");
            return ResponseEntity.badRequest().body(err);
        }

        GisLookupResponse lookup = lookupOpt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("latitude", lookup.getLatitude());
        response.put("longitude", lookup.getLongitude());
        response.put("xCoordinate", lookup.getxCoordinate());
        response.put("yCoordinate", lookup.getyCoordinate());
        response.put("gridRow", lookup.getGridRow());
        response.put("gridColumn", lookup.getGridColumn());
        response.put("districtName", lookup.getDistrictName());

        // Attach soil data if available
        if (lookup.getGridRow() != null && lookup.getGridColumn() != null) {
            Optional<SoilGridCell> cellOpt = gisService.getGridCell(lookup.getGridRow(), lookup.getGridColumn());
            if (cellOpt.isPresent()) {
                Optional<SoilGridData> soilDataOpt = gisService.getSoilData(cellOpt.get().getGridCellId());
                if (soilDataOpt.isPresent()) {
                    response.put("soilData", soilDataOpt.get());
                }
            }
        }

        return ResponseEntity.ok(response);
    }
}
