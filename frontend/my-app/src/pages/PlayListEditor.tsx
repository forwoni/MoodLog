import React, { useState } from "react";
import x_icon from "../assets/x_icon.svg";

const dummySongs = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  artist: "아티스트 명",
  title: "노래 제목",
}));

export default function PlayListEditor() {
  const [songs, setSongs] = useState(dummySongs);

  const handleDelete = (id: number) => {
    setSongs(songs.filter(song => song.id !== id));
  };

  const handleAdd = () => {
    setSongs([
      ...songs,
      { id: Date.now(), artist: "아티스트 명", title: "노래 제목" },
    ]);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-black/40">
      <div className="w-[700px] min-h-[1100px] bg-white rounded-2xl shadow-lg p-8 flex flex-col relative">
        {/* 상단 우측: 노래 추가, 닫기 버튼 */}
        <div className="flex justify-end items-center mb-6">
          <button
            onClick={handleAdd}
            className="border border-gray-300 rounded px-4 py-2 text-sm font-medium mr-4 hover:bg-gray-100"
          >
            노래 추가
          </button>
          <button onClick={() => window.history.back()}>
            <img src={x_icon} alt="닫기" className="w-6 h-6" />
          </button>
        </div>
        {/* 곡 리스트: 스크롤 없음, 6개가 한 화면에 모두 보임 */}
        <div className="flex flex-col gap-4 mb-10">
          {songs.map(song => (
            <div
              key={song.id}
              className="flex items-center bg-white border border-gray-200 rounded-md px-4 py-5 relative min-h-[110px]"
              style={{ height: 110 }}
            >
              {/* 썸네일 */}
              <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center mr-6 text-base text-gray-400 leading-tight text-center select-none">
                {/* 한 줄이 안 되면 두 줄로 */}
                <span>
                  노래<br />이미지
                </span>
              </div>
              {/* 곡 정보 */}
              <div className="flex flex-col flex-1">
                <span className="text-sm text-gray-700">{song.artist}</span>
                <span className="text-base font-medium text-gray-900">{song.title}</span>
                <span className="text-lg mt-1">🎵</span>
              </div>
              {/* 삭제(X) 버튼 */}
              <button
                onClick={() => handleDelete(song.id)}
                className="ml-4 text-gray-400 hover:text-red-500"
                aria-label="삭제"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {/* 페이지네이션: 리스트와 동일한 간격 */}
        <div className="flex justify-center items-center gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <button
              key={i}
              className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200"
            >
              {i + 1}
            </button>
          ))}
          <button className="ml-3 text-gray-700 hover:underline flex items-center">
            다음 <span className="ml-1">&gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
