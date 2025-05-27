package com.DevStream.MoodLogBe.auth.service;

import com.DevStream.MoodLogBe.auth.domain.RefreshToken;
import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.auth.dto.*;
import com.DevStream.MoodLogBe.auth.repository.RefreshTokenRepository;
import com.DevStream.MoodLogBe.auth.repository.UserRepository;
import com.DevStream.MoodLogBe.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshRepo;

    @Transactional
    public SignupResponseDto signup(SignupRequestDto req){
        // 1) 이메일/username 중복 체크
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("이미 사용중인 이메일입니다.");
        }
        if (userRepository.existsByUsername(req.getUsername())){
            throw new IllegalArgumentException("이미 사용중인 이름입니다.");
        }

        // 2) 비밀번호 암호화
        String encoded = passwordEncoder.encode(req.getPassword());

        // 3) 엔티티 저장
        User user = User.builder()
                .username(req.getUsername())
                .email(req.getEmail())
                .password(encoded)
                .roles(Set.of("ROLE_USER"))
                .build();

        User saved = userRepository.save(user);

        // 4) 응답 DTO
        return new SignupResponseDto(saved.getId(), saved.getUsername(), saved.getEmail());
    }

    /**
     * 로그인: 이메일/비밀번호 검증 및 토큰 발급
     */
    public LoginResponseDto login(LoginRequestDto req) {
        // 이메일로 사용자 조회 (없으면 예외)
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("등록되지 않은 이메일입니다."));
        // 비밀번호 검증
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // AccessToken 생성
        String accessToken  = jwtUtil.generateAccessToken(
                user.getUsername(),
                Map.of("roles", user.getRoles())
        );

        // RefreshToken 생성
        String refreshToken = jwtUtil.generateRefreshToken(
                user.getUsername()
        );
        RefreshToken entity = new RefreshToken(
                null,
                user.getUsername(),
                refreshToken,
                Instant.now().plusMillis(jwtUtil.getRefreshExpiry())
        );
        refreshRepo.save(entity);

        // 응답 DTO 반환
        return new LoginResponseDto(accessToken, refreshToken);
    }

    /**
     * Refresh 토큰을 통한 AccessToken/RefreshToken 재발급
     */
    @Transactional
    public RefreshResponseDto refresh(RefreshRequestDto req){
        // 전달된 Refresh 토큰
        String incoming = req.refreshToken();

        // 유효성 검사
        if (!jwtUtil.validateToken(incoming)){
            throw new IllegalArgumentException("Invalid refresh token.");
        }

        // 저장된 RefreshToken 조회 (없으면 예외)
        var stored = refreshRepo.findByToken(incoming)
                .orElseThrow(() -> new IllegalArgumentException("Refresh token not found."));

        // 토큰에서 사용자 이름 추출
        String username = jwtUtil.getSubject(incoming);

        // 새 Access/Refresh 토큰 발급
        String newAccess = jwtUtil.generateAccessToken(username, Map.of());
        String newRefresh = jwtUtil.generateRefreshToken(username);

        // 기존 RefreshToken 제거 후 새로 저장
        refreshRepo.deleteByUsername(username);
        RefreshToken entity = new RefreshToken(null, username, newRefresh,
                Instant.now().plusMillis(jwtUtil.getRefreshExpiry()));
        refreshRepo.save(entity);

        // 새 토큰 응답 DTO로 반환
        return new RefreshResponseDto(newAccess, newRefresh);
    }

    /**
     * 로그아웃 처리
     */
    @Transactional
    public void logout(String authHeader) {
        // 인증 헤더가 없거나 형식이 올바르지 않으면 예외
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("유효하지 않은 인증 헤더입니다.");
        }

        // "Bearer " 제거한 실제 토큰 추출
        String token = authHeader.substring(7);
        // 토큰 유효성 검사
        if (!jwtUtil.validateToken(token)) {
            throw new IllegalArgumentException("유효하지 않은 토큰입니다.");
        }

        // 토큰에서 사용자 이름 추출
        String username = jwtUtil.getSubject(token);

        // 해당 사용자의 RefreshToken 삭제
        refreshRepo.deleteByUsername(username);
    }
}
