package com.DevStream.MoodLogBe.spotify.controller;

import com.DevStream.MoodLogBe.spotify.dto.ChartTrackDTO;
import com.DevStream.MoodLogBe.spotify.service.SpotifyChartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Slf4j
@RestController
@RequestMapping("/api/spotify/chart")
@RequiredArgsConstructor
public class SpotifyChartController {

    private final SpotifyChartService spotifyChartService;

    @GetMapping("/popular")
    public ResponseEntity<Map<String, Object>> getPopularTracks(
            @RequestParam(defaultValue = "1") int page) {
        try {
            log.info("Fetching popular tracks for page: {}", page);
            List<ChartTrackDTO> tracks = spotifyChartService.getPopularTracks(page);
            int totalPages = spotifyChartService.getTotalPages();
            
            Map<String, Object> response = new HashMap<>();
            response.put("tracks", tracks);
            response.put("currentPage", page);
            response.put("totalPages", totalPages);
            
            log.info("Successfully retrieved {} tracks for page {}", tracks.size(), page);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get popular tracks: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
