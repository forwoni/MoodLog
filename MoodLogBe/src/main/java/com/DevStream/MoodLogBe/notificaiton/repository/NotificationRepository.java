package com.DevStream.MoodLogBe.notificaiton.repository;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.notificaiton.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByReceiverOrderByCreatedAtDesc(User receiver);
}
