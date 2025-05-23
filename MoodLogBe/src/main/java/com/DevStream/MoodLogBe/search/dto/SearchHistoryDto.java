package com.DevStream.MoodLogBe.search.dto;

import com.DevStream.MoodLogBe.search.domain.SearchHistory;

import java.time.LocalDateTime;

public record SearchHistoryDto(
        String keyword,
        LocalDateTime searchedAt
){
    public static SearchHistoryDto from(SearchHistory history) {
        return new SearchHistoryDto(
                history.getKeyword(),
                history.getSearchedAt()
        );
    }
}
