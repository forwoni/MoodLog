package com.DevStream.MoodLogBe.recommendation.service;

import com.DevStream.MoodLogBe.recommendation.dto.EmotionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmotionAnalysisService {
    private final WebClient webClient;

    /**
     * 사용자 텍스트를 AI 서버로 보내고, 감정 분석 및 음악 추천 결과를 받음.
     *
     * @param text 사용자가 입력한 텍스트
     * @return AI 서버 응답 DTO
     */
    public EmotionResponse analyzeEmotion(String text) {
        return webClient.post()
                .uri("/recommend")
                .bodyValue(Map.of("text", text))
                .retrieve()
                .bodyToMono(EmotionResponse.class)
                .block(); // 동기식으로 결과 받기 (비동기라면 .subscribe())
    }
}
