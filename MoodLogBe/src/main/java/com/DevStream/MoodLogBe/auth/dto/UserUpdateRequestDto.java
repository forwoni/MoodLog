package com.DevStream.MoodLogBe.auth.dto;

public record UserUpdateRequestDto(
        String newUsername,
        String currentPassword,
        String newPassword
) {}
