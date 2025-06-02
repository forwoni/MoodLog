package com.DevStream.MoodLogBe.post.repository;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.post.domain.Post;
import com.DevStream.MoodLogBe.post.domain.PostView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PostViewRepository extends JpaRepository<PostView, Long> {
    // 특정 사용자의 특정 게시글 조회 기록 확인 (최근 24시간 이내)
    @Query("SELECT pv FROM PostView pv WHERE pv.post = :post AND " +
           "((pv.user = :user AND pv.viewedAt > :timeLimit) OR " +
           "(pv.user IS NULL AND pv.ipAddress = :ipAddress AND pv.viewedAt > :timeLimit))")
    Optional<PostView> findRecentView(@Param("post") Post post,
                                    @Param("user") User user,
                                    @Param("ipAddress") String ipAddress,
                                    @Param("timeLimit") LocalDateTime timeLimit);
} 