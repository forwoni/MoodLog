package com.DevStream.MoodLogBe.search.service;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.auth.dto.UserResponseDto;
import com.DevStream.MoodLogBe.auth.repository.UserRepository;
import com.DevStream.MoodLogBe.post.domain.Post;
import com.DevStream.MoodLogBe.post.dto.PostResponseDto;
import com.DevStream.MoodLogBe.post.repository.PostRepository;
import com.DevStream.MoodLogBe.search.dto.SearchResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public SearchResponseDto search(String keyword) {
        List<Post> postResults = postRepository.findByTitleContaining(keyword);
        List<User> userResults = userRepository.findByUsernameContaining(keyword);

        List<PostResponseDto> posts = postResults.stream().map(PostResponseDto::from).toList();
        List<UserResponseDto> users = userResults.stream().map(UserResponseDto::from).toList();

        return new SearchResponseDto(posts, users);
    }
}
