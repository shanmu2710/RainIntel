package com.rainintel.business.controller;

import com.rainintel.business.repository.FieldAssessmentRepository;
import com.rainintel.business.repository.RwhRecommendationRepository;
import com.rainintel.business.repository.RwhResultRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.rainintel.business.repository.UserRepository;
import com.rainintel.business.entity.User;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.AccessDeniedException;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final FieldAssessmentRepository assessmentRepository;
    private final RwhResultRepository rwhResultRepository;
    private final RwhRecommendationRepository rwhRecommendationRepository;
    private final UserRepository userRepository;

    public AnalyticsController(FieldAssessmentRepository assessmentRepository,
                               RwhResultRepository rwhResultRepository,
                               RwhRecommendationRepository rwhRecommendationRepository,
                               UserRepository userRepository) {
        this.assessmentRepository = assessmentRepository;
        this.rwhResultRepository = rwhResultRepository;
        this.rwhRecommendationRepository = rwhRecommendationRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/summary")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('DISTRICT_ADMIN')")
    public ResponseEntity<Map<String, Object>> getSummary(Authentication auth) {
        boolean isSuperAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN"));
        
        long totalAssessments;
        Double totalHarvest;
        Double avgConf;

        if (isSuperAdmin) {
            totalAssessments = assessmentRepository.count();
            totalHarvest = rwhResultRepository.sumHarvestableWater();
            avgConf = rwhRecommendationRepository.avgConfidenceScore();
        } else {
            User user = userRepository.findByUsername(auth.getName()).orElseThrow();
            Long districtId = user.getDistrictId();
            if (districtId == null) throw new AccessDeniedException("No district assigned");
            
            totalAssessments = assessmentRepository.countByDistrict_DistrictId(districtId);
            totalHarvest = rwhResultRepository.sumHarvestableWaterByDistrictId(districtId);
            avgConf = rwhRecommendationRepository.avgConfidenceScoreByDistrictId(districtId);
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalAssessments", totalAssessments);
        summary.put("totalHarvestedLiters", totalHarvest != null ? totalHarvest : 0.0);
        summary.put("averageConfidence", avgConf != null ? Math.round(avgConf * 10.0) / 10.0 : 0.0);

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/district-ranking")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('DISTRICT_ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getDistrictRanking(Authentication auth) {
        boolean isSuperAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN"));
        
        List<Object[]> rawRanking;
        if (isSuperAdmin) {
            rawRanking = rwhResultRepository.getDistrictRanking();
        } else {
            User user = userRepository.findByUsername(auth.getName()).orElseThrow();
            Long districtId = user.getDistrictId();
            if (districtId == null) throw new AccessDeniedException("No district assigned");
            
            rawRanking = rwhResultRepository.getDistrictRankingByDistrictId(districtId);
        }

        List<Map<String, Object>> ranking = new ArrayList<>();

        for (Object[] row : rawRanking) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("districtName", row[0]);
            entry.put("assessmentCount", row[1]);
            entry.put("totalHarvestedLiters", row[2]);
            ranking.add(entry);
        }

        return ResponseEntity.ok(ranking);
    }
}
