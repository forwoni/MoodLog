import React from "react";

interface WritePostModalProps {
  open: boolean;
  onClose: () => void;
}

export default function WritePostModal({ open, onClose }: WritePostModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="relative w-[600px] max-w-[95vw] min-h-[520px] bg-white border rounded-2xl p-10 flex flex-col shadow-lg">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-black"
          onClick={onClose}
          aria-label="닫기"
        >
          ×
        </button>

        {/* 소제목 */}
        <div className="flex items-center mb-8">
          <label className="w-28 font-semibold text-base text-gray-700">소제목</label>
          <input
            type="text"
            placeholder="소제목 입력"
            className="flex-1 border-b border-gray-300 outline-none px-2 py-1 bg-transparent text-base"
          />
        </div>

        {/* 공개 설정 */}
        <div className="flex items-center mb-8">
          <label className="w-28 font-semibold text-base text-gray-700">공개 설정</label>
          <div className="flex items-center gap-6">
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="visibility" defaultChecked className="mr-1 accent-pink-500" />
              전체공개 
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="visibility" className="mr-1 accent-pink-500" />
              비공개 
            </label>
          </div>
        </div>

        {/* 태그 편집 */}
        <div className="flex items-start mb-8">
          <label className="w-28 font-semibold text-base text-gray-700 pt-2">태그 편집</label>
          <textarea
            placeholder="#태그입력"
            className="flex-1 border border-gray-300 rounded resize-none px-2 py-2 min-h-[60px] text-base"
          />
        </div>
        {/* 게시 버튼 */}
        <button
          className="self-end px-10 py-2 border border-black rounded-xl text-lg font-medium bg-white hover:bg-gray-100"
          onClick={onClose}
        >
          게시
        </button>
      </div>
    </div>
  );
}
