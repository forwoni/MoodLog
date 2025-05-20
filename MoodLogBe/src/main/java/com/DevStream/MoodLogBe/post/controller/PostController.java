package com.DevStream.MoodLogBe.post.controller;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.post.dto.PostRequestDto;
import com.DevStream.MoodLogBe.post.dto.PostResponseDto;
import com.DevStream.MoodLogBe.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody PostRequestDto dto,
                                       @AuthenticationPrincipal User user) {
        postService.create(dto, user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getAll() {
        return ResponseEntity.ok(postService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id,
                                       @RequestBody PostRequestDto dto,
                                       @AuthenticationPrincipal User user) {
        postService.update(id, dto, user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @AuthenticationPrincipal User user) {
        postService.delete(id, user);
        return ResponseEntity.noContent().build();
    }

}
