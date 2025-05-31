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

  // 더블클릭 시 상대방 히스토리 페이지로 이동
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/user/${displayName}/posts`);
  };

  const handleClick = () => {
    // 단일 클릭 동작 필요시 구현
  };

  return (
    <div
      className="flex items-center justify-between bg-white border rounded-lg px-6 py-6 mb-6 cursor-pointer transition hover:bg-gray-50"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
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
  const [followingCount, setFollowingCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshCounter, setRefreshCounter] = useState(0);

  // 팔로우 관련 이벤트 리스너들
  useEffect(() => {
    const handleFollowUpdate = () => {
      console.log("[FollowManagementPage] 팔로우 상태 업데이트 이벤트 감지");
      setRefreshCounter(prev => {
        console.log("[FollowManagementPage] refreshCounter 업데이트:", prev, "->", prev + 1);
        return prev + 1;
      });
    };

    console.log("[FollowManagementPage] 이벤트 리스너 등록");
    window.addEventListener("followUpdated", handleFollowUpdate);
    
    return () => {
      console.log("[FollowManagementPage] 이벤트 리스너 제거");
      window.removeEventListener("followUpdated", handleFollowUpdate);
    };
  }, []);

  // 초기 로드 및 새로고침 시 양쪽 데이터 모두 가져오기
  useEffect(() => {
    const fetchBothCounts = async () => {
      try {
        setLoading(true);
        console.log("[FollowManagementPage] 데이터 새로고침 시작 - refreshCounter:", refreshCounter);
        
        const [followingsRes, followersRes] = await Promise.all([
          api.get<Page<FollowUser>>("/social/followings", {
            params: { page: 0, size: 6, timestamp: Date.now() }
          }),
          api.get<Page<FollowUser>>("/social/followers", {
            params: { page: 0, size: 6, timestamp: Date.now() }
          })
        ]);

        console.log("[FollowManagementPage] API 응답:", {
          followings: followingsRes.data,
          followers: followersRes.data
        });

        const followingsList = followingsRes.data.content || [];
        const followersList = followersRes.data.content || [];
        const followingTotal = followingsRes.data.totalElements || 0;
        const followerTotal = followersRes.data.totalElements || 0;

        setFollowings(followingsList);
        setFollowers(followersList);
        setFollowingCount(followingTotal);
        setFollowerCount(followerTotal);
        setTotalPages(activeTab === "following" ? followingsRes.data.totalPages : followersRes.data.totalPages);
        
        console.log("[FollowManagementPage] 상태 업데이트 완료:", {
          followingCount: followingTotal,
          followerCount: followerTotal,
          followings: followingsList,
          followers: followersList
        });
      } catch (error) {
        console.error('[FollowManagementPage] 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBothCounts();
  }, [refreshCounter, activeTab]);

  // 페이지 변경 시 해당 탭의 데이터만 업데이트
  const fetchUsers = useCallback(async () => {
    if (currentPage === 0) return; // 첫 페이지는 이미 로드됨

    try {
      setLoading(true);
      const endpoint = activeTab === "following" ? "/social/followings" : "/social/followers";
      const res = await api.get<Page<FollowUser>>(endpoint, {
        params: {
          page: currentPage,
          size: 6
        }
      });

      const list = res.data.content || [];
      if (activeTab === "following") {
        setFollowings(list);
      } else {
        setFollowers(list);
      }
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('목록 조회 실패:', error);
      alert('목록 조회에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage]);

  useEffect(() => {
    if (currentPage !== 0) {
      fetchUsers();
    }
  }, [fetchUsers, currentPage]);

  const handleDeleteFollowing = async (username: string) => {
    try {
      await api.delete("/social/unfollow", { data: { followingUsername: username } });
      setRefreshCounter(prev => prev + 1);
    } catch (error) {
      console.error('언팔로우 실패:', error);
      alert('이웃 삭제에 실패했습니다.');
    }
  };

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
            팔로잉 ({followingCount})
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
            팔로워 ({followerCount})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">로딩 중...</div>
        ) : (
          <>
            <div className="space-y-4">
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
            {(activeTab === "following" ? followings : followers).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {activeTab === "following" ? "팔로잉" : "팔로워"}가 없습니다
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
