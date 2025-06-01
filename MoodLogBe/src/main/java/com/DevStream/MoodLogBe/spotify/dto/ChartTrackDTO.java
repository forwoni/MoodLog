package com.DevStream.MoodLogBe.spotify.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChartTrackDTO {
    private String title;
    private String artist;
    private String albumImageUrl;
    private String spotifyId;
    private int likes;
} 