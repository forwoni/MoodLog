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
  <div className="flex flex-col bg-white rounded-2xl shadow-md border border-gray-200 p-4 gap-2 hover:shadow-lg transition-shadow duration-300">
    <h3 className="text-lg font-semibold text-gray-800 truncate">{title}</h3>
    <p className="text-sm text-gray-600 line-clamp-2">{content}</p>

    <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
      <span>{new Date(createdAt).toLocaleDateString()}</span>
      <div className="flex gap-2 items-center">
        <span>❤️ {likeCount}</span>
        <span>💬 {comments.length}</span>
      </div>
    </div>

    {playlist && (
      <button
        onClick={() => onPlaylistClick(playlist)}
        className="mt-2 px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700 font-medium self-start hover:bg-purple-200 transition-colors"
      >
        플레이리스트 보기
      </button>
    )}
  </div>
);

export default PostCard;
