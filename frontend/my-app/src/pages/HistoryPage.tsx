import React, { useEffect, useState } from "react";
import api from "../services/axiosInstance";
import { HeaderBox } from "../layouts/headerBox";
import { UserInfoBox } from "../components/UserInfoBox";
import SearchBox from "../components/searchBox";
import HistoryBox from "../components/HistoryBox";
import PlaylistModal from "../components/PlaylistModal";
import { useUser } from "../contexts/UserContext";
import UserPlayListBox  from "../components/UserPlayListBox";
// 타입 정의
interface PlaylistTrack {
  trackName: string;
  artist: string;
  spotifyUrl: string;
  albumImage?: string;
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
}

export default function HistoryPage() {
  const { currentUser } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<"recent" | "likes" | "comments">("recent");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPlaylist(null);
    setShowModal(false);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      if (!currentUser?.username) {
        setError("로그인이 필요합니다.");
        setPosts([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        const res = await api.get<Page<Post>>(
          `/users/${currentUser.username}/posts`,
          { params: { sort, page, size: 6 } }
        );

        setPosts(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      } catch {
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentUser, sort, page]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9f9]">
      <HeaderBox />

      <main className="max-w-[1440px] mx-auto mt-[102px] flex gap-8 px-8">
        {/* 왼쪽: 프로필 & 플레이리스트 */}
        <aside className="flex flex-col w-[300px] gap-4">
          <UserInfoBox />
          <UserPlayListBox
            showEditButton={true}
            playlist={posts.find((p) => p.playlist)?.playlist || null}
            username={currentUser?.username || ""}
          />
        </aside>

        {/* 오른쪽: 게시글 */}
        <section className="flex-1 flex flex-col gap-6">
          <SearchBox />

          {/* 정렬 */}
          <div className="flex justify-end">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as any);
                setPage(0);
              }}
              className="border rounded-md px-3 py-1 text-sm"
            >
              <option value="recent">최신순</option>
              <option value="likes">좋아요순</option>
              <option value="comments">댓글순</option>
            </select>
          </div>

          <HistoryBox
            posts={posts}
            loading={loading}
            error={error}
            sort={sort}
            setSort={setSort}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            onPlaylistClick={openModal}
          />
        </section>
      </main>

      {/* 모달 */}
      {showModal && selectedPlaylist && (
        <PlaylistModal
          onClose={closeModal}
          tracks={selectedPlaylist.tracks}
        />
      )}
    </div>
  );
}
