package org.ihrd.parihaaram.repository;

import org.ihrd.parihaaram.model.ComplaintEvidence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintEvidenceRepository extends JpaRepository<ComplaintEvidence, String> {
    List<ComplaintEvidence> findByComplaintIdOrderByCreatedAtAsc(String complaintId);
    List<ComplaintEvidence> findByComplaintIdAndEvidenceType(String complaintId, String evidenceType);
}
