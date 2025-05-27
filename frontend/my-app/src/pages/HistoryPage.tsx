import { useEffect, useState } from "react";
import api from "../services/axiosInstance"; // ✅ axiosInstance 사용
import { HeaderBox } from "../layouts/headerBox";
import { UserInfoBox } from "../components/UserInfoBox";
import { SearchBox } from "../components/searchBox";
import { UserPlayListTitle } from "../components/UserPlayListTitle";
import { UserPlayListDescription } from "../components/UserPlayListDescription";
import { UserPlayListBox } from "../components/UserPlayLIstBox";
import HistoryBox from "../components/HistoryBox";
import { useUser } from "../contexts/UserContext"; // ✅ UserContext 사용

// 최신 API 명세서에 맞는 Post 타입
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

// 필요한 하위 타입 정의
interface Comment {
  id: number;
  content: string;
  authorUsername: string;
  createdAt: string;
}

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

export default function HistoryPage() {
  const { currentUser } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!currentUser?.username) {
          console.warn("로그인 정보가 없습니다.");
          return;
        }

        // ✅ API 인스턴스 사용 (인증 헤더 자동 추가)
        const res = await api.get<Post[]>(`/users/${currentUser.username}/posts`);
        
        // ✅ API 응답을 그대로 사용 (변환 필요 없음)
        setPosts(res.data);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      }
    };

    fetchPosts();
  }, [currentUser]); // ✅ currentUser 변경 시 재요청

  return (
    <div className="w-[1440px] mx-auto flex flex-col items-center">
      <HeaderBox />
      <div className="w-[1440px] mx-auto mt-[102px]">
        <UserInfoBox
          userName={currentUser?.username || "사용자 이름"}
          userDescription="작성한 게시글을 확인해 보세요"
        />
      </div>
      <div className="mt-[23px] flex justify-center">
        <SearchBox />
      </div>
      <div className="flex flex-row mt-[40px]">
        <div>
          <UserPlayListTitle />
          <UserPlayListDescription />
          <UserPlayListBox
            showEditButton={true}
            username={currentUser?.username || ""}
          />
        </div>
        <div className="ml-[70px] flex-1">
          {/* ✅ posts prop 전달 */}
          <HistoryBox posts={posts} />
        </div>
      </div>
    </div>
  );
}
