package com.DevStream.MoodLogBe.playlist.controller;

import com.DevStream.MoodLogBe.playlist.dto.SpotifyTrackDto;
import com.DevStream.MoodLogBe.playlist.service.SpotifyChartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/music")
public class MusicController {
    private final SpotifyChartService spotifyChartService;

    @GetMapping("/chart")
    public List<SpotifyTrackDto> getChart() {
        return spotifyChartService.getTopTracks();
    }
}
