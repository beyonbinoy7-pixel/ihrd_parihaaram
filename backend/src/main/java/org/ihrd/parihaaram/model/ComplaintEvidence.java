package org.ihrd.parihaaram.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaint_evidence")
public class ComplaintEvidence {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "complaint_id", nullable = false, length = 64)
    private String complaintId;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "stored_file_path", nullable = false, length = 500)
    private String storedFilePath;

    @Column(name = "content_type", nullable = false, length = 100)
    private String contentType;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(name = "evidence_type", nullable = false, length = 50)
    private String evidenceType = "BEFORE"; // BEFORE / AFTER / REOPEN

    @Column(name = "uploaded_by", nullable = false, length = 50)
    private String uploadedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ComplaintEvidence() {}

    public ComplaintEvidence(String id, String complaintId, String fileName, String storedFilePath, String contentType, Long fileSize, String evidenceType, String uploadedBy) {
        this.id = id;
        this.complaintId = complaintId;
        this.fileName = fileName;
        this.storedFilePath = storedFilePath;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.evidenceType = evidenceType;
        this.uploadedBy = uploadedBy;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getComplaintId() { return complaintId; }
    public void setComplaintId(String complaintId) { this.complaintId = complaintId; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getStoredFilePath() { return storedFilePath; }
    public void setStoredFilePath(String storedFilePath) { this.storedFilePath = storedFilePath; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public String getEvidenceType() { return evidenceType; }
    public void setEvidenceType(String evidenceType) { this.evidenceType = evidenceType; }

    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
