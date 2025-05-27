package com.DevStream.MoodLogBe.post.service;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.notification.domain.NotificationType;
import com.DevStream.MoodLogBe.notification.service.NotificationService;
import com.DevStream.MoodLogBe.post.domain.Post;
import com.DevStream.MoodLogBe.post.domain.PostLike;
import com.DevStream.MoodLogBe.post.repository.PostLikeRepository;
import com.DevStream.MoodLogBe.post.repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final NotificationService notificationService;

    /**
     * 게시글 좋아요 토글 처리
     * @param postId 게시글 ID
     * @param user 요청한 사용자
     * @return true: 좋아요 추가, false: 좋아요 취소
     */
    @Transactional
    public boolean toggleLike(Long postId, User user) {
        // 게시글 조회 (없으면 예외 발생)
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));

        // 사용자가 이미 좋아요를 눌렀는지 확인
        Optional<PostLike> existing = postLikeRepository.findByPostAndUser(post, user);

        if (existing.isPresent()) {
            // 이미 좋아요를 눌렀다면, 취소 처리
            postLikeRepository.delete(existing.get());
            post.decreaseLikeCount();
            return false; // 좋아요 취소
        } else {
            // 좋아요가 없으면, 새로운 좋아요 추가
            PostLike newLike = new PostLike(null, post, user);
            postLikeRepository.save(newLike);
            post.increaseLikeCount();

            // 게시글 작성자가 본인이 아니면 알림 발송
            if (!post.getAuthor().getId().equals(user.getId())) { // 자기 자신에게 알림 방지
                notificationService.send(
                        post.getAuthor(),
                        user.getUsername() + "님이 회원님의 게시글에 좋아요를 눌렀습니다.",
                        NotificationType.LIKE
                );
            }
            return true; // 좋아요 추가
        }
    }
}
