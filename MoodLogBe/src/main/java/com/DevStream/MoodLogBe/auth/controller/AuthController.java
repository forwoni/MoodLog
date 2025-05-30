package com.DevStream.MoodLogBe.auth.controller;

import com.DevStream.MoodLogBe.auth.dto.*;
import com.DevStream.MoodLogBe.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * 회원가입
     * @param req 회원가입 요청 정보
     * @return 생성된 사용자 정보
     */
    @PostMapping("/signup")
    public ResponseEntity<SignupResponseDto> signup(
            @Valid @RequestBody SignupRequestDto req) {
        SignupResponseDto dto = authService.signup(req);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(dto);
    }

    /**
     * 로그인
     * @param req 로그인 요청 정보
     * @return 엑세스/리프레시 토큰
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(
            @Valid @RequestBody LoginRequestDto req
    ) {
        LoginResponseDto tokens = authService.login(req);
        return ResponseEntity.ok(tokens);
    }

    /**
     * 토큰 재발급
     * @param req 리프레시 토큰 요청 정보
     * @return 새로운 엑세스/리프레시 토큰
     */
    @PostMapping("/refresh")
    public ResponseEntity<RefreshResponseDto> refresh(
            @RequestBody RefreshRequestDto req
    ) {
        RefreshResponseDto tokens = authService.refresh(req);
        return ResponseEntity.ok(tokens);
    }

    /**
     * 로그아웃
     * @param authHeader Authorization 헤더 포함 (Bearer accessToken)
     * @return 로그아웃 메시지
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        authService.logout(authHeader);
        return ResponseEntity.ok(Map.of("message", "로그아웃되었습니다."));
    }
}

