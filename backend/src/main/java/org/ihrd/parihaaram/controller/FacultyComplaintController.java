package org.ihrd.parihaaram.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.ihrd.parihaaram.dto.ApiResponse;
import org.ihrd.parihaaram.dto.ComplaintResponseDto;
import org.ihrd.parihaaram.security.CustomUserDetails;
import org.ihrd.parihaaram.service.ComplaintService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/faculty")
@Tag(name = "Faculty Operations", description = "Read-only access to problems assigned to the authenticated faculty member")
public class FacultyComplaintController {

    private final ComplaintService complaintService;

    public FacultyComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping("/complaints")
    @Operation(summary = "Get problems assigned to the authenticated faculty member")
    public ResponseEntity<ApiResponse<List<ComplaintResponseDto>>> getAssignedComplaints(
            @AuthenticationPrincipal CustomUserDetails faculty) {
        return ResponseEntity.ok(ApiResponse.success(complaintService.getFacultyComplaints(faculty)));
    }
}
