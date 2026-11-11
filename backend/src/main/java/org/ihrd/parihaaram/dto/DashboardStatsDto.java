package org.ihrd.parihaaram.dto;

import java.util.Map;

public class DashboardStatsDto {

    private long totalComplaints;
    private long submitted;
    private long underReview;
    private long inProgress;
    private long resolved;
    private long closed;
    private long reopened;
    private double resolutionRate;
    private double avgResolutionHours;
    private Map<String, Long> complaintsByCategory;
    private Map<String, Long> complaintsByStatus;

    public DashboardStatsDto() {}

    public long getTotalComplaints() { return totalComplaints; }
    public void setTotalComplaints(long totalComplaints) { this.totalComplaints = totalComplaints; }

    public long getSubmitted() { return submitted; }
    public void setSubmitted(long submitted) { this.submitted = submitted; }

    public long getUnderReview() { return underReview; }
    public void setUnderReview(long underReview) { this.underReview = underReview; }

    public long getInProgress() { return inProgress; }
    public void setInProgress(long inProgress) { this.inProgress = inProgress; }

    public long getResolved() { return resolved; }
    public void setResolved(long resolved) { this.resolved = resolved; }

    public long getClosed() { return closed; }
    public void setClosed(long closed) { this.closed = closed; }

    public long getReopened() { return reopened; }
    public void setReopened(long reopened) { this.reopened = reopened; }

    public double getResolutionRate() { return resolutionRate; }
    public void setResolutionRate(double resolutionRate) { this.resolutionRate = resolutionRate; }

    public double getAvgResolutionHours() { return avgResolutionHours; }
    public void setAvgResolutionHours(double avgResolutionHours) { this.avgResolutionHours = avgResolutionHours; }

    public Map<String, Long> getComplaintsByCategory() { return complaintsByCategory; }
    public void setComplaintsByCategory(Map<String, Long> complaintsByCategory) { this.complaintsByCategory = complaintsByCategory; }

    public Map<String, Long> getComplaintsByStatus() { return complaintsByStatus; }
    public void setComplaintsByStatus(Map<String, Long> complaintsByStatus) { this.complaintsByStatus = complaintsByStatus; }
}
