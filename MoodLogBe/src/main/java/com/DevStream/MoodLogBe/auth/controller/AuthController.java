package com.DevStream.MoodLogBe.auth.controller;

import com.DevStream.MoodLogBe.auth.dto.LoginRequestDto;
import com.DevStream.MoodLogBe.auth.dto.LoginResponseDto;
import com.DevStream.MoodLogBe.auth.dto.SignupRequestDto;
import com.DevStream.MoodLogBe.auth.dto.SignupResponseDto;
import com.DevStream.MoodLogBe.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
