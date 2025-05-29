import React, { useEffect, useState } from "react";
import api from "../services/axiosInstance";
import { HeaderBox } from "../layouts/headerBox";
import { UserInfoBox } from "../components/UserInfoBox";
import SearchBox from "../components/searchBox";
import { UserPlayListTitle } from "../components/UserPlayListTitle";
import { UserPlayListBox } from "../components/UserPlayListBox"
import HistoryBox from "../components/HistoryBox";
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
  pageable: { pageNumber: number; pageSize: number };
  totalPages: number;
  totalElements: number;
}

export default function HistoryPage() {
  const { currentUser } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<"recent" | "likes" | "comments">("recent");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!currentUser?.username) {
          setError("로그인이 필요합니다.");
          setPosts([]);
          setLoading(false);
          return;
        }
        const res = await api.get<Page<Post>>(
          `/users/${currentUser.username}/posts`,
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
  }, [currentUser, sort, page]);

  return (
    <div className="w-[1440px] mx-auto flex flex-col items-center">
      <HeaderBox />
      <div className="w-[1440px] mx-auto mt-[102px]">
        <UserInfoBox />
      </div>
      <div className="mt-[23px] flex justify-center">
        <SearchBox />
      </div>
      <div className="flex flex-row mt-[40px]">
        <div>
          <UserPlayListTitle />
          <UserPlayListBox
            showEditButton={true}
            username={currentUser?.username || ""}
          />
        </div>
        <div className="ml-[70px] flex-1">
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
    </div>
  );
}