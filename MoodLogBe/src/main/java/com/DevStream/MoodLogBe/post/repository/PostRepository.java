package com.DevStream.MoodLogBe.post.repository;

import com.DevStream.MoodLogBe.post.domain.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByAuthorUsernameOrderByCreatedAtDesc(String username, Pageable pageable);
    Page<Post> findByAuthorUsernameOrderByLikeCountDesc(String username, Pageable pageable);
    Page<Post> findByAuthorUsernameOrderByCommentCountDesc(String username, Pageable pageable);

}
