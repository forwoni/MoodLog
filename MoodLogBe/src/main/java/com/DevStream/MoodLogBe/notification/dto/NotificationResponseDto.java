package com.DevStream.MoodLogBe.notification.dto;

import com.DevStream.MoodLogBe.notification.domain.Notification;
import com.DevStream.MoodLogBe.notification.domain.NotificationType;

import java.time.LocalDateTime;

public record NotificationResponseDto(
        Long id,
        String message,
        NotificationType type,
        boolean isRead,
        LocalDateTime createdAt
) {
    public static NotificationResponseDto from(Notification notification) {
        return new NotificationResponseDto(
                notification.getId(),
                notification.getMessage(),
                notification.getType(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
