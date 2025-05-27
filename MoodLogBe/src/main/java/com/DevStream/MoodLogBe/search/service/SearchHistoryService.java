package com.DevStream.MoodLogBe.search.service;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.search.domain.SearchHistory;
import com.DevStream.MoodLogBe.search.dto.SearchHistoryDto;
import com.DevStream.MoodLogBe.search.repository.SearchHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchHistoryService {
    private final SearchHistoryRepository searchHistoryRepository;

    /**
     * 사용자의 검색 기록을 기록
     * - 같은 키워드가 이미 있으면 updatedAt만 갱신
     * - 없으면 새로 저장
     */
    @Transactional
    public void recordSearch(User user, String keyword) {
        searchHistoryRepository.findByUserAndKeyword(user, keyword)
                .ifPresentOrElse(history -> {
                    // 기존 검색어가 있으면 updatedAt만 갱신
                    history.updateTimestamp();
                    searchHistoryRepository.save(history); // ⭐️⭐️⭐️ save 명시적으로 호출!
                }, () -> {
                    // 없으면 새로 저장
                    SearchHistory newHistory = SearchHistory.builder()
                            .user(user)
                            .keyword(keyword)
                            .build();
                    searchHistoryRepository.save(newHistory);
                });
    }

    /**
     * 최근 검색 기록(엔티티)을 조회
     * - 최신순 최대 10개 반환
     */
    @Transactional(readOnly = true)
    public List<SearchHistory> getRecentSearches(User user) {
        return searchHistoryRepository.findTop10ByUserOrderByUpdatedAtDesc(user);
    }

    /**
     * 최근 검색 기록을 DTO로 변환하여 반환
     */
    public List<SearchHistoryDto> getRecentHistories(User user) {
        return searchHistoryRepository.findTop10ByUserOrderBySearchedAtDesc(user).stream()
                .map(SearchHistoryDto::from)
                .toList();
    }
}
