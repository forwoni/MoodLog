package com.DevStream.MoodLogBe.post.service;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.auth.repository.UserRepository;
import com.DevStream.MoodLogBe.comment.dto.CommentResponseDto;
import com.DevStream.MoodLogBe.post.domain.Post;
import com.DevStream.MoodLogBe.post.dto.PostRequestDto;
import com.DevStream.MoodLogBe.post.dto.PostResponseDto;
import com.DevStream.MoodLogBe.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public void create(PostRequestDto dto, User user) {
        if(user == null) throw new IllegalArgumentException("인증된 사용자 없음");

        Post post = new Post(
                null,
                dto.title(),
                user,
                dto.content(),
                dto.autoSaved(),
                null,
                null,
                0,
                new ArrayList<>(),
                new ArrayList<>(),
                0
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
                        post.getUpdatedAt(),
                        post.getViewCount(),
                        post.getLikeCount(),
                        List.of()
                ))
                .toList();
    }

    public PostResponseDto getById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("게시글 없음"));

        post.increaseViewCount();

        List<CommentResponseDto> commentDtos = post.getComments().stream()
                .map(comment -> new CommentResponseDto(
                        comment.getId(),
                        comment.getContent(),
                        comment.getAuthor().getUsername(),
                        comment.getCreatedAt()
                ))
                .toList();


        return new PostResponseDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getAutoSaved(),
                post.getAuthor().getUsername(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                post.getViewCount(),
                post.getLikeCount(),
                commentDtos
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
    @Transactional(readOnly = true)
    public Page<PostResponseDto> getPostsByUsername(String username, String sortBy, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("해당 사용자를 찾을 수 없습니다."));

        return switch (sortBy) {
            case "likes" -> postRepository.findByAuthor(user,
                            PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "likeCount")))
                    .map(this::toDto);
            case "comments" -> postRepository.findPostsByAuthorOrderByCommentCountDesc(username, pageable)
                    .map(this::toDto);
            default -> postRepository.findByAuthor(user,
                            PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "createdAt")))
                    .map(this::toDto);
        };
    }

    private PostResponseDto toDto(Post post) {
        return new PostResponseDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getAutoSaved(),
                post.getAuthor().getUsername(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                post.getViewCount(),
                post.getLikeCount(),
                post.getComments().stream().map(comment -> new CommentResponseDto(
                        comment.getId(),
                        comment.getContent(),
                        comment.getAuthor().getUsername(),
                        comment.getCreatedAt()
                )).toList()
        );
    }

}
