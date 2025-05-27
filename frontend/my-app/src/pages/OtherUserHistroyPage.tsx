import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/axiosInstance";
import HistoryBox from "../components/HistoryBox";
import OtherUserInfoBox from "../components/OtherUserInfoBox";
import { HeaderBox } from "../layouts/headerBox"; // HeaderBox import 경로는 실제 위치에 맞게

// 타입 정의들 (생략 가능, 기존 코드와 동일하게 유지)

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

  return (
    <div className="w-[1440px] mx-auto flex flex-col items-center bg-[#F1F1F1] min-h-screen">
      <HeaderBox />
      <div className="mt-[102px] w-full flex flex-col items-center">
        <OtherUserInfoBox authorName={username || ""} />
        <HistoryBox
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
  );
}
