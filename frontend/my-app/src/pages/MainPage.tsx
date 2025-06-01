import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBox from '../components/searchBox';
import logo from '../assets/moodlog_logo_transparent.png';
import PopularChart from '../components/PopularChart';
import MyPageModal from '../components/MyPageModal';
import {
  Bell,
  User,
  X,
  Pencil,
  Heart,
  Users,
  LogOut,
  FileText,
  Settings,
  Music2,
  TrendingUp
} from 'lucide-react';
import api from '../services/axiosInstance';
import { getNotifications, markNotificationAsRead } from '../services/notificationService';
import { useUser } from '../contexts/UserContext';

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  timestamp: string;
  link?: string;
}

interface UserInfo {
  id: number;
  username: string;
  email: string;
}

interface ChartTrack {
  title: string;
  artist: string;
  albumImageUrl: string;
  likes: number;
  spotifyId: string;
}

function MainPage() {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [showMyPageModal, setShowMyPageModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [chartTracks, setChartTracks] = useState<ChartTrack[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const SPOTIFY_KOREA_TOP_50_URL = 'https://open.spotify.com/playlist/37i9dQZEVXbNxXF4SkHj9F';

  // 사용자 정보 조회
  const fetchUserInfo = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const res = await api.get<UserInfo>('/users/me');
      setUserInfo(res.data);
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      handleLogout();
    }
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      localStorage.removeItem('access_token');
      navigate('/login');
      return;
    }

    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
    }
  };

  // 알림 목록 불러오기
  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('알림 조회 실패:', error);
    }
  };

  // 알림 읽음 처리
  const handleNotificationClick = async (notificationId: number, link?: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      if (link) navigate(link);
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  // 전체 알림 읽음 처리
  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter(n => !n.isRead)
          .map(n => markNotificationAsRead(n.id))
      );
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error('전체 알림 읽음 처리 실패:', error);
    }
  };

  // 차트 데이터 가져오기
  const fetchChartData = async (page: number) => {
    try {
      const response = await api.get('/spotify/chart/popular', {
        params: { page }
      });
      setChartTracks(response.data.tracks);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('차트 데이터 로딩 실패:', error);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    fetchUserInfo();
    fetchNotifications();
    fetchChartData(1);
  }, []);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
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
      className="absolute right-8 top-20 w-80 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 z-10 border border-purple-100 animate-in slide-in-from-top-2"
    >
      <div className="flex items-center justify-between border-b border-purple-100 pb-2 mb-4">
        <div className="flex items-center gap-2">
          <Bell className="text-purple-600" size={18} />
          <span className="font-medium text-gray-900">알림</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            className="text-xs text-purple-600 hover:text-purple-700 hover:underline transition-colors"
          >
            전체 읽음
          </button>
          <X
            size={18}
            className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => setShowNotifications(false)}
          />
        </div>
      </div>
      <div className="max-h-[280px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>알림이 없습니다.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id, notification.link)}
              className={`p-3 cursor-pointer rounded-xl transition-colors ${
                !notification.isRead 
                  ? 'bg-purple-50 hover:bg-purple-100' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">{notification.message}</p>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-purple-500 rounded-full ml-2 animate-pulse" />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // 로그아웃 모달
  const LogoutModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md mx-4 p-6 w-full">
        <h3 className="text-xl font-bold text-gray-900 mb-4">로그아웃</h3>
        <p className="text-gray-600 mb-6">
          정말 로그아웃 하시겠습니까?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowLogoutModal(false)}
            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={() => {
              setShowLogoutModal(false);
              handleLogout();
            }}
            className="px-4 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );

  // 프로필 메뉴 UI
  const ProfileMenu = () => (
    <div
      ref={profileRef}
      className="absolute right-8 top-20 w-56 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-2 z-10 border border-purple-100 animate-in slide-in-from-top-2"
    >
      <div className="p-3 border-b border-purple-100">
        <div className="font-medium text-gray-900">{userInfo?.username}</div>
        <div className="text-sm text-gray-500">{userInfo?.email}</div>
      </div>
      <div className="py-1">
        <button
          onClick={() => {
            setShowProfileMenu(false);
            setShowMyPageModal(true);
          }}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-gray-700 hover:bg-purple-50 rounded-xl transition-colors"
        >
          <Settings size={18} className="text-purple-600" />
          <span>마이페이지</span>
        </button>
        <button
          onClick={() => navigate('/history')}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-gray-700 hover:bg-purple-50 rounded-xl transition-colors"
        >
          <FileText size={18} className="text-purple-600" />
          <span>내 기록</span>
        </button>
        <button
          onClick={() => {
            setShowProfileMenu(false);
            setShowLogoutModal(true);
          }}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-1"
        >
          <LogOut size={18} />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-blue-50">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-[1440px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Mood Log"
              className="h-12 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate('/main')}
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">MoodLog</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Bell
                className="w-6 h-6 text-gray-700 cursor-pointer hover:text-purple-600 transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              />
              {notifications.filter(n => !n.isRead).length > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.filter(n => !n.isRead).length}
                </div>
              )}
            </div>
            <User
              className="w-6 h-6 text-gray-700 cursor-pointer hover:text-purple-600 transition-colors"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            />
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-[1200px] mx-auto px-8 py-8">
        {/* 로고 & 검색 섹션 */}
        <section className="mb-12 flex flex-col items-center">
          <img
            src={logo}
            alt="Mood Log"
            className="h-32 mb-6 cursor-pointer"
            onClick={() => navigate('/main')}
          />
          <h1 className="text-3xl font-bold text-purple-900 text-center mb-6">
            당신의 감정을 음악으로 기록하세요
          </h1>
          <div className="max-w-2xl w-full">
            <SearchBox />
          </div>
        </section>

        {/* 기능 버튼 & 차트 섹션 */}
        <div className="grid grid-cols-12 gap-6">
          {/* 왼쪽: 실시간 차트 */}
          <div className="col-span-7">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100 hover:border-purple-200 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
                      실시간 급상승 🔥
                    </h2>
                    <p className="text-sm text-gray-500">지금 인기 있는 노래</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => fetchChartData(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {chartTracks.map((track, index) => (
                  <div 
                    key={track.spotifyId}
                    onClick={() => window.open(`https://open.spotify.com/track/${track.spotifyId}`, '_blank')}
                    className="group cursor-pointer bg-purple-50/50 rounded-lg p-4 hover:bg-purple-100/50 transition-colors"
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                        <img 
                          src={track.albumImageUrl} 
                          alt={`${track.title} 앨범 커버`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-semibold text-purple-600 w-6">{index + 1}</span>
                          <h3 className="font-medium text-base text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                            {track.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-500 truncate mb-3">{track.artist}</p>
                        <div className="flex items-center gap-2 text-sm text-purple-600">
                          <Music2 className="w-4 h-4" />
                          <span>{track.likes.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽: 기능 버튼들 */}
          <div className="col-span-5 space-y-3">
            <button
              onClick={() => navigate('/post')}
              className="w-full flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all hover:scale-[1.02] group"
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Pencil className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold">새 글 작성하기</h3>
                <p className="text-xs text-purple-200">당신의 감정을 음악과 함께 기록하세요</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/popular')}
              className="w-full flex items-center gap-3 px-5 py-4 bg-white/80 backdrop-blur-sm text-gray-900 rounded-xl shadow-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all hover:scale-[1.02] group border border-purple-100 hover:border-purple-200"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold">인기 글</h3>
                <p className="text-xs text-gray-500">다른 사람들의 인기있는 글을 확인하세요</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/followmanagement')}
              className="w-full flex items-center gap-3 px-5 py-4 bg-white/80 backdrop-blur-sm text-gray-900 rounded-xl shadow-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all hover:scale-[1.02] group border border-purple-100 hover:border-purple-200"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold">이웃 글</h3>
                <p className="text-xs text-gray-500">팔로우하는 사람들의 글을 모아보세요</p>
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* 알림창 */}
      {showNotifications && <NotificationPanel />}

      {/* 프로필 메뉴 */}
      {showProfileMenu && <ProfileMenu />}

      {/* MyPageModal */}
      <MyPageModal
        isOpen={showMyPageModal}
        onClose={() => setShowMyPageModal(false)}
      />

      {/* 로그아웃 모달 */}
      {showLogoutModal && <LogoutModal />}
    </div>
  );
}

export default MainPage;
