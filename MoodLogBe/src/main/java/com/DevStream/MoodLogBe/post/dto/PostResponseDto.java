package com.DevStream.MoodLogBe.post.dto;

import java.time.LocalDateTime;

public record PostResponseDto(
        Long id,
        String title,
        String content,
        Boolean autoSaved,
        String authorName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
