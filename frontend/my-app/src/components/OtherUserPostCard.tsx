import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Eye, Calendar, Music } from "lucide-react";

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

interface OtherUserPostCardProps {
  id: number;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  comments: Comment[];
  playlist?: Playlist;
  onPlaylistClick: (playlist: Playlist) => void;
}

const OtherUserPostCard: React.FC<OtherUserPostCardProps> = ({
  id,
  title,
  content,
  authorName,
  createdAt,
  viewCount,
  likeCount,
  comments,
  playlist,
  onPlaylistClick,
}) => {
  const navigate = useNavigate();

  // 본문 미리보기(100자)
  const getPreview = (html: string) => {
    const plain = html.replace(/<[^>]+>/g, "");
    return plain.length > 100 ? plain.slice(0, 100) + "..." : plain;
  };

  return (
    <div
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-purple-100 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/postdetail/${id}`)}
    >
      {/* 제목 및 날짜 */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text line-clamp-1 mb-1">
            {title}
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium text-purple-600">@{authorName}</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-400 shrink-0 ml-4">
          <Calendar size={14} className="mr-1" />
          {new Date(createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* 본문 */}
      <p className="text-gray-600 line-clamp-2 mb-4">
        {getPreview(content)}
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
          <div className="flex items-center gap-1 text-emerald-500">
            <Eye size={16} />
            <span className="text-sm font-medium">{viewCount}</span>
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

      {/* 플레이리스트 미리보기 */}
      {playlist && (
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
          <div className="flex items-center gap-2">
            <Music size={16} className="text-purple-500" />
            <span className="font-medium text-purple-700">{playlist.name}</span>
          </div>
          {playlist.description && (
            <p className="text-sm text-gray-600 mt-1">{playlist.description}</p>
          )}
          <div className="text-xs text-gray-500 mt-1">
            {playlist.tracks.length}곡
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherUserPostCard;
