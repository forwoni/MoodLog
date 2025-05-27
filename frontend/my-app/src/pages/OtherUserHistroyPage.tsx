import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/axiosInstance";
import OtherUserHistoryBox from "../components/OtherUserHistoryBox";

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
        const res = await api.get(`/users/${username}/posts`, {
          params: { sort, page, size: 6 },
        });
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
    <div className="flex flex-col items-center py-10">
      <OtherUserHistoryBox
        posts={posts}
        loading={loading}
        error={error}
        sort={sort}
        setSort={setSort}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        username={username || ""}
      />
    </div>
  );
}
