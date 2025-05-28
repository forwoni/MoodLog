package com.DevStream.MoodLogBe.auth.service;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.auth.dto.UserResponseDto;
import com.DevStream.MoodLogBe.auth.dto.UserUpdateRequestDto;
import com.DevStream.MoodLogBe.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final LocalFileUploader localFileUploader;

    /**
     * 현재 로그인된 사용자 정보 조회
     */
    @Transactional(readOnly = true)
    public UserResponseDto getCurrentUser(User user) {
        // 사용자 정보를 UserResponseDto로 변환해 반환
        return new UserResponseDto(user.getId(), user.getUsername(), user.getEmail());
    }

    /**
     * 사용자 정보 수정 (닉네임, 비밀번호)
     */
    @Transactional
    public UserResponseDto updateUser(User user, UserUpdateRequestDto dto) {
        // 사용자 엔티티 조회 (없으면 예외)
        User persistentUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        // 현재 비밀번호 검증
        if (!passwordEncoder.matches(dto.currentPassword(), persistentUser.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        // 새로운 닉네임이 입력되었으면 변경
        if (dto.newUsername() != null && !dto.newUsername().isBlank()) {
            persistentUser.setUsername(dto.newUsername());
        }

        // 새로운 비밀번호가 입력되었으면 암호화 후 변경
        if (dto.newPassword() != null && !dto.newPassword().isBlank()) {
            String encoded = passwordEncoder.encode(dto.newPassword());
            persistentUser.setPassword(encoded);
        }

        // 수정된 사용자 정보를 UserResponseDto로 반환
        return new UserResponseDto(
                persistentUser.getId(),
                persistentUser.getUsername(),
                persistentUser.getEmail()
        );
    }
    /**
     *  프로필 이미지 업로드
     */
    @Transactional
    public String updateProfileImage(User user, MultipartFile file) {
        User persistentUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        try {
            // 파일 업로드 (파일명: userId_타임스탬프.확장자)
            String filename = "user_" + user.getId() + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String url = localFileUploader.uploadFile(file, filename);

            // 사용자 엔티티에 이미지 URL 저장
            persistentUser.setProfileImageUrl(url);

            return url; // 프론트에서 이미지 표시 가능
        } catch (Exception e) {
            throw new RuntimeException("프로필 이미지 업로드 실패: " + e.getMessage());
        }
    }
}
