package com.DevStream.MoodLogBe.playlist.controller;

import com.DevStream.MoodLogBe.playlist.service.SpotifyTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/spotify")
@RequiredArgsConstructor
public class SpotifyTokenController {
    private final SpotifyTokenService tokenService;

    @GetMapping("/token")
    public ResponseEntity<Map<String, String>> token() {
        String accessToken = tokenService.getAccessToken();
        return ResponseEntity.ok(Map.of("access_token", accessToken));
    }
}
