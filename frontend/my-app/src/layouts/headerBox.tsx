import React from "react";
import { useNavigate } from "react-router-dom";
import new_moodlog_logo from "../assets/new_moodlog_logo.svg"
import { useUser } from "../contexts/UserContext";
import { Menu } from "lucide-react";

export const HeaderBox = ({
  showEditDelete = false,
  onEdit,
  onDelete,
}: {
  showEditDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useUser();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  const handleHistoryClick = () => {
    if (!currentUser?.username) {
      alert("로그인이 필요합니다.");
      navigate('/login');
      return;
    }
    
    // 현재 URL이 /history인 경우에만 새로고침
    if (window.location.pathname === '/history') {
      window.location.reload();
    } else {
      // sessionStorage에 현재 사용자 정보 저장
      sessionStorage.setItem('currentHistoryUser', currentUser.username);
      navigate('/history');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-purple-100/50 z-50">
      <div className="max-w-[1200px] mx-auto h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <img
            className="h-8 w-auto cursor-pointer"
            alt="Logo"
            src={new_moodlog_logo}
            onClick={() => navigate("/main")}
          />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
            MoodLog
          </span>
        </div>
        {currentUser && (
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={handleHistoryClick}
              className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-purple-50 transition-colors border border-purple-100"
            >
              내 기록
            </button>
            {showEditDelete && (
              <div className="flex gap-2">
                <button
                  onClick={onEdit}
                  className="px-4 py-1.5 rounded-lg bg-purple-50 text-purple-600 text-sm font-medium hover:bg-purple-100 transition-colors"
                >
                  게시글 수정
                </button>
                <button
                  onClick={onDelete}
                  className="px-4 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-sm font-medium hover:bg-rose-100 transition-colors"
                >
                  게시글 삭제
                </button>
              </div>
            )}
          </div>
        )}
        {/* 모바일 메뉴 */}
        {currentUser && (
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} className="text-gray-600" />
            </button>

            {showMobileMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <button
                  onClick={handleHistoryClick}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 transition-colors"
                >
                  내 기록
                </button>
                {showEditDelete && (
                  <>
                    <button
                      onClick={onEdit}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={onDelete}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                      삭제
                    </button>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 transition-colors"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};