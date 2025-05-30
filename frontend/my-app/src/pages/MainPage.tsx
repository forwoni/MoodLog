import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBox from '../components/searchBox';
import logo from '../assets/moodlog_logo_transparent.png';
import {
  Bell,
  User,
  X,
  Pencil,
  Heart,
  Folder,
  LogOut,
  FileText,
  Settings
} from 'lucide-react';
import api from '../services/axiosInstance'; // axios 인스턴스 (토큰 자동 처리)

interface Notification {
  id: number;
  message: string;
  read: boolean;
  timestamp: string;
  link?: string; // 알림 클릭 시 이동 경로
}

function MainPage() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // 알림 목록 API 연동
  const fetchNotifications = async () => {
    try {
      const res = await api.get<Notification[]>('/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error('알림 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // 알림 클릭 시 읽음 처리 및 이동
  const handleNotificationClick = async (id: number, link?: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((noti) => (noti.id === id ? { ...noti, read: true } : noti))
      );
      if (link) navigate(link);
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  // 전체 읽음 처리
  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((noti) => ({ ...noti, read: true })));
    } catch (error) {
      console.error('전체 읽음 처리 실패:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 알림 패널 UI
  const NotificationPanel = () => (
    <div
      ref={notifRef}
      className="absolute right-16 top-28 w-80 bg-white rounded-xl shadow-xl p-4 z-10 border"
    >
      <div className="flex items-center justify-between border-b pb-2 mb-4">
        <div className="flex items-center gap-2">
          <Bell className="text-gray-700" />
          <span className="font-medium">알림</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            className="text-xs text-blue-600 hover:underline"
          >
            전체 읽음
          </button>
          <X
            className="cursor-pointer"
            onClick={() => setShowNotifications(false)}
          />
        </div>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-500">알림이 없습니다.</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id, notification.link)}
              className={`p-3 cursor-pointer hover:bg-gray-50 rounded-md ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm">{notification.message}</p>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-2" />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="w-screen h-screen flex flex-col bg-[#F1F1F1] overflow-hidden text-[1.5rem]">
      {/* 상단 영역 */}
      <header className="h-[50%] bg-[#DAD6D6] flex flex-col items-center justify-center relative">
        <img
          src={logo}
          alt="Mood Log"
          className="h-72 mb-12 cursor-pointer"
          onClick={() => navigate('/main')}
        />
        <SearchBox />
        <div className="absolute top-10 right-14 flex gap-10">
          <Bell
            className="w-9 h-9 cursor-pointer"
            onClick={() => setShowNotifications(!showNotifications)}
          />
          <User
            className="w-9 h-9 cursor-pointer"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          />
        </div>
      </header>

      <div className="h-[2px] w-full bg-black" />

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
            <button
              onClick={() => navigate('/post')}
              className="flex items-center gap-4 px-8 py-6 bg-white rounded-lg shadow border hover:bg-gray-100 text-2xl font-semibold w-80"
            >
              <Pencil className="w-8 h-8 text-black" /> 글쓰기
            </button>
            <button
              className="flex items-center gap-4 px-8 py-6 bg-white rounded-lg shadow border hover:bg-gray-100 text-2xl font-semibold w-80"
              onClick={() => navigate('/popular')}
            >
              <Heart className="w-8 h-8 text-black" /> 인기 글
            </button>
            <button
              onClick={() => navigate('/followmanagement')}
              className="flex items-center gap-4 px-8 py-6 bg-white rounded-lg shadow border hover:bg-gray-100 text-2xl font-semibold w-80"
            >
              <Folder className="w-8 h-8 text-black" /> 이웃 글
            </button>
          </section>
        </div>
      </main>

      {/* 알림창 */}
      {showNotifications && <NotificationPanel />}

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
            <li
              className="flex items-center gap-2 hover:underline cursor-pointer"
              onClick={() => navigate('/history')}
            >
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
