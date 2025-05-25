import React, { useState } from "react";
import { HeaderBox } from "../layouts/headerBox";
import { UserInfoBox } from "../components/UserInfoBox";

function SearchBox() {
  return (
    <div className="w-[800px] mx-auto mt-6">
      <input
        type="text"
        placeholder="검색어 입력"
        className="w-full h-12 px-6 rounded-full border border-gray-200 bg-[#f7f7f7] text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-200"
      />
    </div>
  );
}

function NeighborCard({ name, onDelete }: { name: string; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between bg-white border rounded-lg px-6 py-6 mb-6">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full" />
        <span className="text-lg font-medium text-gray-800">{name}</span>
      </div>
      <button
        onClick={onDelete}
        className="text-2xl text-gray-400 hover:text-gray-600 transition"
        aria-label="이웃 삭제"
      >
        ×
      </button>
    </div>
  );
}

export default function FallowManagementPage() {
  // 임시 이웃 데이터
  const [neighbors, setNeighbors] = useState([
    "이웃 이름",
    "이웃 이름",
    "이웃 이름",
    "이웃 이름",
    "이웃 이름",
    "이웃 이름",
  ]);

  // 삭제 핸들러
  const handleDelete = (idx: number) => {
    setNeighbors((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="w-[1440px] mx-auto flex flex-col items-center bg-white min-h-screen">
      <HeaderBox />
      {/* 사용자 정보 */}
      <div className="w-full bg-gradient-to-r from-[#e3c6f7] to-[#c9a7e9] h-[160px] flex items-end">
        <div className="w-[1440px] mx-auto">
          <UserInfoBox
            userName="사용자 이름"
            userDescription="사용자에 대한 간단한 설명"
          />
        </div>
      </div>
      {/* 검색창 */}
      <SearchBox />

      {/* 본문 */}
      <div className="w-[1100px] mx-auto mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">사용자의 모든 이웃</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">정렬 기준</span>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-white">
              <option>최신순</option>
              <option>이름순</option>
            </select>
          </div>
        </div>

        {/* 이웃 리스트 */}
        <div>
          {neighbors.map((name, idx) => (
            <NeighborCard
              key={idx}
              name={name}
              onDelete={() => handleDelete(idx)}
            />
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-end mt-8 text-gray-400 gap-2 text-sm">
          {[1,2,3,4,5,6,7,8,9,10].map((num) => (
            <button
              key={num}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200"
            >
              {num}
            </button>
          ))}
          <span className="ml-2">다음 &gt;</span>
        </div>
      </div>
    </div>
  );
}
