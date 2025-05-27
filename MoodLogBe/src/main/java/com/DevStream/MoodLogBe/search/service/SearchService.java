package com.DevStream.MoodLogBe.search.service;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.auth.dto.UserResponseDto;
import com.DevStream.MoodLogBe.auth.repository.UserRepository;
import com.DevStream.MoodLogBe.post.domain.Post;
import com.DevStream.MoodLogBe.post.dto.PostResponseDto;
import com.DevStream.MoodLogBe.post.repository.PostRepository;
import com.DevStream.MoodLogBe.post.service.PostService;
import com.DevStream.MoodLogBe.search.dto.SearchResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostService postService;

    /**
     * 키워드를 기준으로 게시글과 사용자 검색
     * - 게시글: 제목, 내용에 키워드 포함
     * - 사용자: 닉네임에 키워드 포함
     * - 게시글은 PostResponseDto로 변환 (플레이리스트 포함)
     * - 사용자도 UserResponseDto로 변환
     */
    public SearchResponseDto search(String keyword) {
        // 게시글 검색 (제목/내용에 키워드 포함)
        List<Post> postResults = postRepository.findByTitleContainingOrContentContaining(keyword, keyword);
        // 사용자 검색 (닉네임에 키워드 포함)
        List<User> userResults = userRepository.findByUsernameContaining(keyword);

        // 게시글 -> DTO 변환 (플레이리스트 포함)
        List<PostResponseDto> posts = postResults.stream()
                .map(postService::toDto)
                .toList();

        // 사용자 -> DTO 변환
        List<UserResponseDto> users = userResults.stream().map(UserResponseDto::from).toList();

        // 검색 결과를 묶어서 반환
        return new SearchResponseDto(posts, users);
    }
}
