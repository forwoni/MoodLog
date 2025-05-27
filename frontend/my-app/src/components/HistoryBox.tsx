import React, { useEffect, useState, useMemo } from "react";
import axios, { AxiosError } from "axios";
import PostCard from "./PostCard";
import { useUser } from "../contexts/UserContext";

// 타입 정의 (API 명세서 반영)
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
  playlist: Playlist;
}

interface HistoryBoxProps {
  posts?: Post[];
}

const HistoryBox: React.FC<HistoryBoxProps> = ({ posts }) => {
  const { currentUser } = useUser();
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [sort, setSort] = useState<"recent" | "likes" | "comments">("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // posts prop이 바뀌면 상태 동기화
  useEffect(() => {
    if (Array.isArray(posts)) {
      setAllPosts(posts);
      setLoading(false);
    }
  }, [posts]);

  // 서버에서 내 게시글 목록 불러오기
  const fetchPosts = async () => {
    if (!currentUser?.username) {
      setError("로그인이 필요합니다");
      setAllPosts([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get<Post[]>(
        `/api/users/${currentUser.username}/posts`,
        { params: { sort: `${sort},desc` } }
      );
      if (Array.isArray(data)) {
        setAllPosts(data);
      } else {
        setAllPosts([]);
        setError("서버 데이터 형식 오류");
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(
        error.response?.data?.message ||
          error.message ||
          "게시글 조회 실패"
      );
      setAllPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!posts) {
      setCurrentPage(0);
      fetchPosts();
    }
    // eslint-disable-next-line
  }, [sort, currentUser?.username]);

  // 정렬 및 페이지네이션
  const paginatedPosts = useMemo(() => {
    const safePosts = Array.isArray(allPosts) ? allPosts : [];
    const sorted = [...safePosts].sort((a, b) => {
      if (sort === "recent") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sort === "likes") {
        return b.likeCount - a.likeCount;
      } else {
        return b.comments.length - a.comments.length;
      }
    });
    const pages = [];
    for (let i = 0; i < sorted.length; i += 6) {
      pages.push(sorted.slice(i, i + 6));
    }
    return pages;
  }, [allPosts, sort]);

  const currentPosts = paginatedPosts[currentPage] || [];
  const totalPages = paginatedPosts.length;

  return (
    <div className="flex flex-col w-[800px] min-h-[400px] items-center gap-5 pt-10 pb-5 px-0 relative bg-white rounded-lg shadow">
      {/* 정렬 선택 */}
      <div className="flex w-[570px] items-center justify-end gap-2 relative">
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as typeof sort);
            setCurrentPage(0);
          }}
          className="w-[123px] h-[30px] rounded-md border border-black/30 pl-2 pr-6"
        >
          <option value="recent">최신순</option>
          <option value="likes">좋아요순</option>
          <option value="comments">댓글순</option>
        </select>
      </div>

      {/* 게시글 목록 */}
      <div className="w-full flex flex-col items-center gap-4 px-4">
        {loading ? (
          <div className="text-gray-400 text-lg">로딩 중...</div>
        ) : error ? (
          <div className="text-red-500 text-lg">{error}</div>
        ) : currentPosts.length === 0 ? (
          <div className="text-gray-400 text-lg">게시물 없음</div>
        ) : (
          currentPosts.map((post) => (
            <PostCard
              key={post.id}
              {...post}
              isMyPost={post.authorName === currentUser?.username}
            />
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="disabled:opacity-50"
          >
            &lt;
          </button>
          <span>
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
            }
            disabled={currentPage === totalPages - 1}
            className="disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryBox;
