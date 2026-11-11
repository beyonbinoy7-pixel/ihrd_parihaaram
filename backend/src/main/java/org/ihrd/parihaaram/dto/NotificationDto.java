package org.ihrd.parihaaram.dto;

import java.time.LocalDateTime;

public class NotificationDto {
    private String id;
    private String userId;
    private String role;
    private String title;
    private String message;
    private String complaintId;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public NotificationDto() {}

    public NotificationDto(String id, String userId, String role, String title, String message, String complaintId, Boolean isRead, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.role = role;
        this.title = title;
        this.message = message;
        this.complaintId = complaintId;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getComplaintId() { return complaintId; }
    public void setComplaintId(String complaintId) { this.complaintId = complaintId; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean read) { isRead = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
