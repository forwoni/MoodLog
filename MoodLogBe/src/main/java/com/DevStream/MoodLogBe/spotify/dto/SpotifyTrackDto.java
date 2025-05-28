package com.DevStream.MoodLogBe.spotify.dto;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpotifyTrackDto {
    private String trackId;
    private String title;
    private String artist;
    private String externalUrl;
    private String imageUrl;
    private Integer rankNum;
}
