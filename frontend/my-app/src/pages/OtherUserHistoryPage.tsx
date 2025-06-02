import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/axiosInstance";
import { HeaderBox } from "../layouts/headerBox";
import { Heart, MessageCircle, ChevronLeft, ChevronRight, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PlaylistModal from "../components/PlaylistModal";
import { UserInfoBox } from "../components/UserInfoBox";

// 타입 정의
interface PlaylistTrack {
  trackName: string;
  artist: string;
  spotifyUrl: string;
  albumImage?: string;
}

interface Playlist {
  id: number;
  name: string;
  description: string;
  tracks: PlaylistTrack[];
}

interface Comment {
  id: number;
  content: string;
  authorUsername: string;
  createdAt: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  comments: Comment[];
  playlist?: Playlist;
}

interface Page<T> {
  content: T[];
  totalPages: number;
}

type ViewMode = "posts" | "playlists";

export default function OtherUserHistoryPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<"recent" | "likes" | "views">("recent");
  const [viewMode, setViewMode] = useState<ViewMode>("posts");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (playlist: Playlist, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPlaylist(playlist);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPlaylist(null);
    setShowModal(false);
  };

  const handlePostClick = (postId: number) => {
    navigate(`/postdetail/${postId}`);
  };

  // 플레이리스트만 필터링
  const playlists = posts.filter(post => post.playlist).map(post => ({
    ...post.playlist!,
    postId: post.id,
    postTitle: post.title,
    createdAt: post.createdAt
  }));

  useEffect(() => {
    const fetchPosts = async () => {
      if (!username) {
        setError("사용자를 찾을 수 없습니다.");
        setPosts([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        const res = await api.get<Page<Post>>(
          `/users/${username}/posts`,
          { params: { sort, page, size: viewMode === 'posts' ? 8 : 12 } }
        );

        setPosts(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      } catch {
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [username, sort, page, viewMode]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-blue-50">
      <HeaderBox />
      
      {/* 프로필 영역 */}
      <div className="w-full bg-gradient-to-r from-purple-100/50 to-blue-100/50 backdrop-blur-sm pt-24 pb-6">
        <div className="max-w-[1200px] mx-auto px-6">
          {username && <UserInfoBox username={username} />}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-[1200px] mx-auto px-6 py-6">
        {/* 필터 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-4 border border-purple-100 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
              {username}님의 활동
            </h2>
            <div className="flex items-center gap-3">
              {/* 보기 모드 토글 */}
              <div className="flex rounded-lg border border-purple-200 overflow-hidden">
                <button
                  onClick={() => setViewMode("posts")}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    viewMode === "posts"
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : "bg-white text-gray-600 hover:bg-purple-50"
                  }`}
                >
                  게시글
                </button>
                <button
                  onClick={() => setViewMode("playlists")}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    viewMode === "playlists"
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : "bg-white text-gray-600 hover:bg-purple-50"
                  }`}
                >
                  플레이리스트
                </button>
              </div>
              {/* 정렬 옵션 */}
              <div className="flex items-center">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="px-3 py-1.5 rounded-lg border border-purple-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50 backdrop-blur-sm"
                >
                  <option value="recent">최신순</option>
                  <option value="likes">좋아요순</option>
                  <option value="views">조회수순</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 게시글/플레이리스트 그리드 */}
        {loading ? (
          <div className="text-center py-8">
            <div className="text-base text-gray-500">로딩 중...</div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-base text-red-500">{error}</div>
          </div>
        ) : (
          <div className={`grid gap-4 ${
            viewMode === "posts" 
              ? "grid-cols-2 lg:grid-cols-4" 
              : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          }`}>
            {viewMode === "posts" ? (
              // 게시글 보기
              posts.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-purple-100 p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={() => handlePostClick(post.id)}
                >
                  {/* 썸네일 */}
                  {post.playlist?.tracks[0]?.albumImage && (
                    <div className="aspect-video rounded-md overflow-hidden mb-3">
                      <img
                        src={post.playlist.tracks[0].albumImage}
                        alt="앨범 커버"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* 제목 및 날짜 */}
                  <div className="flex flex-col gap-1 mb-2">
                    <h3 className="text-base font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text line-clamp-1">
                      {post.title}
                    </h3>
                    <div className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* 본문 */}
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {post.content.replace(/<[^>]+>/g, '')}
                  </p>

                  {/* 하단 정보 */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-rose-500">
                        <Heart size={14} className="fill-current" />
                        <span className="text-xs font-medium">{post.likeCount}</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-500">
                        <MessageCircle size={14} />
                        <span className="text-xs font-medium">{post.comments.length}</span>
                      </div>
                    </div>

                    {/* 플레이리스트 버튼 */}
                    {post.playlist && (
                      <button
                        onClick={(e) => openModal(post.playlist!, e)}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-medium hover:from-purple-600 hover:to-blue-600 transition-all"
                      >
                        <Music size={12} />
                        <span className="hidden sm:inline">플레이리스트</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // 플레이리스트 보기
              playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-purple-100 p-3 hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={(e) => openModal(playlist, e)}
                >
                  {/* 플레이리스트 커버 */}
                  {playlist.tracks[0]?.albumImage && (
                    <div className="aspect-square rounded-md overflow-hidden mb-2">
                      <img
                        src={playlist.tracks[0].albumImage}
                        alt="플레이리스트 커버"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* 플레이리스트 정보 */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <Music size={12} className="text-purple-500 flex-shrink-0" />
                    <h3 className="text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text line-clamp-1">
                      {playlist.name}
                    </h3>
                  </div>

                  {playlist.description && (
                    <p className="text-xs text-gray-600 line-clamp-1 mb-1.5">
                      {playlist.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-gray-500">
                    <span>{playlist.tracks.length}곡</span>
                    <span>{new Date(playlist.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-purple-200 text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center gap-1.5">
              <span className="text-base font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
                {page + 1}
              </span>
              <span className="text-gray-400">/</span>
              <span className="text-base text-gray-600">
                {totalPages}
              </span>
            </div>
            
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-purple-200 text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* 플레이리스트 모달 */}
      {showModal && selectedPlaylist && (
        <PlaylistModal
          playlist={selectedPlaylist}
          onClose={closeModal}
        />
      )}
    </div>
  );
} 