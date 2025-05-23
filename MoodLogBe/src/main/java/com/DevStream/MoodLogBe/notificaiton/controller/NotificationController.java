package com.DevStream.MoodLogBe.notificaiton.controller;

import com.DevStream.MoodLogBe.config.CustomUserDetails;
import com.DevStream.MoodLogBe.notificaiton.dto.NotificationResponseDto;
import com.DevStream.MoodLogBe.notificaiton.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * 알림 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<NotificationResponseDto>> getNotifications(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<NotificationResponseDto> notifications = notificationService.getNotifications(userDetails.getUser());
        return ResponseEntity.ok(notifications);
    }

    /**
     * 알림 읽음 처리
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        notificationService.markAsRead(userDetails.getUser(), id);
        return ResponseEntity.ok().build();
    }
}
