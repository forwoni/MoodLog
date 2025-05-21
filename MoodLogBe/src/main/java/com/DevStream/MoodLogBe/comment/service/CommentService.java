package com.DevStream.MoodLogBe.comment.service;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.comment.domain.Comment;
import com.DevStream.MoodLogBe.comment.dto.CommentRequestDto;
import com.DevStream.MoodLogBe.comment.dto.CommentResponseDto;
import com.DevStream.MoodLogBe.comment.repository.CommentRepository;
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

    public void create(Long postId, CommentRequestDto dto, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("게시글 없음"));

        Comment comment = Comment.builder()
                .content(dto.content())
                .author(user)
                .post(post)
                .build();

        post.getComments().add(comment);

        commentRepository.save(comment);
    }

    public List<CommentResponseDto> getComments(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("게시글 없음"));

        return commentRepository.findByPost(post).stream()
                .map(comment -> new CommentResponseDto(
                        comment.getId(),
                        comment.getContent(),
                        comment.getAuthor().getUsername(),
                        comment.getCreatedAt()
                ))
                .toList();
    }

    public void delete(Long commentId, User user) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("댓글 없음"));

        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new AccessDeniedException("삭제 권한 없음");
        }

        commentRepository.delete(comment);
    }
}
