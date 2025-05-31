// ✅ PlaylistModal.tsx
import React from "react";
import { X, Music, ExternalLink, Clock } from "lucide-react";

interface Track {
  trackName: string;
  artist: string;
  spotifyUrl: string;
  albumImage?: string;
  duration?: string;
}

interface Playlist {
  id: number;
  name: string;
  description: string;
  tracks: Track[];
}

interface PlaylistModalProps {
  playlist: Playlist;
  onClose: () => void;
}

export default function PlaylistModal({ playlist, onClose }: PlaylistModalProps) {
  // 배경 클릭 시 모달 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md w-full max-w-2xl max-h-[80vh] overflow-hidden border border-purple-100">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-purple-100">
          <div className="flex items-center gap-3">
            <Music className="w-4 h-4 text-purple-500" />
            <div>
              <h2 className="text-base font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
                {playlist.name}
              </h2>
              {playlist.description && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {playlist.description}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-purple-50 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* 트랙 목록 */}
        <div className="overflow-y-auto max-h-[calc(80vh-64px)]">
          <div className="px-4 py-2">
            {/* 헤더 행 */}
            <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 px-3 py-2 text-xs font-medium text-gray-500 border-b border-purple-100">
              <div className="w-8">#</div>
              <div>제목</div>
              <div>아티스트</div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
              </div>
            </div>

            {/* 트랙 목록 */}
            {playlist.tracks.map((track, index) => (
              <div
                key={index}
                className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 px-3 py-2 hover:bg-purple-50/50 rounded-md group items-center"
              >
                {/* 트랙 번호 */}
                <div className="w-8 text-xs text-gray-400 font-medium">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* 트랙 정보 */}
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {track.albumImage ? (
                      <img
                        src={track.albumImage}
                        alt={track.trackName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="w-4 h-4 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {track.trackName}
                    </div>
                  </div>
                </div>

                {/* 아티스트 */}
                <div className="text-sm text-gray-500 truncate">
                  {track.artist}
                </div>

                {/* 재생 시간 & 링크 */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 font-medium">
                    {track.duration || ""}
                  </span>
                  <a
                    href={track.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-400 hover:text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
