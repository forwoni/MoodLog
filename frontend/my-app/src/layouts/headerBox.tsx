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
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-purple-100/50 z-50">
      <div className="max-w-[1200px] mx-auto h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <img
            className="h-8 w-auto cursor-pointer"
            alt="Logo"
            src={new_moodlog_logo}
            onClick={() => navigate("/main")}
          />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
            MoodLog
          </span>
        </div>
        {showEditDelete && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="px-4 py-1.5 rounded-lg bg-purple-50 text-purple-600 text-sm font-medium hover:bg-purple-100 transition-colors"
            >
              게시글 수정
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-sm font-medium hover:bg-rose-100 transition-colors"
            >
              게시글 삭제
            </button>
          </div>
        )}
      </div>
    </header>
  );
};