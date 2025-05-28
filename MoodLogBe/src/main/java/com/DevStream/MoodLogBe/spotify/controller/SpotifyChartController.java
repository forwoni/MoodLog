package com.DevStream.MoodLogBe.spotify.controller;

import com.DevStream.MoodLogBe.spotify.domain.SpotifyChart;
import com.DevStream.MoodLogBe.spotify.dto.SpotifyTrackDto;
import com.DevStream.MoodLogBe.spotify.service.SpotifyChartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/spotify")
@RequiredArgsConstructor
public class SpotifyChartController {
    private final SpotifyChartService chartService;

    @GetMapping("/charts")
    public ResponseEntity<List<SpotifyTrackDto>> getTop10Tracks() {
        return ResponseEntity.ok(chartService.getTop10Tracks());
    }
}
