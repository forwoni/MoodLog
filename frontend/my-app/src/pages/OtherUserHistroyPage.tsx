import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { HeaderBox } from "../layouts/headerBox";
import { UserInfoBox } from "../components/UserInfoBox";
import { UserPlayListTitle } from "../components/UserPlayListTitle";
import { UserPlayListDescription } from "../components/UserPlayListDescription";
import { UserPlayListBox } from "../components/UserPlayLIstBox";
import { HistoryBox } from "../components/HistoryBox";

interface Post {
  id: number;
  title: string;
  content: string;
  date: string;
}

interface UserInfo {
  username: string;
  email: string;
}

export default function OtherUserHistoryPage() {
  const { username } = useParams();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!username) return;

    const fetchUserData = async () => {
      try {
        // 게시글 불러오기
        const postRes = await axios.get(`/api/users/${username}/posts`);
        const converted = postRes.data.content.map((p: any) => ({
          id: p.id,
          title: p.title,
          content: p.content,
          date: p.createdAt.split("T")[0],
        }));
        setPosts(converted);

        // 유저 정보는 게시글에 포함된 authorName이나 API가 추가되면 분리 가능
        setUserInfo({
          username,
          email: "email 정보 없음",
        });
      } catch (err) {
        console.error("상대방 데이터 조회 실패:", err);
      }
    };

    fetchUserData();
  }, [username]);

  return (
    <div className="w-[1440px] mx-auto flex flex-col items-center">
      <HeaderBox />
      <div className="w-[1440px] mx-auto mt-[102px]">
        <UserInfoBox
          userName={userInfo?.username || "상대방 사용자"}
          userDescription="상대방의 게시글과 플레이리스트"
        />
      </div>
      <div className="flex flex-row mt-[40px]">
        <div>
          <UserPlayListTitle initialTitle="상대방의 플레이리스트" />
          <UserPlayListDescription initialDescription="상대방의 플레이리스트 설명" />
          <UserPlayListBox showEditButton={false} username={username} />
        </div>
        <div className="ml-[70px] flex-1">
          <HistoryBox posts={posts} showEditButton={false} showDeleteButton={false} />
        </div>
      </div>
    </div>
  );
}

