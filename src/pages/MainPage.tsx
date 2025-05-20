import { useState, useEffect, useRef } from "react";
import { Bell, User, X } from "lucide-react";
import logo from "../assets/moodlog_logo_transparent.png";
import profileIcon from "../assets/default-profile.png";

const MainPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !(notifRef.current as any).contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !(profileRef.current as any).contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col bg-[#F1F1F1]">
      {/* 헤더 영역 */}
      <header className="w-full h-1/2 bg-[#DAD6D6] flex flex-col items-center justify-center relative shadow-md">
        <img src={logo} alt="Mood Log" className="h-16 mb-5" />

        <div className="relative w-[600px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="w-full px-5 py-2 rounded-full outline-none text-sm bg-white placeholder-gray-400"
          />
          {/* 돋보기 아이콘 */}
          <svg
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1016.65 16.65z" />
          </svg>

          {/* 삭제(X) 버튼 */}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-white bg-gray-400 rounded-full p-0.5"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* 알림 / 프로필 */}
        <div className="absolute right-10 top-10 flex gap-6">
          <Bell
            className="w-6 h-6 cursor-pointer"
            onClick={() => setShowNotifications(!showNotifications)}
          />
          <img
            src={profileIcon}
            alt="프로필"
            className="w-6 h-6 rounded-full cursor-pointer"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          />
        </div>
      </header>

      {/* 본문 영역 */}
      <main className="flex-1 flex justify-between px-16 py-6">
        {/* 실시간 노래차트 */}
        <section className="w-[300px] bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold mb-4">🎵 실시간 노래차트</h2>
          <ul className="space-y-2 text-sm">
            <li>1. 너에게 닿기를 - 10cm</li>
            <li>2. Like JENNIE - 제니 (JENNIE)</li>
            <li>3. Drowning - WOODZ</li>
            <li>4. Fly Up - RIIZE</li>
          </ul>
        </section>

        {/* 우측 버튼 박스 */}
        <section className="flex flex-col gap-4">
          <button className="flex items-center gap-2 bg-white px-6 py-3 rounded shadow border hover:bg-gray-100 text-gray-800 font-medium">
            ✏️ 글쓰기
          </button>
          <button className="flex items-center gap-2 bg-white px-6 py-3 rounded shadow border hover:bg-gray-100 text-gray-800 font-medium">
            ❤️ 인기 글
          </button>
          <button className="flex items-center gap-2 bg-white px-6 py-3 rounded shadow border hover:bg-gray-100 text-gray-800 font-medium">
            📁 이웃 글
          </button>
        </section>
      </main>

      {/* 알림창 */}
      {showNotifications && (
        <div
          ref={notifRef}
          className="absolute right-16 top-28 w-64 bg-white rounded-md shadow-lg p-4 z-10"
        >
          <span className="font-semibold">🔔 알림</span>
          <p className="text-sm text-gray-500 mt-2">새 알림이 없습니다.</p>
        </div>
      )}

      {/* 프로필 메뉴 */}
      {showProfileMenu && (
        <div
          ref={profileRef}
          className="absolute right-10 top-28 w-48 bg-white rounded-md shadow-lg p-4 text-sm z-10"
        >
          <p className="font-bold mb-2">닉네임</p>
          <ul className="space-y-2">
            <li className="hover:underline cursor-pointer">📜 내 글 목록</li>
            <li className="hover:underline cursor-pointer">⚙️ 마이 페이지</li>
            <li className="hover:underline cursor-pointer text-red-500">🚪 로그아웃</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MainPage;
<h1 className="text-2xl text-red-600 font-bold">🔥 수정된 MainPage입니다!</h1>
