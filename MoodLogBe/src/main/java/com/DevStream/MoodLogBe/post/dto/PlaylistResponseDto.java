package com.DevStream.MoodLogBe.post.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class PlaylistResponseDto {
    private Long id;
    private String name;
    private String description;
    private List<TrackDto> tracks;

    @Getter
    @AllArgsConstructor
    public static class TrackDto {
        private String trackName;
        private String artist;
        private String spotifyUrl;
    }
}
