package com.DevStream.MoodLogBe.config;

import com.DevStream.MoodLogBe.auth.filter.JwtAuthenticationFilter;
import com.DevStream.MoodLogBe.auth.repository.UserRepository;
import com.DevStream.MoodLogBe.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1) CSRF 끄기, 세션 사용 안 함
                .csrf(csrf->csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 2) 인증/인가 규칙
                .authorizeHttpRequests(auth ->
                        auth
                                // signup/login 은 모두 허용
                                .requestMatchers("/api/auth/**").permitAll()
                                // 403 추적을 위한 스프링 기본 error 핸들러
                                .requestMatchers("/error").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/posts").authenticated()
                                // 그 외 모든 요청은 인증 필요
                                .anyRequest().authenticated()
                )

                // 3) JWT 필터를 스프링 시큐리티 필터 체인 앞단에 추가
                .addFilterBefore(jwtAuthenticationFilter(),
                        org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
        ;

        return http.build();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtil, userRepository);
    }
}
