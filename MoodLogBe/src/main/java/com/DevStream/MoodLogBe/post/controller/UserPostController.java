package com.DevStream.MoodLogBe.post.controller;

import com.DevStream.MoodLogBe.post.dto.PostResponseDto;
import com.DevStream.MoodLogBe.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserPostController {
    private final PostService postService;

    /**
     * 특정 유저가 작성한 게시글 목록 조회 (정렬/페이징 지원)
     * @param username 조회 대상 유저의 username
     * @param sort 정렬 조건: recent | likes | comments
     * @param pageable page, size, sort (Spring 자동 매핑)
     */
    @GetMapping("/{username}/posts")
    public Page<PostResponseDto> getUserPosts(@PathVariable String username,
                                              @RequestParam(defaultValue = "recent") String sort,
                                              Pageable pageable) {
        return postService.getPostsByUsername(username, sort, pageable);
    }
}
