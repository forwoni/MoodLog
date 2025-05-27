package com.DevStream.MoodLogBe.post.dto;

import com.DevStream.MoodLogBe.comment.dto.CommentResponseDto;
import com.DevStream.MoodLogBe.post.domain.Post;

import java.time.LocalDateTime;
import java.util.List;

public record PostResponseDto(
        Long id,
        String title,
        String content,
        Boolean autoSaved,
        String authorName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        int viewCount,
        int likeCount,
        List<CommentResponseDto> comments
) {
    public static PostResponseDto from(Post post) {
        return new PostResponseDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getAutoSaved(),
                post.getAuthor().getUsername(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                post.getViewCount(),
                post.getLikeCount(),
                post.getComments().stream().map(comment -> new CommentResponseDto(
                        comment.getId(),
                        comment.getContent(),
                        comment.getAuthor().getUsername(),
                        comment.getCreatedAt()
                )).toList()
        );
    }
}
