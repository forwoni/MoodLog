package com.DevStream.MoodLogBe.post.service;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.post.domain.Post;
import com.DevStream.MoodLogBe.post.dto.PostRequestDto;
import com.DevStream.MoodLogBe.post.dto.PostResponseDto;
import com.DevStream.MoodLogBe.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public void create(PostRequestDto dto, User user) {
        if(user == null) throw new IllegalArgumentException("인증된 사용자 없음");

        Post post = new Post(
                null,
                dto.title(),
                user,
                dto.content(),
                dto.autoSaved(),
                null,
                null
        );
        postRepository.save(post);
    }

    public List<PostResponseDto> getAll() {
        return postRepository.findAll().stream()
                .map(post -> new PostResponseDto(
                        post.getId(),
                        post.getTitle(),
                        post.getContent(),
                        post.getAutoSaved(),
                        post.getAuthor().getUsername(),
                        post.getCreatedAt(),
                        post.getUpdatedAt()
                ))
                .toList();
    }

    public PostResponseDto getById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("게시글 없음"));

        return new PostResponseDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getAutoSaved(),
                post.getAuthor().getUsername(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }

    @Transactional
    public void update(Long id, PostRequestDto dto, User user) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("게시글 없음"));

        if (!post.getAuthor().getId().equals(user.getId()))
            throw new AccessDeniedException("수정 권한 없음");

        post.update(dto.title(), dto.content(), dto.autoSaved());
    }

    public void delete(Long id, User user) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("게시글 없음"));

        if (!post.getAuthor().getId().equals(user.getId()))
            throw new AccessDeniedException("삭제 권한 없음");

        postRepository.delete(post);
    }
}
