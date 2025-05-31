import React, { useEffect, useState } from "react";
import api from "../services/axiosInstance";
import { HeaderBox } from "../layouts/headerBox";
import { UserInfoBox } from "../components/UserInfoBox";
import PlaylistModal from "../components/PlaylistModal";
import { useUser } from "../contexts/UserContext";
import { Image, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  autoSaved: boolean;
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

export default function HistoryPage() {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<"recent" | "likes">("recent");
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
    navigate(`/post/${postId}`);
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
      if (!currentUser?.username) {
        setError("로그인이 필요합니다.");
        setPosts([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        const res = await api.get<Page<Post>>(
          `/users/${currentUser.username}/posts`,
          { params: { sort, page, size: 6 } }
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
  }, [currentUser, sort, page]);

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <HeaderBox />
      
      {/* 프로필 영역 */}
      <div className="w-full bg-gradient-to-r from-purple-100/80 to-purple-200/80 pt-24 pb-12">
        <div className="max-w-[1440px] mx-auto px-8">
          <UserInfoBox />
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        {/* 필터 */}
        <div className="flex items-center justify-end gap-4 mb-8">
          {/* 보기 모드 토글 */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setViewMode("posts")}
              className={`px-4 py-2 text-sm ${
                viewMode === "posts"
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              게시글
            </button>
            <button
              onClick={() => setViewMode("playlists")}
              className={`px-4 py-2 text-sm ${
                viewMode === "playlists"
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              플레이리스트
            </button>
          </div>
          {/* 정렬 옵션 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">정렬</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="recent">최신순</option>
              <option value="likes">좋아요순</option>
            </select>
          </div>
        </div>

        {/* 게시글/플레이리스트 그리드 */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">로딩 중...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <>
            <div className={`grid gap-6 ${
              viewMode === "posts" 
                ? "grid-cols-3" 
                : "grid-cols-2"
            }`}>
              {viewMode === "posts" ? (
                // 게시글 보기
                posts.map((post) => (
                  <div 
                    key={post.id} 
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                    onClick={() => handlePostClick(post.id)}
                  >
                    {/* 썸네일 */}
                    <div className="aspect-[1.91/1] bg-gray-100 overflow-hidden relative">
                      {post.playlist?.tracks[0]?.albumImage ? (
                        <>
                          <img
                            src={post.playlist.tracks[0].albumImage}
                            alt="앨범 커버"
                            className="w-full h-full object-cover"
                          />
                          {/* 플레이리스트 버튼 */}
                          <button
                            onClick={(e) => post.playlist && openModal(post.playlist, e)}
                            className="absolute bottom-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                          >
                            <Music className="w-4 h-4 text-white" />
                          </button>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>
                    {/* 컨텐츠 */}
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{post.title}</h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{post.content}</p>
                      {/* 메타 정보 */}
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-3">
                          <span>좋아요 {post.likeCount}</span>
                          <span>댓글 {post.comments.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // 플레이리스트 보기
                playlists.map((playlist) => (
                  <div 
                    key={playlist.id} 
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden flex"
                    onClick={(e) => openModal(playlist, e)}
                  >
                    {/* 썸네일 */}
                    <div className="w-[240px] aspect-square bg-gray-100 overflow-hidden flex-shrink-0">
                      {playlist.tracks[0]?.albumImage ? (
                        <img
                          src={playlist.tracks[0].albumImage}
                          alt="앨범 커버"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                    </div>
                    {/* 컨텐츠 */}
                    <div className="flex-1 p-6 flex flex-col">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{playlist.name}</h3>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{playlist.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Music className="w-4 h-4" />
                          <span>{playlist.tracks.length}곡</span>
                        </div>
                      </div>
                      {/* 메타 정보 */}
                      <div className="text-xs text-gray-400 mt-4">
                        {new Date(playlist.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-8 h-8 rounded-full text-sm ${
                      page === i
                        ? "bg-purple-500 text-white"
                        : "bg-white text-gray-500 hover:bg-purple-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* 플레이리스트 모달 */}
      {showModal && selectedPlaylist && (
        <PlaylistModal onClose={closeModal} tracks={selectedPlaylist.tracks} />
      )}
    </div>
  );
}
