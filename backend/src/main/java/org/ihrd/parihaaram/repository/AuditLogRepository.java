package org.ihrd.parihaaram.repository;

import org.ihrd.parihaaram.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findTop100ByOrderByCreatedAtDesc();
    List<AuditLog> findByActorIdOrderByCreatedAtDesc(String actorId);
}
