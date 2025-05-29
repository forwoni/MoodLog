package com.DevStream.MoodLogBe.spotify.repository;

import com.DevStream.MoodLogBe.spotify.domain.SpotifyTrack;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpotifyTrackRepository extends JpaRepository<SpotifyTrack, Long> {
    List<SpotifyTrack> findTop10ByOrderByRankNumAsc();
}
