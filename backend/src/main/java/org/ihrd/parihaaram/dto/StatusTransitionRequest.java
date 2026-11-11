package org.ihrd.parihaaram.dto;

import jakarta.validation.constraints.NotNull;
import org.ihrd.parihaaram.model.ComplaintStatus;

import java.util.List;

public class StatusTransitionRequest {

    @NotNull(message = "Target status is required")
    private ComplaintStatus status;

    private String comment;
    private String resolutionDescription;
    private List<String> resolutionImages;

    public StatusTransitionRequest() {}

    public ComplaintStatus getStatus() { return status; }
    public void setStatus(ComplaintStatus status) { this.status = status; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getResolutionDescription() { return resolutionDescription; }
    public void setResolutionDescription(String resolutionDescription) { this.resolutionDescription = resolutionDescription; }

    public List<String> getResolutionImages() { return resolutionImages; }
    public void setResolutionImages(List<String> resolutionImages) { this.resolutionImages = resolutionImages; }
}
