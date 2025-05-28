package com.DevStream.MoodLogBe.recommendation.dto;

import lombok.Data;

import java.util.List;

@Data
public class EmotionResponse {
    private String emotion;
    private List<Track> tracks;

    @Data
    public static class Track{
        private String track_name;
        private String artist;
        private String album_image;
        private String spotify_url;
    }
}
