package org.ihrd.parihaaram.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.ihrd.parihaaram.dto.*;
import org.ihrd.parihaaram.security.CustomUserDetails;
import org.ihrd.parihaaram.service.ComplaintService;
import org.ihrd.parihaaram.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@Tag(name = "Student Operations", description = "Endpoints for students to submit, track, verify, and reopen grievances")
public class StudentComplaintController {

    private final ComplaintService complaintService;
    private final NotificationService notificationService;

    public StudentComplaintController(ComplaintService complaintService, NotificationService notificationService) {
        this.complaintService = complaintService;
        this.notificationService = notificationService;
    }

    @PostMapping("/complaints")
    @Operation(summary = "Submit a new student complaint")
    public ResponseEntity<ApiResponse<ComplaintResponseDto>> createComplaint(
            @Valid @RequestBody CreateComplaintRequest request,
            @AuthenticationPrincipal CustomUserDetails student) {
        ComplaintResponseDto response = complaintService.createComplaint(request, student);
        return ResponseEntity.ok(ApiResponse.success(response, "Complaint submitted successfully"));
    }

    @GetMapping("/complaints")
    @Operation(summary = "Get list of complaints reported by the authenticated student")
    public ResponseEntity<ApiResponse<List<ComplaintResponseDto>>> getMyComplaints(
            @AuthenticationPrincipal CustomUserDetails student) {
        List<ComplaintResponseDto> complaints = complaintService.getStudentComplaints(student);
        return ResponseEntity.ok(ApiResponse.success(complaints));
    }

    @GetMapping("/complaints/{id}")
    @Operation(summary = "Get details of a specific complaint owned by the authenticated student")
    public ResponseEntity<ApiResponse<ComplaintResponseDto>> getComplaintDetail(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails student) {
        ComplaintResponseDto complaint = complaintService.getStudentComplaintById(id, student);
        return ResponseEntity.ok(ApiResponse.success(complaint));
    }

    @PostMapping("/complaints/{id}/verify")
    @Operation(summary = "Student confirms resolution of complaint (transitions to CLOSED)")
    public ResponseEntity<ApiResponse<ComplaintResponseDto>> verifyComplaint(
            @PathVariable String id,
            @RequestBody(required = false) StudentVerifyRequest request,
            @AuthenticationPrincipal CustomUserDetails student) {
        if (request == null) request = new StudentVerifyRequest();
        ComplaintResponseDto response = complaintService.studentVerifyResolution(id, request, student);
        return ResponseEntity.ok(ApiResponse.success(response, "Complaint marked as verified and closed."));
    }

    @PostMapping("/complaints/{id}/reopen")
    @Operation(summary = "Student rejects resolution and reopens complaint (transitions to REOPENED)")
    public ResponseEntity<ApiResponse<ComplaintResponseDto>> reopenComplaint(
            @PathVariable String id,
            @Valid @RequestBody StudentReopenRequest request,
            @AuthenticationPrincipal CustomUserDetails student) {
        ComplaintResponseDto response = complaintService.studentReopenComplaint(id, request, student);
        return ResponseEntity.ok(ApiResponse.success(response, "Complaint reopened for administrative review."));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get student dashboard statistics and metric cards")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboard(
            @AuthenticationPrincipal CustomUserDetails student) {
        DashboardStatsDto stats = complaintService.getStudentDashboard(student);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/notifications")
    @Operation(summary = "Get student notifications")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getNotifications(
            @AuthenticationPrincipal CustomUserDetails student) {
        List<NotificationDto> notifications = notificationService.getUserNotifications(student.getId());
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    @PatchMapping("/notifications/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<ApiResponse<Void>> markNotificationRead(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails student) {
        notificationService.markAsRead(id, student.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "Notification marked as read"));
    }
}
