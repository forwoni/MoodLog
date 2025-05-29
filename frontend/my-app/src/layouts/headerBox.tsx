import React from "react";
import { useNavigate } from "react-router-dom";
import new_moodlog_logo from "../assets/new_moodlog_logo.svg"

export const HeaderBox = ({
  showEditDelete = false,
  onEdit,
  onDelete,
}: {
  showEditDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-[1440px] h-[102px] bg-white z-50 shadow flex items-center justify-between px-8">
      <div className="flex items-center">
        <img
          className="w-[65px] h-[49px] object-cover cursor-pointer"
          alt="Logo"
          src={new_moodlog_logo}
          onClick={() => navigate("/main")}
        />
        <span className="ml-2 text-2xl font-bold text-[#222]">MoodLog</span>
      </div>
      {showEditDelete && (
        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="px-5 py-2 rounded bg-[#F3CFFF] text-[#7C3AED] font-semibold text-base hover:bg-[#e6b8fa] transition"
          >
            게시글 수정
          </button>
          <button
            onClick={onDelete}
            className="px-5 py-2 rounded bg-[#E9AFFF] text-[#A21CAF] font-semibold text-base hover:bg-[#e6b8fa] transition"
          >
            게시글 삭제
          </button>
        </div>
      )}
    </header>
  );
};
