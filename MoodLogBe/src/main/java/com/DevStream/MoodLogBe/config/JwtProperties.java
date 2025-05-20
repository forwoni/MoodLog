package com.DevStream.MoodLogBe.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    private String secret;
    private long accessTokenExpiry;   // ex. 1000 * 60 * 15  (15분)
    private long refreshTokenExpiry;  // ex. 1000 * 60 * 60 * 24 * 7  (7일)
}
