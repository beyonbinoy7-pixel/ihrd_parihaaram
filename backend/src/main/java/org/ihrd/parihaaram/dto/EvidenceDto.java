package org.ihrd.parihaaram.dto;

import java.time.LocalDateTime;

public class EvidenceDto {
    private String id;
    private String complaintId;
    private String fileName;
    private String url;
    private String contentType;
    private Long fileSize;
    private String evidenceType;
    private String uploadedBy;
    private LocalDateTime createdAt;

    public EvidenceDto() {}

    public EvidenceDto(String id, String complaintId, String fileName, String url, String contentType, Long fileSize, String evidenceType, String uploadedBy, LocalDateTime createdAt) {
        this.id = id;
        this.complaintId = complaintId;
        this.fileName = fileName;
        this.url = url;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.evidenceType = evidenceType;
        this.uploadedBy = uploadedBy;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getComplaintId() { return complaintId; }
    public void setComplaintId(String complaintId) { this.complaintId = complaintId; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

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
