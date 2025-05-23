package com.DevStream.MoodLogBe.social.service;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.auth.repository.UserRepository;
import com.DevStream.MoodLogBe.notificaiton.domain.NotificationType;
import com.DevStream.MoodLogBe.notificaiton.service.NotificationService;
import com.DevStream.MoodLogBe.social.domain.Follow;
import com.DevStream.MoodLogBe.social.dto.FollowRequestDto;
import com.DevStream.MoodLogBe.social.dto.FollowResponseDto;
import com.DevStream.MoodLogBe.social.mapper.FollowMapper;
import com.DevStream.MoodLogBe.social.repository.FollowRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class FollowService {
    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final FollowMapper followMapper;
    private final NotificationService notificationService;

    @Transactional
    public void follow(User follower, FollowRequestDto dto) {
        User following = userRepository.findByUsername(dto.followingUsername())
                .orElseThrow(() -> new EntityNotFoundException("대상 유저를 찾을 수 없습니다."));

        if (follower.equals(following)) {
            throw new IllegalArgumentException("자기 자신을 팔로우할 수 없습니다.");
        }

        boolean alreadyExists = followRepository.existsByFollowerAndFollowing(follower, following);
        if (alreadyExists) {
            throw new IllegalArgumentException("이미 팔로우한 유저입니다.");
        }

        Follow follow = new Follow(null, follower, following, null);
        followRepository.save(follow);

        // ✨ 알림 전송
        notificationService.send(
                following,
                follower.getUsername() + "님이 회원님을 팔로우했습니다.",
                NotificationType.FOLLOW
        );
    }

    @Transactional
    public void unfollow(User follower, FollowRequestDto dto) {
        User following = userRepository.findByUsername(dto.followingUsername())
                .orElseThrow(() -> new EntityNotFoundException("대상 유저를 찾을 수 없습니다."));

        Follow follow = followRepository.findByFollowerAndFollowing(follower, following)
                .orElseThrow(() -> new NoSuchElementException("팔로우 관계가 존재하지 않습니다."));

        followRepository.delete(follow);
    }

    @Transactional(readOnly = true)
    public boolean isFollowing(User follower, String targetUsername) {
        return userRepository.findByUsername(targetUsername)
                .map(target -> followRepository.existsByFollowerAndFollowing(follower, target))
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public List<FollowResponseDto> getAllFollowings(User user) {
        return followRepository.findByFollower(user).stream()
                .map(followMapper::toDto)
                .toList();
    }
}
