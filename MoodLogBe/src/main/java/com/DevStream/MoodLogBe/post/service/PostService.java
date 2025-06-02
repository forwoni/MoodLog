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
import com.DevStream.MoodLogBe.post.service.PostViewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final EmotionAnalysisService emotionAnalysisService;
    private final PlaylistRepository playlistRepository;
    private final TrackRepository trackRepository;
    private final PostViewService postViewService;
    private final Random random = new Random();

    /**
     * 게시글 생성
     * - 사용자 인증 검증
     * - 게시글 내용으로 감정 분석 후 플레이리스트/트랙 자동 생성
     */
    @Transactional
    public Long create(PostRequestDto dto, User user) {
        if (user == null) throw new IllegalArgumentException("인증된 사용자 없음");

        // 1) 감정 분석 서비스 호출
        EmotionResponse emotionResponse = emotionAnalysisService.analyzeEmotion(dto.content());

        // 2) 분석 결과를 기반으로 트랙 생성
        List<Track> tracks = emotionResponse.getTracks().stream()
                .map(dtoTrack -> {
                    Track track = new Track();
                    track.setTrackName(dtoTrack.getTrack_name());
                    track.setArtist(dtoTrack.getArtist());
                    track.setAlbumImage(dtoTrack.getAlbum_image());
                    track.setSpotifyUrl(dtoTrack.getSpotify_url());
                    return track;
                }).toList();

        // 3) 플레이리스트 생성 및 트랙 연결
        Playlist playlist = new Playlist();
        
        // 플레이리스트 제목 생성
        String playlistName = generatePlaylistName(dto.title(), emotionResponse.getEmotion());
        playlist.setName(playlistName);
        
        // 플레이리스트 설명 생성
        String description = generatePlaylistDescription(emotionResponse.getEmotion(), tracks.size());
        playlist.setDescription(description);
        
        playlist.setTracks(new ArrayList<>());

        // 트랙과 플레이리스트 연결
        tracks.forEach(track -> track.setPlaylist(playlist));
        playlist.setTracks(tracks);

        // 4) 게시글 엔티티 생성 및 저장
        Post post = Post.builder()
                .title(dto.title())
                .author(user)
                .content(dto.content())
                .autoSaved(dto.autoSaved())
                .playlist(playlist)
                .build();

        // 5) 관계 설정 및 저장
        Post savedPost = postRepository.save(post);
        playlist.setPost(savedPost);

        playlistRepository.save(playlist);
        trackRepository.saveAll(tracks);

        return savedPost.getId();
    }

    // 플레이리스트 제목 생성
    private String generatePlaylistName(String postTitle, String emotion) {
        // 감정에 따른 이모지 매핑
        Map<String, String> emotionEmojis = Map.of(
            "happy", "✨",
            "sad", "💫",
            "angry", "🔥",
            "peaceful", "🌊",
            "excited", "⚡️",
            "love", "💝"
        );

        // 감정에 따른 접두사 매핑
        Map<String, List<String>> emotionPrefixes = Map.of(
            "happy", List.of("행복한 순간", "기쁨이 가득한", "즐거운 하루의"),
            "sad", List.of("감성적인", "몽환적인", "새벽감성"),
            "angry", List.of("강렬한", "에너지 넘치는", "불타오르는"),
            "peaceful", List.of("평온한", "고요한", "차분한"),
            "excited", List.of("설레이는", "활기찬", "신나는"),
            "love", List.of("로맨틱한", "달콤한", "사랑스러운")
        );

        // 랜덤하게 접두사 선택
        Random random = new Random();
        List<String> prefixes = emotionPrefixes.getOrDefault(emotion, List.of("나의"));
        String prefix = prefixes.get(random.nextInt(prefixes.size()));

        // 이모지 선택
        String emoji = emotionEmojis.getOrDefault(emotion, "🎵");

        return String.format("%s %s %s", prefix, postTitle, emoji);
    }

    // 플레이리스트 설명 생성
    private String generatePlaylistDescription(String emotion, int trackCount) {
        Map<String, List<String>> emotionDescriptions = Map.of(
            "happy", List.of(
                "기분 좋은 순간을 더욱 특별하게 만들어줄 플레이리스트",
                "행복한 에너지가 가득한 음악들을 모았어요",
                "즐거운 마음을 함께 나눌 수 있는 노래들"
            ),
            "sad", List.of(
                "감성적인 밤을 위한 특별한 선곡",
                "마음을 위로해주는 음악들을 담았어요",
                "깊어가는 밤, 감성에 젖어들 수 있는 플레이리스트"
            ),
            "angry", List.of(
                "강렬한 비트로 스트레스를 날려버려요",
                "에너지 넘치는 음악으로 기분 전환하세요",
                "파워풀한 사운드로 가득한 플레이리스트"
            ),
            "peaceful", List.of(
                "마음의 안정을 찾아주는 차분한 선곡",
                "고요한 순간을 더욱 특별하게 만들어줄 음악",
                "평화로운 분위기의 플레이리스트"
            ),
            "excited", List.of(
                "설렘이 가득한 순간을 위한 특별한 선곡",
                "활기찬 에너지가 느껴지는 음악들",
                "신나는 리듬으로 가득한 플레이리스트"
            ),
            "love", List.of(
                "로맨틱한 순간을 더욱 특별하게 만들어줄 음악",
                "사랑스러운 감성이 담긴 플레이리스트",
                "달콤한 멜로디로 가득한 선곡"
            )
        );

        Random random = new Random();
        List<String> descriptions = emotionDescriptions.getOrDefault(emotion, 
            List.of("당신의 감정을 음악으로 표현한 플레이리스트"));
        
        return descriptions.get(random.nextInt(descriptions.size())) + 
               String.format(" (%d곡)", trackCount);
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
    public PostResponseDto getById(Long id, HttpServletRequest request, User user) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("게시글 없음"));

        // 조회수 처리
        postViewService.processView(post, user, request);

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
            case "views" -> postRepository.findByAuthor(user,
                            PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "viewCount")))
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
