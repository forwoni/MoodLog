package com.DevStream.MoodLogBe.auth.service;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.auth.dto.LoginRequestDto;
import com.DevStream.MoodLogBe.auth.dto.LoginResponseDto;
import com.DevStream.MoodLogBe.auth.dto.SignupRequestDto;
import com.DevStream.MoodLogBe.auth.dto.SignupResponseDto;
import com.DevStream.MoodLogBe.auth.repository.UserRepository;
import com.DevStream.MoodLogBe.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

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

    public LoginResponseDto login(LoginRequestDto req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("등록되지 않은 이메일입니다."));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        String accessToken  = jwtUtil.generateAccessToken(
                user.getUsername(),
                Map.of("roles", user.getRoles())
        );
        String refreshToken = jwtUtil.generateRefreshToken(
                user.getUsername()
        );

        return new LoginResponseDto(accessToken, refreshToken);
    }
}
