import React from "react";
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
  onPlaylistClick: (playlist: Playlist) => void; // ✅ 모달 열기 핸들러!
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
  onPlaylistClick, // ✅
}) => {
  const navigate = useNavigate();

  // 본문 미리보기(100자)
  const getPreview = (html: string) => {
    const plain = html.replace(/<[^>]+>/g, "");
    return plain.length > 100 ? plain.slice(0, 100) + "..." : plain;
  };

  return (
    <div
      className="border rounded-lg shadow-md bg-white p-6 mb-6 cursor-pointer hover:shadow-lg transition"
      onDoubleClick={() => navigate(`/postdetail/${id}`)}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <span className="text-xs text-gray-400">
          {new Date(createdAt).toLocaleString()}
        </span>
      </div>
      <div className="text-gray-600 mb-3">{getPreview(content)}</div>
      <div className="flex items-center text-sm text-gray-500 space-x-4">
        <span>작성자: {authorName}</span>
        <span>조회수: {viewCount}</span>
        <span className="flex items-center gap-1">❤️ {likeCount}</span>
        <span>댓글: {comments?.length || 0}</span>
      </div>

      {/* ✅ 플레이리스트 정보 및 모달 버튼 */}
      {playlist && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <div className="font-semibold text-sm mb-1">🎵 {playlist.name}</div>
          <div className="text-xs text-gray-500 mb-2">{playlist.description}</div>
          <button
            onClick={(e) => {
              e.stopPropagation(); // ✅ 부모 클릭 방지!
              onPlaylistClick(playlist);
            }}
            className="mt-2 px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700 font-medium hover:bg-purple-200 transition-colors"
          >
            플레이리스트 보기
          </button>
        </div>
      )}
    </div>
  );
};

export default OtherUserPostCard;
