package org.ihrd.parihaaram.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "user_id", nullable = false, length = 50)
    private String userId;

    @Column(nullable = false, length = 50)
    private String role;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "complaint_id", length = 64)
    private String complaintId;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Notification() {}

    public Notification(String id, String userId, String role, String title, String message, String complaintId) {
        this.id = id;
        this.userId = userId;
        this.role = role;
        this.title = title;
        this.message = message;
        this.complaintId = complaintId;
        this.isRead = false;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
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
