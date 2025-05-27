import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/axiosInstance";
import { HeaderBox } from "../layouts/headerBox";
import OtherUserInfoBox from "../components/OtherUserInfoBox";
import OtherUserHistoryBox from "../components/OtherUserHistoryBox";
import { OtherUserPlayListBox } from "../components/OtherUserPlayListBox";
import { useUser } from "../contexts/UserContext";

// 타입 정의
interface PlaylistTrack {
  trackName: string;
  artist: string;
  spotifyUrl: string;
}
interface Playlist {
  id: number;
  name: string;
  description: string;
  tracks: PlaylistTrack[];
}
interface Comment {
  id: number;
  content: string;
  authorUsername: string;
  createdAt: string;
}
interface Post {
  id: number;
  title: string;
  content: string;
  autoSaved: boolean;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  comments: Comment[];
  playlist?: Playlist;
}
interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
}

export default function OtherUserHistoryPage() {
  const { username } = useParams<{ username: string }>();
  const { currentUser } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<"recent" | "likes" | "comments">("recent");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // 1. 팔로우 상태 확인
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!username || !currentUser) return;
      try {
        const res = await api.get<boolean>(`/social/is-following?target=${username}`);
        setIsFollowing(res.data);
      } catch (error) {
        setIsFollowing(false);
        // 에러는 무시(비로그인 등)
      }
    };
    checkFollowStatus();
  }, [username, currentUser]);

  // 2. 게시글 불러오기
  useEffect(() => {
    if (!username) return;
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get<Page<Post>>(
          `/users/${username}/posts`,
          { params: { sort, page, size: 6 } }
        );
        setPosts(res.data.content);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
        setPosts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [username, sort, page]);

  // 3. 팔로우/언팔로우 핸들러
  const handleFollow = async () => {
    if (!username || !currentUser) return;
    try {
      setFollowLoading(true);
      if (isFollowing) {
        // 언팔로우
        await api.delete("/social/unfollow", {
          data: { followingUsername: username },
        });
      } else {
        // 팔로우
        await api.post("/social/follow", { followingUsername: username });
      }
      setIsFollowing(!isFollowing);
    } catch (error: any) {
      alert(error.response?.data?.message || "처리 중 오류가 발생했습니다.");
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="w-[1440px] mx-auto flex flex-col items-center">
      <HeaderBox />

      {/* InfoBox + 팔로우 버튼 오버레이 */}
      <div className="w-[1440px] mx-auto mt-[102px] flex justify-center relative">
        <OtherUserInfoBox authorName={username || ""} />
        {currentUser?.username !== username && (
          <button
            onClick={handleFollow}
            disabled={followLoading}
            className={`absolute top-8 right-32 px-6 py-2 rounded-full font-semibold transition-colors
              ${isFollowing 
                ? "bg-red-100 text-red-600 hover:bg-red-200 border border-red-300" 
                : "bg-purple-600 text-white hover:bg-purple-700"}
            `}
            style={{ zIndex: 10 }}
          >
            {followLoading
              ? "처리 중..."
              : isFollowing
                ? "➖ 이웃 제거"
                : "➕ 이웃 추가"}
          </button>
        )}
      </div>

      {/* 메인 2단 레이아웃 */}
      <div className="flex flex-row mt-[40px] w-full px-[170px]">
        <div className="w-[350px]">
          <OtherUserPlayListBox username={username || ""} />
        </div>
        <div className="ml-[100px] flex-1">
          <OtherUserHistoryBox
            posts={posts}
            loading={loading}
            error={error}
            sort={sort}
            setSort={setSort}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
}
