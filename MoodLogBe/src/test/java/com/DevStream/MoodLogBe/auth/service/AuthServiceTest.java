package com.DevStream.MoodLogBe.auth.service;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.auth.dto.SignupRequestDto;
import com.DevStream.MoodLogBe.auth.dto.SignupResponseDto;
import com.DevStream.MoodLogBe.auth.repository.RefreshTokenRepository;
import com.DevStream.MoodLogBe.auth.repository.UserRepository;
import com.DevStream.MoodLogBe.auth.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AuthServiceTest {
    @InjectMocks
    private AuthService authService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // AuthService 생성 시 BCryptPasswordEncoder 주입
        authService = new AuthService(
                userRepository,
                passwordEncoder,
                jwtUtil,
                refreshTokenRepository
        );
    }

    @Test
    @DisplayName("성공: 신규 회원가입")
    void signup_success(){
        //given
        SignupRequestDto req = new SignupRequestDto("test", "test@hufs.ac.kr", "pass");
        when(userRepository.existsByEmail(req.getEmail())).thenReturn(false);
        when(userRepository.existsByUsername(req.getUsername())).thenReturn(false);

        // 저장 시점에 id가 찍히도록 모킹
        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        when(userRepository.save(captor.capture())).thenAnswer(inv ->{
            User u = inv.getArgument(0);
            u.setId(42L);
            return u;
        });
        //when
        SignupResponseDto dto = authService.signup(req);

        //then
        assertThat(dto.getId()).isEqualTo(42L);
        assertThat(dto.getUsername()).isEqualTo("test");
        assertThat(dto.getEmail()).isEqualTo("test@hufs.ac.kr");

        // 저장된 User 객체 검증 (암호화, Role 포함 등)
        User saved = captor.getValue();
        assertThat(passwordEncoder.matches("pass", saved.getPassword())).isTrue();
        assertThat(saved.getRoles()).containsExactly("ROLE_USER");

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("실패: 이메일 중복")
    void signup_fails_whenEmailExists(){
        //given
        SignupRequestDto req = new SignupRequestDto("Hawon", "Hawon@example.com", "pw");
        when(userRepository.existsByEmail(req.getEmail())).thenReturn(true);

        //then
        assertThatThrownBy(() -> authService.signup(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("이미 사용중인 이메일입니다.");
    }

    @Test
    @DisplayName("실패: username 중복")
    void signup_fails_whenUsernameExists(){
        //given
        SignupRequestDto req = new SignupRequestDto("Hawon", "Hawon@example.com", "pw");
        when(userRepository.existsByUsername(req.getUsername())).thenReturn(true);

        //then
        assertThatThrownBy(() -> authService.signup(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("이미 사용중인 이름입니다.");
    }
}
