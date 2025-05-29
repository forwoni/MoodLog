import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axiosInstance";
import { HeaderBox } from "../layouts/headerBox";
import { UserInfoBox } from "../components/UserInfoBox";
import { useUser } from "../contexts/UserContext";

interface FollowUser {
  id: number;
  followerUsername: string;
  followingUsername: string;
  followingProfileImageUrl: string;
  createdAt: string;
}

interface Page<T> {
  content?: T[];
  totalPages: number;
  totalElements: number;
}

function UserCard({
  user,
  type,
  onDelete,
}: {
  user: FollowUser;
  type: "following" | "follower";
  onDelete?: () => void;
}) {
  const navigate = useNavigate();
  const displayName = type === "following" 
    ? user.followingUsername 
    : user.followerUsername;

  const handleClick = () => navigate(`/user/${displayName}`);

  return (
    <div className="flex items-center justify-between bg-white border rounded-lg px-6 py-6 mb-6 cursor-pointer transition hover:bg-gray-50" onClick={handleClick}>
      <div className="flex items-center gap-6">
        <img
          src={user.followingProfileImageUrl || "/default-profile.png"}
          alt={displayName}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <div className="text-lg font-medium text-gray-800">{displayName}</div>
          <div className="text-sm text-gray-500">
            {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      {type === "following" && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-2xl text-gray-400 hover:text-gray-600 transition"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default function FollowManagementPage() {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<"following" | "follower">("following");
  const [followings, setFollowings] = useState<FollowUser[]>([]);
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshCounter, setRefreshCounter] = useState(0); // 새로고침 트리거

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === "following" ? "/social/followings" : "/social/followers";
      const res = await api.get<Page<FollowUser>>(endpoint, {
        params: {
          page: currentPage,
          size: 6,
          search: searchQuery,
          _: refreshCounter // 캐시 방지
        }
      });
      
      if (activeTab === "following") {
        setFollowings(res.data.content || []);
      } else {
        setFollowers(res.data.content || []);
      }
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      alert("목록 조회 실패");
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, searchQuery, refreshCounter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteFollowing = async (username: string) => {
    try {
      await api.delete("/social/unfollow", { data: { followingUsername: username } });
      setRefreshCounter(prev => prev + 1); // 즉시 갱신
    } catch (error) {
      alert("이웃 삭제 실패");
    }
  };

  // 다른 페이지에서 팔로우 추가 시 이 함수 호출 필요
  const triggerRefresh = () => setRefreshCounter(prev => prev + 1);

  if (!currentUser) {
    return (
      <div className="w-[1440px] mx-auto flex flex-col items-center bg-white min-h-screen">
        <HeaderBox />
        <div className="mt-[120px] text-xl">로그인이 필요합니다</div>
      </div>
    );
  }

  return (
    <div className="w-[1440px] mx-auto flex flex-col items-center bg-white min-h-screen">
      <HeaderBox />
      
      <div className="w-full flex justify-center mt-[102px]">
        <UserInfoBox />
      </div>

      <div className="w-[800px] mx-auto mt-6">
        <input
          type="text"
          placeholder="이름 검색"
          value={searchQuery}
          onChange={(e) => {
            setCurrentPage(0);
            setSearchQuery(e.target.value);
          }}
          className="w-full h-12 px-6 rounded-full border border-gray-200 bg-[#f7f7f7] text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-200"
        />
      </div>

      <div className="w-[1100px] mx-auto mt-12">
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => {
              setActiveTab("following");
              setCurrentPage(0);
            }}
            className={`px-4 py-2 ${
              activeTab === "following" 
                ? "border-b-2 border-purple-600 text-purple-600" 
                : "text-gray-500"
            }`}
          >
            팔로잉 ({followings.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("follower");
              setCurrentPage(0);
            }}
            className={`px-4 py-2 ${
              activeTab === "follower" 
                ? "border-b-2 border-purple-600 text-purple-600" 
                : "text-gray-500"
            }`}
          >
            팔로워 ({followers.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">로딩 중...</div>
        ) : (
          <>
            <div>
              {(activeTab === "following" ? followings : followers).map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  type={activeTab}
                  onDelete={
                    activeTab === "following" 
                      ? () => handleDeleteFollowing(user.followingUsername) 
                      : undefined
                  }
                />
              ))}
            </div>

            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`px-3 py-1 rounded ${
                    currentPage === idx
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
