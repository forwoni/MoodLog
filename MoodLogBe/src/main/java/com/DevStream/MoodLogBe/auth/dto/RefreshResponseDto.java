package com.DevStream.MoodLogBe.auth.dto;

public record RefreshResponseDto(
       String accessToken,
       String refreshToken
) { }
