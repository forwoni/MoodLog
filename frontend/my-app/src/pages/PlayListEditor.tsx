import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import x_icon from "../assets/x_icon.svg";
import axios from "axios";
import { useUser } from "../contexts/UserContext";

interface Track {
  trackName: string;
  artist: string;
  albumImage: string;
  spotifyUrl: string;
}

export default function PlayListEditor() {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const fetchPlaylistFromFirstPost = async () => {
      try {
        if (!currentUser?.username) {
          console.warn("사용자 이름이 없습니다.");
          return;
        }

        const res = await axios.get(`/api/users/${currentUser.username}/posts`, {
          params: { sort: "recent", page: 0, size: 1 },
        });

        console.log("응답 데이터 확인 👉", res.data.content?.[0]?.playlist);

        const firstPost = res.data.content?.[0];
        if (firstPost?.playlist) {
          const convertedTracks: Track[] = firstPost.playlist.tracks.map((track: any) => ({
            trackName: track.trackName,
            artist: track.artist,
            albumImage: track.albumImage, // camelCase로!
            spotifyUrl: track.spotifyUrl,
          }));
          setTracks(convertedTracks);
        } else {
          setTracks([]);
        }
      } catch (err) {
        console.error("플레이리스트 조회 실패", err);
        setTracks([]);
      }
    };

    fetchPlaylistFromFirstPost();
  }, [currentUser]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-black/40">
      <div className="w-[700px] min-h-[700px] bg-white rounded-2xl shadow-lg p-8 flex flex-col relative">
        {/* 상단 우측: 닫기 버튼 */}
        <div className="flex justify-end items-center mb-6">
          <button onClick={() => navigate(-1)}>
            <img src={x_icon} alt="닫기" className="w-6 h-6" />
          </button>
        </div>

        {tracks.length === 0 ? (
          <div className="text-center text-gray-500">플레이리스트가 없습니다.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {tracks.map((track, i) => (
              <div
                key={i}
                className="flex items-center bg-white border border-gray-200 rounded-md px-4 py-5 cursor-pointer hover:bg-gray-50"
                onClick={() => window.open(track.spotifyUrl, "_blank")}
              >
                {/* 앨범 이미지 */}
                <div className="w-24 h-24 bg-gray-100 rounded mr-6 overflow-hidden">
                  {track.albumImage ? (
                    <img
                      src={track.albumImage}
                      alt="앨범 이미지"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-base text-gray-400 text-center leading-tight select-none">
                      노래<br />이미지
                    </div>
                  )}
                </div>

                {/* 곡 정보 */}
                <div className="flex flex-col flex-1">
                  <span className="text-sm text-gray-700">{track.artist}</span>
                  <span className="text-base font-medium text-gray-900">{track.trackName}</span>
                  <span className="text-lg mt-1">🎵</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
