package org.ihrd.parihaaram.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class AssignComplaintRequest {

    @NotBlank(message = "Department is required")
    @Size(max = 100, message = "Department must be 100 characters or fewer")
    private String department;

    @NotBlank(message = "Faculty member is required")
    private String facultyId;

    private LocalDate dueDate;
    private String comment;

    public AssignComplaintRequest() {}

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getFacultyId() { return facultyId; }
    public void setFacultyId(String facultyId) { this.facultyId = facultyId; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
