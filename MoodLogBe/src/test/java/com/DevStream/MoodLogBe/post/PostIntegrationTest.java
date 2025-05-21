package com.DevStream.MoodLogBe.post;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.auth.repository.UserRepository;
import com.DevStream.MoodLogBe.config.CustomUserDetails;
import com.DevStream.MoodLogBe.post.domain.Post;
import com.DevStream.MoodLogBe.post.dto.PostRequestDto;
import com.DevStream.MoodLogBe.post.repository.PostLikeRepository;
import com.DevStream.MoodLogBe.post.repository.PostRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional

public class PostIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostLikeRepository postLikeRepository;

    private User user;

    @BeforeEach
    void setupSecurityContext() {
        // 1. 유저 생성 및 저장 (signup 로직과 유사하게 처리)
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("{noop}password") // 테스트에서는 인코딩 없이 저장하거나 encoder 사용
                .roles(Set.of("ROLE_USER"))  // null 방지 필수
                .build();

        User savedUser = userRepository.save(user);  // 저장된 유저 → ID 필요

        // 2. CustomUserDetails 생성
        CustomUserDetails userDetails = new CustomUserDetails(savedUser);

        // 3. SecurityContext에 등록
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    @WithMockUser(username = "testuser") // 시큐리티 인증
    void 게시글_작성_조회_댓글_좋아요_흐름_테스트() throws Exception {
        // 1. 게시글 작성
        PostRequestDto request = new PostRequestDto("Test Title", "Test Content", false);
        String json = objectMapper.writeValueAsString(request);

        mockMvc.perform(post("/api/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated());

        // 2. 게시글 조회
        Post post = postRepository.findAll().get(0);

        mockMvc.perform(get("/api/posts/" + post.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Title"))
                .andExpect(jsonPath("$.viewCount").value(1));

        // 3. 댓글 작성
        mockMvc.perform(post("/api/posts/" + post.getId() + "/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"content\": \"첫 댓글입니다!\"}"))
                .andExpect(status().isCreated());

        // 4. 게시글 다시 조회해서 댓글 포함 여부 확인
        mockMvc.perform(get("/api/posts/" + post.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.comments[0].content").value("첫 댓글입니다!"));

        // 5. 좋아요 토글 (등록)
        mockMvc.perform(post("/api/posts/" + post.getId() + "/like"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/posts/" + post.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.likeCount").value(1));

        // 6. 좋아요 토글 (취소)
        mockMvc.perform(post("/api/posts/" + post.getId() + "/like"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/posts/" + post.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.likeCount").value(0));
    }
}
