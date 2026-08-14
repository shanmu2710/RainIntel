package com.rainintel.business.service;

import com.rainintel.business.dto.AssessmentDetailResponse;
import com.rainintel.business.dto.CreateAssessmentRequest;
import com.rainintel.business.dto.GisLookupResponse;
import com.rainintel.business.entity.*;
import com.rainintel.business.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AssessmentService {

    private static final Logger logger = LoggerFactory.getLogger(AssessmentService.class);

    private final FieldAssessmentRepository assessmentRepository;
    private final DistrictRepository districtRepository;
    private final UserRepository userRepository;
    private final RainfallRecordRepository rainfallRecordRepository;
    private final SoilGridCellRepository soilGridCellRepository;
    private final SoilGridDataRepository soilGridDataRepository;
    
    private final AssessmentRainfallRepository assessmentRainfallRepository;
    private final AssessmentSoilRepository assessmentSoilRepository;
    private final RwhResultRepository rwhResultRepository;
    private final RwhRecommendationRepository rwhRecommendationRepository;

    private final GisService gisService;
    private final CalculationService calculationService;

    public AssessmentService(FieldAssessmentRepository assessmentRepository,
                             DistrictRepository districtRepository,
                             UserRepository userRepository,
                             RainfallRecordRepository rainfallRecordRepository,
                             SoilGridCellRepository soilGridCellRepository,
                             SoilGridDataRepository soilGridDataRepository,
                             AssessmentRainfallRepository assessmentRainfallRepository,
                             AssessmentSoilRepository assessmentSoilRepository,
                             RwhResultRepository rwhResultRepository,
                             RwhRecommendationRepository rwhRecommendationRepository,
                             GisService gisService,
                             CalculationService calculationService) {
        this.assessmentRepository = assessmentRepository;
        this.districtRepository = districtRepository;
        this.userRepository = userRepository;
        this.rainfallRecordRepository = rainfallRecordRepository;
        this.soilGridCellRepository = soilGridCellRepository;
        this.soilGridDataRepository = soilGridDataRepository;
        this.assessmentRainfallRepository = assessmentRainfallRepository;
        this.assessmentSoilRepository = assessmentSoilRepository;
        this.rwhResultRepository = rwhResultRepository;
        this.rwhRecommendationRepository = rwhRecommendationRepository;
        this.gisService = gisService;
        this.calculationService = calculationService;
    }

    @Transactional
    public AssessmentDetailResponse createAssessment(CreateAssessmentRequest request, String username) {
        logger.info("Creating new assessment for user: {} - Building: {}", username, request.getBuildingName());

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        // 1. GIS Coordinates Lookup
        Optional<GisLookupResponse> gisResult = gisService.lookupCoordinates(request.getLatitude(), request.getLongitude());
        
        String resolvedDistrictName = request.getDistrictName();
        Integer gridRow = null;
        Integer gridCol = null;

        if (gisResult.isPresent()) {
            GisLookupResponse lookup = gisResult.get();
            if (lookup.getDistrictName() != null) {
                resolvedDistrictName = lookup.getDistrictName();
            }
            gridRow = lookup.getGridRow();
            gridCol = lookup.getGridColumn();
        }

        // 2. Resolve District
        if (resolvedDistrictName == null || resolvedDistrictName.trim().isEmpty()) {
            resolvedDistrictName = "Coimbatore"; // default fallback for testing
        }
        
        final String searchName = resolvedDistrictName;
        District district = districtRepository.findByDistrictNameIgnoreCase(searchName)
                .orElseGet(() -> {
                    logger.warn("District not found in DB: '{}'. Fetching any or creating placeholder.", searchName);
                    // Fetch first available district from DB
                    List<District> allDistricts = districtRepository.findAll();
                    if (!allDistricts.isEmpty()) {
                        return allDistricts.get(0);
                    }
                    // Fallback create
                    District placeholder = new District();
                    placeholder.setDistrictId(999L);
                    placeholder.setDistrictName(searchName);
                    placeholder.setStateName("Unknown");
                    return districtRepository.save(placeholder);
                });

        // 3. Convert Area to Sq Meters
        double roofAreaM2 = request.getRoofAreaSqFt() * 0.092903;

        // 4. Save FieldAssessment
        FieldAssessment assessment = new FieldAssessment();
        assessment.setEngineer(user);
        assessment.setDistrict(district);
        assessment.setLatitude(request.getLatitude());
        assessment.setLongitude(request.getLongitude());
        String combinedAddress = request.getBuildingName() + " | " + (request.getAddress() != null ? request.getAddress() : "");
        assessment.setAddress(combinedAddress);
        assessment.setBuildingType(request.getBuildingType());
        assessment.setRoofAreaM2(roofAreaM2);
        assessment.setRoofMaterial(request.getRoofMaterial());
        assessment.setRoofSlope(request.getRoofSlope());
        assessment.setWaterDemandLpd(request.getWaterDemandLpd());
        assessment.setPurpose(request.getPurpose());
        assessment.setStatus("SUBMITTED");

        assessment = assessmentRepository.save(assessment);

        // 5. Rainfall Snapshot
        Optional<RainfallRecord> rainfallRecordOpt = rainfallRecordRepository.findFirstByDistrictOrderByObservationDateDesc(district);
        AssessmentRainfall rainfallSnapshot = new AssessmentRainfall();
        rainfallSnapshot.setAssessment(assessment);
        
        double annualRainfallMm = 1108.0; // average default
        if (rainfallRecordOpt.isPresent()) {
            RainfallRecord record = rainfallRecordOpt.get();
            rainfallSnapshot.setRainfallRecord(record);
            rainfallSnapshot.setObservationDate(record.getObservationDate());
            rainfallSnapshot.setActualMm(record.getActualMm());
            rainfallSnapshot.setNormalMm(record.getNormalMm());
            rainfallSnapshot.setDeparturePercent(record.getDeparturePercent());
            rainfallSnapshot.setCategory(record.getCategory());
            
            if (record.getActualMm() != null && record.getActualMm() > 0) {
                annualRainfallMm = record.getActualMm();
            }
        } else {
            rainfallSnapshot.setObservationDate(LocalDate.now());
            rainfallSnapshot.setActualMm(annualRainfallMm);
            rainfallSnapshot.setNormalMm(annualRainfallMm);
            rainfallSnapshot.setDeparturePercent(0.0);
            rainfallSnapshot.setCategory("N");
        }
        assessmentRainfallRepository.save(rainfallSnapshot);

        // 6. Soil Snapshot
        AssessmentSoil soilSnapshot = null;
        if (gridRow != null && gridCol != null) {
            Optional<SoilGridCell> cellOpt = soilGridCellRepository.findByGridRowAndGridColumn(gridRow, gridCol);
            if (cellOpt.isPresent()) {
                SoilGridCell cell = cellOpt.get();
                Optional<SoilGridData> soilDataOpt = soilGridDataRepository.findById(cell.getGridCellId());
                if (soilDataOpt.isPresent()) {
                    SoilGridData data = soilDataOpt.get();
                    soilSnapshot = new AssessmentSoil();
                    soilSnapshot.setAssessment(assessment);
                    soilSnapshot.setSoilGridCell(cell);
                    soilSnapshot.setSandyFraction(data.getSandyFraction());
                    soilSnapshot.setLoamyFraction(data.getLoamyFraction());
                    soilSnapshot.setClayeyFraction(data.getClayeyFraction());
                    soilSnapshot.setClayeySkeletalFraction(data.getClayeySkeletalFraction());
                    soilSnapshot.setDepth025Fraction(data.getDepth025Fraction());
                    soilSnapshot.setDepth2550Fraction(data.getDepth2550Fraction());
                    soilSnapshot.setDepth5075Fraction(data.getDepth5075Fraction());
                    soilSnapshot.setDepth75100Fraction(data.getDepth75100Fraction());
                    soilSnapshot.setDepth100150Fraction(data.getDepth100150Fraction());
                    soilSnapshot.setDepth150200Fraction(data.getDepth150200Fraction());
                    soilSnapshot.setOrganicCarbonKgM2(data.getOrganicCarbonKgM2());
                    soilSnapshot.setInorganicCarbonKgM2(data.getInorganicCarbonKgM2());
                    
                    assessmentSoilRepository.save(soilSnapshot);
                }
            }
        }

        // 7. Calculate RWH results
        RwhResult result = calculationService.calculateRwh(assessment, annualRainfallMm, soilSnapshot);
        result = rwhResultRepository.save(result);

        // 8. Generate Recommendation
        RwhRecommendation recommendation = calculationService.generateRecommendation(assessment, result, soilSnapshot);
        recommendation = rwhRecommendationRepository.save(recommendation);

        return mapToResponse(assessment, result, recommendation);
    }

    @Transactional(readOnly = true)
    public List<AssessmentDetailResponse> getAssessmentsForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        List<FieldAssessment> assessments;
        if ("SUPER_ADMIN".equals(user.getRole().getRoleName())) {
            assessments = assessmentRepository.findAll();
        } else if ("DISTRICT_ADMIN".equals(user.getRole().getRoleName()) && user.getDistrictId() != null) {
            Optional<District> dOpt = districtRepository.findById(user.getDistrictId());
            if (dOpt.isPresent()) {
                assessments = assessmentRepository.findByDistrict(dOpt.get());
            } else {
                assessments = assessmentRepository.findByEngineer(user);
            }
        } else {
            assessments = assessmentRepository.findByEngineer(user);
        }

        return assessments.stream()
                .map(this::getAssessmentDetails)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AssessmentDetailResponse getAssessmentDetails(Long assessmentId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        FieldAssessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found: " + assessmentId));

        verifyAssessmentAccess(user, assessment);

        RwhResult result = rwhResultRepository.findByAssessment(assessment).orElse(null);
        List<RwhRecommendation> recs = rwhRecommendationRepository.findByAssessment(assessment);
        RwhRecommendation recommendation = recs.isEmpty() ? null : recs.get(0);

        return mapToResponse(assessment, result, recommendation);
    }

    @Transactional
    public AssessmentDetailResponse updateStatus(Long assessmentId, String status, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        FieldAssessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found: " + assessmentId));
        
        verifyAssessmentAccess(user, assessment);

        assessment.setStatus(status.toUpperCase());
        assessment = assessmentRepository.save(assessment);

        return getAssessmentDetails(assessment);
    }

    private void verifyAssessmentAccess(User user, FieldAssessment assessment) {
        String roleName = user.getRole().getRoleName();
        if ("SUPER_ADMIN".equals(roleName)) {
            return;
        }
        if ("DISTRICT_ADMIN".equals(roleName)) {
            if (user.getDistrictId() != null && assessment.getDistrict() != null && 
                user.getDistrictId().equals(assessment.getDistrict().getDistrictId())) {
                return;
            }
        }
        if ("FIELD_ENGINEER".equals(roleName)) {
            if (assessment.getEngineer() != null && assessment.getEngineer().getUserId().equals(user.getUserId())) {
                return;
            }
        }
        throw new org.springframework.security.access.AccessDeniedException("Access is denied");
    }

    private AssessmentDetailResponse mapToResponse(FieldAssessment assessment, RwhResult result, RwhRecommendation recommendation) {
        AssessmentDetailResponse resp = new AssessmentDetailResponse();
        resp.setAssessmentId(assessment.getAssessmentId());
        resp.setBuildingType(assessment.getBuildingType());
        String rawAddress = assessment.getAddress();
        if (rawAddress != null && rawAddress.contains(" | ")) {
            String[] parts = rawAddress.split(" \\| ", 2);
            resp.setBuildingName(parts[0]);
            resp.setAddress(parts[1]);
        } else {
            resp.setBuildingName(assessment.getBuildingType() != null ? assessment.getBuildingType() + " Building" : "Government Building");
            resp.setAddress(rawAddress);
        }
        resp.setLatitude(assessment.getLatitude());
        resp.setLongitude(assessment.getLongitude());
        
        // Convert back to Sq Ft for frontend display
        double areaSqFt = assessment.getRoofAreaM2() / 0.092903;
        resp.setRoofAreaSqFt(Math.round(areaSqFt * 10.0) / 10.0);
        
        resp.setRoofMaterial(assessment.getRoofMaterial());
        resp.setWaterDemandLpd(assessment.getWaterDemandLpd());
        resp.setStatus(assessment.getStatus());
        resp.setCreatedAt(assessment.getCreatedAt());

        if (result != null) {
            resp.setAnnualRainfallMm(result.getAnnualRainfallMm());
            resp.setRunoffCoefficient(result.getRunoffCoefficient());
            resp.setHarvestPotentialL(result.getHarvestableWaterL());
            resp.setRechargePotentialL(result.getRechargePotentialL());
            resp.setRecommendedStorageL(result.getRecommendedStorageL());
        }

        if (recommendation != null) {
            resp.setSystemType(recommendation.getSystemType());
            resp.setStorageCapacityL(recommendation.getStorageCapacityL());
            resp.setRechargeType(recommendation.getRechargeType());
            resp.setFilterType(recommendation.getFilterType());
            resp.setConfidenceScore(recommendation.getConfidenceScore());
            resp.setRecommendationReason(recommendation.getRecommendationReason());
        }

        return resp;
    }

    private AssessmentDetailResponse getAssessmentDetails(FieldAssessment a) {
        RwhResult result = rwhResultRepository.findByAssessment(a).orElse(null);
        List<RwhRecommendation> recs = rwhRecommendationRepository.findByAssessment(a);
        RwhRecommendation recommendation = recs.isEmpty() ? null : recs.get(0);
        return mapToResponse(a, result, recommendation);
    }
}
