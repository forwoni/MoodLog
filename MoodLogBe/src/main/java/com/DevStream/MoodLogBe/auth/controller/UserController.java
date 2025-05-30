package com.DevStream.MoodLogBe.auth.controller;

import com.DevStream.MoodLogBe.auth.dto.UserResponseDto;
import com.DevStream.MoodLogBe.auth.dto.UserUpdateRequestDto;
import com.DevStream.MoodLogBe.auth.service.UserService;
import com.DevStream.MoodLogBe.config.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    /**
     * 현재 로그인된 사용자 정보 조회
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        UserResponseDto response = userService.getCurrentUser(userDetails.getUser());
        return ResponseEntity.ok(response);
    }

    /**
     * 현재 로그인된 사용자 정보 수정
     */
    @PutMapping("/me")
    public ResponseEntity<?> updateMyInfo(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UserUpdateRequestDto dto
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        UserResponseDto response = userService.updateUser(userDetails.getUser(), dto);
        return ResponseEntity.ok(response);
    }

    /**
     * 프로필 이미지 업로드 (최초 업로드)
     */
    @PostMapping("/profile-image")
    public ResponseEntity<?> uploadProfileImage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestPart MultipartFile file
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        String imageUrl = userService.updateProfileImage(userDetails.getUser(), file);
        return ResponseEntity.ok(imageUrl);
    }

    /**
     * 프로필 이미지 수정 (덮어쓰기)
     */
    @PutMapping("/profile-image")
    public ResponseEntity<?> updateProfileImage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestPart MultipartFile file
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        String newImageUrl = userService.updateProfileImage(userDetails.getUser(), file);
        return ResponseEntity.ok(newImageUrl);
    }
}
