package com.DevStream.MoodLogBe.auth.controller;

import com.DevStream.MoodLogBe.auth.dto.UserResponseDto;
import com.DevStream.MoodLogBe.auth.dto.UserUpdateRequestDto;
import com.DevStream.MoodLogBe.auth.service.UserService;
import com.DevStream.MoodLogBe.config.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    /**
     * 현재 로그인된 사용자 정보 조회
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getMyInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserResponseDto response = userService.getCurrentUser(userDetails.getUser());
        return ResponseEntity.ok(response);
    }

    /**
     * 현재 로그인된 사용자 정보 수정
     */
    @PutMapping("/me")
    public ResponseEntity<UserResponseDto> updateMyInfo(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UserUpdateRequestDto dto
    ) {
        UserResponseDto response = userService.updateUser(userDetails.getUser(), dto);
        return ResponseEntity.ok(response);
    }
}
