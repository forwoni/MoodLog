import React from "react";

const PostCard: React.FC<any> = ({
  title,
  content,
  createdAt,
  likeCount,
  comments,
  playlist,
  onPlaylistClick,
}) => (
  <div className="flex flex-col bg-white border rounded p-4 shadow">
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-gray-600 mt-1">{content.slice(0, 100)}...</p>
    <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
      <span>{new Date(createdAt).toLocaleString()}</span>
      <div>❤️ {likeCount} · 💬 {comments.length}</div>
    </div>
    {playlist && (
      <button
        onClick={() => onPlaylistClick(playlist)}
        className="mt-2 text-xs text-blue-500 underline self-start"
      >
        플레이리스트 보기
      </button>
    )}
  </div>
);
export default PostCard;
