import React from "react";
import PostCard from "./PostCard";
import { useUser } from "../contexts/UserContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HistoryBox: React.FC<any> = ({
  posts,
  loading,
  error,
  page,
  setPage,
  totalPages,
  onPlaylistClick,
}) => {
  const { currentUser } = useUser();

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100">
        {/* 상단 타이틀 */}
        <div className="flex items-center gap-3 mb-6 border-b border-purple-100 pb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
            내 게시글 목록
          </h2>
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
          
          {posts.map((post: any) => (
            <PostCard
              key={post.id}
              {...post}
              isMyPost={post.authorName === currentUser?.username}
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

export default HistoryBox;
