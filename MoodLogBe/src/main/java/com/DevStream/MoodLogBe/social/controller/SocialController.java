package com.DevStream.MoodLogBe.social.controller;

import com.DevStream.MoodLogBe.config.CustomUserDetails;
import com.DevStream.MoodLogBe.social.dto.FollowRequestDto;
import com.DevStream.MoodLogBe.social.dto.FollowResponseDto;
import com.DevStream.MoodLogBe.social.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/social")
public class SocialController {
    private final FollowService followService;

    @PostMapping("/follow")
    public ResponseEntity<Void> follow(@AuthenticationPrincipal CustomUserDetails userDetails,
                                       @RequestBody FollowRequestDto dto) {
        followService.follow(userDetails.getUser(), dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/unfollow")
    public ResponseEntity<Void> unfollow(@AuthenticationPrincipal CustomUserDetails userDetails,
                                         @RequestBody FollowRequestDto dto) {
        followService.unfollow(userDetails.getUser(), dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/is-following")
    public ResponseEntity<Boolean> isFollowing(@AuthenticationPrincipal CustomUserDetails userDetails,
                                               @RequestParam String target) {
        boolean result = followService.isFollowing(userDetails.getUser(), target);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/followings")
    public ResponseEntity<List<FollowResponseDto>> getFollowings(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(followService.getAllFollowings(userDetails.getUser()));
    }
}
