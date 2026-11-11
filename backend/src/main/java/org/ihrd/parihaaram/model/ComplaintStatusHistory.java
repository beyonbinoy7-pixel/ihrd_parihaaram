package org.ihrd.parihaaram.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaint_status_history")
public class ComplaintStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "complaint_id", nullable = false, length = 64)
    private String complaintId;

    @Column(name = "from_status", length = 50)
    private String fromStatus;

    @Column(name = "to_status", nullable = false, length = 50)
    private String toStatus;

    @Column(name = "actor_id", nullable = false, length = 50)
    private String actorId;

    @Column(name = "actor_name", nullable = false, length = 150)
    private String actorName;

    @Column(name = "actor_role", nullable = false, length = 50)
    private String actorRole;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ComplaintStatusHistory() {}

    public ComplaintStatusHistory(String complaintId, String fromStatus, String toStatus, String actorId, String actorName, String actorRole, String comment) {
        this.complaintId = complaintId;
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.actorId = actorId;
        this.actorName = actorName;
        this.actorRole = actorRole;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getComplaintId() { return complaintId; }
    public void setComplaintId(String complaintId) { this.complaintId = complaintId; }

    public String getFromStatus() { return fromStatus; }
    public void setFromStatus(String fromStatus) { this.fromStatus = fromStatus; }

    public String getToStatus() { return toStatus; }
    public void setToStatus(String toStatus) { this.toStatus = toStatus; }

    public String getActorId() { return actorId; }
    public void setActorId(String actorId) { this.actorId = actorId; }

    public String getActorName() { return actorName; }
    public void setActorName(String actorName) { this.actorName = actorName; }

    public String getActorRole() { return actorRole; }
    public void setActorRole(String actorRole) { this.actorRole = actorRole; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
