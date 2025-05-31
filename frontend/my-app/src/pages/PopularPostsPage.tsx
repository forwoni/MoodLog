import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderBox } from "../layouts/headerBox";
import { Heart, MessageCircle, Music, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../services/axiosInstance";
import PlaylistModal from "../components/PlaylistModal";

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

export default function PopularPostsPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [sort, setSort] = useState<"latest" | "likes" | "comments">("latest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<Post[]>("/posts", {
          params: { 
            sort,
            page,
            size: 10
          }
        });
        
        // 전체 데이터를 받아서 정렬 및 페이지네이션 처리
        let allPosts = response.data;
        
        // 정렬 적용
        if (sort === "latest") {
          allPosts = allPosts.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else if (sort === "likes") {
          allPosts = allPosts.sort((a, b) => b.likeCount - a.likeCount);
        } else if (sort === "comments") {
          allPosts = allPosts.sort((a, b) => b.comments.length - a.comments.length);
        }

        const totalItems = allPosts.length;
        const totalPages = Math.ceil(totalItems / 10);
        
        const startIndex = page * 10;
        const endIndex = Math.min(startIndex + 10, totalItems);
        const currentPagePosts = allPosts.slice(startIndex, endIndex);
        
        setPosts(currentPagePosts);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("인기 게시글 불러오기 실패:", error);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
        setPosts([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [sort, page]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-blue-50">
      <HeaderBox />
      
      {/* 타이틀 영역 */}
      <div className="w-full bg-gradient-to-r from-purple-100/50 to-blue-100/50 backdrop-blur-sm pt-24 pb-6">
        <div className="max-w-[1200px] mx-auto px-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
            인기 게시글
          </h1>
          <p className="text-gray-500 mt-2">
            MoodLog 사용자들의 게시글을 모아봤어요
          </p>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-[1200px] mx-auto px-6 py-6">
        {/* 필터 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-4 border border-purple-100 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
              게시글 목록
            </h2>
            <div className="flex items-center">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as "latest" | "likes" | "comments");
                  setPage(0);
                }}
                className="px-3 py-1.5 rounded-lg border border-purple-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50 backdrop-blur-sm"
              >
                <option value="latest">최신순</option>
                <option value="likes">좋아요 많은 순</option>
                <option value="comments">댓글 많은 순</option>
              </select>
            </div>
          </div>
        </div>

        {/* 게시글 그리드 */}
        {loading ? (
          <div className="text-center py-8">
            <div className="text-base text-gray-500">로딩 중...</div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-base text-red-500">{error}</div>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {posts.map((post, index) => (
              <div 
                key={post.id} 
                className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-purple-100 p-2 hover:shadow-md transition-all duration-300 cursor-pointer aspect-square flex flex-col"
                onClick={() => handlePostClick(post.id)}
              >
                {/* 썸네일 */}
                {post.playlist?.tracks[0]?.albumImage ? (
                  <div className="w-full aspect-square rounded-md overflow-hidden mb-1">
                    <img
                      src={post.playlist.tracks[0].albumImage}
                      alt="앨범 커버"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-square rounded-md bg-gradient-to-br from-purple-100 to-blue-100 mb-1 flex items-center justify-center">
                    <Music size={24} className="text-purple-300" />
                  </div>
                )}

                {/* 제목 */}
                <h3 className="text-xs font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text line-clamp-2 mb-1">
                  {post.title}
                </h3>

                {/* 작성자 */}
                <span className="text-[10px] text-gray-500 line-clamp-1">{post.authorName}</span>

                {/* 하단 정보 */}
                <div className="flex items-center justify-between mt-auto pt-1">
                  <div className="flex items-center gap-2 text-[10px]">
                    <div className="flex items-center gap-0.5 text-rose-500">
                      <Heart size={10} className="fill-current" />
                      <span>{post.likeCount}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-blue-500">
                      <MessageCircle size={10} />
                      <span>{post.comments.length}</span>
                    </div>
                  </div>

                  {/* 순위 뱃지 */}
                  {sort === "likes" && post.likeCount > 0 && index < 3 && page === 0 && (
                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold bg-gradient-to-r from-purple-500 to-blue-500">
                      {index + 1}
                    </div>
                  )}
                </div>
              </div>
            ))}
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

