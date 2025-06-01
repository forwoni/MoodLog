package com.DevStream.MoodLogBe.post.service;

import com.DevStream.MoodLogBe.auth.domain.User;
import com.DevStream.MoodLogBe.auth.repository.UserRepository;
import com.DevStream.MoodLogBe.comment.dto.CommentResponseDto;
import com.DevStream.MoodLogBe.post.domain.Playlist;
import com.DevStream.MoodLogBe.post.domain.Post;
import com.DevStream.MoodLogBe.post.domain.Track;
import com.DevStream.MoodLogBe.post.dto.PlaylistResponseDto;
import com.DevStream.MoodLogBe.post.dto.PostRequestDto;
import com.DevStream.MoodLogBe.post.dto.PostResponseDto;
import com.DevStream.MoodLogBe.post.repository.PlaylistRepository;
import com.DevStream.MoodLogBe.post.repository.PostRepository;
import com.DevStream.MoodLogBe.post.repository.TrackRepository;
import com.DevStream.MoodLogBe.recommendation.dto.EmotionResponse;
import com.DevStream.MoodLogBe.recommendation.service.EmotionAnalysisService;
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
    private final EmotionAnalysisService emotionAnalysisService;
    private final PlaylistRepository playlistRepository;
    private final TrackRepository trackRepository;

    /**
     * 게시글 생성
     * - 사용자 인증 검증
     * - 게시글 내용으로 감정 분석 후 플레이리스트/트랙 자동 생성
     */
    @Transactional
    public void create(PostRequestDto dto, User user) {
        if (user == null) throw new IllegalArgumentException("인증된 사용자 없음");

        // 1) 감정 분석 서비스 호출
        EmotionResponse emotionResponse = emotionAnalysisService.analyzeEmotion(dto.content());

        // 2) 분석 결과를 기반으로 트랙 생성
        List<Track> tracks = emotionResponse.getTracks().stream()
                .map(dtoTrack -> {
                    Track track = new Track();
                    track.setTrackName(dtoTrack.getTrack_name());
                    track.setArtist(dtoTrack.getArtist());
                    track.setAlbumImage(dtoTrack.getAlbum_image()); // ✅ 앨범 이미지도 저장!
                    track.setSpotifyUrl(dtoTrack.getSpotify_url());
                    return track;
                }).toList();

        // 3) 플레이리스트 생성 및 트랙 연결
        Playlist playlist = new Playlist();
        playlist.setName(dto.title() + "의 플레이리스트");
        playlist.setDescription("자동 생성된 플레이리스트입니다.");
        playlist.setTracks(new ArrayList<>()); // 비어있는 트랙 리스트

        // 트랙과 플레이리스트 연결
        tracks.forEach(track -> track.setPlaylist(playlist));
        playlist.setTracks(tracks);

        // 4) 게시글 엔티티 생성
        Post post = new Post(
                null,
                dto.title(),
                user,
                dto.content(),
                dto.autoSaved(),
                null, // createdAt
                null, // updatedAt
                0,
                new ArrayList<>(),
                new ArrayList<>(),
                0,
                null
        );

        // 5) 관계 설정 및 저장
        postRepository.save(post);
        playlist.setPost(post);
        post.setPlaylist(playlist);

        playlistRepository.save(playlist);
        trackRepository.saveAll(tracks);

        postRepository.save(post);
    }


    /**
     * 모든 게시글 조회
     */
    public List<PostResponseDto> getAll() {
        return postRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    /**
     * 게시글 단건 조회 (조회수 증가 포함)
     */
    public PostResponseDto getById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("게시글 없음"));

        post.increaseViewCount();

        return toDto(post);
    }

    /**
     * 게시글 수정
     * - 작성자만 수정 가능
     */
    @Transactional
    public void update(Long id, PostRequestDto dto, User user) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("게시글 없음"));

        if (!post.getAuthor().getId().equals(user.getId()))
            throw new AccessDeniedException("수정 권한 없음");

        post.update(dto.title(), dto.content(), dto.autoSaved());
    }

    /**
     * 게시글 삭제
     * - 작성자만 삭제 가능
     */
    public void delete(Long id, User user) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("게시글 없음"));

        if (!post.getAuthor().getId().equals(user.getId()))
            throw new AccessDeniedException("삭제 권한 없음");

        postRepository.delete(post);
    }

    /**
     * 특정 사용자 게시글 조회 (정렬/페이징)
     */
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

    /**
     * Post 엔티티 -> PostResponseDto로 변환
     * - 댓글 및 플레이리스트 정보 포함
     */
    public PostResponseDto toDto(Post post) {
        // 댓글 변환
        List<CommentResponseDto> commentDtos = post.getComments().stream()
                .map(comment -> new CommentResponseDto(
                        comment.getId(),
                        comment.getContent(),
                        comment.getAuthor().getUsername(),
                        comment.getCreatedAt()
                ))
                .toList();

        // 플레이리스트가 있으면 변환
        PlaylistResponseDto playlistDto = null;
        if (post.getPlaylist() != null) {
            playlistDto = new PlaylistResponseDto(
                    post.getPlaylist().getId(),
                    post.getPlaylist().getName(),
                    post.getPlaylist().getDescription(),
                    post.getPlaylist().getTracks().stream()
                            .map(track -> new PlaylistResponseDto.TrackDto(
                                    track.getTrackName(),
                                    track.getArtist(),
                                    track.getAlbumImage(),
                                    track.getSpotifyUrl()
                            )).toList()
            );
        }

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
                commentDtos,
                playlistDto
        );
    }

    /**
     * 상위 N개의 게시글 조회
     * - 좋아요 or 댓글 순 정렬
     */
    @Transactional(readOnly = true)
    public List<PostResponseDto> getTopPosts(String sortBy, int size) {
        Pageable pageable = PageRequest.of(0, size);
        List<Post> posts;

        switch (sortBy) {
            case "likes" -> posts = postRepository.findTopNByOrderByLikeCountDesc(pageable);
            case "comments" -> posts = postRepository.findTopNByOrderByCommentCountDesc(pageable);
            default -> throw new IllegalArgumentException("잘못된 정렬 기준입니다: " + sortBy);
        }

        return posts.stream()
                .map(this::toDto)
                .toList();
    }

}
