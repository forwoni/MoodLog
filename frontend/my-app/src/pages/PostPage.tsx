import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/moodlog_logo_transparent.png";
import FontDropdown from "../components/FontDropdown";
import AlignDropdown from "../components/AlignDropdown";

// 사용자 정보는 실제로는 context 등에서 받아오는 것이 안전합니다.
const getCurrentUsername = () => localStorage.getItem("username") || "";

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

  // 1. 최신 임시글(내가 작성한 것만) 불러오기 및 이전 임시글 삭제
  useEffect(() => {
    const loadMyLatestDraft = async () => {
      try {
        const username = getCurrentUsername();
        // 내 글만 조회 (정렬: 최신순, 임시글만)
        const { data } = await axios.get<Post[]>("/api/posts", {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
        });

        // 내 글 + autoSaved만 필터링
        const myDrafts = data
          .filter(post => post.authorUsername === username && post.autoSaved)
          .sort((a, b) => b.id - a.id);

        if (myDrafts.length > 0) {
          const latestDraft = myDrafts[0];
          setTitle(latestDraft.title);
          setContent(latestDraft.content);
          if (editorRef.current) {
            editorRef.current.innerHTML = latestDraft.content;
          }
          setCurrentDraftId(latestDraft.id);

          // 내 이전 임시글 삭제
          await Promise.all(
            myDrafts.slice(1).map(draft =>
              axios.delete(`/api/posts/${draft.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
              })
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

  // 2. 자동 저장 (5초마다, 내 임시글 id만 사용)
  useEffect(() => {
    const autoSave = async () => {
      const username = getCurrentUsername();
      if (!title && !content) return;

      try {
        const payload = {
          title: title || "임시 저장 제목",
          content: content || " ",
          autoSaved: true
        };

        // 기존 임시글이 있으면 PUT, 없으면 POST
        if (currentDraftId) {
          // 내 글이 맞는지 체크(프론트에서 한 번 더 안전장치)
          const res = await axios.get<Post>(`/api/posts/${currentDraftId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
          });
          if (res.data.authorUsername !== username) {
            // 내 글이 아니면 자동 저장 금지
            return;
          }
          await axios.put(`/api/posts/${currentDraftId}`, payload, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
          });
        } else {
          const response = await axios.post("/api/posts", payload, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
          });
          setCurrentDraftId(response.data.id);
        }
      } catch (error) {
        console.error("자동 저장 실패:", error);
      }
    };

    const interval = setInterval(autoSave, 5000);
    return () => clearInterval(interval);
  }, [title, content, currentDraftId]);

  // 에디터 selection 저장/복원 (툴바 기능용)
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

      // 최종 게시물 저장 (autoSaved: false)
      if (currentDraftId) {
        // 내 글이 맞는지 체크(프론트에서 한 번 더 안전장치)
        const username = getCurrentUsername();
        const res = await axios.get<Post>(`/api/posts/${currentDraftId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
        });
        if (res.data.authorUsername !== username) {
          alert("본인 글이 아닙니다.");
          return;
        }
        await axios.put(`/api/posts/${currentDraftId}`, {
          title,
          content,
          autoSaved: false
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
        });

        // 임시글 삭제 (원한다면)
        await axios.delete(`/api/posts/${currentDraftId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
        });
      } else {
        // 혹시라도 id가 없으면 새로 생성
        await axios.post("/api/posts", {
          title,
          content,
          autoSaved: false
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
        });
      }

      navigate("/history");
    } catch (error) {
      console.error("게시 실패:", error);
      alert("게시에 실패했습니다.");
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
