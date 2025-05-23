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

    @Transactional
    public void recordSearch(User user, String keyword) {
        searchHistoryRepository.findByUserAndKeyword(user, keyword)
                .ifPresentOrElse(history -> {
                    // 기존 검색어가 있으면 updatedAt만 갱신
                    history.updateTimestamp();
                }, () -> {
                    // 없으면 새로 저장
                    SearchHistory newHistory = SearchHistory.builder()
                            .user(user)
                            .keyword(keyword)
                            .build();
                    searchHistoryRepository.save(newHistory);
                });
    }

    @Transactional(readOnly = true)
    public List<SearchHistory> getRecentSearches(User user) {
        return searchHistoryRepository.findTop10ByUserOrderByUpdatedAtDesc(user);
    }


    public List<SearchHistoryDto> getRecentHistories(User user) {
        return searchHistoryRepository.findTop10ByUserOrderBySearchedAtDesc(user).stream()
                .map(SearchHistoryDto::from)
                .toList();
    }
}
