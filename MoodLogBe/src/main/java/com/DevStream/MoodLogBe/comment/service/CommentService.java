package com.DevStream.MoodLogBe.comment.service;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.comment.domain.Comment;
import com.DevStream.MoodLogBe.comment.dto.CommentRequestDto;
import com.DevStream.MoodLogBe.comment.dto.CommentResponseDto;
import com.DevStream.MoodLogBe.comment.repository.CommentRepository;
import com.DevStream.MoodLogBe.notification.domain.NotificationType;
import com.DevStream.MoodLogBe.notification.service.NotificationService;
import com.DevStream.MoodLogBe.post.domain.Post;
import com.DevStream.MoodLogBe.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final NotificationService notificationService;

    /**
     * 댓글 작성
     */
    public void create(Long postId, CommentRequestDto dto, User user) {
        // 게시글 조회 (없으면 예외)
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("게시글 없음"));

        // 댓글 엔티티 생성
        Comment comment = Comment.builder()
                .content(dto.content())
                .author(user)
                .post(post)
                .build();

        // 댓글을 게시글에 추가
        post.getComments().add(comment);

        // 댓글 저장
        commentRepository.save(comment);

        // 자기 자신의 게시글이 아니라면 알림 전송
        if (!post.getAuthor().getId().equals(user.getId())) { // 자기 자신에게 알림 방지
            notificationService.send(
                    post.getAuthor(),
                    user.getUsername() + "님이 회원님의 게시글에 댓글을 남겼습니다.",
                    NotificationType.COMMENT
            );
        }
    }

    /**
     * 게시글의 모든 댓글 조회
     */
    public List<CommentResponseDto> getComments(Long postId) {
        // 게시글 조회 (없으면 예외)
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("게시글 없음"));

        // 댓글들을 DTO로 변환해 반환
        return commentRepository.findByPost(post).stream()
                .map(comment -> new CommentResponseDto(
                        comment.getId(),
                        comment.getContent(),
                        comment.getAuthor().getUsername(),
                        comment.getCreatedAt()
                ))
                .toList();
    }

    /**
     * 댓글 삭제
     * - 작성자만 삭제 가능
     */
    public void delete(Long commentId, User user) {
        // 댓글 조회 (없으면 예외
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("댓글 없음"));

        // 작성자가 아닌 경우 예외
        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new AccessDeniedException("삭제 권한 없음");
        }

        // 댓글 삭제
        commentRepository.delete(comment);
    }
}
