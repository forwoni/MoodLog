package com.DevStream.MoodLogBe.post.dto;

public record PostRequestDto(
        String title,
        String content,
        Boolean autoSaved
) {}
