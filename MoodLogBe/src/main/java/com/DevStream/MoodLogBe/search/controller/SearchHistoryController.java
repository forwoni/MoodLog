package com.DevStream.MoodLogBe.search.controller;

import com.DevStream.MoodLogBe.config.CustomUserDetails;
import com.DevStream.MoodLogBe.search.dto.SearchHistoryDto;
import com.DevStream.MoodLogBe.search.service.SearchHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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

    @DeleteMapping("/{keyword}")
    public ResponseEntity<Void> deleteSearchHistory(
            @PathVariable String keyword,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        searchHistoryService.deleteSearchHistory(userDetails.getUser(), keyword);
        return ResponseEntity.ok().build();
    }
}
