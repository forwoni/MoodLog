import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
// import { PostCard } from "./PostCard";
import BotAngleBracket from "../assets/BotAngleBracket.svg";
// import { useUser } from "../context/UserContext";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  authorUsername: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export const HistoryBox = () => {
  const { currentUser } = useUser();
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [sort, setSort] = useState<"recent" | "likes" | "comments">("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 페이지별로 6개씩 분할
  const paginatedPosts = useMemo(() => {
    const sorted = [...allPosts].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const pages = [];
    for (let i = 0; i < sorted.length; i += 6) {
      pages.push(sorted.slice(i, i + 6));
    }
    return pages;
  }, [allPosts]);

  // 신규 게시글 추가 함수 (API 연동 필요)
  const addNewPost = (newPost: Post) => {
    setAllPosts(prev => [newPost, ...prev]);
    
    // 첫 페이지가 6개 초과 시 페이지 분할
    if (paginatedPosts[0]?.length === 6) {
      setCurrentPage(0); // 신규 글이 추가되면 무조건 1페이지로 이동
    }
  };

  // 게시글 조회
  const fetchPosts = async () => {
    try {
      const { data } = await axios.get<Post[]>(
        `/api/users/${currentUser?.username}/posts`,
        { params: { sort: `${sort},desc` } }
      );
      setAllPosts(data);
    } catch (err) {
      setError("게시글 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [sort]);

  // 페이지네이션
  const currentPosts = paginatedPosts[currentPage] || [];
  const totalPages = paginatedPosts.length;

  return (
    <div className="flex flex-col w-[800px] min-h-[400px] items-center gap-5 pt-10 pb-5 px-0 relative bg-white rounded-lg shadow">
      {/* 정렬 기준 선택기 */}
      <div className="flex w-[570px] items-center justify-end gap-2 relative">
        <select 
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="w-[123px] h-[30px] rounded-md border border-black/30 pl-2 pr-6"
        >
          <option value="recent">최신순</option>
          <option value="likes">좋아요순</option>
          <option value="comments">댓글순</option>
        </select>
        <img src={BotAngleBracket} alt="아래 꺽쇠" className="w-6 h-6 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* 게시글 목록 */}
      <div className="w-full flex flex-col items-center gap-4 px-4">
        {currentPosts.length === 0 ? (
          <div className="text-gray-400 text-lg">게시물 없음</div>
        ) : (
          currentPosts.map(post => (
            <PostCard
              key={post.id}
              {...post}
              isMyPost={post.authorUsername === currentUser?.username}
            />
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
          disabled={currentPage === 0}
        >
          &lt;
        </button>
        <span>{currentPage + 1} / {totalPages}</span>
        <button 
          onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={currentPage === totalPages - 1}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};
