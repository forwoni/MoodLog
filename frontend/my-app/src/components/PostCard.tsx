import React from "react";

// 타입 정의 (API 명세서 반영)
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
  playlist: Playlist;
  isMyPost?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
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
  // 본문 미리보기(100자)
  const getPreview = (html: string) => {
    const plain = html.replace(/<[^>]+>/g, "");
    return plain.length > 100 ? plain.slice(0, 100) + "..." : plain;
  };

  return (
    <div className="border rounded-lg shadow-md bg-white p-6 mb-6 cursor-pointer hover:shadow-lg transition">
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
        <span>좋아요: {likeCount}</span>
        <span>댓글: {comments.length}</span>
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
      {/* 플레이리스트 정보 표시 (최신 명세서 활용) */}
      {playlist && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <div className="font-semibold text-sm mb-1">🎵 {playlist.name}</div>
          <div className="text-xs text-gray-500 mb-2">{playlist.description}</div>
          <ul className="text-sm">
            {playlist.tracks.map((track, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span>{track.trackName} - {track.artist}</span>
                <a
                  href={track.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 underline text-xs"
                >
                  Spotify
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PostCard;
