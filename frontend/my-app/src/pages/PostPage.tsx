import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axiosInstance";
import logo from "../assets/moodlog_logo_transparent.png";
import FontDropdown from "../components/FontDropdown";
import AlignDropdown from "../components/AlignDropdown";
import { useUser } from "../contexts/UserContext";
import { AxiosError } from "axios";

interface Post {
  id: number;
  title: string;
  content: string;
  autoSaved: boolean;
  authorName: string;
  createdAt: string;
}

export default function PostPage() {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();

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

  // 1. 최신 임시글 불러오기
  useEffect(() => {
    const loadLatestDraft = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          alert("로그인이 필요합니다");
          navigate("/login");
          return;
        }

        const { data } = await api.get<Post[]>("/posts", {
          params: { autoSaved: true },
          headers: { Authorization: `Bearer ${token}` }
        });

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

          await Promise.all(
            myDrafts.slice(1).map(draft =>
              api.delete(`/posts/${draft.id}`, {
                headers: { Authorization: `Bearer ${token}` }
              })
            )
          );
        }
      } catch (error) {
        console.error("임시 저장글 불러오기 실패:", error);
        alert("임시 저장글을 불러오지 못했습니다");
      } finally {
        setIsLoading(false);
      }
    };

    loadLatestDraft();
  }, []);

  // 2. 자동 저장 기능
  useEffect(() => {
    const autoSave = async () => {
      if (!currentUser?.username || (!title && !content)) return;

      try {
        const payload = {
          title: title || "임시 저장 제목",
          content: content || " ",
          autoSaved: true
        };

        if (currentDraftId) {
          await api.put(`/posts/${currentDraftId}`, payload);
        } else {
          const { data } = await api.post("/posts", payload);
          setCurrentDraftId(data.id);
        }
      } catch (error) {
        console.error("자동 저장 실패:", error);
      }
    };

    const interval = setInterval(autoSave, 5000);
    return () => clearInterval(interval);
  }, [title, content, currentDraftId, currentUser]);

  // 3. 게시 기능 (수정된 부분)
  const handlePublish = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요");
      return;
    }
    try {
      const payload = {
        title,
        content,
        autoSaved: false
      };

      let postId: number | null = null;

      if (currentDraftId) {
        // Case 1: 임시글을 게시하는 경우 (id를 알고 있음)
        await api.put(`/posts/${currentDraftId}`, payload);
        postId = currentDraftId;
      } else {
        // Case 2: 새 글을 게시하는 경우 (id를 모름)
        await api.post("/posts", payload);

        // 전체 게시글 목록에서 내 최신 글 찾기
        const { data: posts } = await api.get<Post[]>("/posts");
        const myPosts = posts
          .filter(post => post.authorName === currentUser?.username)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        if (myPosts.length > 0) {
          postId = myPosts[0].id;
        }
      }git 

      if (!postId) {
        alert("게시글 ID를 찾을 수 없습니다.");
        return;
      }

      navigate(`/postdetail/${postId}`);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      alert(err.response?.data?.message || "게시 실패");
      if (err.response?.status === 401) logout();
    }
  };
  // 에디터 선택 영역 관리
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
    handleCommand("fontSize", "7");
    setTimeout(() => {
      const elements = editorRef.current?.querySelectorAll('font[size="7"]');
      elements?.forEach(el => {
        (el as HTMLElement).style.fontSize = `${size}px`;
        el.removeAttribute("size");
      });
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

  const showPlaceholder =
    (!content || content === "<br>") &&
    (!editorRef.current || editorRef.current.innerText.trim() === "");

  if (isLoading) return <div className="text-center py-8">불러오는 중...</div>;

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
