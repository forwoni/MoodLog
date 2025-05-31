import React from "react";
import { useNavigate } from "react-router-dom";

interface Track {
  trackName: string;
  artist: string;
  spotifyUrl: string;
  albumImage?: string;
}

interface Playlist {
  name: string;
  description: string;
  tracks: Track[];
}

interface OtherUserPlayListBoxProps {
  playlist: Playlist | null;
  username: string;
}

export const OtherUserPlayListBox = ({
  playlist,
  username,
}: OtherUserPlayListBoxProps): React.JSX.Element => {
  const navigate = useNavigate();

  const handleBoxClick = () => {
    navigate(`/playlist/${username}`);
  };

  if (!playlist) {
    return (
      <div className="w-60 h-[348px] mt-[30px] flex items-center justify-center text-gray-500 border rounded bg-white">
        플레이리스트 없음
      </div>
    );
  }

  const firstTrack = playlist.tracks?.[0];
  const firstTrackName = firstTrack?.trackName || "곡 없음";
  const firstTrackImage = firstTrack?.albumImage;

  return (
    <div
      className="w-60 h-[348px] mt-[30px] cursor-pointer"
      onClick={handleBoxClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleBoxClick();
      }}
      aria-label={`${username}님의 플레이리스트 보기`}
    >
      <div className="flex flex-col items-center flex-1 rounded-md overflow-hidden border border-solid border-[#0000001a] bg-white">
        {/* 이미지 영역 */}
        <div className="relative flex-1 w-full h-60 bg-[#d8d8d880] flex items-center justify-center overflow-hidden">
          {firstTrackImage ? (
            <img
              src={firstTrackImage}
              alt="대표 이미지"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="font-normal text-black text-center leading-4">
              {firstTrackName}
            </div>
          )}
        </div>

        {/* 텍스트 정보 영역 */}
        <div className="flex flex-col items-start gap-1 p-3 w-full">
          <div className="font-normal text-base leading-6 text-black">
            {firstTrackName}
          </div>
          <div className="font-normal text-base leading-7 text-black">
            {playlist.name}
          </div>
          <div className="flex items-center gap-2 w-full">
            <div className="text-base leading-6 text-black">
              🎵 {playlist.tracks?.length || 0}곡
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
