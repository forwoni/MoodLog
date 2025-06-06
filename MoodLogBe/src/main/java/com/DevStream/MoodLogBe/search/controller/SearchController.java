package com.DevStream.MoodLogBe.search.controller;

import com.DevStream.MoodLogBe.config.CustomUserDetails;
import com.DevStream.MoodLogBe.search.dto.SearchResponseDto;
import com.DevStream.MoodLogBe.search.service.SearchHistoryService;
import com.DevStream.MoodLogBe.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/search")
public class SearchController {
    private final SearchService searchService;
    private final SearchHistoryService searchHistoryService;

    @GetMapping
    public SearchResponseDto search(@RequestParam String query, @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails != null) {
            searchHistoryService.recordSearch(userDetails.getUser(), query);
        }
        return searchService.search(query);
    }
}
