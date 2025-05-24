package com.DevStream.MoodLogBe.analyzer;

import java.util.*;

public class EmotionAnalyzer {

    private static final Map<String, String> emotionDictionary = new HashMap<>();

    static {
        // 행복 관련 키워드
        List<String> happyWords = Arrays.asList("기쁘다", "행복하다", "좋다", "즐겁다", "신난다", "감사하다");
        // 슬픔 관련 키워드
        List<String> sadWords = Arrays.asList("슬프다", "우울하다", "눈물", "외롭다", "힘들다", "속상하다");
        // 분노 관련 키워드
        List<String> angryWords = Arrays.asList("화나다", "짜증", "열받다", "싫다", "분노", "짜증나다");
        // 평온 관련 키워드
        List<String> calmWords = Arrays.asList("차분하다", "평온하다", "조용하다", "느긋하다", "편안하다");

        for (String word : happyWords) emotionDictionary.put(word, "happy");
        for (String word : sadWords) emotionDictionary.put(word, "sad");
        for (String word : angryWords) emotionDictionary.put(word, "angry");
        for (String word : calmWords) emotionDictionary.put(word, "calm");
    }

    public String analyzeEmotion(String text) {
        if (text == null || text.isEmpty()) {
            return "neutral";
        }

        Map<String, Integer> emotionCount = new HashMap<>();

        for (Map.Entry<String, String> entry : emotionDictionary.entrySet()) {
            String keyword = entry.getKey();
            String emotion = entry.getValue();

            if (text.contains(keyword)) {
                emotionCount.put(emotion, emotionCount.getOrDefault(emotion, 0) + 1);
            }
        }

        if (emotionCount.isEmpty()) {
            return "neutral";
        }

        return Collections.max(emotionCount.entrySet(), Map.Entry.comparingByValue()).getKey();
    }
}
