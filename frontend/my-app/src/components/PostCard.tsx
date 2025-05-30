import React from "react";
import { useNavigate } from "react-router-dom";

interface PlaylistTrack {
  trackName: string;
  artist: string;
  spotifyUrl: string;
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
interface PostCardProps {
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
  isMyPost?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  content,
  authorName,
  createdAt,
  viewCount,
  likeCount,
  comments,
  playlist,
  autoSaved,
  isMyPost,
}) => {
  const navigate = useNavigate();

  // 본문 미리보기(2줄)
  const getPreview = (html: string) => {
    const plain = html.replace(/<[^>]+>/g, "");
    return plain.length > 60 ? plain.slice(0, 60) + "..." : plain;
  };

  // 더블클릭 시 상세 페이지 이동
  const handleDoubleClick = () => {
    navigate(`/postdetail/${id}`);
  };

  return (
    <div
      className="border rounded-xl shadow bg-white px-6 py-5 mb-5 cursor-pointer hover:shadow-lg transition"
      style={{
        minHeight: "155px",
        maxHeight: "230px",
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
      onDoubleClick={handleDoubleClick}
    >
      {/* 제목/날짜 */}
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <span className="text-xs text-gray-500">
          {new Date(createdAt).toLocaleString()}
        </span>
      </div>

      {/* 본문 미리보기 */}
      <div className="text-gray-800 mb-1 text-base" style={{ minHeight: "28px" }}>
        {getPreview(content)}
      </div>

      {/* 메타 정보 */}
      <div className="flex items-center text-sm text-gray-600 gap-4 mb-1">
        <span>작성자: {authorName}</span>
        <span>❤️ {likeCount}</span>
        <span>댓글: {comments?.length || 0}</span>
        {autoSaved && (
          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
            임시저장
          </span>
        )}
        {isMyPost && (
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
            내 글
          </span>
        )}
      </div>

      {/* 플레이리스트 정보 */}
      {playlist && (
        <div className="mt-2 p-2 bg-gray-50 rounded">
          <div className="font-semibold text-sm mb-1">
            🎵 {playlist.name}
          </div>
          <div className="text-xs text-gray-500 mb-1">{playlist.description}</div>
          {playlist.tracks && playlist.tracks.length > 0 && (
            <ul className="text-sm">
              {playlist.tracks.slice(0, 3).map((track, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span>{track.trackName} - {track.artist}</span>
                  <a
                    href={track.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 underline text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Spotify
                  </a>
                </li>
              ))}
              {playlist.tracks.length > 3 && (
                <li className="text-xs text-gray-400">
                  외 {playlist.tracks.length - 3}곡
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
