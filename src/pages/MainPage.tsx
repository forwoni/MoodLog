import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/moodlog_logo_transparent.png';
import { Bell, User, X, Pencil, Heart, Folder, LogOut, FileText, Settings } from 'lucide-react';

function MainPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col bg-[#F1F1F1] overflow-hidden text-[1.5rem]">
      {/* 상단 영역 */}
      <header className="h-[50%] bg-[#DAD6D6] flex flex-col items-center justify-center relative">
        <img src={logo} alt="Mood Log" className="h-72 mb-12" />

        {/* 검색창 */}
        <div className="relative w-[1200px]">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-24 py-6 rounded-full outline-none text-2xl bg-white placeholder-gray-400 shadow"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <X size={28} />
            </button>
          )}
        </div>

        <div className="absolute top-10 right-14 flex gap-10">
          <Bell className="w-9 h-9 cursor-pointer" onClick={() => setShowNotifications(!showNotifications)} />
          <User className="w-9 h-9 cursor-pointer" onClick={() => setShowProfileMenu(!showProfileMenu)} />
        </div>
      </header>

      {/* 본문 구분선 */}
      <div className="h-[2px] w-full bg-black" />

      {/* 하단 본문 영역 */}
      <main className="flex-1 flex flex-row px-36 py-10 bg-[#EFEFEF] text-[1.5rem] overflow-hidden">
        <section className="w-[580px] h-[100%] bg-white rounded-xl border border-gray-300 p-6 shadow-md flex flex-col">
          <h2 className="text-4xl font-bold mb-6">🎵 실시간 노래차트</h2>
          <div className="border border-gray-300 rounded-md px-4 py-6 space-y-5 overflow-y-auto flex-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="flex items-center gap-4 w-full min-w-0 py-2">
                <span className="w-8 text-xl font-semibold shrink-0">{i}</span>
                <div className="w-14 h-14 bg-gray-300 rounded-md shrink-0" />
                <div className="flex flex-col text-lg flex-grow min-w-0">
                  <span className="font-medium truncate">곡 제목 {i}</span>
                  <span className="text-gray-500 truncate">가수 이름</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex-grow flex justify-end items-center">
          <div className="w-[1px] bg-gray-400 mx-28 self-stretch" />

          <section className="flex flex-col justify-center items-end gap-12">
            <button className="flex items-center gap-4 px-8 py-6 bg-white rounded-lg shadow border hover:bg-gray-100 text-2xl font-semibold w-80">
              <Pencil className="w-8 h-8 text-black" /> 글쓰기
            </button>
            <button className="flex items-center gap-4 px-8 py-6 bg-white rounded-lg shadow border hover:bg-gray-100 text-2xl font-semibold w-80">
              <Heart className="w-8 h-8 text-black" /> 인기 글
            </button>
            <button className="flex items-center gap-4 px-8 py-6 bg-white rounded-lg shadow border hover:bg-gray-100 text-2xl font-semibold w-80">
              <Folder className="w-8 h-8 text-black" /> 이웃 글
            </button>
          </section>
        </div>
      </main>

      {/* 알림창 */}
      {showNotifications && (
        <div
          ref={notifRef}
          className="absolute right-16 top-28 w-72 bg-white rounded-xl shadow-xl p-4 z-10 border"
        >
          <div className="flex items-center justify-between border-b pb-2 mb-4">
            <Bell className="text-gray-700" />
            <X className="cursor-pointer" onClick={() => setShowNotifications(false)} />
          </div>
          <div className="bg-gray-100 h-40 rounded-md mb-4"></div>
          <div className="h-[1px] bg-gray-300" />
          <div className="h-10 bg-white" />
        </div>
      )}

      {/* 프로필 메뉴 */}
      {showProfileMenu && (
        <div
          ref={profileRef}
          className="absolute right-10 top-28 w-48 bg-white rounded-xl shadow-xl p-4 text-sm z-10 border"
        >
          <div className="flex items-center border-b pb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-2">
              <User className="w-6 h-6 text-black" />
            </div>
            <p className="font-bold text-base">닉네임</p>
          </div>
          <ul className="space-y-3 mt-4">
            <li className="flex items-center gap-2 hover:underline cursor-pointer">
              <FileText className="w-5 h-5 text-gray-700" /> 내 글 목록
            </li>
            <li
              className="flex items-center gap-2 hover:underline cursor-pointer"
              onClick={() => navigate('/mypage')}
            >
              <Settings className="w-5 h-5 text-gray-700" /> 마이 페이지
            </li>
            <li
              className="flex items-center gap-2 hover:underline cursor-pointer text-black"
              onClick={() => navigate('/')}
            >
              <LogOut className="w-5 h-5" /> 로그아웃
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default MainPage;
