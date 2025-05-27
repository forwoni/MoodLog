import React, { useRef, useState, useEffect } from "react";
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

// 임시글/게시글 타입
interface Post {
  id: number;
  title: string;
  content: string;
  autoSaved: boolean;
  authorUsername: string;
}

export default function PostPage() {
  const [font, setFont] = useState("Arial");
  const [fontSize, setFontSize] = useState(16);
  const [align, setAlign] = useState("left");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentDraftId, setCurrentDraftId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelection = useRef<Range | null>(null);
  const navigate = useNavigate();

  // 1. 최신 임시글 불러오기 및 이전 임시글 삭제
  useEffect(() => {
    const loadMyLatestDraft = async () => {
      try {
        const { data } = await api.get<Post[]>("/posts");
        const myDrafts = data
          .filter(post => post.autoSaved)
          .sort((a, b) => b.id - a.id);

        if (myDrafts.length > 0) {
          const latestDraft = myDrafts[0];
          setTitle(latestDraft.title);
          setContent(latestDraft.content);
          if (editorRef.current) {
            editorRef.current.innerHTML = latestDraft.content;
          }
          setCurrentDraftId(latestDraft.id);

          // 이전 임시글 삭제
          await Promise.all(
            myDrafts.slice(1).map(draft =>
              api.delete(`/posts/${draft.id}`)
            )
          );
        }
      } catch (error) {
        console.error("임시 저장글 불러오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMyLatestDraft();
  }, []);

  // 2. 자동 저장 (5초마다)
  useEffect(() => {
    const autoSave = async () => {
      if (!title && !content) return;

      try {
        const payload = {
          title: title || "임시 저장 제목",
          content: content || " ",
          autoSaved: true
        };

        if (currentDraftId) {
          await api.put(`/posts/${currentDraftId}`, payload);
        } else {
          const response = await api.post("/posts", payload);
          setCurrentDraftId(response.data.id);
        }
      } catch (error) {
        console.error("자동 저장 실패:", error);
      }
    };

    const interval = setInterval(autoSave, 5000);
    return () => clearInterval(interval);
  }, [title, content, currentDraftId]);

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

  // 3. 게시물 최종 제출 (임시글이면 autoSaved: false로 전환)
  const handlePublish = async () => {
    try {
      if (!title.trim()) {
        alert("제목을 입력해주세요");
        return;
      }

      if (currentDraftId) {
        await api.put(`/posts/${currentDraftId}`, {
          title,
          content,
          autoSaved: false
        });
      } else {
        await api.post("/posts", {
          title,
          content,
          autoSaved: false
        });
      }

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

  if (isLoading) {
    return <div className="text-center py-8">불러오는 중...</div>;
  }

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
