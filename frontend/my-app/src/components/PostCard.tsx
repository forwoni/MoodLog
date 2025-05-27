import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/axiosInstance";
import PostCard from "../components/PostCard";

// 타입 정의 (API 명세서 기반)
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
  pageable: { pageNumber: number; pageSize: number };
  totalPages: number;
  totalElements: number;
}

export default function OtherUserHistoryPage() {
  const { username } = useParams<{ username: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<"recent" | "likes" | "comments">("recent");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        if (Array.isArray(res.data.content)) {
          setPosts(res.data.content);
          setTotalPages(res.data.totalPages || 1);
        } else {
          setPosts([]);
          setTotalPages(1);
          setError("서버 응답 형식 오류");
        }
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

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6">
        <span className="text-blue-600">@{username}</span>님의 게시글
      </h1>
      <div className="flex w-full items-center justify-end gap-2 mb-6">
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as typeof sort);
            setPage(0);
          }}
          className="w-[123px] h-[30px] rounded-md border border-black/30 pl-2 pr-6"
        >
          <option value="recent">최신순</option>
          <option value="likes">좋아요순</option>
          <option value="comments">댓글순</option>
        </select>
      </div>
      <div className="w-full flex flex-col items-center gap-4 px-4 min-h-[400px] bg-white rounded-lg shadow">
        {loading ? (
          <div className="text-gray-400 text-lg py-20">로딩 중...</div>
        ) : error ? (
          <div className="text-red-500 text-lg py-20">{error}</div>
        ) : posts.length === 0 ? (
          <div className="text-gray-400 text-lg py-20">게시물이 없습니다.</div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))
        )}
      </div>
      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="disabled:opacity-50"
          >
            &lt;
          </button>
          <span>
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className="disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
