package org.ihrd.parihaaram.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.ihrd.parihaaram.dto.*;
import org.ihrd.parihaaram.model.AuditLog;
import org.ihrd.parihaaram.security.CustomUserDetails;
import org.ihrd.parihaaram.service.AuthService;
import org.ihrd.parihaaram.service.AuditLogService;
import org.ihrd.parihaaram.service.ComplaintService;
import org.ihrd.parihaaram.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin Command Center", description = "Endpoints for college administrators to manage complaints, status updates, staff assignments, and audit trails")
public class AdminComplaintController {

    private final ComplaintService complaintService;
    private final AuthService authService;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public AdminComplaintController(
            ComplaintService complaintService,
            AuthService authService,
            NotificationService notificationService,
            AuditLogService auditLogService) {
        this.complaintService = complaintService;
        this.authService = authService;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    @GetMapping("/complaints")
    @Operation(summary = "Get list of complaints targeted to the administrator's college (Target-College Isolation)")
    public ResponseEntity<ApiResponse<List<ComplaintResponseDto>>> getComplaints(
            @AuthenticationPrincipal CustomUserDetails admin) {
        List<ComplaintResponseDto> complaints = complaintService.getAdminComplaints(admin);
        return ResponseEntity.ok(ApiResponse.success(complaints));
    }

    @GetMapping("/complaints/{id}")
    @Operation(summary = "Get detailed complaint information with timeline and evidence")
    public ResponseEntity<ApiResponse<ComplaintResponseDto>> getComplaintDetail(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails admin) {
        ComplaintResponseDto complaint = complaintService.getAdminComplaintById(id, admin);
        return ResponseEntity.ok(ApiResponse.success(complaint));
    }

    @PatchMapping("/complaints/{id}/status")
    @Operation(summary = "Update complaint status (UNDER_REVIEW, IN_PROGRESS, RESOLVED)")
    public ResponseEntity<ApiResponse<ComplaintResponseDto>> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody StatusTransitionRequest request,
            @AuthenticationPrincipal CustomUserDetails admin) {
        ComplaintResponseDto response = complaintService.updateComplaintStatus(id, request, admin);
        return ResponseEntity.ok(ApiResponse.success(response, "Status updated successfully"));
    }

    @PostMapping("/complaints/{id}/assign")
    @Operation(summary = "Assign complaint to maintenance team/staff member")
    public ResponseEntity<ApiResponse<ComplaintResponseDto>> assignComplaint(
            @PathVariable String id,
            @Valid @RequestBody AssignComplaintRequest request,
            @AuthenticationPrincipal CustomUserDetails admin) {
        ComplaintResponseDto response = complaintService.assignComplaint(id, request, admin);
        return ResponseEntity.ok(ApiResponse.success(response, "Complaint assigned successfully"));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard statistics and resolution rate metrics")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboard(
            @AuthenticationPrincipal CustomUserDetails admin) {
        DashboardStatsDto stats = complaintService.getAdminDashboard(admin);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "Get immutable system audit log records")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs() {
        return ResponseEntity.ok(ApiResponse.success(auditLogService.getRecentLogs()));
    }

    @GetMapping("/notifications")
    @Operation(summary = "Get admin notifications")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getNotifications(
            @AuthenticationPrincipal CustomUserDetails admin) {
        List<NotificationDto> notifications = notificationService.getUserNotifications(admin.getId());
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    @PostMapping("/students")
    @Operation(summary = "Administrative creation of student account")
    public ResponseEntity<ApiResponse<UserDto>> createStudent(
            @Valid @RequestBody AdminCreateStudentRequest request,
            @AuthenticationPrincipal CustomUserDetails admin) {
        UserDto student = authService.adminCreateStudent(request, admin.getId(), admin.getCollegeCode());
        return ResponseEntity.ok(ApiResponse.success(student, "Student created successfully"));
    }

    @GetMapping("/faculty")
    @Operation(summary = "List faculty accounts at the administrator's college")
    public ResponseEntity<ApiResponse<List<UserDto>>> getFaculty(
            @AuthenticationPrincipal CustomUserDetails admin) {
        return ResponseEntity.ok(ApiResponse.success(authService.getCollegeFaculty(admin.getCollegeCode())));
    }

    @PostMapping("/faculty")
    @Operation(summary = "Create a faculty account at the administrator's college")
    public ResponseEntity<ApiResponse<UserDto>> createFaculty(
            @Valid @RequestBody AdminCreateFacultyRequest request,
            @AuthenticationPrincipal CustomUserDetails admin) {
        UserDto faculty = authService.adminCreateFaculty(request, admin);
        return ResponseEntity.ok(ApiResponse.success(faculty, "Faculty account created successfully"));
    }
}
