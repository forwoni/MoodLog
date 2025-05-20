package com.DevStream.MoodLogBe.auth.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.time.Instant;

@Entity
public class RefreshToken {
    @Id @GeneratedValue
    private Long id;

    private String username;
    private String token;
    private Instant expiresAt;

}
