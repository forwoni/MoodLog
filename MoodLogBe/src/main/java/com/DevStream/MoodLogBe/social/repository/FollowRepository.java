package com.DevStream.MoodLogBe.social.repository;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.social.domain.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    Optional<Follow> findByFollowerAndFollowing(User follower, User following);
}
