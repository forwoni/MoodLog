package com.DevStream.MoodLogBe.spotify.domain;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpotifyTrack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String trackId;
    private String title;
    private String artist;
    private String externalUrl;
    private String imageUrl;
    private Integer rankNum;
}
