package com.DevStream.MoodLogBe.search.repository;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.search.domain.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    // 특정 사용자와 키워드로 기존 검색 기록이 있는지 확인
    Optional<SearchHistory> findByUserAndKeyword(User user, String keyword);

    // 특정 사용자의 검색 기록을 최근순으로 최대 10개 조회
    List<SearchHistory> findTop10ByUserOrderByUpdatedAtDesc(User user);

    List<SearchHistory> findTop10ByUserOrderBySearchedAtDesc(User user);

}
