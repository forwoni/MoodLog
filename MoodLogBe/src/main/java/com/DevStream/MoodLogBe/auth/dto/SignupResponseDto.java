package com.DevStream.MoodLogBe.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SignupResponseDto {
    private final Long id;
    private final String username;
    private final String email;
}
