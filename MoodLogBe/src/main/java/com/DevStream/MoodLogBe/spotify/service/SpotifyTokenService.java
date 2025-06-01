package com.DevStream.MoodLogBe.spotify.service;

import com.DevStream.MoodLogBe.spotify.dto.SpotifyTokenResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import se.michaelthelin.spotify.SpotifyApi;

import java.util.Base64;
import java.util.concurrent.locks.ReentrantLock;

@Slf4j
@Service
@RequiredArgsConstructor
public class SpotifyTokenService {
    private final RestTemplate restTemplate;
    private final SpotifyApi spotifyApi;

    @Value("${spotify.client-id}")
    private String clientId;
    @Value("${spotify.client-secret}")
    private String clientSecret;

    private volatile String cachedToken;
    private final ReentrantLock tokenLock = new ReentrantLock();

    public synchronized String getAccessToken() {
        try {
            tokenLock.lock();
            if (cachedToken != null) {
                log.debug("Using cached token");
                return cachedToken;
            }

            return refreshToken();
        } finally {
            tokenLock.unlock();
        }
    }

    public String refreshToken() {
        try {
            tokenLock.lock();
            log.info("Fetching new Spotify access token");
            String credentials = Base64.getEncoder().encodeToString((clientId + ":" + clientSecret).getBytes());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.set("Authorization", "Basic " + credentials);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "client_credentials");

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
            
            ResponseEntity<SpotifyTokenResponse> response = restTemplate
                    .postForEntity("https://accounts.spotify.com/api/token", request, SpotifyTokenResponse.class);

            SpotifyTokenResponse tokenResponse = response.getBody();
            if (tokenResponse != null && tokenResponse.getAccess_token() != null) {
                cachedToken = tokenResponse.getAccess_token();
                spotifyApi.setAccessToken(cachedToken);
                log.info("Successfully obtained new Spotify access token");
                return cachedToken;
            }

            throw new RuntimeException("Failed to get Spotify access token: Response body is null or token is missing");
        } catch (Exception e) {
            log.error("Failed to get Spotify access token", e);
            throw new RuntimeException("Failed to get Spotify access token", e);
        } finally {
            tokenLock.unlock();
        }
    }

    public synchronized SpotifyApi getSpotifyApi() {
        String token = getAccessToken();
        spotifyApi.setAccessToken(token);
        return spotifyApi;
    }
}
