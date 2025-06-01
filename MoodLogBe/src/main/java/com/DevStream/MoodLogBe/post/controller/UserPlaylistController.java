package com.DevStream.MoodLogBe.post.controller;

import com.DevStream.MoodLogBe.post.domain.Playlist;
import com.DevStream.MoodLogBe.post.dto.PlaylistResponseDto;
import com.DevStream.MoodLogBe.post.repository.PlaylistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users/{username}/playlists")
public class UserPlaylistController {
    private final PlaylistRepository playlistRepository;

    @GetMapping
    public List<PlaylistResponseDto> getUserPlaylists(@PathVariable String username) {
        List<Playlist> playlists = playlistRepository.findByPostAuthorUsername(username);

        return playlists.stream()
                .map(playlist -> new PlaylistResponseDto(
                        playlist.getId(),
                        playlist.getName(),
                        playlist.getDescription(),
                        playlist.getTracks().stream()
                                .map(track -> new PlaylistResponseDto.TrackDto(
                                        track.getTrackName(),
                                        track.getArtist(),
                                        track.getAlbumImage(),
                                        track.getSpotifyUrl()
                                )).toList()
                ))
                .toList();
    }
}
