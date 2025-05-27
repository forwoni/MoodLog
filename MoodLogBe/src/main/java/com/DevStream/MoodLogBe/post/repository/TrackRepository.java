package com.DevStream.MoodLogBe.post.repository;

import com.DevStream.MoodLogBe.post.domain.Track;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrackRepository extends JpaRepository<Track, Long> {
}
