package org.ihrd.parihaaram.dto;

import java.time.LocalDateTime;

public class ComplaintStatusHistoryDto {
    private Long id;
    private String fromStatus;
    private String toStatus;
    private String actorId;
    private String actorName;
    private String actorRole;
    private String comment;
    private LocalDateTime createdAt;

    public ComplaintStatusHistoryDto() {}

    public ComplaintStatusHistoryDto(Long id, String fromStatus, String toStatus, String actorId, String actorName, String actorRole, String comment, LocalDateTime createdAt) {
        this.id = id;
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.actorId = actorId;
        this.actorName = actorName;
        this.actorRole = actorRole;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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
