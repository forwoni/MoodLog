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

    @PostMapping("/signup")
    public ResponseEntity<SignupResponseDto> signup(
            @Valid @RequestBody SignupRequestDto req) {
        SignupResponseDto dto = authService.signup(req);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(dto);
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(
            @Valid @RequestBody LoginRequestDto req
    ){
        LoginResponseDto tokens = authService.login(req);
        return ResponseEntity
                .ok(tokens);
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshResponseDto> refresh(
            @RequestBody RefreshRequestDto req
    ){
        RefreshResponseDto tokens = authService.refresh(req);
        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        authService.logout(authHeader);
        return ResponseEntity.ok(Map.of("message", "로그아웃되었습니다."));
    }

}
