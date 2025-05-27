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

    /**
     * 알림 전송
     * @param receiver 알림을 받을 사용자
     * @param message 알림 메시지
     * @param type 알림 종류
     */
    public void send(User receiver, String message, NotificationType type) {
        // 새로운 알림 생성
        Notification notification = Notification.builder()
                .receiver(receiver)
                .message(message)
                .type(type)
                .isRead(false) // 기본값: 읽지 않음
                .build();
        // 알림 저장
        notificationRepository.save(notification);
    }

    /**
     * 사용자의 알림 목록 조회 (최신순)
     */
    @Transactional(readOnly = true)
    public List<NotificationResponseDto> getNotifications(User user) {
        // 사용자별 알림 목록을 최신순으로 조회 후 DTO로 변환
        return notificationRepository.findByReceiverOrderByCreatedAtDesc(user)
                .stream()
                .map(NotificationResponseDto::from)
                .toList();
    }

    /**
     * 특정 알림을 읽음 처리
     * @param user 요청 사용자
     * @param id 읽음 처리할 알림 ID
     */
    @Transactional
    public void markAsRead(User user, Long id) {
        // 알림 조회 (없으면 예외)
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("알림을 찾을 수 없습니다."));

        // 자신의 알림인지 확인
        if (!notification.getReceiver().getId().equals(user.getId())) {
            throw new SecurityException("본인의 알림만 읽음 처리할 수 있습니다.");
        }

        // 읽음 처리
        notification.markAsRead();
    }
}
