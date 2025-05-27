package com.DevStream.MoodLogBe.social.repository;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.social.domain.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    boolean existsByFollowerAndFollowing(User follower, User following);
    Optional<Follow> findByFollowerAndFollowing(User follower, User following);
    List<Follow> findByFollower(User follower);
    List<Follow> findByFollowing(User following);
}
