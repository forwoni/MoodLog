package com.DevStream.MoodLogBe.social.mapper;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.social.domain.Follow;
import com.DevStream.MoodLogBe.social.dto.FollowResponseDto;
import org.springframework.stereotype.Component;

@Component
public class FollowMapper {
    public FollowResponseDto toDto(Follow follow) {
        return new FollowResponseDto(
                follow.getId(),
                follow.getFollower().getUsername(),
                follow.getFollowing().getUsername(),
                follow.getFollowing().getProfileImageUrl(),
                follow.getCreatedAt()
        );
    }

    public Follow toEntity(User follower, User following) {
        return Follow.builder()
                .follower(follower)
                .following(following)
                .build();
    }

}
