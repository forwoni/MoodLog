package com.DevStream.MoodLogBe.post.service;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.post.domain.Post;
import com.DevStream.MoodLogBe.post.domain.PostView;
import com.DevStream.MoodLogBe.post.repository.PostViewRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PostViewService {
    private final PostViewRepository postViewRepository;
    private static final int VIEW_COUNT_INTERVAL_HOURS = 24;

    @Transactional
    public boolean processView(Post post, User user, HttpServletRequest request) {
        String ipAddress = getClientIp(request);
        LocalDateTime timeLimit = LocalDateTime.now().minusHours(VIEW_COUNT_INTERVAL_HOURS);

        // 최근 24시간 내 조회 기록 확인
        boolean hasRecentView = postViewRepository.findRecentView(post, user, ipAddress, timeLimit)
                .isPresent();

        if (!hasRecentView) {
            // 새로운 조회 기록 생성
            PostView postView = PostView.create(post, user, ipAddress);
            postViewRepository.save(postView);
            
            // 게시글 조회수 증가
            post.increaseViewCount();
            return true;
        }

        return false;
    }

    // 클라이언트 IP 주소 추출
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
} 