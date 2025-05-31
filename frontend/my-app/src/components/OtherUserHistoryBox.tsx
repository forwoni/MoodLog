import React from "react";
import OtherUserPostCard from "./OtherUserPostCard";
import { ChevronLeft, ChevronRight, ListFilter } from "lucide-react";

// 타입 정의 (Post 등)
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

interface OtherUserHistoryBoxProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
  sort: "recent" | "likes" | "comments";
  setSort: (sort: "recent" | "likes" | "comments") => void;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  onPlaylistClick: (playlist: Playlist) => void;
}

const OtherUserHistoryBox: React.FC<OtherUserHistoryBoxProps> = ({
  posts,
  loading,
  error,
  sort,
  setSort,
  page,
  setPage,
  totalPages,
  onPlaylistClick,
}) => {
  return (
    <div className="max-w-[1200px] mx-auto px-8 py-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100">
        {/* 상단 정렬 선택 */}
        <div className="flex items-center justify-between mb-6 border-b border-purple-100 pb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
            게시글 목록
          </h2>
          <div className="flex items-center gap-2">
            <ListFilter size={20} className="text-purple-500" />
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as typeof sort);
                setPage(0);
              }}
              className="px-4 py-2 rounded-lg border border-purple-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50 backdrop-blur-sm"
            >
              <option value="recent">최신순</option>
              <option value="likes">좋아요순</option>
              <option value="comments">댓글순</option>
            </select>
          </div>
        </div>

        {/* 게시글 목록 */}
        <div className="space-y-4">
          {loading && (
            <div className="text-center py-8">
              <div className="text-lg text-gray-500">로딩 중...</div>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8">
              <div className="text-lg text-red-500">{error}</div>
            </div>
          )}
          
          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-8">
              <div className="text-lg text-gray-500">게시글이 없습니다.</div>
            </div>
          )}
          
          {posts.map((post) => (
            <OtherUserPostCard
              key={post.id}
              {...post}
              onPlaylistClick={onPlaylistClick}
            />
          ))}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-purple-100">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-purple-200 text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
                {page + 1}
              </span>
              <span className="text-gray-400">/</span>
              <span className="text-lg text-gray-600">
                {totalPages}
              </span>
            </div>
            
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-purple-200 text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtherUserHistoryBox;
