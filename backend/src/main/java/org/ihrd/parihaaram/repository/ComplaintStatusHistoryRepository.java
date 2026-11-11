package org.ihrd.parihaaram.repository;

import org.ihrd.parihaaram.model.ComplaintStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintStatusHistoryRepository extends JpaRepository<ComplaintStatusHistory, Long> {
    List<ComplaintStatusHistory> findByComplaintIdOrderByCreatedAtAsc(String complaintId);
}
