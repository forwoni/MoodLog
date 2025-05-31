// ✅ PlaylistModal.tsx
import React from "react";
import x_icon from "../assets/x_icon.svg";

interface PlaylistTrack {
  trackName: string;
  artist: string;
  albumImage: string; // ✅ 모든 곡에 이미지 표시
  spotifyUrl: string;
}

interface PlaylistModalProps {
  tracks: PlaylistTrack[];
  onClose: () => void;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({ tracks, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[400px] max-h-[90vh] overflow-y-auto relative p-6">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-6 h-6 text-gray-600"
        >
          <img src={x_icon} alt="닫기" className="w-full h-full" />
        </button>

        {/* 모달 타이틀 */}
        <h2 className="text-lg font-bold mb-4">플레이리스트</h2>

        {/* 트랙 리스트 */}
        <div className="flex flex-col gap-4">
          {tracks.map((track, idx) => (
            <div
              key={idx}
              className="flex items-center border border-gray-300 rounded-md p-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => window.open(track.spotifyUrl, "_blank")}
            >
              {/* 앨범 이미지 */}
              <div className="w-16 h-16 rounded overflow-hidden bg-gray-200 flex-shrink-0 mr-4">
                {track.albumImage ? (
                  <img
                    src={track.albumImage}
                    alt="앨범 이미지"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              {/* 곡 정보 */}
              <div className="flex flex-col flex-1">
                <span className="font-semibold text-black">{track.trackName}</span>
                <span className="text-sm text-gray-600">{track.artist}</span>
              </div>

              {/* 듣기 버튼 */}
              <button
                className="text-sm text-blue-500 underline ml-4"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(track.spotifyUrl, "_blank");
                }}
              >
                듣기
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistModal;
