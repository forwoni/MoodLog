import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/axiosInstance";
import logo from "../assets/moodlog_logo_transparent.png";
import FontDropdown from "../components/FontDropdown";
import AlignDropdown from "../components/AlignDropdown";
import { useUser } from "../contexts/UserContext";
import { AxiosError } from "axios";
import ConfirmModal from "../components/ConfirmModal";

interface Post {
  id: number;
  title: string;
  content: string;
  autoSaved: boolean;
  authorName: string;
  createdAt: string;
}

export default function PostEditPage() {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();
  const { id } = useParams();

  const [font, setFont] = useState("Arial");
  const [fontSize, setFontSize] = useState(16);
  const [align, setAlign] = useState("left");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelection = useRef<Range | null>(null);

  // 1. 게시글 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          alert("로그인이 필요합니다");
          navigate("/login");
          return;
        }
        const { data } = await api.get<Post>(`/posts/${id}`);
        setTitle(data.title);
        setContent(data.content);
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.innerHTML = data.content;
          }
        }, 0);
      } catch (error) {
        alert("게시글을 불러올 수 없습니다.");
        navigate("/main");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
    // eslint-disable-next-line
  }, [id]);

  // 2. 게시글 수정 기능
  const handleEdit = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleEditConfirm = async () => {
    try {
      const payload = {
        title,
        content,
        autoSaved: false
      };
      await api.put(`/posts/${id}`, payload);
      navigate(`/postdetail/${id}`);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      alert(err.response?.data?.message || "수정 실패");
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

  const handleBodyInput = () => {
    setContent(editorRef.current?.innerHTML || "");
  };

  const showPlaceholder =
    (!content || content === "<br>") &&
    (!editorRef.current || editorRef.current.innerText.trim() === "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-blue-50">
      {/* 헤더 */}
      <div className="w-full bg-white/80 backdrop-blur-sm py-4 px-6 md:px-10 shadow-lg border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <img
            src={logo}
            alt="MoodLog"
            className="h-16 md:h-20 cursor-pointer transition-transform hover:scale-105"
            onClick={() => navigate("/main")}
          />
          <button
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
            onClick={handleEdit}
          >
            <span>수정 완료</span>
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8">
        {/* 에디터 컨테이너 */}
        <div className="max-w-[700px] mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
          {/* 툴바 */}
          <div className="border-b border-purple-100 p-3 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-purple-100 p-1">
                <FontDropdown value={font} onChange={handleFontChange} />
                <div className="w-px h-6 bg-purple-100"></div>
                <input
                  type="number"
                  min={8}
                  max={72}
                  value={fontSize}
                  onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                  className="w-14 px-2 py-1 text-center bg-transparent focus:outline-none"
                  style={{ fontSize: 14 }}
                  onFocus={saveSelection}
                />
              </div>
              
              <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-purple-100 p-1">
                <AlignDropdown value={align} onChange={handleAlignChange} />
              </div>

              <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-purple-100 p-1">
                <button
                  className={`px-2.5 py-1 rounded font-bold transition-all ${
                    bold
                      ? "bg-purple-600 text-white"
                      : "text-purple-600 hover:bg-purple-50"
                  }`}
                  onClick={() => handleCommand("bold")}
                  aria-pressed={bold}
                  type="button"
                >
                  B
                </button>
                <button
                  className={`px-2.5 py-1 rounded italic transition-all ${
                    italic
                      ? "bg-purple-600 text-white"
                      : "text-purple-600 hover:bg-purple-50"
                  }`}
                  onClick={() => handleCommand("italic")}
                  aria-pressed={italic}
                  type="button"
                >
                  I
                </button>
              </div>
            </div>
          </div>

          {/* 에디터 본문 */}
          <div className="p-5">
            {/* 제목 영역 */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 mb-4 shadow-sm border border-purple-100">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full text-xl md:text-2xl font-bold bg-transparent outline-none placeholder-gray-300 focus:placeholder-gray-400 transition-colors"
                style={{
                  background: "linear-gradient(to right, #7c3aed, #2563eb)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              />
            </div>
            
            {/* 본문 영역 */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-purple-100">
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleBodyInput}
                className="relative min-h-[400px] max-h-[600px] overflow-y-auto outline-none prose prose-sm prose-purple max-w-none"
                style={{
                  fontSize: `${fontSize}px`,
                  fontFamily: font,
                  textAlign: align as 'left' | 'center' | 'right' | 'justify',
                }}
              >
                {showPlaceholder && (
                  <span
                    className="absolute left-0 top-0 text-gray-300 pointer-events-none select-none"
                    style={{ userSelect: "none" }}
                  >
                    게시글을 입력하세요
                  </span>
                )}
              </div>
            </div>

            {/* 플레이리스트 안내 메시지 */}
            <div className="mt-6 bg-purple-50/50 backdrop-blur-sm rounded-xl p-4 border border-purple-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="21" cy="16" r="3" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    플레이리스트 안내
                  </h3>
                  <p className="mt-1 text-gray-600">
                    게시글 수정 시에는 기존 플레이리스트가 유지되며 변경할 수 없습니다. 
                    새로운 플레이리스트를 생성하시려면 새 게시글을 작성해 주세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 수정 확인 모달 */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="게시글 수정"
        message="수정된 내용을 저장하시겠습니까?"
        confirmText="저장"
        onConfirm={handleEditConfirm}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
}
