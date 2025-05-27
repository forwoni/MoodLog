package com.DevStream.MoodLogBe.post.repository;

import com.DevStream.MoodLogBe.post.domain.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
}
