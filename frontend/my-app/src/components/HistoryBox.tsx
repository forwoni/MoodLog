import React from "react";
import PostCard from "./PostCard";
import { useUser } from "../contexts/UserContext";

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
    <div className="grid grid-cols-1 gap-4">
      {loading && <p>로딩 중...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && posts.length === 0 && (
        <p className="text-gray-400">게시글이 없습니다.</p>
      )}
      {posts.map((post: any) => (
        <PostCard
          key={post.id}
          {...post}
          isMyPost={post.authorName === currentUser?.username}
          onPlaylistClick={onPlaylistClick}
        />
      ))}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button onClick={() => setPage(Math.max(0, page - 1))}>&lt;</button>
          <span>{page + 1} / {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))}>&gt;</button>
        </div>
      )}
    </div>
  );
};
export default HistoryBox;
