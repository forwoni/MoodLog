package com.DevStream.MoodLogBe.spotify.service;

import com.DevStream.MoodLogBe.spotify.domain.SpotifyTrack;
import com.DevStream.MoodLogBe.spotify.repository.SpotifyTrackRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.PlaylistTrack;
import se.michaelthelin.spotify.model_objects.specification.Track;

@Slf4j
@Component
@RequiredArgsConstructor
public class SpotifyChartScheduler {

    private final SpotifyApi spotifyApi;
    private final SpotifyTrackRepository trackRepository;
    private final SpotifyTokenService tokenService;
    
    // 한국 TOP 50 플레이리스트 ID
    private static final String KOREA_TOP_50_PLAYLIST_ID = "37i9dQZEVXbNxXF4SkHj9F";

    @Scheduled(fixedRate = 1800000) // 30분마다 실행
    public void updateSpotifyCharts() {
        try {
            log.info("Updating Spotify charts...");
            
            // 액세스 토큰 갱신
            String accessToken = tokenService.getAccessToken();
            spotifyApi.setAccessToken(accessToken);

            // 플레이리스트 트랙 조회
            Paging<PlaylistTrack> playlistTracks = spotifyApi
                .getPlaylistsItems(KOREA_TOP_50_PLAYLIST_ID)
                .limit(10)
                .build()
                .execute();

            // 기존 데이터 삭제
            trackRepository.deleteAll();

            // 새로운 데이터 저장
            PlaylistTrack[] tracks = playlistTracks.getItems();
            for (int i = 0; i < tracks.length; i++) {
                Track track = (Track) tracks[i].getTrack();
                SpotifyTrack spotifyTrack = SpotifyTrack.builder()
                    .trackId(track.getId())
                    .title(track.getName())
                    .artist(track.getArtists()[0].getName())
                    .externalUrl(track.getExternalUrls().get("spotify"))
                    .imageUrl(track.getAlbum().getImages()[0].getUrl())
                    .rankNum(i + 1)
                    .build();
                
                trackRepository.save(spotifyTrack);
            }
            
            log.info("Spotify charts updated successfully");
        } catch (Exception e) {
            log.error("Failed to update Spotify charts", e);
        }
    }
} 