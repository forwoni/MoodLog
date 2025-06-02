import React from "react";
import { Heart, MessageCircle, Calendar, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PostCard: React.FC<any> = ({
  id,
  title,
  content,
  createdAt,
  likeCount,
  comments,
  playlist,
  onPlaylistClick,
}) => {
  const navigate = useNavigate();

  // HTML 태그와 엔티티를 제거하는 함수
  const stripHtmlTags = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <div 
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-purple-100 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/postdetail/${id}`)}
    >
      {/* 제목 및 날짜 */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text line-clamp-1">
          {title}
        </h3>
        <div className="flex items-center text-sm text-gray-400 shrink-0 ml-4">
          <Calendar size={14} className="mr-1" />
          {new Date(createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* 본문 */}
      <p className="text-gray-600 line-clamp-2 mb-4">
        {stripHtmlTags(content)}
      </p>

      {/* 하단 정보 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-rose-500">
            <Heart size={16} className="fill-current" />
            <span className="text-sm font-medium">{likeCount}</span>
          </div>
          <div className="flex items-center gap-1 text-blue-500">
            <MessageCircle size={16} />
            <span className="text-sm font-medium">{comments.length}</span>
          </div>
        </div>

        {/* 플레이리스트 버튼 */}
        {playlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlaylistClick(playlist);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:from-purple-600 hover:to-blue-600 transition-all"
          >
            <Music size={14} />
            플레이리스트
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
