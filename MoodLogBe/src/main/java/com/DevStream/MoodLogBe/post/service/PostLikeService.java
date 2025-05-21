package com.DevStream.MoodLogBe.post.service;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.post.domain.Post;
import com.DevStream.MoodLogBe.post.domain.PostLike;
import com.DevStream.MoodLogBe.post.repository.PostLikeRepository;
import com.DevStream.MoodLogBe.post.repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;

    @Transactional
    public boolean toggleLike(Long postId, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));

        Optional<PostLike> existing = postLikeRepository.findByPostAndUser(post, user);

        if (existing != null) {
            postLikeRepository.delete(existing.get());
            post.decreaseLikeCount();
            return false; // 좋아요 취소
        } else {
            PostLike newLike = new PostLike(null, post, user);
            postLikeRepository.save(newLike);
            post.increaseLikeCount();
            return true; // 좋아요 추가
        }
    }
}
