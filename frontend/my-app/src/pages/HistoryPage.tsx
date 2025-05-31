import React, { useEffect, useState } from "react";
import api from "../services/axiosInstance";
import { HeaderBox } from "../layouts/headerBox";
import { UserInfoBox } from "../components/UserInfoBox";
import SearchBox from "../components/SearchBox";
import HistoryBox from "../components/HistoryBox";
import PlaylistModal from "../components/PlaylistModal";
import { useUser } from "../contexts/UserContext";
import UserPlayListBox from "../components/UserPlayListBox";

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
      {/* 헤더 */}
      <HeaderBox />

      {/* 유저 인포 영역 */}
      <div className="max-w-[1440px] w-full mx-auto px-8 mt-[102px]">
        <UserInfoBox />
      </div>

      {/* 메인 콘텐츠: 좌-우 1:1 레이아웃 */}
      <main className="grid grid-cols-[1.2fr_1fr] gap-6 max-w-[1440px] w-full mx-auto px-8 mt-8">
        {/* 좌측: 플레이리스트 */}
        <aside className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">나의 플레이리스트</h2>
          <UserPlayListBox
            showEditButton={true}
            playlist={posts.find((p) => p.playlist)?.playlist || null}
            username={currentUser?.username || ""}
          />
        </aside>

        {/* 우측: 게시글 */}
        <section className="flex flex-col gap-4">
          <SearchBox />

          {/* 정렬 기준 */}
          <div className="flex justify-end items-center gap-2 text-sm text-gray-500">
            <label htmlFor="sort">정렬 기준</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as typeof sort);
                setPage(0);
              }}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-purple-400 focus:border-purple-400"
            >
              <option value="recent">최신순</option>
              <option value="likes">좋아요순</option>
              <option value="comments">댓글순</option>
            </select>
          </div>

          {/* 게시글 목록 */}
          <div className="flex flex-col gap-4">
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
          </div>
        </section>
      </main>

      {/* 모달 */}
      {showModal && selectedPlaylist && (
        <PlaylistModal onClose={closeModal} tracks={selectedPlaylist.tracks} />
      )}
    </div>
  );
}
