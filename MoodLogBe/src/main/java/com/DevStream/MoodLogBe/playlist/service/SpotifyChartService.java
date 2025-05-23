package com.DevStream.MoodLogBe.playlist.service;

import com.DevStream.MoodLogBe.playlist.dto.SpotifyTrackDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SpotifyChartService {
    private final SpotifyTokenService spotifyTokenService;
    private final RestTemplate restTemplate = new RestTemplate();

    public List<SpotifyTrackDto> getTopTracks() {
        String accessToken = spotifyTokenService.getAccessToken();
        String playlistId = "37i9dQZF1DXcBWIGoYBM5M"; // 글로벌 Top 50

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        String url = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
        List<Map<String, Object>> items = (List<Map<String, Object>>) response.getBody().get("items");

        List<SpotifyTrackDto> result = new ArrayList<>();
        int rank = 1;

        for (Map<String, Object> item : items) {
            Map<String, Object> track = (Map<String, Object>) item.get("track");

            String title = (String) track.get("name");

            List<Map<String, Object>> artists = (List<Map<String, Object>>) track.get("artists");
            String artist = (String) artists.get(0).get("name");

            Map<String, Object> album = (Map<String, Object>) track.get("album");
            List<Map<String, Object>> images = (List<Map<String, Object>>) album.get("images");
            String imageUrl = (String) images.get(0).get("url");

            result.add(new SpotifyTrackDto(title, artist, imageUrl, rank++));
        }

        return result;
    }
}
