package com.DevStream.MoodLogBe.auth.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtUtil {
    // application.yml 에 정의된 값들을 바인딩한 프로퍼티
    private final com.DevStream.MoodLogBe.config.JwtProperties jwtProperties;

    // 서명용 비밀키
    private SecretKey key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
    }
    /**
     * Access Token 생성
     * @param subject   토큰의 subject (예: username 또는 userId)
     * @param claims    추가로 담고 싶은 사용자 정보(Map)
     */

    public String generateAccessToken(String subject, Map<String, Object> claims){
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(subject)
                .addClaims(claims)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + jwtProperties.getAccessTokenExpiry()))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
    /**
     * Refresh Token 생성
     * @param subject 토큰의 subject
     */
    public String generateRefreshToken(String subject) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + jwtProperties.getRefreshTokenExpiry()))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * 토큰에서 클레임 파싱 (유효성 검사 포함)
     */
    public Claims parseClaims(String token) throws JwtException {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    /**
     * 토큰이 유효한지 검사
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            // 토큰 만료, 변조, 서명 오류 등
            return false;
        }
    }

    /**
     * 토큰에서 subject (username 등) 추출
     */
    public String getSubject(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * 토큰 만료일시 확인
     */
    public Date getExpiration(String token) {
        return parseClaims(token).getExpiration();
    }

    public long getAccessExpiry(){
        return jwtProperties.getAccessTokenExpiry();
    }

    public long getRefreshExpiry() {
        return jwtProperties.getRefreshTokenExpiry();
    }

}
