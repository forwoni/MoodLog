package com.DevStream.MoodLogBe.auth.dto;

import com.DevStream.MoodLogBe.auth.domain.User;

public record UserResponseDto(
        Long id,
        String username
) {
    public static UserResponseDto from(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getUsername()
        );
    }
}
