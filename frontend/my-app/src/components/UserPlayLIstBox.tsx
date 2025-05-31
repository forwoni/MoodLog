import React from "react";
import { useNavigate } from "react-router-dom";
import pencil_icon from "../assets/pencil_icon.svg";

interface Track {
  trackName: string;
  artist: string;
  albumImage: string;
  spotifyUrl: string;
}
interface Playlist {
  name: string;
  description: string;
  tracks: Track[];
}
interface Props {
  playlist: Playlist | null;
  showEditButton?: boolean;
}

const UserPlayListBox: React.FC<Props> = ({ playlist, showEditButton = true }) => {
  const navigate = useNavigate();
  const firstTrackImage = playlist?.tracks?.[0]?.albumImage || "";

  return (
    <div
      className="w-60 bg-white rounded-lg shadow border p-3 relative cursor-pointer"
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
      {playlist ? (
        <>
          <img
            src={firstTrackImage}
            alt="앨범 커버"
            className="w-full h-40 object-cover rounded mb-3"
          />
          <div className="text-sm text-gray-700">{playlist.tracks[0]?.trackName}</div>
          <div className="text-base font-medium">{playlist.name}</div>
          <div className="text-xs text-gray-500 mt-1">🎵 {playlist.tracks.length}곡</div>
        </>
      ) : (
        <div className="flex items-center justify-center text-gray-400 h-40">
          플레이리스트 없음
        </div>
      )}
    </div>
  );
};
export default UserPlayListBox;
