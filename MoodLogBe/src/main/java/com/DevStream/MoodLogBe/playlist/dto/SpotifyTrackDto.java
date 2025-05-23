package com.DevStream.MoodLogBe.playlist.dto;

public record SpotifyTrackDto(
        String title,
        String artist,
        String albumImageUrl,
        int rank
) {}
