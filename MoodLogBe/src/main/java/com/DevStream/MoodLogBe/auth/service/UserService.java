package com.DevStream.MoodLogBe.auth.service;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.auth.dto.UserResponseDto;
import com.DevStream.MoodLogBe.auth.dto.UserUpdateRequestDto;
import com.DevStream.MoodLogBe.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserResponseDto getCurrentUser(User user) {
        return new UserResponseDto(user.getId(), user.getUsername(), user.getEmail());
    }

    @Transactional
    public UserResponseDto updateUser(User user, UserUpdateRequestDto dto) {
        User persistentUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(dto.currentPassword(), persistentUser.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        if (dto.newUsername() != null && !dto.newUsername().isBlank()) {
            persistentUser.setUsername(dto.newUsername());
        }

        if (dto.newPassword() != null && !dto.newPassword().isBlank()) {
            String encoded = passwordEncoder.encode(dto.newPassword());
            persistentUser.setPassword(encoded);
        }

        return new UserResponseDto(
                persistentUser.getId(),
                persistentUser.getUsername(),
                persistentUser.getEmail()
        );
    }
}
