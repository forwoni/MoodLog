package com.DevStream.MoodLogBe.post.repository;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.post.domain.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByAuthor(User author, Pageable pageable);

    @Query("""
    SELECT p FROM Post p
    LEFT JOIN p.comments c
    WHERE p.author.username = :username
    GROUP BY p
    ORDER BY COUNT(c) DESC 
    """)
    Page<Post> findPostsByAuthorOrderByCommentCountDesc(@Param("username") String username, Pageable pageable);
    List<Post> findByTitleContaining(String keyword);
    List<Post> findByTitleContainingOrContentContaining(String titleKeyword, String contentKeyword);
}
