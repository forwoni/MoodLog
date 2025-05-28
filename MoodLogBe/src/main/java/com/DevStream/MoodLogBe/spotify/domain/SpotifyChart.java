package com.DevStream.MoodLogBe.spotify.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SpotifyChart {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String trackName;
    private String artist;
    private String spotifyUrl;

    private LocalDateTime fetchedAt;
}
