package com.DevStream.MoodLogBe.post.controller;

import com.DevStream.MoodLogBe.post.domain.Playlist;
import com.DevStream.MoodLogBe.post.dto.PlaylistResponseDto;
import com.DevStream.MoodLogBe.post.repository.PlaylistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/playlists")
@RequiredArgsConstructor
public class PlaylistController {
    private final PlaylistRepository playlistRepository;

    @GetMapping
    public List<PlaylistResponseDto> getAllPlaylists(@RequestParam(required = false) String author) {
        List<Playlist> playlists;

        if (author != null) {
            playlists = playlistRepository.findByPostAuthorUsername(author);
        } else {
            playlists = playlistRepository.findAll();
        }

        return playlists.stream()
                .map(playlist -> new PlaylistResponseDto(
                        playlist.getId(),
                        playlist.getName(),
                        playlist.getDescription(),
                        playlist.getTracks().stream()
                                .map(track -> new PlaylistResponseDto.TrackDto(
                                        track.getTrackName(),
                                        track.getArtist(),
                                        track.getSpotifyUrl()
                                )).toList()
                ))
                .toList();
    }
}
