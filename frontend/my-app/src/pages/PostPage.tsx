import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axiosInstance";
import logo from "../assets/moodlog_logo_transparent.png";
import FontDropdown from "../components/FontDropdown";
import AlignDropdown from "../components/AlignDropdown";
import { useUser } from "../contexts/UserContext";
import { AxiosError } from "axios";
import { Music, Loader, Heart, Sparkles } from 'lucide-react';

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
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishingStep, setPublishingStep] = useState<'emotion' | 'playlist'>('emotion');

  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelection = useRef<Range | null>(null);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

        // 기존 상태 초기화
        setTitle("");
        setContent("");
        setCurrentDraftId(null);
        if (editorRef.current) {
          editorRef.current.innerHTML = "";
        }

        const { data } = await api.get<Post[]>("/posts", {
          params: { autoSaved: true },
          headers: { Authorization: `Bearer ${token}` }
        });

        const myDrafts = data
          .filter(post => post.autoSaved && post.authorName === currentUser?.username)
          .sort((a, b) => b.id - a.id);

        if (myDrafts.length > 0) {
          const latestDraft = myDrafts[0];
          const loadDraft = window.confirm(
            "임시저장된 글이 있습니다. 불러오시겠습니까?"
          );

          if (loadDraft) {
            setTitle(latestDraft.title);
            setContent(latestDraft.content);
            if (editorRef.current) {
              editorRef.current.innerHTML = latestDraft.content;
            }
            setCurrentDraftId(latestDraft.id);

            // 오래된 임시저장 글 삭제
            await Promise.all(
              myDrafts.slice(1).map(draft =>
                api.delete(`/posts/${draft.id}`, {
                  headers: { Authorization: `Bearer ${token}` }
                })
              )
            );
          } else {
            // 임시저장 글을 불러오지 않을 경우 모든 임시저장 글 삭제
            await Promise.all(
              myDrafts.map(draft =>
                api.delete(`/posts/${draft.id}`, {
                  headers: { Authorization: `Bearer ${token}` }
                })
              )
            );
          }
        }
      } catch (error) {
        console.error("임시 저장글 불러오기 실패:", error);
        // 에러 발생 시에도 상태 초기화
        setTitle("");
        setContent("");
        setCurrentDraftId(null);
        if (editorRef.current) {
          editorRef.current.innerHTML = "";
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadLatestDraft();
  }, [currentUser, navigate]);

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

    autoSaveIntervalRef.current = setInterval(autoSave, 5000);
    return () => {
      if (autoSaveIntervalRef.current) clearInterval(autoSaveIntervalRef.current);
    };
  }, [title, content, currentDraftId, currentUser]);

  // 3. 게시하기 버튼 클릭
  const handlePublish = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요");
      return;
    }

    setIsPublishing(true);
    setPublishingStep('emotion');

    try {
      // ⭐️ 자동저장 중단!
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }

      const payload = {
        title,
        content,
        autoSaved: false
      };

      let postId: number | null = null;

      if (currentDraftId) {
        await api.put(`/posts/${currentDraftId}`, payload);
        postId = currentDraftId;
      } else {
        await api.post("/posts", payload);

        const { data: posts } = await api.get<Post[]>("/posts");
        const myPosts = posts
          .filter(post => post.authorName === currentUser?.username)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        if (myPosts.length > 0) {
          postId = myPosts[0].id;
        }
      }

      if (!postId) {
        alert("게시글 ID를 찾을 수 없습니다.");
        setIsPublishing(false);
        return;
      }

      // 감정 분석 단계를 보여주기 위한 딜레이
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // 플레이리스트 생성 단계로 전환
      setPublishingStep('playlist');
      
      // 플레이리스트 생성 단계를 보여주기 위한 딜레이
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      navigate(`/postdetail/${postId}`);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      alert(err.response?.data?.message || "게시 실패");
      if (err.response?.status === 401) logout();
      setIsPublishing(false);
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

  const placeholderContent = `오늘 하루는 어떠셨나요?

예시)
• 오늘의 감정: 행복했어요 😊
• 감정의 이유: 좋아하는 음악을 들으며 산책했어요
• 오늘의 플레이리스트:
  - IU - 밤편지
  - 폴킴 - 비
  - 아이유 - 가을 아침

산책하면서 들은 음악들이 너무 좋았어요.
특히 '밤편지'를 들으면서 걸었을 때는 
마음이 따뜻해지는 기분이었습니다...`;

  if (isLoading) return <div className="text-center py-8">불러오는 중...</div>;

  if (isPublishing) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-white via-purple-50 to-blue-50 flex flex-col items-center justify-center z-50">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-purple-100 flex flex-col items-center max-w-md mx-4">
          {publishingStep === 'emotion' ? (
            <>
              <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-purple-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Heart className="w-8 h-8 text-white animate-bounce" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 text-transparent bg-clip-text mb-3">
                감정 분석 중
              </h2>
              <p className="text-gray-600 text-center mb-6">
                MoodLog가 당신의 글에 담긴<br />
                감정을 분석하고 있습니다
              </p>
              <div className="flex items-center gap-2 text-rose-600">
                <Loader className="w-5 h-5 animate-spin" />
                <span>감정 분석 중...</span>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-6 relative">
                <Music className="w-8 h-8 text-white" />
                <div className="absolute inset-0 rounded-full">
                  <div className="absolute inset-0 rounded-full animate-ping bg-white/30"></div>
                  <Sparkles className="absolute -right-1 -top-1 w-5 h-5 text-yellow-400 animate-bounce" />
                  <Sparkles className="absolute -left-1 -bottom-1 w-4 h-4 text-purple-400 animate-bounce" />
                </div>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text mb-3">
                플레이리스트 생성 중
              </h2>
              <p className="text-gray-600 text-center mb-6">
                분석된 감정을 바탕으로<br />
                당신만을 위한 플레이리스트를 만들고 있습니다
              </p>
              <div className="flex items-center gap-2 text-purple-600">
                <Loader className="w-5 h-5 animate-spin" />
                <span>음악 선정 중...</span>
              </div>
            </>
          )}
        </div>
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
            onClick={handlePublish}
          >
            <span>게시하기</span>
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
                    className="absolute left-0 top-0 text-gray-300 pointer-events-none select-none whitespace-pre-line transition-colors"
                    style={{ userSelect: "none" }}
                  >
                    {placeholderContent}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
