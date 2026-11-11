package org.ihrd.parihaaram.repository;

import org.ihrd.parihaaram.model.Complaint;
import org.ihrd.parihaaram.model.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, String> {
    Optional<Complaint> findByTicketId(String ticketId);
    List<Complaint> findByReporterIdOrderByCreatedAtDesc(String reporterId);
    List<Complaint> findByAssignedFacultyIdOrderByCreatedAtDesc(String assignedFacultyId);
    List<Complaint> findByTargetCollegeCodeOrderByCreatedAtDesc(String targetCollegeCode);
    List<Complaint> findAllByOrderByCreatedAtDesc();

    long countByTargetCollegeCode(String targetCollegeCode);
    long countByTargetCollegeCodeAndStatus(String targetCollegeCode, ComplaintStatus status);

    long countByReporterId(String reporterId);
    long countByReporterIdAndStatus(String reporterId, ComplaintStatus status);

    long countByStatus(ComplaintStatus status);
}
