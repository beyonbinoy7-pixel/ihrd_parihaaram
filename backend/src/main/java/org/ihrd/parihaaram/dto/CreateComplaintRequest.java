package org.ihrd.parihaaram.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class CreateComplaintRequest {

    private String reportType = "OWN_COLLEGE"; // OWN_COLLEGE or OTHER_COLLEGE
    private String targetCollege; // e.g. "CEC" or "#CEC"

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category = "Infrastructure";

    private String categoryId = "infrastructure";
    private String building;
    private String floor;
    private String room;
    private String studentPriority = "MEDIUM";
    private List<String> evidenceUrls; // Optional URLs or uploaded IDs

    public CreateComplaintRequest() {}

    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }

    public String getTargetCollege() { return targetCollege; }
    public void setTargetCollege(String targetCollege) { this.targetCollege = targetCollege; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }

    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }

    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }

    public String getStudentPriority() { return studentPriority; }
    public void setStudentPriority(String studentPriority) { this.studentPriority = studentPriority; }

    public List<String> getEvidenceUrls() { return evidenceUrls; }
    public void setEvidenceUrls(List<String> evidenceUrls) { this.evidenceUrls = evidenceUrls; }
}
