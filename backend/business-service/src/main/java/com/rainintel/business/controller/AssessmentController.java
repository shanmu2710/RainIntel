package com.rainintel.business.controller;

import com.rainintel.business.dto.AssessmentDetailResponse;
import com.rainintel.business.dto.CreateAssessmentRequest;
import com.rainintel.business.service.AssessmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @PostMapping
    public ResponseEntity<AssessmentDetailResponse> createAssessment(@Valid @RequestBody CreateAssessmentRequest request,
                                                                      Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(assessmentService.createAssessment(request, username));
    }

    @GetMapping
    public ResponseEntity<List<AssessmentDetailResponse>> getAssessments(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(assessmentService.getAssessmentsForUser(username));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssessmentDetailResponse> getAssessmentDetails(@PathVariable Long id,
                                                                         Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(assessmentService.getAssessmentDetails(id, username));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AssessmentDetailResponse> updateStatus(@PathVariable Long id,
                                                                  @RequestBody Map<String, String> body,
                                                                  Authentication authentication) {
        String status = body.get("status");
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status field is required");
        }
        String username = authentication.getName();
        return ResponseEntity.ok(assessmentService.updateStatus(id, status, username));
    }
}
