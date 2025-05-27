package com.DevStream.MoodLogBe.recommendation.controller;

import com.DevStream.MoodLogBe.recommendation.dto.EmotionResponse;
import com.DevStream.MoodLogBe.recommendation.service.EmotionAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/emotion")
public class EmotionController {

    private final EmotionAnalysisService emotionAnalysisService;

    @PostMapping("/recommend")
    public EmotionResponse analyzeEmotion(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        return emotionAnalysisService.analyzeEmotion(text);
    }
}
