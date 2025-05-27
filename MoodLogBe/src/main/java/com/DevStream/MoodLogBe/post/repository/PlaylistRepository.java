package com.DevStream.MoodLogBe.post.repository;

import com.DevStream.MoodLogBe.post.domain.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    @Query("SELECT p FROM Playlist p WHERE p.post.author.username = :author")
    List<Playlist> findByPostAuthorUsername(@Param("author") String author);

}
