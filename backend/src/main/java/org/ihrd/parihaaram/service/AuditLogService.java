package org.ihrd.parihaaram.service;

import org.ihrd.parihaaram.model.AuditLog;
import org.ihrd.parihaaram.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(String actorId, String actorRole, String action, String entityType, String entityId, String ipAddress, String metadata) {
        try {
            AuditLog log = new AuditLog(actorId, actorRole, action, entityType, entityId, ipAddress, metadata);
            auditLogRepository.save(log);
        } catch (Exception e) {
            // Audit log write failure should not disrupt main transaction, but be logged
            System.err.println("Failed to write audit log: " + e.getMessage());
        }
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop100ByOrderByCreatedAtDesc();
    }
}
