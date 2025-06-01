import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axiosInstance";
import { HeaderBox } from "../layouts/headerBox";
import { UserInfoBox } from "../components/UserInfoBox";
import { useUser } from "../contexts/UserContext";
import { User, Heart, MessageCircle, Music, Calendar, UserMinus, UserPlus } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  hasPlaylist: boolean;
}

interface FollowUser {
  id: number;
  followerUsername: string;
  followingUsername: string;
  followingProfileImageUrl: string;
  createdAt: string;
  recentPosts?: Post[];
  isFollowing: boolean;
}

interface Page<T> {
  content?: T[];
  totalPages: number;
  totalElements: number;
}

function UserCard({
  user,
  type,
  onToggleFollow,
  isFollowing,
}: {
  user: FollowUser;
  type: "following" | "follower";
  onToggleFollow: () => void;
  isFollowing: boolean;
}) {
  const navigate = useNavigate();
  const displayName = type === "following" ? user.followingUsername : user.followerUsername;
  const [isHovered, setIsHovered] = useState(false);

  const handleNavigateToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/user/${displayName}/posts`);
  };

  return (
    <div
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-purple-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-purple-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 상단 프로필 영역 */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer" onClick={handleNavigateToProfile}>
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-white shadow-md">
              {user.followingProfileImageUrl ? (
                <img
                  src={user.followingProfileImageUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={32} className="text-purple-300" />
                </div>
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
          <div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
              {displayName}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={14} />
              <span>팔로우: {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFollow();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            isFollowing
              ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
              : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
          }`}
        >
          {isFollowing ? (
            <>
              <UserMinus size={18} />
              <span>언팔로우</span>
            </>
          ) : (
            <>
              <UserPlus size={18} />
              <span>팔로우</span>
            </>
          )}
        </button>
      </div>

      {/* 최근 게시글 미리보기 */}
      {user.recentPosts && user.recentPosts.length > 0 && (
        <div className="border-t border-purple-50">
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">최근 게시글</h4>
            <div className="space-y-2">
              {user.recentPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/postdetail/${post.id}`)}
                  className="p-3 rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors cursor-pointer"
                >
                  <h5 className="text-sm font-medium text-gray-700 mb-1 line-clamp-1">
                    {post.title}
                  </h5>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={12} />
                      {post.likeCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={12} />
                      {post.commentCount}
                    </span>
                    {post.hasPlaylist && (
                      <span className="flex items-center gap-1 text-purple-500">
                        <Music size={12} />
                        플레이리스트
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FollowManagementPage() {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<"following" | "follower">("following");
  const [followings, setFollowings] = useState<FollowUser[]>([]);
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [followingCount, setFollowingCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // 무한 스크롤 설정
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        setCurrentPage(prev => prev + 1);
      }
    }, options);

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading]);

  const fetchUsers = useCallback(async (page: number) => {
    try {
      setLoading(true);
      const endpoint = activeTab === "following" ? "/social/followings" : "/social/followers";
      console.log('Fetching users from endpoint:', endpoint);
      
      const res = await api.get(endpoint, {
        params: {
          page,
          size: 10,
          includeRecentPosts: true
        }
      });

      console.log('API Response:', res.data);
      
      // API 응답이 배열 형태로 오는 경우 처리
      const users = Array.isArray(res.data) ? res.data : (res.data.content || []);
      console.log('Processed users:', users);

      if (activeTab === "following") {
        const followingUsers = users.map(user => ({ ...user, isFollowing: true }));
        console.log('Following users:', followingUsers);
        setFollowings(prev => page === 0 ? followingUsers : [...prev, ...followingUsers]);
        if (page === 0) {
          console.log('Setting following count:', users.length);
          setFollowingCount(users.length);
        }
      } else {
        // 팔로워들의 팔로우 상태 확인
        const followerUsers = await Promise.all(
          users.map(async (user: FollowUser) => {
            try {
              const followCheckRes = await api.get(`/social/is-following?target=${user.followerUsername}`);
              return { ...user, isFollowing: followCheckRes.data };
            } catch (error) {
              console.error('팔로우 상태 확인 실패:', error);
              return { ...user, isFollowing: false };
            }
          })
        );
        
        console.log('Follower users with follow status:', followerUsers);
        setFollowers(prev => page === 0 ? followerUsers : [...prev, ...followerUsers]);
        if (page === 0) {
          console.log('Setting follower count:', users.length);
          setFollowerCount(users.length);
        }
      }
      
      // 페이지네이션 정보가 있는 경우에만 설정
      if (res.data.totalPages) {
        setTotalPages(res.data.totalPages);
        setHasMore(page < res.data.totalPages - 1);
      } else {
        // 배열 응답의 경우 더 이상 데이터가 없다고 가정
        setTotalPages(1);
        setHasMore(false);
      }
    } catch (error: any) {
      console.error('사용자 목록 조회 실패:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    console.log('Active tab changed to:', activeTab);
    setCurrentPage(0);
    fetchUsers(0);
  }, [activeTab, fetchUsers]);

  useEffect(() => {
    if (currentPage > 0) {
      console.log('Loading more users, page:', currentPage);
      fetchUsers(currentPage);
    }
  }, [currentPage, fetchUsers]);

  const handleToggleFollow = async (username: string, isFollowing: boolean) => {
    try {
      console.log('Toggling follow for user:', username, 'current status:', isFollowing);
      
      if (isFollowing) {
        await api.delete("/social/unfollow", { data: { followingUsername: username } });
      } else {
        await api.post("/social/follow", { followingUsername: username });
      }

      // 현재 페이지 새로고침
      console.log('Refreshing user list after follow toggle');
      fetchUsers(0);
    } catch (error: any) {
      console.error('팔로우 상태 변경 실패:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-blue-50">
        <HeaderBox />
        <div className="max-w-[1200px] mx-auto px-6 pt-24">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700">로그인이 필요합니다</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-blue-50">
      <HeaderBox />
      
      <div className="max-w-[1200px] mx-auto px-6 pt-24">
        {/* 사용자 정보 */}
        <div className="mb-12">
          <UserInfoBox />
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-purple-100 p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("following")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "following"
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              팔로잉 ({followingCount})
            </button>
            <button
              onClick={() => setActiveTab("follower")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "follower"
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              팔로워 ({followerCount})
            </button>
          </div>
        </div>

        {/* 사용자 목록 */}
        <div className="space-y-4">
          {loading && <div className="text-center py-4">로딩 중...</div>}
          {!loading && (activeTab === "following" ? followings : followers).length === 0 && (
            <div className="text-center py-4 text-gray-500">
              {activeTab === "following" ? "팔로우하는 사용자가 없습니다." : "팔로워가 없습니다."}
            </div>
          )}
          {(activeTab === "following" ? followings : followers).map((user) => (
            <UserCard
              key={user.id}
              user={user}
              type={activeTab}
              onToggleFollow={() => handleToggleFollow(
                activeTab === "following" ? user.followingUsername : user.followerUsername,
                user.isFollowing
              )}
              isFollowing={user.isFollowing}
            />
          ))}
        </div>

        {/* 로딩 상태 */}
        <div ref={loadingRef} className="py-8 text-center">
          {loading && <div className="text-gray-500">로딩 중...</div>}
          {!hasMore && <div className="text-gray-500">더 이상 표시할 항목이 없습니다</div>}
        </div>
      </div>
    </div>
  );
}
