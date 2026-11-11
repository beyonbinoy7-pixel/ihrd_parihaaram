package org.ihrd.parihaaram.service;

import org.ihrd.parihaaram.dto.NotificationDto;
import org.ihrd.parihaaram.model.Notification;
import org.ihrd.parihaaram.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void sendNotification(String userId, String role, String title, String message, String complaintId) {
        Notification notification = new Notification(
                UUID.randomUUID().toString(),
                userId,
                role,
                title,
                message,
                complaintId
        );
        notificationRepository.save(notification);
    }

    public List<NotificationDto> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<NotificationDto> getRoleNotifications(String role) {
        return notificationRepository.findByRoleOrderByCreatedAtDesc(role)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(String notificationId, String userId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (n.getUserId().equalsIgnoreCase(userId)) {
                n.setIsRead(true);
                notificationRepository.save(n);
            }
        });
    }

    private NotificationDto toDto(Notification n) {
        return new NotificationDto(
                n.getId(),
                n.getUserId(),
                n.getRole(),
                n.getTitle(),
                n.getMessage(),
                n.getComplaintId(),
                n.getIsRead(),
                n.getCreatedAt()
        );
    }
}
