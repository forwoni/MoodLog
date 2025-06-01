package com.DevStream.MoodLogBe.spotify.service;

import com.DevStream.MoodLogBe.spotify.dto.ChartTrackDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.Track;
import org.apache.hc.core5.http.ParseException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;

@Slf4j
@Service
@RequiredArgsConstructor
public class SpotifyChartService {

    // 한국의 인기 있는 노래들의 Spotify Track ID
    private static final List<String> POPULAR_TRACK_IDS = Arrays.asList(
        // Page 1: Japanese Songs
        "3rysOpH29UDtPpv5W2pzWZ", // 小さな恋のうた - 高木さん
        "7pcTLUekZJQnzDOUDuExVJ", // 打上花火 - Daoko
        "5NqGfELjcdvRIUuhgZJ34W", // Marigold - Aimyon
        "1kMlcLyljkrShV0LSdSGBz", // Yesterday - OFFICIAL HIGE DANDISM
        "3KnURrjsXA0TDce8N7iOwz", // 灰色と青 - Kenshi Yonezu
        "1gUAX2ImxDsB3YDcyxMXlB", // カワキヲアメク - 美波
        "7Cd17G3oNQ34OWUwS8ZxfR", // Lemon - Kenshi Yonezu
        "1HNvADmPBGAExeyIHkcJtd", // Sparkle - RADWIMPS
        "1di1C0QI6Y92yZPYn6XYAZ", // シルエット - KANA-BOON
        "6y4GYuZszeXNOXuBFsJlos", // Kaikai Kitan - Eve

        // Page 2: International Pop Hits
        "0k4d5YPDr1r7FX77VdqWez", // You Right - Doja Cat
        "3DarAbFujv6eYNliUTyqtz", // Kiss Me More - Doja Cat
        "1LPSkqVhWVRUkKE03YUkpB", // Leave The Door Open - Bruno Mars
        "3DXncPQOG4VBw3QHh3S817", // I'm the One - DJ Khaled
        "6h5PAsRni4IRlxWr6uDPTP", // More Than You Know - Axwell /\ Ingrosso
        "6ocbgoVGwYJhOv1GgI9NsF", // 7 rings - Ariana Grande
        "5GkQIP5mWPi4KZLLXeuFTT", // motive - Ariana Grande
        "7MXVkk9YMctZqd1Srtv4MB", // Starboy - The Weeknd
        "1sbEeUY8KsdvgiQi26JBFz", // POPSTAR - DJ Khaled
        "6XHVuErjQ4XNm6nDPVCxVX", // No Guidance - Chris Brown

        // Page 3: K-pop Hits
        "6f4CAdAmrOfGH3FOfwHMSV", // Fry's Dream - AKMU
        "3gtlthEgyulDfT8dWdKsnv", // Spicy - aespa
        "7ovUcF5uHTBRzUpB6ZOmvt", // アイドル - YOASOBI
        "50Q0BUdTTtaMumIELoyrm8", // Fast Forward - JEON SOMI
        "5XWlyfo0kZ8LF7VSyfS4Ew", // Drama - aespa
        "6xXCn7H2Yl8SDD6jxo5SpN", // You & Me - JENNIE
        "36ylDwMUz1EqrdbfBF8vC7", // Cupid - FIFTY FIFTY
        "1ULdASrNy5rurl1TZfFaMP", // Spicy - aespa
        "56v8WEnGzLByGsDAXDiv4d", // ETA - NewJeans
        "0pHylQR53epYtRcVIhUSCh", // I Love My Body - HWASA

        // Page 4: Recent Global Hits
        "6mnjcTmK8TewHfyOp3fC9C", // Die Young - Kesha
        "7gaA3wERFkFkgivjwbSvkG", // yes, and? - Ariana Grande
        "0yLdNVWF3Srea0uzk55zFn", // Flowers - Miley Cyrus
        "2JzZzZUQj3Qff7wapcbKjc", // See You Again - Wiz Khalifa
        "0O6u0VJ46W86TxN9wgyqDj", // I Like You - Post Malone
        "7HdXRMw14roDx2a0COWk3M", // This Is Why - Paramore
        "6Knv6wdA0luoMUuuoYi2i1", // My House - Flo Rida
        "1mea3bSkSGXuIRvnydlB5b", // Viva La Vida - Coldplay
        "5vNRhkKd0yEAg8suGBpjeY", // APT. - ROSÉ
        "1K39ty6o1sHwwlZwO6a7wK"  // Wildest Dreams - Taylor Swift
    );

    private final SpotifyTokenService spotifyTokenService;

    public List<ChartTrackDTO> getPopularTracks(int page) {
        List<ChartTrackDTO> tracks = new ArrayList<>();
        SpotifyApi spotifyApi = spotifyTokenService.getSpotifyApi();

        int startIndex = (page - 1) * 10;
        int endIndex = Math.min(startIndex + 10, POPULAR_TRACK_IDS.size());
        
        log.info("Fetching tracks for page {} (indices {} to {})", page, startIndex, endIndex);
        
        for (int i = startIndex; i < endIndex; i++) {
            String trackId = POPULAR_TRACK_IDS.get(i);
            try {
                log.info("Attempting to fetch track with ID: {}", trackId);
                Track track = spotifyApi.getTrack(trackId).build().execute();
                
                ChartTrackDTO dto = ChartTrackDTO.builder()
                    .title(track.getName())
                    .artist(track.getArtists()[0].getName())
                    .albumImageUrl(track.getAlbum().getImages()[0].getUrl())
                    .spotifyId(track.getId())
                    .likes(track.getPopularity())
                    .build();
                
                tracks.add(dto);
                log.info("Successfully fetched track: {} by {}", 
                    track.getName(), track.getArtists()[0].getName());

            } catch (SpotifyWebApiException | ParseException | IOException e) {
                log.error("Failed to fetch track {} with error: {}", trackId, e.getMessage());
                // Continue with next track even if one fails
            }
        }

        log.info("Returning {} tracks for page {}", tracks.size(), page);
        return tracks;
    }

    public int getTotalPages() {
        return (int) Math.ceil(POPULAR_TRACK_IDS.size() / 10.0);
    }
}
