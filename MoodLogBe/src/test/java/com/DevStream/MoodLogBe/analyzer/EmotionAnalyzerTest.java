package com.DevStream.MoodLogBe.analyzer;

import com.DevStream.MoodLogBe.analyzer.EmotionAnalyzer;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class EmotionAnalyzerTest {

    EmotionAnalyzer analyzer = new EmotionAnalyzer();

    @Test
    public void testHappyEmotion() {
        String result = analyzer.analyzeEmotion("오늘은 정말 기쁘고 신나는 날이에요!");
        assertEquals("happy", result);
    }

    @Test
    public void testSadEmotion() {
        String result = analyzer.analyzeEmotion("요즘 너무 슬프고 외로워요.");
        assertEquals("sad", result);
    }

    @Test
    public void testAngryEmotion() {
        String result = analyzer.analyzeEmotion("진짜 짜증나고 열받는 상황이었어.");
        assertEquals("angry", result);
    }

    @Test
    public void testCalmEmotion() {
        String result = analyzer.analyzeEmotion("오늘은 조용하고 차분한 하루였어.");
        assertEquals("calm", result);
    }

    @Test
    public void testNeutralEmotion() {
        String result = analyzer.analyzeEmotion("점심으로 김치찌개 먹고 산책했어.");
        assertEquals("neutral", result);
    }
}
