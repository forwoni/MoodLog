package com.DevStream.MoodLogBe.post.dto;

import com.DevStream.MoodLogBe.comment.dto.CommentResponseDto;

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
        List<CommentResponseDto> comments
) {}
