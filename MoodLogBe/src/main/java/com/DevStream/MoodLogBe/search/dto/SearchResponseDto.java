package com.DevStream.MoodLogBe.search.dto;

import com.DevStream.MoodLogBe.auth.dto.UserResponseDto;
import com.DevStream.MoodLogBe.post.dto.PostResponseDto;

import java.util.List;

public record SearchResponseDto(
        List<PostResponseDto> posts,
        List<UserResponseDto> users
){}
