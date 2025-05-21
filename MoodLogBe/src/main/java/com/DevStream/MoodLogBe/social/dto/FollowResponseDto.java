package com.DevStream.MoodLogBe.social.dto;

import java.time.LocalDateTime;

public record FollowResponseDto(
        Long id,
        String followerUsername,
        String followingUsername,
        LocalDateTime createdAt
) {}
