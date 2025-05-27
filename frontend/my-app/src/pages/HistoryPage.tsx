import { useEffect, useState } from "react";
import axios from "axios";
import { HeaderBox } from "../layouts/headerBox";
import { UserInfoBox } from "../components/UserInfoBox";
import { SearchBox } from "../components/searchBox";
import { UserPlayListTitle } from "../components/UserPlayListTitle";
import { UserPlayListDescription } from "../components/UserPlayListDescription";
import { UserPlayListBox } from "../components/UserPlayLIstBox";
import { HistoryBox } from "../components/HistoryBox";

// 게시글 타입 정의
interface Post {
  id: number;
  title: string;
  content: string;
  date: string;
}

export default function HistoryPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const username = localStorage.getItem("username");
        const token = localStorage.getItem("accessToken");

        if (!username || !token) {
          console.warn("로그인 정보가 없습니다.");
          return;
        }

        const res = await axios.get(`/api/users/${username}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const converted = res.data.content.map((p: any) => ({
          id: p.id,
          title: p.title,
          content: p.content,
          date: p.createdAt.split("T")[0],
        }));

        setPosts(converted);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="w-[1440px] mx-auto flex flex-col items-center">
      <HeaderBox />
      <div className="w-[1440px] mx-auto mt-[102px]">
        <UserInfoBox
          userName="사용자 이름"
          userDescription="사용자에 대한 간단한 설명"
        />
      </div>
      <div className="mt-[23px] flex justify-center">
        <SearchBox />
      </div>
      <div className="flex flex-row mt-[40px]">
        {/* 왼쪽: 플레이리스트 */}
        <div>
          <UserPlayListTitle />
          <UserPlayListDescription />
          <UserPlayListBox showEditButton={true} />
        </div>
        {/* 오른쪽: 게시글 */}
        <div className="ml-[70px] flex-1">
          <HistoryBox posts={posts} />
        </div>
      </div>
    </div>
  );
}
