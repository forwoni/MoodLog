package com.DevStream.MoodLogBe.post.repository;

import com.DevStream.MoodLogBe.post.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
