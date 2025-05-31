import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/moodlog_logo_transparent.png";
import { Bell, User, X } from "lucide-react";
import axios from "axios";
import api from "../services/axiosInstance";

interface Notification {
  id: number;
  message: string;
  read: boolean;
  timestamp: string;
  link?: string;
}

const sortOptions = [
  { label: "좋아요 많은 순", value: "likes" },
  { label: "댓글 많은 순", value: "comments" },
];

function PopularPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("likes");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const postsPerPage = 5;

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("인기 게시글 불러오기 실패:", error);
      }
    };
    fetchPosts();
  }, []);

  // 알림 목록 불러오기
  const fetchNotifications = async () => {
    try {
      const res = await api.get<Notification[]>("/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.error("알림 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // 좋아요 1개 이상, 댓글 1개 이상 필터링 후 정렬
  const getSortedPosts = () => {
    if (sortBy === "likes") {
      const filtered = posts.filter(p => (p.likeCount ?? 0) >= 1);
      return filtered
        .sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0))
        .slice(0, 10);
    }
    if (sortBy === "comments") {
      // comments가 배열이면
      const filtered = posts.filter(p =>
        Array.isArray(p.comments)
          ? p.comments.length >= 1
          : (p.commentCount ?? 0) >= 1
      );
      return filtered
        .sort((a, b) => {
          const aCount = Array.isArray(a.comments)
            ? a.comments.length
            : a.commentCount ?? 0;
          const bCount = Array.isArray(b.comments)
            ? b.comments.length
            : b.commentCount ?? 0;
          return bCount - aCount;
        })
        .slice(0, 10);
    }
    return [];
  };

  const sortedPosts = getSortedPosts();

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  return (
    <div className="min-h-screen bg-white px-[12%] pt-6 pb-24 relative text-[2.2rem]">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6 px-4">
        <img
          src={logo}
          alt="Mood Log"
          className="h-44 cursor-pointer"
          onClick={() => navigate("/main")}
        />
        <div className="flex gap-6">
          <div className="relative">
            <Bell 
              className="w-9 h-9 cursor-pointer" 
              onClick={() => setShowNotifications(!showNotifications)} 
            />
            {notifications.filter(n => !n.read).length > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </div>
            )}
          </div>
          <User className="w-9 h-9 cursor-pointer" onClick={() => setShowProfileMenu(!showProfileMenu)} />
        </div>
      </div>

      {/* 알림/프로필 메뉴 */}
      {showNotifications && (
        <div
          ref={notifRef}
          className="absolute right-16 top-36 w-80 bg-white rounded-xl shadow-xl p-4 z-10 border"
        >
          <div className="flex items-center justify-between border-b pb-2 mb-4">
            <div className="flex items-center gap-2">
              <Bell className="text-gray-700" />
              <span className="font-medium">알림</span>
            </div>
            <X className="cursor-pointer" onClick={() => setShowNotifications(false)} />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center text-gray-500">알림이 없습니다.</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 cursor-pointer hover:bg-gray-50 rounded-md ${
                    !notification.read ? "bg-blue-50" : ""
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
      )}

      {showProfileMenu && (
        <div
          ref={profileRef}
          className="absolute right-10 top-36 w-52 bg-white rounded-xl shadow-xl p-4 text-sm z-10 border"
        >
          <div className="flex items-center border-b pb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-2">
              <User className="w-6 h-6 text-black" />
            </div>
            <p className="font-bold text-base">닉네임</p>
          </div>
          <ul className="space-y-3 mt-4">
            <li className="flex items-center gap-2 hover:underline cursor-pointer">내 글 목록</li>
            <li
              className="flex items-center gap-2 hover:underline cursor-pointer"
              onClick={() => navigate("/mypage", { state: { from: location.pathname } })}
            >
              마이 페이지
            </li>
            <li className="flex items-center gap-2 hover:underline cursor-pointer text-black">로그아웃</li>
          </ul>
        </div>
      )}

      {/* 상단 인기글 + 정렬 */}
      <div className="flex justify-between items-center bg-[#f2f0f1] rounded-md px-10 py-10 mb-14 border">
        <div className="text-3xl font-semibold text-black flex items-center gap-2">
          인기 글
        </div>
        <div className="relative text-xl">
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="border px-5 py-2 rounded shadow-sm bg-white"
          >
            {sortOptions.find(opt => opt.value === sortBy)?.label} ▼
          </button>
          {isDropdownOpen && (
            <ul className="absolute right-0 mt-2 bg-white border rounded shadow z-10 w-48">
              {sortOptions.map(option => (
                <li
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setDropdownOpen(false);
                    setCurrentPage(1); // 정렬 바꿀 때 1페이지로 이동
                  }}
                  className={`px-5 py-3 cursor-pointer hover:bg-gray-100 ${
                    sortBy === option.value ? "bg-blue-100" : ""
                  }`}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 인기글 카드 목록 (5개씩 표시) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20">
        {currentPosts.length === 0 ? (
          <div className="col-span-3 text-center text-gray-400 text-2xl py-16">
            조건에 맞는 인기글이 없습니다.
          </div>
        ) : (
          currentPosts.map(post => (
            <div
              key={post.id}
              className="border p-14 rounded-xl shadow-md hover:shadow-xl transition"
              onDoubleClick={() => navigate(`/postdetail/${post.id}`)}
              style={{ cursor: "pointer" }}
            >
              <h3 className="text-3xl font-bold mb-8">{post.title}</h3>
              <div className="text-xl text-gray-700 flex gap-10">
                <span>♡ {post.likeCount ?? 0}</span>
                <span>
                  💬{" "}
                  {Array.isArray(post.comments)
                    ? post.comments.length
                    : typeof post.commentCount === "number"
                    ? post.commentCount
                    : 0}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-start mt-16 gap-4 text-xl text-gray-700">
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-4 py-2 border rounded ${
              currentPage === idx + 1 ? "bg-black text-white" : "bg-white"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PopularPostsPage;
