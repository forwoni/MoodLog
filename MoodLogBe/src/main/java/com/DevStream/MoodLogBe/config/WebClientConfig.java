package com.DevStream.MoodLogBe.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .baseUrl("http://localhost:8000") // 👉 FastAPI 서버의 실제 주소:포트로 설정!
                .build();
    }
}
