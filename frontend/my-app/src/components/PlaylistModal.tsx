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

interface PlaylistModalProps {
  tracks: Track[];
  onClose: () => void;
}

export default function PlaylistModal({ tracks, onClose }: PlaylistModalProps) {
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Music className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-bold text-gray-900">플레이리스트</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 트랙 목록 */}
        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="px-6 py-4">
            {/* 헤더 행 */}
            <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
              <div className="w-10">#</div>
              <div>제목</div>
              <div>아티스트</div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            {/* 트랙 목록 */}
            {tracks.map((track, index) => (
              <div
                key={index}
                className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-3 hover:bg-gray-50 rounded-lg group items-center"
              >
                {/* 트랙 번호 */}
                <div className="w-10 text-sm text-gray-400">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* 트랙 정보 */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                    {track.albumImage ? (
                      <img
                        src={track.albumImage}
                        alt={track.trackName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {track.trackName}
                    </div>
                  </div>
                </div>

                {/* 아티스트 */}
                <div className="text-gray-500 truncate">
                  {track.artist}
                </div>

                {/* 재생 시간 & 링크 */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">
                    {track.duration || ""}
                  </span>
                  <a
                    href={track.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-4 h-4" />
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
