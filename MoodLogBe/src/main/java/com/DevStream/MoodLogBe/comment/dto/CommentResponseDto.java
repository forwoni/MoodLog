package com.DevStream.MoodLogBe.comment.dto;

import java.time.LocalDateTime;

public record CommentResponseDto(
        Long id,
        String content,
        String authorUsername,
        LocalDateTime createdAt
) {}
