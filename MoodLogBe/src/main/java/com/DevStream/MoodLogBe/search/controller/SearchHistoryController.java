package com.DevStream.MoodLogBe.search.controller;

import com.DevStream.MoodLogBe.config.CustomUserDetails;
import com.DevStream.MoodLogBe.search.dto.SearchHistoryDto;
import com.DevStream.MoodLogBe.search.service.SearchHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/search/histories")
public class SearchHistoryController {
    private final SearchHistoryService searchHistoryService;

    @GetMapping
    public List<SearchHistoryDto> getRecentHistories(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return searchHistoryService.getRecentHistories(userDetails.getUser());
    }
}
