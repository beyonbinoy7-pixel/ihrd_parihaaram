package org.ihrd.parihaaram.dto;

public class StudentVerifyRequest {

    private Integer rating = 5;
    private String comment;

    public StudentVerifyRequest() {}

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
