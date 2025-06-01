import React from "react";
import { useNavigate } from "react-router-dom";
import pencil_icon from "../assets/pencil_icon.svg";

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
}

function UserPlayListBox({ playlists, showEditButton = true }: Props) {
  const navigate = useNavigate();

  if (!playlists || playlists.length === 0) {
    return (
      <div
        className="w-60 bg-white rounded-2xl shadow-md border border-gray-200 p-4 cursor-pointer relative"
        onClick={() => navigate("/playlisteditor")}
      >
        <div className="flex items-center justify-center text-gray-400 h-40">
          플레이리스트 없음
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {playlists.map((playlist) => {
        const firstTrackImage = playlist?.tracks?.[0]?.albumImage || "";
        
        return (
          <div
            key={playlist.id}
            className="w-60 bg-white rounded-2xl shadow-md border border-gray-200 p-4 cursor-pointer relative"
            onClick={() => navigate("/playlisteditor")}
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
            <img
              src={firstTrackImage}
              alt="앨범 커버"
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
            <div className="text-sm text-gray-700 truncate">{playlist.tracks[0]?.trackName}</div>
            <div className="text-base font-semibold text-gray-800 truncate">{playlist.name}</div>
            <div className="text-xs text-gray-500 mt-1">🎵 {playlist.tracks.length}곡</div>
          </div>
        );
      })}
    </div>
  );
}

export default UserPlayListBox; 