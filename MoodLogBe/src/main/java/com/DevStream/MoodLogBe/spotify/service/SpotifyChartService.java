package com.DevStream.MoodLogBe.spotify.service;

import com.DevStream.MoodLogBe.spotify.dto.SpotifyTrackDto;
import com.DevStream.MoodLogBe.spotify.repository.SpotifyTrackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpotifyChartService {

    private final SpotifyTrackRepository trackRepository;

    @Transactional(readOnly = true)
    public List<SpotifyTrackDto> getTop10Tracks() {
        return trackRepository.findTop10ByOrderByRankNumAsc().stream()
                .map(track -> SpotifyTrackDto.builder()
                        .trackId(track.getTrackId())
                        .title(track.getTitle())
                        .artist(track.getArtist())
                        .externalUrl(track.getExternalUrl())
                        .imageUrl(track.getImageUrl())
                        .rankNum(track.getRankNum())
                        .build())
                .collect(Collectors.toList());
    }
}
