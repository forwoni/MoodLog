import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderBox } from "../layouts/headerBox";
import FontDropdown from "../components/FontDropdown";
import AlignDropdown from "../components/AlignDropdown";

export default function PostPage() {
  const [font, setFont] = useState("글씨체 1");
  const [fontSize, setFontSize] = useState(16);
  const [align, setAlign] = useState("left");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelection = useRef<Range | null>(null);

  const navigate = useNavigate();

  // 선택 영역 저장/복원
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelection.current = selection.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    if (savedSelection.current && editorRef.current) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedSelection.current);
      editorRef.current.focus();
    }
  };

  // 명령 실행 함수
  const handleCommand = (command: string, value?: string) => {
    saveSelection();
    document.execCommand(command, false, value);
    restoreSelection();
    setBold(document.queryCommandState("bold"));
    setItalic(document.queryCommandState("italic"));
  };

  const handleFontChange = (font: string) => {
    saveSelection();
    setFont(font);
    handleCommand("fontName", font);
  };

  const handleFontSizeChange = (size: number) => {
    saveSelection();
    setFontSize(size);
    setTimeout(() => {
      restoreSelection();
      handleCommand("fontSize", "7");
      setTimeout(() => {
        const fontElements = editorRef.current?.querySelectorAll("font[size='7']");
        fontElements?.forEach((el) => {
          (el as HTMLElement).removeAttribute("size");
          (el as HTMLElement).style.fontSize = `${size}px`;
        });
      }, 0);
    }, 0);
  };

  const handleAlignChange = (align: string) => {
    saveSelection();
    setAlign(align);
    handleCommand(`justify${align.charAt(0).toUpperCase() + align.slice(1)}`);
  };

  const handleBodyInput = () => {
    setBody(editorRef.current?.innerHTML || "");
  };

  const showPlaceholder =
    (!body || body === "<br>") &&
    (!editorRef.current || editorRef.current.innerText.trim() === "");

  // 게시하기 버튼 클릭 시 history 페이지로 이동
  const handleSubmit = () => {
    // 실제로는 여기서 서버로 데이터 전송 등 처리 가능
    navigate("/history");
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderBox />
      <div className="max-w-[1200px] mx-auto pt-[102px]">
        {/* 툴바 */}
        <div className="flex items-center border-b border-gray-200 py-2 px-2 bg-white">
          <FontDropdown value={font} onChange={handleFontChange} />
          <input
            type="number"
            min={8}
            max={72}
            value={fontSize}
            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
            className="ml-2 w-12 px-1 py-1 border rounded text-center bg-white"
            style={{ fontSize: 16 }}
            onFocus={saveSelection}
          />
          <AlignDropdown value={align} onChange={handleAlignChange} />
          <button
            className={`ml-2 px-2 py-1 border rounded font-bold transition-colors ${
              bold ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-500"
            }`}
            onClick={() => handleCommand("bold")}
            aria-pressed={bold}
            type="button"
          >
            B
          </button>
          <button
            className={`ml-2 px-2 py-1 border rounded italic transition-colors ${
              italic ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-500"
            }`}
            onClick={() => handleCommand("italic")}
            aria-pressed={italic}
            type="button"
          >
            I
          </button>
          <button
            className="ml-auto px-4 py-2 bg-black text-white rounded"
            onClick={handleSubmit}
          >
            게시하기
          </button>
        </div>

        {/* 본문 에디터 */}
        <div className="flex justify-center mt-6">
          <div className="w-[600px] min-h-[900px] border rounded bg-white flex flex-col">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="border-b px-6 py-4 text-lg font-semibold text-gray-800 outline-none"
            />
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleBodyInput}
              className="relative px-6 py-4 text-gray-800 flex-1 outline-none"
              style={{ minHeight: 600 }}
            >
              {showPlaceholder && (
                <span
                  className="absolute left-6 top-4 text-gray-400 pointer-events-none select-none"
                  style={{ userSelect: "none" }}
                >
                  게시글을 입력하세요
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
