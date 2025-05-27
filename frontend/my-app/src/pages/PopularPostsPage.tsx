import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/moodlog_logo_transparent.png';
import { Bell, User, X } from 'lucide-react';
import axios from 'axios';

const sortOptions = [
  { label: '최신순', value: 'latest' },
  { label: '좋아요 많은 순', value: 'likes' },
  { label: '댓글 많은 순', value: 'comments' },
];

function PopularPostsPage() {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('latest');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('인기 게시글 불러오기 실패:', error);
      }
    };
    fetchPosts();
  }, []);

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'likes') return b.likeCount - a.likeCount;
    if (sortBy === 'comments') return b.comments.length - a.comments.length;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  return (
    <div className="min-h-screen bg-white px-[12%] pt-6 pb-24 relative text-[2.2rem]">
      <div className="flex justify-between items-center mb-6 px-4">
        <img
          src={logo}
          alt="Mood Log"
          className="h-44 cursor-pointer"
          onClick={() => navigate('/main')}
        />
        <div className="flex gap-6">
          <Bell className="w-9 h-9 cursor-pointer" onClick={() => setShowNotifications(!showNotifications)} />
          <User className="w-9 h-9 cursor-pointer" onClick={() => setShowProfileMenu(!showProfileMenu)} />
        </div>
      </div>

      {showNotifications && (
        <div
          ref={notifRef}
          className="absolute right-16 top-36 w-80 bg-white rounded-xl shadow-xl p-4 z-10 border"
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
              onClick={() => navigate('/mypage', { state: { from: location.pathname } })}
            >
              마이 페이지
            </li>
            <li className="flex items-center gap-2 hover:underline cursor-pointer text-black">로그아웃</li>
          </ul>
        </div>
      )}

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
                  }}
                  className={`px-5 py-3 cursor-pointer hover:bg-gray-100 ${
                    sortBy === option.value ? 'bg-blue-100' : ''
                  }`}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20">
        {currentPosts.map(post => (
          <div
            key={post.id}
            className="border p-14 rounded-xl shadow-md hover:shadow-xl transition"
          >
            <h3 className="text-3xl font-bold mb-8">{post.title}</h3>
            <div className="text-xl text-gray-700 flex gap-10">
              <span>♡ {post.likeCount}</span>
              {post.comments.length > 0 && <span>💬 {post.comments.length}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-start mt-16 gap-4 text-xl text-gray-700">
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-4 py-2 border rounded ${currentPage === idx + 1 ? 'bg-black text-white' : 'bg-white'}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PopularPostsPage;
