package com.DevStream.MoodLogBe.spotify.dto;

import lombok.Data;

@Data
public class SpotifyTokenResponse {
    private String access_token;
    private String token_type;
    private int expires_in;
}
