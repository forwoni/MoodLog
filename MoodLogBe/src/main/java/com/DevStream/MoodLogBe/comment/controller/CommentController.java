package com.DevStream.MoodLogBe.comment.controller;

import com.DevStream.MoodLogBe.comment.dto.CommentRequestDto;
import com.DevStream.MoodLogBe.comment.dto.CommentResponseDto;
import com.DevStream.MoodLogBe.comment.service.CommentService;
import com.DevStream.MoodLogBe.config.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts/{postId}/comments")
public class CommentController {
    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<Void> create(@PathVariable Long postId,
                                       @RequestBody CommentRequestDto dto,
                                       @AuthenticationPrincipal CustomUserDetails userDetails){
        commentService.create(postId, dto, userDetails.getUser());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<List<CommentResponseDto>> getAll(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getComments(postId));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(@PathVariable Long postId,  // 경로 상 필요하지만 사용은 안 함
                                       @PathVariable Long commentId,
                                       @AuthenticationPrincipal CustomUserDetails userDetails) {
        commentService.delete(commentId, userDetails.getUser());
        return ResponseEntity.noContent().build();
    }
}
