package org.ihrd.parihaaram.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class StudentReopenRequest {

    @NotBlank(message = "Explanation is required for reopening")
    private String explanation;

    private List<String> rejectionImages;

    public StudentReopenRequest() {}

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public List<String> getRejectionImages() { return rejectionImages; }
    public void setRejectionImages(List<String> rejectionImages) { this.rejectionImages = rejectionImages; }
}
