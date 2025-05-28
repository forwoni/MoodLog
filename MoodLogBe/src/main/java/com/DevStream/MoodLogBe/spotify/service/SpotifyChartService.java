package com.DevStream.MoodLogBe.spotify.service;

import com.DevStream.MoodLogBe.spotify.domain.SpotifyChart;
import com.DevStream.MoodLogBe.spotify.repository.SpotifyChartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SpotifyChartService {

    private final SpotifyChartRepository chartRepository;
    private final SpotifyTokenService spotifyTokenService;
    private final RestTemplate restTemplate;

    // 스케줄러: 1시간마다 Spotify 차트 갱신
    @Scheduled(cron = "0 0 * * * *") // 매시 정각
    @Transactional
    public void updateSpotifyCharts() {
        String accessToken = spotifyTokenService.getAccessToken();

        // Spotify 차트 API 호출
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> req = new HttpEntity<>(headers);

        String playlistId = "37i9dQZEVXbMDoHDwVN2tF";
        String url = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";
        ResponseEntity<Map> res = restTemplate.exchange(url, HttpMethod.GET, req, Map.class);

        // 응답 파싱해서 10개 곡 DB에 저장
        List<Map<String, Object>> items = (List<Map<String, Object>>) res.getBody().get("items");
        chartRepository.deleteAll(); // 기존 차트 삭제
        for (Map<String, Object> item : items) {
            Map<String, Object> track = (Map<String, Object>) item.get("track");
            chartRepository.save(new SpotifyChart(
                    null,
                    (String) track.get("name"),
                    ((Map<String, Object>) ((List<?>) track.get("artists")).get(0)).get("name").toString(),
                    (String) ((Map<String, Object>) track.get("external_urls")).get("spotify"),
                    LocalDateTime.now()
            ));
        }
    }

    // 프론트로 최신 차트 조회
    @Transactional(readOnly = true)
    public List<SpotifyChart> getLatestCharts() {
        return chartRepository.findTop10ByOrderByFetchedAtDesc();
    }
}
