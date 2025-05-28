package com.DevStream.MoodLogBe.social.service;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.auth.repository.UserRepository;
import com.DevStream.MoodLogBe.notification.domain.NotificationType;
import com.DevStream.MoodLogBe.notification.service.NotificationService;
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

    /**
     * 팔로우 생성
     * - 대상 유저를 찾아서 팔로우 관계를 저장
     * - 이미 팔로우 중이라면 예외
     * - 자기 자신을 팔로우할 수 없음
     * - 알림 전송
     */
    @Transactional
    public void follow(User follower, FollowRequestDto dto) {
        // 대상 유저 찾기
        User following = userRepository.findByUsername(dto.followingUsername())
                .orElseThrow(() -> new EntityNotFoundException("대상 유저를 찾을 수 없습니다."));

        // 자기 자신 팔로우 방지
        if (follower.equals(following)) {
            throw new IllegalArgumentException("자기 자신을 팔로우할 수 없습니다.");
        }

        // 이미 팔로우 중인지 확인
        boolean alreadyExists = followRepository.existsByFollowerAndFollowing(follower, following);
        if (alreadyExists) {
            throw new IllegalArgumentException("이미 팔로우한 유저입니다.");
        }

        // 팔로우 관계 저장
        Follow follow = new Follow(null, follower, following, null);
        followRepository.save(follow);

        // 팔로우 알림 전송
        notificationService.send(
                following,
                follower.getUsername() + "님이 회원님을 팔로우했습니다.",
                NotificationType.FOLLOW
        );
    }

    /**
     * 언팔로우
     * - 팔로우 관계를 찾아서 삭제
     */
    @Transactional
    public void unfollow(User follower, FollowRequestDto dto) {
        // 대상 유저 찾기
        User following = userRepository.findByUsername(dto.followingUsername())
                .orElseThrow(() -> new EntityNotFoundException("대상 유저를 찾을 수 없습니다."));

        // 팔로우 관계 찾기
        Follow follow = followRepository.findByFollowerAndFollowing(follower, following)
                .orElseThrow(() -> new NoSuchElementException("팔로우 관계가 존재하지 않습니다."));

        // 언팔로우
        followRepository.delete(follow);
    }

    /**
     * 특정 사용자를 팔로우 중인지 확인
     */
    @Transactional(readOnly = true)
    public boolean isFollowing(User follower, String targetUsername) {
        return userRepository.findByUsername(targetUsername)
                .map(target -> followRepository.existsByFollowerAndFollowing(follower, target))
                .orElse(false);
    }

    /**
     * 사용자가 팔로우 중인 모든 대상 목록 반환
     */
    @Transactional(readOnly = true)
    public List<FollowResponseDto> getAllFollowings(User user) {
        return followRepository.findByFollower(user).stream()
                .map(followMapper::toDto)
                .toList();
    }

    /**
     * 사용자를 팔로우하는 대상 목록 반환
     */
    @Transactional(readOnly = true)
    public List<FollowResponseDto> getFollowers(User user) {
        return followRepository.findByFollowing(user).stream()
                .map(followMapper::toDto)
                .toList();
    }
}
