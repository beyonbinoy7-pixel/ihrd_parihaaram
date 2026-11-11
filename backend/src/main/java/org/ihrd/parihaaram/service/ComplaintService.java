package org.ihrd.parihaaram.service;

import org.ihrd.parihaaram.dto.*;
import org.ihrd.parihaaram.exception.InvalidStatusTransitionException;
import org.ihrd.parihaaram.exception.ResourceNotFoundException;
import org.ihrd.parihaaram.exception.UnauthorizedException;
import org.ihrd.parihaaram.model.*;
import org.ihrd.parihaaram.repository.*;
import org.ihrd.parihaaram.security.CustomUserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintEvidenceRepository evidenceRepository;
    private final ComplaintStatusHistoryRepository historyRepository;
    private final CollegeRepository collegeRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;
    private final UserRepository userRepository;

    public ComplaintService(
            ComplaintRepository complaintRepository,
            ComplaintEvidenceRepository evidenceRepository,
            ComplaintStatusHistoryRepository historyRepository,
            CollegeRepository collegeRepository,
            NotificationService notificationService,
            AuditLogService auditLogService,
            UserRepository userRepository) {
        this.complaintRepository = complaintRepository;
        this.evidenceRepository = evidenceRepository;
        this.historyRepository = historyRepository;
        this.collegeRepository = collegeRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
        this.userRepository = userRepository;
    }

    // --- TICKET GENERATOR ---
    public String generateTicketId(String targetCollegeCode) {
        String code = (targetCollegeCode != null && !targetCollegeCode.isBlank())
                ? targetCollegeCode.toUpperCase().replace("#", "").trim()
                : "CEK";

        for (int i = 0; i < 20; i++) {
            int randomNum = ThreadLocalRandom.current().nextInt(100000, 999999);
            String ticketId = "CE-" + code + "-" + Year.now().getValue() + "-" + randomNum;
            if (complaintRepository.findByTicketId(ticketId).isEmpty()) {
                return ticketId;
            }
        }
        return "CE-" + code + "-" + Year.now().getValue() + "-" + System.currentTimeMillis() % 1000000;
    }

    // --- STUDENT OPERATIONS ---

    @Transactional
    public ComplaintResponseDto createComplaint(CreateComplaintRequest request, CustomUserDetails student) {
        String reporterCollege = student.getCollegeCode().toUpperCase();
        String targetCollege = (request.getTargetCollege() != null && !request.getTargetCollege().isBlank())
                ? request.getTargetCollege().trim().toUpperCase().replace("#", "")
                : reporterCollege;

        String reportType = reporterCollege.equalsIgnoreCase(targetCollege) ? "OWN_COLLEGE" : "OTHER_COLLEGE";
        String complaintId = "comp-" + UUID.randomUUID().toString();
        String ticketId = generateTicketId(targetCollege);

        Complaint complaint = new Complaint();
        complaint.setId(complaintId);
        complaint.setTicketId(ticketId);
        complaint.setReporterId(student.getId());
        complaint.setReporterName(student.getName());
        complaint.setReporterEmail(student.getEmail());
        complaint.setReporterCollegeCode(reporterCollege);
        complaint.setTargetCollegeCode(targetCollege);
        complaint.setReportType(reportType);
        complaint.setCategory(request.getCategory());
        complaint.setCategoryId(request.getCategoryId() != null ? request.getCategoryId() : request.getCategory().toLowerCase());
        complaint.setTitle(request.getTitle().trim());
        complaint.setDescription(request.getDescription().trim());
        complaint.setBuilding(request.getBuilding());
        complaint.setFloor(request.getFloor());
        complaint.setRoom(request.getRoom());
        complaint.setStudentPriority(request.getStudentPriority() != null ? request.getStudentPriority().toUpperCase() : "MEDIUM");
        complaint.setSystemPriority(complaint.getStudentPriority());
        complaint.setPriorityScore("CRITICAL".equalsIgnoreCase(complaint.getStudentPriority()) ? 90 : ("HIGH".equalsIgnoreCase(complaint.getStudentPriority()) ? 75 : 50));
        complaint.setPriorityReason("Assessed from student grievance submission");
        complaint.setStatus(ComplaintStatus.SUBMITTED);
        complaint.setSlaDueAt(LocalDateTime.now().plusHours("HIGH".equalsIgnoreCase(complaint.getStudentPriority()) ? 24 : 72));

        complaintRepository.save(complaint);

        // Save evidence if provided
        if (request.getEvidenceUrls() != null && !request.getEvidenceUrls().isEmpty()) {
            for (int i = 0; i < request.getEvidenceUrls().size(); i++) {
                String fileUrl = request.getEvidenceUrls().get(i);
                ComplaintEvidence evidence = new ComplaintEvidence(
                        UUID.randomUUID().toString(),
                        complaintId,
                        "evidence-photo-" + (i + 1),
                        fileUrl,
                        "image/jpeg",
                        1024L,
                        "BEFORE",
                        student.getId()
                );
                evidenceRepository.save(evidence);
            }
        }

        // Add Initial Status History Timeline Entry
        ComplaintStatusHistory initialHistory = new ComplaintStatusHistory(
                complaintId,
                null,
                ComplaintStatus.SUBMITTED.name(),
                student.getId(),
                student.getName(),
                "STUDENT",
                "Problem reported by student through PARIHAARAM Portal."
        );
        historyRepository.save(initialHistory);

        // Send notifications
        notificationService.sendNotification(
                student.getId(),
                "STUDENT",
                "Complaint Registered",
                "Your grievance " + ticketId + " has been successfully submitted to #" + targetCollege + " Administration.",
                complaintId
        );

        // Log audit
        auditLogService.log(
                student.getId(),
                "STUDENT",
                "COMPLAINT_CREATED",
                "COMPLAINT",
                complaintId,
                "127.0.0.1",
                "{\"ticketId\": \"" + ticketId + "\", \"targetCollege\": \"" + targetCollege + "\"}"
        );

        return getComplaintDtoById(complaintId);
    }

    public List<ComplaintResponseDto> getStudentComplaints(CustomUserDetails student) {
        return complaintRepository.findByReporterIdOrderByCreatedAtDesc(student.getId())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ComplaintResponseDto getStudentComplaintById(String idOrTicket, CustomUserDetails student) {
        Complaint complaint = findComplaintByIdOrTicket(idOrTicket);
        if (!isProblemOwnedByStudent(complaint, student)) {
            throw new UnauthorizedException("You are not authorized to view this complaint.");
        }
        return getComplaintDtoById(complaint.getId());
    }

    public List<ComplaintResponseDto> getFacultyComplaints(CustomUserDetails faculty) {
        return complaintRepository.findByAssignedFacultyIdOrderByCreatedAtDesc(faculty.getId())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public boolean isProblemOwnedByStudent(Complaint complaint, CustomUserDetails student) {
        if (complaint == null || student == null) return false;
        return complaint.getReporterId().equalsIgnoreCase(student.getId());
    }

    // --- ADMIN OPERATIONS (Target College Isolation) ---

    public List<ComplaintResponseDto> getAdminComplaints(CustomUserDetails admin) {
        if (admin.getRole() == Role.SUPER_ADMIN) {
            return complaintRepository.findAllByOrderByCreatedAtDesc()
                    .stream()
                    .map(this::toDto)
                    .collect(Collectors.toList());
        }

        // Strict College-Level Isolation
        String authorizedCollege = admin.getCollegeCode().toUpperCase();
        return complaintRepository.findByTargetCollegeCodeOrderByCreatedAtDesc(authorizedCollege)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ComplaintResponseDto getAdminComplaintById(String idOrTicket, CustomUserDetails admin) {
        Complaint complaint = findComplaintByIdOrTicket(idOrTicket);

        if (admin.getRole() != Role.SUPER_ADMIN) {
            String authorizedCollege = admin.getCollegeCode().toUpperCase();
            if (!complaint.getTargetCollegeCode().equalsIgnoreCase(authorizedCollege)) {
                throw new UnauthorizedException("Access Denied: This complaint is routed to #" + complaint.getTargetCollegeCode() + " and is not accessible to your college administration (" + authorizedCollege + ").");
            }
        }

        return getComplaintDtoById(complaint.getId());
    }

    @Transactional
    public ComplaintResponseDto updateComplaintStatus(String idOrTicket, StatusTransitionRequest request, CustomUserDetails admin) {
        Complaint complaint = findComplaintByIdOrTicket(idOrTicket);

        if (admin.getRole() != Role.SUPER_ADMIN && !complaint.getTargetCollegeCode().equalsIgnoreCase(admin.getCollegeCode())) {
            throw new UnauthorizedException("You are not authorized to update complaints from other colleges.");
        }

        ComplaintStatus fromStatus = complaint.getStatus();
        ComplaintStatus toStatus = request.getStatus();

        // Enforce strict state machine transitions
        validateAdminTransition(fromStatus, toStatus);

        complaint.setStatus(toStatus);

        if (toStatus == ComplaintStatus.RESOLVED) {
            complaint.setResolvedAt(LocalDateTime.now());
            complaint.setResolutionBy(admin.getName());
            if (request.getResolutionDescription() != null) {
                complaint.setResolutionDescription(request.getResolutionDescription().trim());
            }

            // Save resolution evidence images if provided
            if (request.getResolutionImages() != null) {
                for (int i = 0; i < request.getResolutionImages().size(); i++) {
                    ComplaintEvidence ev = new ComplaintEvidence(
                            UUID.randomUUID().toString(),
                            complaint.getId(),
                            "resolution-proof-" + (i + 1),
                            request.getResolutionImages().get(i),
                            "image/jpeg",
                            1024L,
                            "AFTER",
                            admin.getId()
                    );
                    evidenceRepository.save(ev);
                }
            }

            notificationService.sendNotification(
                    complaint.getReporterId(),
                    "STUDENT",
                    "Resolution Submitted — Action Required",
                    "Admin has marked grievance " + complaint.getTicketId() + " as RESOLVED. Please verify the fix or reopen if dissatisfied.",
                    complaint.getId()
            );
        }

        complaintRepository.save(complaint);

        // Record immutable status transition history
        String comment = request.getComment() != null ? request.getComment() : ("Status transitioned to " + toStatus);
        ComplaintStatusHistory history = new ComplaintStatusHistory(
                complaint.getId(),
                fromStatus.name(),
                toStatus.name(),
                admin.getId(),
                admin.getName(),
                admin.getRole().name(),
                comment
        );
        historyRepository.save(history);

        auditLogService.log(
                admin.getId(),
                admin.getRole().name(),
                "STATUS_CHANGED",
                "COMPLAINT",
                complaint.getId(),
                "127.0.0.1",
                "{\"from\": \"" + fromStatus + "\", \"to\": \"" + toStatus + "\", \"ticketId\": \"" + complaint.getTicketId() + "\"}"
        );

        return getComplaintDtoById(complaint.getId());
    }

    @Transactional
    public ComplaintResponseDto assignComplaint(String idOrTicket, AssignComplaintRequest request, CustomUserDetails admin) {
        Complaint complaint = findComplaintByIdOrTicket(idOrTicket);

        if (admin.getRole() != Role.SUPER_ADMIN && !complaint.getTargetCollegeCode().equalsIgnoreCase(admin.getCollegeCode())) {
            throw new UnauthorizedException("Unauthorized college access.");
        }

        User faculty = userRepository.findByIdIgnoreCase(request.getFacultyId().trim())
                .filter(user -> user.getRole() == Role.FACULTY && Boolean.TRUE.equals(user.getIsActive()))
                .filter(user -> user.getCollegeCode().equalsIgnoreCase(complaint.getTargetCollegeCode()))
                .orElseThrow(() -> new ResourceNotFoundException("Active faculty account not found for the complaint's college."));

        ComplaintStatus fromStatus = complaint.getStatus();
        ComplaintStatus toStatus = ComplaintStatus.IN_PROGRESS;
        complaint.setStatus(toStatus);
        complaint.setAssignedFacultyId(faculty.getId());
        complaint.setAssignedFacultyName(faculty.getName());
        complaint.setAssignedDepartment(request.getDepartment().trim());
        complaint.setAssignmentDueDate(request.getDueDate());
        complaintRepository.save(complaint);

        String comment = "Assigned to " + request.getDepartment() + " department (Faculty: " + faculty.getName() + ")"
                + (request.getDueDate() != null ? " Due: " + request.getDueDate() : "");

        ComplaintStatusHistory history = new ComplaintStatusHistory(
                complaint.getId(),
                fromStatus.name(),
                toStatus.name(),
                admin.getId(),
                admin.getName(),
                admin.getRole().name(),
                comment
        );
        historyRepository.save(history);

        notificationService.sendNotification(
                complaint.getReporterId(),
                "STUDENT",
                "Grievance Assigned",
                "Your grievance " + complaint.getTicketId() + " has been assigned to " + request.getDepartment() + " and is IN PROGRESS.",
                complaint.getId()
        );
        notificationService.sendNotification(
                faculty.getId(),
                "FACULTY",
                "New Problem Assigned",
                "Problem " + complaint.getTicketId() + " has been assigned to you by " + admin.getName() + ".",
                complaint.getId()
        );

        return getComplaintDtoById(complaint.getId());
    }

    // --- STUDENT VERIFICATION & REOPEN ACTIONS ---

    @Transactional
    public ComplaintResponseDto studentVerifyResolution(String idOrTicket, StudentVerifyRequest request, CustomUserDetails student) {
        Complaint complaint = findComplaintByIdOrTicket(idOrTicket);

        if (!isProblemOwnedByStudent(complaint, student)) {
            throw new UnauthorizedException("Only the student who reported this grievance can verify resolution.");
        }

        if (complaint.getStatus() != ComplaintStatus.RESOLVED) {
            throw new InvalidStatusTransitionException("Only RESOLVED complaints can be confirmed by the student.");
        }

        complaint.setStatus(ComplaintStatus.CLOSED);
        complaint.setClosedAt(LocalDateTime.now());
        complaint.setRating(request.getRating() != null ? request.getRating() : 5);
        complaint.setStudentFeedbackComment(request.getComment() != null ? request.getComment().trim() : "Student confirmed resolution");
        complaintRepository.save(complaint);

        ComplaintStatusHistory history = new ComplaintStatusHistory(
                complaint.getId(),
                ComplaintStatus.RESOLVED.name(),
                ComplaintStatus.CLOSED.name(),
                student.getId(),
                student.getName(),
                "STUDENT",
                "Resolution verified and closed by student. Rating: " + complaint.getRating() + "/5. Feedback: " + complaint.getStudentFeedbackComment()
        );
        historyRepository.save(history);

        auditLogService.log(
                student.getId(),
                "STUDENT",
                "COMPLAINT_CLOSED",
                "COMPLAINT",
                complaint.getId(),
                "127.0.0.1",
                "{\"ticketId\": \"" + complaint.getTicketId() + "\", \"rating\": " + complaint.getRating() + "}"
        );

        return getComplaintDtoById(complaint.getId());
    }

    @Transactional
    public ComplaintResponseDto studentReopenComplaint(String idOrTicket, StudentReopenRequest request, CustomUserDetails student) {
        Complaint complaint = findComplaintByIdOrTicket(idOrTicket);

        if (!isProblemOwnedByStudent(complaint, student)) {
            throw new UnauthorizedException("Only the reporting student can reopen this complaint.");
        }

        if (complaint.getStatus() != ComplaintStatus.RESOLVED && complaint.getStatus() != ComplaintStatus.CLOSED) {
            throw new InvalidStatusTransitionException("Only RESOLVED or recently CLOSED complaints can be reopened.");
        }

        ComplaintStatus from = complaint.getStatus();
        complaint.setStatus(ComplaintStatus.REOPENED);
        complaint.setReopenedAt(LocalDateTime.now());
        complaint.setReopenReason(request.getExplanation().trim());
        complaint.setReopenBy(student.getName());
        complaintRepository.save(complaint);

        // Save rejection proof images
        if (request.getRejectionImages() != null) {
            for (int i = 0; i < request.getRejectionImages().size(); i++) {
                ComplaintEvidence ev = new ComplaintEvidence(
                        UUID.randomUUID().toString(),
                        complaint.getId(),
                        "reopen-proof-" + (i + 1),
                        request.getRejectionImages().get(i),
                        "image/jpeg",
                        1024L,
                        "REOPEN",
                        student.getId()
                );
                evidenceRepository.save(ev);
            }
        }

        ComplaintStatusHistory history = new ComplaintStatusHistory(
                complaint.getId(),
                from.name(),
                ComplaintStatus.REOPENED.name(),
                student.getId(),
                student.getName(),
                "STUDENT",
                "Student rejected resolution and reopened grievance: " + request.getExplanation()
        );
        historyRepository.save(history);

        auditLogService.log(
                student.getId(),
                "STUDENT",
                "COMPLAINT_REOPENED",
                "COMPLAINT",
                complaint.getId(),
                "127.0.0.1",
                "{\"ticketId\": \"" + complaint.getTicketId() + "\", \"reason\": \"" + request.getExplanation() + "\"}"
        );

        return getComplaintDtoById(complaint.getId());
    }

    // --- DASHBOARDS ---

    public DashboardStatsDto getStudentDashboard(CustomUserDetails student) {
        String studentId = student.getId();
        DashboardStatsDto dto = new DashboardStatsDto();

        dto.setTotalComplaints(complaintRepository.countByReporterId(studentId));
        dto.setSubmitted(complaintRepository.countByReporterIdAndStatus(studentId, ComplaintStatus.SUBMITTED));
        dto.setUnderReview(complaintRepository.countByReporterIdAndStatus(studentId, ComplaintStatus.UNDER_REVIEW));
        dto.setInProgress(complaintRepository.countByReporterIdAndStatus(studentId, ComplaintStatus.IN_PROGRESS));
        dto.setResolved(complaintRepository.countByReporterIdAndStatus(studentId, ComplaintStatus.RESOLVED));
        dto.setClosed(complaintRepository.countByReporterIdAndStatus(studentId, ComplaintStatus.CLOSED));
        dto.setReopened(complaintRepository.countByReporterIdAndStatus(studentId, ComplaintStatus.REOPENED));

        long finished = dto.getResolved() + dto.getClosed();
        dto.setResolutionRate(dto.getTotalComplaints() > 0 ? (finished * 100.0 / dto.getTotalComplaints()) : 0.0);
        return dto;
    }

    public DashboardStatsDto getAdminDashboard(CustomUserDetails admin) {
        String targetCollege = admin.getCollegeCode().toUpperCase();
        DashboardStatsDto dto = new DashboardStatsDto();

        if (admin.getRole() == Role.SUPER_ADMIN) {
            dto.setTotalComplaints(complaintRepository.count());
            dto.setSubmitted(complaintRepository.countByStatus(ComplaintStatus.SUBMITTED));
            dto.setUnderReview(complaintRepository.countByStatus(ComplaintStatus.UNDER_REVIEW));
            dto.setInProgress(complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS));
            dto.setResolved(complaintRepository.countByStatus(ComplaintStatus.RESOLVED));
            dto.setClosed(complaintRepository.countByStatus(ComplaintStatus.CLOSED));
            dto.setReopened(complaintRepository.countByStatus(ComplaintStatus.REOPENED));
        } else {
            dto.setTotalComplaints(complaintRepository.countByTargetCollegeCode(targetCollege));
            dto.setSubmitted(complaintRepository.countByTargetCollegeCodeAndStatus(targetCollege, ComplaintStatus.SUBMITTED));
            dto.setUnderReview(complaintRepository.countByTargetCollegeCodeAndStatus(targetCollege, ComplaintStatus.UNDER_REVIEW));
            dto.setInProgress(complaintRepository.countByTargetCollegeCodeAndStatus(targetCollege, ComplaintStatus.IN_PROGRESS));
            dto.setResolved(complaintRepository.countByTargetCollegeCodeAndStatus(targetCollege, ComplaintStatus.RESOLVED));
            dto.setClosed(complaintRepository.countByTargetCollegeCodeAndStatus(targetCollege, ComplaintStatus.CLOSED));
            dto.setReopened(complaintRepository.countByTargetCollegeCodeAndStatus(targetCollege, ComplaintStatus.REOPENED));
        }

        long finished = dto.getResolved() + dto.getClosed();
        dto.setResolutionRate(dto.getTotalComplaints() > 0 ? (finished * 100.0 / dto.getTotalComplaints()) : 0.0);
        // No resolution-duration query is available yet; zero means no computed estimate.
        dto.setAvgResolutionHours(0.0);
        return dto;
    }

    // --- HELPER METHODS ---

    private void validateAdminTransition(ComplaintStatus from, ComplaintStatus to) {
        if (from == to) {
            throw new InvalidStatusTransitionException("Complaint is already in status " + to + ".");
        }

        boolean valid = switch (from) {
            case SUBMITTED -> (to == ComplaintStatus.UNDER_REVIEW || to == ComplaintStatus.IN_PROGRESS);
            case UNDER_REVIEW -> (to == ComplaintStatus.IN_PROGRESS || to == ComplaintStatus.RESOLVED);
            case IN_PROGRESS -> (to == ComplaintStatus.RESOLVED);
            case REOPENED -> (to == ComplaintStatus.IN_PROGRESS || to == ComplaintStatus.UNDER_REVIEW);
            case RESOLVED -> false; // Only student can confirm CLOSED or REOPENED
            case CLOSED -> false; // Closed is terminal unless reopened by student
        };

        if (!valid) {
            throw new InvalidStatusTransitionException("Illegal status transition from " + from + " to " + to + ".");
        }
    }

    private Complaint findComplaintByIdOrTicket(String idOrTicket) {
        return complaintRepository.findById(idOrTicket)
                .or(() -> complaintRepository.findByTicketId(idOrTicket))
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID/Ticket: " + idOrTicket));
    }

    public ComplaintResponseDto getComplaintDtoById(String complaintId) {
        Complaint c = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found: " + complaintId));
        return toDto(c);
    }

    private ComplaintResponseDto toDto(Complaint c) {
        ComplaintResponseDto dto = new ComplaintResponseDto();
        dto.setId(c.getId());
        dto.setTicketId(c.getTicketId());
        dto.setReporterId(c.getReporterId());
        dto.setReporterName(c.getReporterName());
        dto.setReporterEmail(c.getReporterEmail());
        dto.setReporterCollegeCode(c.getReporterCollegeCode());
        dto.setTargetCollegeCode(c.getTargetCollegeCode());
        dto.setReportType(c.getReportType());
        dto.setCategory(c.getCategory());
        dto.setCategoryId(c.getCategoryId());
        dto.setTitle(c.getTitle());
        dto.setDescription(c.getDescription());
        dto.setBuilding(c.getBuilding());
        dto.setFloor(c.getFloor());
        dto.setRoom(c.getRoom());
        dto.setStudentPriority(c.getStudentPriority());
        dto.setSystemPriority(c.getSystemPriority());
        dto.setPriorityScore(c.getPriorityScore());
        dto.setPriorityReason(c.getPriorityReason());
        dto.setStatus(c.getStatus());
        dto.setAssignedFacultyId(c.getAssignedFacultyId());
        dto.setAssignedFacultyName(c.getAssignedFacultyName());
        dto.setAssignedDepartment(c.getAssignedDepartment());
        dto.setAssignmentDueDate(c.getAssignmentDueDate());
        dto.setSlaDueAt(c.getSlaDueAt());
        dto.setResolvedAt(c.getResolvedAt());
        dto.setClosedAt(c.getClosedAt());
        dto.setReopenedAt(c.getReopenedAt());
        dto.setResolutionDescription(c.getResolutionDescription());
        dto.setResolutionBy(c.getResolutionBy());
        dto.setReopenReason(c.getReopenReason());
        dto.setReopenBy(c.getReopenBy());
        dto.setRating(c.getRating());
        dto.setStudentFeedbackComment(c.getStudentFeedbackComment());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());

        collegeRepository.findByCodeIgnoreCase(c.getReporterCollegeCode())
                .ifPresent(col -> dto.setReporterCollegeName(col.getName()));
        collegeRepository.findByCodeIgnoreCase(c.getTargetCollegeCode())
                .ifPresent(col -> dto.setTargetCollegeName(col.getName()));

        // Evidence
        List<EvidenceDto> evidenceDtos = evidenceRepository.findByComplaintIdOrderByCreatedAtAsc(c.getId())
                .stream()
                .map(ev -> new EvidenceDto(
                        ev.getId(),
                        ev.getComplaintId(),
                        ev.getFileName(),
                        ev.getStoredFilePath().startsWith("http") ? ev.getStoredFilePath() : "/api/evidence/" + ev.getStoredFilePath(),
                        ev.getContentType(),
                        ev.getFileSize(),
                        ev.getEvidenceType(),
                        ev.getUploadedBy(),
                        ev.getCreatedAt()
                ))
                .collect(Collectors.toList());
        dto.setEvidence(evidenceDtos);

        // Timeline
        List<ComplaintStatusHistoryDto> timelineDtos = historyRepository.findByComplaintIdOrderByCreatedAtAsc(c.getId())
                .stream()
                .map(h -> new ComplaintStatusHistoryDto(
                        h.getId(),
                        h.getFromStatus(),
                        h.getToStatus(),
                        h.getActorId(),
                        h.getActorName(),
                        h.getActorRole(),
                        h.getComment(),
                        h.getCreatedAt()
                ))
                .collect(Collectors.toList());
        dto.setTimeline(timelineDtos);

        return dto;
    }
}
