package com.DevStream.MoodLogBe.playlist.service;

import com.DevStream.MoodLogBe.playlist.dto.SpotifyTokenResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;

@Service
@RequiredArgsConstructor
public class SpotifyTokenService {
    private final RestTemplate restTemplate;

    @Value("${spotify.client-id}")
    private String clientId;
    @Value("${spotify.client-secret}")
    private String clientSecret;

    public String getAccessToken() {
        String credentials = Base64.getEncoder()
                .encodeToString((clientId + ":" + clientSecret).getBytes());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBasicAuth(clientId, clientSecret);

        MultiValueMap<String,String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "client_credentials");

        HttpEntity<MultiValueMap<String,String>> req = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<SpotifyTokenResponse> res = restTemplate
                    .postForEntity("https://accounts.spotify.com/api/token", req, SpotifyTokenResponse.class);
            return res.getBody().getAccess_token();
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Spotify 인증 실패: " + e.getStatusCode(), e);
        }
    }
}
