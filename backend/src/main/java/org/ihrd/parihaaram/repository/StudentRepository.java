package org.ihrd.parihaaram.repository;

import org.ihrd.parihaaram.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {
    Optional<Student> findByStudentIdIgnoreCase(String studentId);
    boolean existsByStudentIdIgnoreCase(String studentId);
}
