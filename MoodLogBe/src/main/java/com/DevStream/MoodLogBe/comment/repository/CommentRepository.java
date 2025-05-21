package com.DevStream.MoodLogBe.comment.repository;

import com.DevStream.MoodLogBe.comment.domain.Comment;
import com.DevStream.MoodLogBe.post.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPost(Post post);
}
