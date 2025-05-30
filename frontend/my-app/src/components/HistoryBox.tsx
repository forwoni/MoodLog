import React from "react";
import PostCard from "./PostCard";
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

interface HistoryBoxProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
  sort: "recent" | "likes" | "comments";
  setSort: (sort: "recent" | "likes" | "comments") => void;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  onPlaylistClick: (playlist: Playlist) => void; // ✅ 추가
}

const HistoryBox: React.FC<HistoryBoxProps> = ({
  posts,
  loading,
  error,
  sort,
  setSort,
  page,
  setPage,
  totalPages,
  onPlaylistClick, // ✅ 추가
}) => {
  const { currentUser } = useUser();

  return (
    <div className="flex flex-col w-[800px] min-h-[400px] items-center gap-5 pt-10 pb-5 px-0 relative bg-white rounded-lg shadow">
      {/* 정렬 선택 */}
      <div className="flex w-[570px] items-center justify-end gap-2 relative">
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

      <div className="w-full flex flex-col items-center gap-4 px-4">
        {loading ? (
          <div className="text-gray-400 text-lg">로딩 중...</div>
        ) : error ? (
          <div className="text-red-500 text-lg">{error}</div>
        ) : posts.length === 0 ? (
          <div className="text-gray-400 text-lg">게시물 없음</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="w-full">
              <PostCard
                {...post}
                isMyPost={post.authorName === currentUser?.username}
              />
              {post.playlist && (
                <button
                  onClick={() => onPlaylistClick(post.playlist!)}
                  className="mt-2 text-sm text-blue-500 underline"
                >
                  플레이리스트 보기
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center gap-4 mt-4">
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
};

export default HistoryBox;
