import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axiosInstance";
import logo from "../assets/moodlog_logo_transparent.png";
import FontDropdown from "../components/FontDropdown";
import AlignDropdown from "../components/AlignDropdown";
import { AxiosError } from "axios";

// 서버 에러 응답 타입 정의
interface ErrorResponse {
  message?: string;
  [key: string]: unknown;
}

// 타입 가드 함수
function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as Record<string, unknown>).isAxiosError === true
  );
}

// 서버 응답이 ErrorResponse 타입인지 확인
function isErrorResponse(data: unknown): data is ErrorResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "message" in data
  );
}

export default function PostPage() {
  const [font, setFont] = useState("Arial");
  const [fontSize, setFontSize] = useState(16);
  const [align, setAlign] = useState("left");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelection = useRef<Range | null>(null);
  const navigate = useNavigate();

  // 에디터 selection 저장/복원
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection?.rangeCount) {
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

  // 에디터 명령 실행
  const handleCommand = (command: string, value?: string) => {
    saveSelection();
    document.execCommand(command, false, value);
    restoreSelection();
    setBold(document.queryCommandState("bold"));
    setItalic(document.queryCommandState("italic"));
  };

  // 툴바 핸들러
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

  // 본문 입력 핸들러
  const handleBodyInput = () => {
    setContent(editorRef.current?.innerHTML || "");
  };

  // 게시물 최종 제출
  const handlePublish = async () => {
    try {
      if (!title.trim()) {
        alert("제목을 입력해주세요");
        return;
      }

      // 임시 저장 없이 무조건 새 글 생성(POST)
      await api.post("/posts", {
        title,
        content,
        autoSaved: false
      });

      navigate("/history");
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        console.error("게시 실패:", error.response.data);
        const responseData = error.response.data;
        if (isErrorResponse(responseData)) {
          alert(responseData.message || "게시에 실패했습니다.");
        } else {
          alert(JSON.stringify(responseData) || "게시에 실패했습니다.");
        }
      } else if (error instanceof Error) {
        console.error("게시 실패:", error.message);
        alert(error.message);
      } else {
        console.error("게시 실패:", error);
        alert("게시에 실패했습니다.");
      }
    }
  };

  const showPlaceholder =
    (!content || content === "<br>") &&
    (!editorRef.current || editorRef.current.innerText.trim() === "");

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="w-full bg-white py-4 px-10 shadow-md flex justify-start items-center">
        <img
          src={logo}
          alt="MoodLog"
          className="h-24 cursor-pointer"
          onClick={() => navigate("/main")}
        />
      </div>

      <div className="max-w-[1200px] mx-auto pt-6">
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
            onClick={handlePublish}
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
