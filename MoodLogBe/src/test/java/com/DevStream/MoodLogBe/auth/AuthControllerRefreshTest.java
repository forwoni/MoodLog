package com.DevStream.MoodLogBe.auth;

import com.DevStream.MoodLogBe.auth.controller.AuthController;
import com.DevStream.MoodLogBe.auth.dto.RefreshRequestDto;
import com.DevStream.MoodLogBe.auth.dto.RefreshResponseDto;
import com.DevStream.MoodLogBe.auth.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;


@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerRefreshTest {
    @Autowired
    MockMvc mvc;
    @MockBean
    AuthService authService;
    @Autowired
    ObjectMapper om;

    @Test
    void refresh_success() throws Exception {
        var reqDto = new RefreshRequestDto("old-refresh-token");
        var resDto = new RefreshResponseDto("new-access", "new-refresh");

        when(authService.refresh(any())).thenReturn(resDto);

        mvc.perform(post("/api/auth/refresh")
                        .contentType(APPLICATION_JSON)
                        .content(om.writeValueAsString(reqDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("new-access"))
                .andExpect(jsonPath("$.refreshToken").value("new-refresh"));
    }

    @Test
    void refresh_fail_invalid() throws Exception {
        var reqDto = new RefreshRequestDto("bad-token");
        when(authService.refresh(any()))
                .thenThrow(new IllegalArgumentException("Refresh token not found."));

        mvc.perform(post("/api/auth/refresh")
                        .contentType(APPLICATION_JSON)
                        .content(om.writeValueAsString(reqDto)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Refresh token not found."));
    }
}
