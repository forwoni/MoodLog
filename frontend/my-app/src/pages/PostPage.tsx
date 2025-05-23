import React, { useState } from "react";
import { HeaderBox } from "../layouts/headerBox";
import FontDropdown from "../components/FontDropdown";
import AlignDropdown from "../components/AlignDropdown";

export default function PostPage() {
  const [font, setFont] = useState("글씨체 1");
  const [fontSize, setFontSize] = useState(8);
  const [align, setAlign] = useState("left");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <HeaderBox />
      <div className="max-w-[1200px] mx-auto pt-[102px]">
        {/* 툴바 */}
        <div className="flex items-center border-b border-gray-200 py-2 px-2 bg-white">
          <FontDropdown value={font} onChange={setFont} />
          {/* 텍스트 사이즈 input */}
          <input
            type="number"
            min={6}
            max={72}
            value={fontSize}
            onChange={e => setFontSize(Number(e.target.value))}
            className="ml-2 w-12 px-1 py-1 border rounded text-center bg-white"
            style={{ fontSize: 16 }}
          />
          <AlignDropdown value={align} onChange={setAlign} />
          {/* 볼드 버튼: 명도 변화 */}
          <button
            className={`ml-2 px-2 py-1 border rounded font-bold transition-colors ${
              bold ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-500"
            }`}
            onClick={() => setBold((b) => !b)}
            aria-pressed={bold}
          >
            B
          </button>
          {/* 이탤릭 버튼: 명도 변화 */}
          <button
            className={`ml-2 px-2 py-1 border rounded italic transition-colors ${
              italic ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-500"
            }`}
            onClick={() => setItalic((i) => !i)}
            aria-pressed={italic}
          >
            I
          </button>
          <button className="ml-auto px-4 py-2 bg-black text-white rounded">
            게시하기
          </button>
        </div>
        {/* 본문 에디터 */}
        <div className="flex justify-center mt-6">
          <div className="w-[600px] min-h-[900px] border rounded bg-white flex flex-col">
            <div className="border-b px-6 py-4 text-lg font-semibold text-gray-800">
              제목
            </div>
            <div className="px-6 py-4 text-gray-500">게시글 내용</div>
            <div className="flex-1 flex items-center justify-center">
              <span className="text-pink-500 text-2xl">○</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
