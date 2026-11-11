package org.ihrd.parihaaram.dto;

import org.ihrd.parihaaram.model.Role;

public class UserDto {
    private String id;
    private String studentId;
    private String username;
    private String name;
    private String email;
    private Role role;
    private String collegeCode;
    private String collegeName;
    private String department;
    private Integer year;

    public UserDto() {}

    public UserDto(String id, String username, String name, String email, Role role, String collegeCode) {
        this.id = id;
        this.studentId = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.role = role;
        this.collegeCode = collegeCode;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId != null ? studentId : id; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getCollegeCode() { return collegeCode; }
    public void setCollegeCode(String collegeCode) { this.collegeCode = collegeCode; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
}
