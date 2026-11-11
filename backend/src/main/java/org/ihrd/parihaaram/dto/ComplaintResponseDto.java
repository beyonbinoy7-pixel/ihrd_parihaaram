package org.ihrd.parihaaram.dto;

import org.ihrd.parihaaram.model.ComplaintStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ComplaintResponseDto {

    private String id;
    private String ticketId;
    private String reporterId;
    private String reporterName;
    private String reporterEmail;
    private String reporterCollegeCode;
    private String reporterCollegeName;
    private String targetCollegeCode;
    private String targetCollegeName;
    private String reportType;
    private String category;
    private String categoryId;
    private String title;
    private String description;
    private String building;
    private String floor;
    private String room;
    private String studentPriority;
    private String systemPriority;
    private Integer priorityScore;
    private String priorityReason;
    private ComplaintStatus status;
    private String assignedFacultyId;
    private String assignedFacultyName;
    private String assignedDepartment;
    private LocalDate assignmentDueDate;
    private LocalDateTime slaDueAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
    private LocalDateTime reopenedAt;
    private String resolutionDescription;
    private String resolutionBy;
    private String reopenReason;
    private String reopenBy;
    private Integer rating;
    private String studentFeedbackComment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<EvidenceDto> evidence = new ArrayList<>();
    private List<ComplaintStatusHistoryDto> timeline = new ArrayList<>();

    public ComplaintResponseDto() {}

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

    public String getReporterCollegeName() { return reporterCollegeName; }
    public void setReporterCollegeName(String reporterCollegeName) { this.reporterCollegeName = reporterCollegeName; }

    public String getTargetCollegeCode() { return targetCollegeCode; }
    public void setTargetCollegeCode(String targetCollegeCode) { this.targetCollegeCode = targetCollegeCode; }

    public String getTargetCollegeName() { return targetCollegeName; }
    public void setTargetCollegeName(String targetCollegeName) { this.targetCollegeName = targetCollegeName; }

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

    public List<EvidenceDto> getEvidence() { return evidence; }
    public void setEvidence(List<EvidenceDto> evidence) { this.evidence = evidence; }

    public List<ComplaintStatusHistoryDto> getTimeline() { return timeline; }
    public void setTimeline(List<ComplaintStatusHistoryDto> timeline) { this.timeline = timeline; }
}
