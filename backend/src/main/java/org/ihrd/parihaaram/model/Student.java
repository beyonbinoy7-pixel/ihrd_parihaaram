package org.ihrd.parihaaram.model;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @Column(name = "user_id", length = 50)
    private String userId;

    @Column(name = "student_id", nullable = false, unique = true, length = 50)
    private String studentId;

    @Column(nullable = false, length = 100)
    private String department;

    @Column(name = "year_of_study", nullable = false)
    private Integer yearOfStudy;

    public Student() {}

    public Student(String userId, String studentId, String department, Integer yearOfStudy) {
        this.userId = userId;
        this.studentId = studentId;
        this.department = department;
        this.yearOfStudy = yearOfStudy;
    }

    // Getters and Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(Integer yearOfStudy) { this.yearOfStudy = yearOfStudy; }
}
