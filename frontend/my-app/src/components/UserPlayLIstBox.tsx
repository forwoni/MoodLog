import React from "react";
import { useNavigate } from "react-router-dom";
import pencil_icon from "../assets/pencil_icon.svg";

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

interface Props {
  playlists: Playlist[];
  showEditButton?: boolean;
  onPlaylistClick?: (playlist: Playlist) => void;
}

const UserPlayListBox: React.FC<Props> = ({
  playlists,
  showEditButton = true,
  onPlaylistClick,
}) => {
  const navigate = useNavigate();

  const handleBoxClick = (
    playlist: Playlist,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();
    if (onPlaylistClick) {
      onPlaylistClick(playlist);
    } else {
      navigate("/playlisteditor");
    }
  };

  if (!playlists || playlists.length === 0) {
    return (
      <div
        className="w-60 h-[348px] mt-[30px] flex items-center justify-center text-gray-500 border rounded bg-white cursor-pointer"
        onClick={() => navigate("/playlisteditor")}
      >
        플레이리스트 없음
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {playlists.map((playlist) => {
        const firstTrack = playlist.tracks?.[0];
        const firstTrackName = firstTrack?.trackName || "곡 없음";
        const firstTrackImage = firstTrack?.albumImage;

        return (
          <div
            key={playlist.id}
            className="w-60 h-[348px] mt-[30px] cursor-pointer relative"
            onClick={(e) => handleBoxClick(playlist, e)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                handleBoxClick(playlist, e as any);
            }}
            aria-label={`${playlist.name} 플레이리스트 보기`}
          >
            {showEditButton && (
              <img
                src={pencil_icon}
                alt="수정"
                className="absolute top-2 right-2 w-5 h-5"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/playlisteditor");
                }}
              />
            )}
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
      })}
    </div>
  );
};

export default UserPlayListBox;
