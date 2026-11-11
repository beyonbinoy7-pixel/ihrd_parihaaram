package org.ihrd.parihaaram.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "ticket_id", nullable = false, unique = true, length = 50)
    private String ticketId;

    @Column(name = "reporter_id", nullable = false, length = 50)
    private String reporterId;

    @Column(name = "reporter_name", nullable = false, length = 150)
    private String reporterName;

    @Column(name = "reporter_email", nullable = false, length = 150)
    private String reporterEmail;

    @Column(name = "reporter_college_code", nullable = false, length = 20)
    private String reporterCollegeCode;

    @Column(name = "target_college_code", nullable = false, length = 20)
    private String targetCollegeCode;

    @Column(name = "report_type", nullable = false, length = 50)
    private String reportType = "OWN_COLLEGE"; // OWN_COLLEGE or OTHER_COLLEGE

    @Column(nullable = false, length = 100)
    private String category;

    @Column(name = "category_id", nullable = false, length = 50)
    private String categoryId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String building;

    @Column(length = 100)
    private String floor;

    @Column(length = 100)
    private String room;

    @Column(name = "student_priority", nullable = false, length = 20)
    private String studentPriority = "MEDIUM";

    @Column(name = "system_priority", nullable = false, length = 20)
    private String systemPriority = "MEDIUM";

    @Column(name = "priority_score", nullable = false)
    private Integer priorityScore = 50;

    @Column(name = "priority_reason")
    private String priorityReason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ComplaintStatus status = ComplaintStatus.SUBMITTED;

    @Column(name = "assigned_faculty_id", length = 50)
    private String assignedFacultyId;

    @Column(name = "assigned_faculty_name", length = 150)
    private String assignedFacultyName;

    @Column(name = "assigned_department", length = 100)
    private String assignedDepartment;

    @Column(name = "assignment_due_date")
    private LocalDate assignmentDueDate;

    @Column(name = "sla_due_at")
    private LocalDateTime slaDueAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    @Column(name = "reopened_at")
    private LocalDateTime reopenedAt;

    @Column(name = "resolution_description", columnDefinition = "TEXT")
    private String resolutionDescription;

    @Column(name = "resolution_by", length = 150)
    private String resolutionBy;

    @Column(name = "reopen_reason", columnDefinition = "TEXT")
    private String reopenReason;

    @Column(name = "reopen_by", length = 150)
    private String reopenBy;

    private Integer rating;

    @Column(name = "student_feedback_comment", columnDefinition = "TEXT")
    private String studentFeedbackComment;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Complaint() {}

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTicketId() { return ticketId; }
    public void setTicketId(String ticketId) { this.ticketId = ticketId; }

    public String getReporterId() { return reporterId; }
    public void setReporterId(String reporterId) { this.reporterId = reporterId; }

    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }

    public String getReporterEmail() { return reporterEmail; }
    public void setReporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; }

    public String getReporterCollegeCode() { return reporterCollegeCode; }
    public void setReporterCollegeCode(String reporterCollegeCode) { this.reporterCollegeCode = reporterCollegeCode; }

    public String getTargetCollegeCode() { return targetCollegeCode; }
    public void setTargetCollegeCode(String targetCollegeCode) { this.targetCollegeCode = targetCollegeCode; }

    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }

    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }

    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }

    public String getStudentPriority() { return studentPriority; }
    public void setStudentPriority(String studentPriority) { this.studentPriority = studentPriority; }

    public String getSystemPriority() { return systemPriority; }
    public void setSystemPriority(String systemPriority) { this.systemPriority = systemPriority; }

    public Integer getPriorityScore() { return priorityScore; }
    public void setPriorityScore(Integer priorityScore) { this.priorityScore = priorityScore; }

    public String getPriorityReason() { return priorityReason; }
    public void setPriorityReason(String priorityReason) { this.priorityReason = priorityReason; }

    public ComplaintStatus getStatus() { return status; }
    public void setStatus(ComplaintStatus status) { this.status = status; }

    public String getAssignedFacultyId() { return assignedFacultyId; }
    public void setAssignedFacultyId(String assignedFacultyId) { this.assignedFacultyId = assignedFacultyId; }

    public String getAssignedFacultyName() { return assignedFacultyName; }
    public void setAssignedFacultyName(String assignedFacultyName) { this.assignedFacultyName = assignedFacultyName; }

    public String getAssignedDepartment() { return assignedDepartment; }
    public void setAssignedDepartment(String assignedDepartment) { this.assignedDepartment = assignedDepartment; }

    public LocalDate getAssignmentDueDate() { return assignmentDueDate; }
    public void setAssignmentDueDate(LocalDate assignmentDueDate) { this.assignmentDueDate = assignmentDueDate; }

    public LocalDateTime getSlaDueAt() { return slaDueAt; }
    public void setSlaDueAt(LocalDateTime slaDueAt) { this.slaDueAt = slaDueAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public LocalDateTime getClosedAt() { return closedAt; }
    public void setClosedAt(LocalDateTime closedAt) { this.closedAt = closedAt; }

    public LocalDateTime getReopenedAt() { return reopenedAt; }
    public void setReopenedAt(LocalDateTime reopenedAt) { this.reopenedAt = reopenedAt; }

    public String getResolutionDescription() { return resolutionDescription; }
    public void setResolutionDescription(String resolutionDescription) { this.resolutionDescription = resolutionDescription; }

    public String getResolutionBy() { return resolutionBy; }
    public void setResolutionBy(String resolutionBy) { this.resolutionBy = resolutionBy; }

    public String getReopenReason() { return reopenReason; }
    public void setReopenReason(String reopenReason) { this.reopenReason = reopenReason; }

    public String getReopenBy() { return reopenBy; }
    public void setReopenBy(String reopenBy) { this.reopenBy = reopenBy; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getStudentFeedbackComment() { return studentFeedbackComment; }
    public void setStudentFeedbackComment(String studentFeedbackComment) { this.studentFeedbackComment = studentFeedbackComment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
