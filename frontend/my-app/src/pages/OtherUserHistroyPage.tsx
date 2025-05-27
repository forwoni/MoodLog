
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/axiosInstance";
import { HeaderBox } from "../layouts/headerBox";
import OtherUserInfoBox from "../components/OtherUserInfoBox";
import OtherUserHistoryBox from "../components/OtherUserHistoryBox";
import { OtherUserPlayListBox } from "../components/OtherUserPlayListBox";
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
    <div className="w-[1440px] mx-auto flex flex-col items-center">
      <HeaderBox />
      <div className="w-[1440px] mx-auto mt-[102px]">
        <OtherUserInfoBox authorName={username || ""} />
      </div>
      <div className="flex flex-row mt-[40px]">
        <div>
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
