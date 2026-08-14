package com.rainintel.business.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rainintel.business.dto.GisLookupResponse;
import com.rainintel.business.entity.District;
import com.rainintel.business.entity.SoilGridCell;
import com.rainintel.business.entity.SoilGridData;
import com.rainintel.business.repository.DistrictRepository;
import com.rainintel.business.repository.SoilGridCellRepository;
import com.rainintel.business.repository.SoilGridDataRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Optional;

@Service
public class GisService {

    private static final Logger logger = LoggerFactory.getLogger(GisService.class);

    private final DistrictRepository districtRepository;
    private final SoilGridCellRepository soilGridCellRepository;
    private final SoilGridDataRepository soilGridDataRepository;
    private final ObjectMapper objectMapper;

    @Value("${rainintel.gis.script-path:C:/Users/Public/Downloads/RainIntel/gis/gis_bridge.py}")
    private String scriptPath;

    public GisService(DistrictRepository districtRepository,
                      SoilGridCellRepository soilGridCellRepository,
                      SoilGridDataRepository soilGridDataRepository,
                      ObjectMapper objectMapper) {
        this.districtRepository = districtRepository;
        this.soilGridCellRepository = soilGridCellRepository;
        this.soilGridDataRepository = soilGridDataRepository;
        this.objectMapper = objectMapper;
    }

    public Optional<GisLookupResponse> lookupCoordinates(double latitude, double longitude) {
        try {
            logger.info("Executing GIS coordinate lookup for lat={}, lng={}", latitude, longitude);
            ProcessBuilder pb = new ProcessBuilder(
                    "python",
                    scriptPath,
                    String.valueOf(latitude),
                    String.valueOf(longitude)
            );
            pb.redirectErrorStream(true);
            Process process = pb.start();

            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line);
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                logger.error("Python GIS bridge script failed with exit code: {}. Output: {}", exitCode, output);
                return Optional.empty();
            }

            String jsonOutput = output.toString().trim();
            logger.info("GIS bridge script completed successfully. Raw output: {}", jsonOutput);

            GisLookupResponse response = objectMapper.readValue(jsonOutput, GisLookupResponse.class);
            return Optional.of(response);

        } catch (Exception e) {
            logger.error("Error invoking GIS bridge script", e);
            return Optional.empty();
        }
    }

    public Optional<District> getDistrictForName(String districtName) {
        if (districtName == null) {
            return Optional.empty();
        }
        return districtRepository.findByDistrictNameIgnoreCase(districtName.trim());
    }

    public Optional<SoilGridCell> getGridCell(int row, int col) {
        return soilGridCellRepository.findByGridRowAndGridColumn(row, col);
    }

    public Optional<SoilGridData> getSoilData(Long gridCellId) {
        if (gridCellId == null) {
            return Optional.empty();
        }
        return soilGridDataRepository.findById(gridCellId);
    }
}
