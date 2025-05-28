package com.DevStream.MoodLogBe.spotify.repository;

import com.DevStream.MoodLogBe.spotify.domain.SpotifyChart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpotifyChartRepository extends JpaRepository<SpotifyChart, Long> {
    List<SpotifyChart> findTop10ByOrderByFetchedAtDesc();
}
