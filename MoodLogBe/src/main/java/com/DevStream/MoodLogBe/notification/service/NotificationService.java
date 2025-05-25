package com.DevStream.MoodLogBe.notification.service;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.notification.domain.Notification;
import com.DevStream.MoodLogBe.notification.domain.NotificationType;
import com.DevStream.MoodLogBe.notification.dto.NotificationResponseDto;
import com.DevStream.MoodLogBe.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public void send(User receiver, String message, NotificationType type) {
        Notification notification = Notification.builder()
                .receiver(receiver)
                .message(message)
                .type(type)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponseDto> getNotifications(User user) {
        return notificationRepository.findByReceiverOrderByCreatedAtDesc(user)
                .stream()
                .map(NotificationResponseDto::from)
                .toList();
    }

    @Transactional
    public void markAsRead(User user, Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("알림을 찾을 수 없습니다."));
        if (!notification.getReceiver().getId().equals(user.getId())) {
            throw new SecurityException("본인의 알림만 읽음 처리할 수 있습니다.");
        }
        notification.markAsRead();
    }
}
