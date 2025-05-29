import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Track {
  trackName: string;
  artist: string;
  spotifyUrl: string;
}

interface Playlist {
  name: string;
  description: string;
  tracks: Track[];
}

interface OtherUserPlayListBoxProps {
  username: string; 
}

export const OtherUserPlayListBox = ({
  username,
}: OtherUserPlayListBoxProps): React.JSX.Element => {
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        if (!username) {
          console.warn("사용자 이름이 없습니다.");
          return;
        }

        const res = await axios.get(`/api/users/${username}/posts`);
        const firstPost = res.data.content?.[0];
        if (firstPost && firstPost.playlist) {
          setPlaylist(firstPost.playlist);
        }
      } catch (err) {
        console.error("플레이리스트 조회 실패:", err);
      }
    };

    fetchPlaylist();
  }, [username]);

  const handleBoxClick = () => {
    // ✅ 다른 유저 플레이리스트 상세 페이지로 이동 (예시)
    navigate(`/playlist/${username}`);
  };

  if (!playlist) {
    return (
      <div className="w-60 h-[348px] mt-[30px] flex items-center justify-center text-gray-500 border rounded bg-white">
        플레이리스트 없음
      </div>
    );
  }

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
      <div className="flex w-60 items-start gap-10 relative">
        <div className="flex flex-col items-center flex-1 grow rounded-md overflow-hidden border border-solid border-[#0000001a] bg-white">
          {/* 이미지 영역 */}
          <div className="flex h-60 items-start relative self-stretch w-full">
            <div className="relative flex-1 self-stretch grow bg-[#d8d8d880]">
              <div className="absolute w-[209px] h-4 top-[111px] left-4 font-normal text-black text-center tracking-[0] leading-4 whitespace-nowrap flex items-center justify-center">
                {playlist.tracks?.[0]?.trackName || "곡 없음"}
              </div>
            </div>
          </div>

          {/* 텍스트 정보 영역 */}
          <div className="flex flex-col items-start gap-1 p-3 self-stretch w-full">
            <div className="self-stretch mt-[-1px] font-normal text-base leading-6 text-black tracking-[0]">
              {playlist.tracks?.[0]?.trackName || "노래 제목 없음"}
            </div>
            <div className="self-stretch font-normal text-base leading-7 text-black tracking-[0]">
              {playlist.name}
            </div>
            <div className="flex items-center gap-2 self-stretch w-full">
              <div className="w-6 h-6 mt-[-1px] font-normal text-base text-center leading-6 whitespace-nowrap overflow-hidden text-ellipsis text-black tracking-[0]">
                🎵 {playlist.tracks?.length || 0}곡
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
