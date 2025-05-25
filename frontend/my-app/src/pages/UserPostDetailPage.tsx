import React from "react";
import { HeaderBox } from "../layouts/headerBox";
import { UserPlayListBox } from "../components/UserPlayLIstBox";
import CommentSection from "../components/CommentSection";

export default function PostDetailPage() {
  // 임시 데이터
  const postData = {
    title: "감성적인 저녁의 플레이리스트",
    content: `오늘 하루 정말 힘들었어요.  
음악을 들으며 마음을 달랬던 순간을 공유합니다.

여러분의 하루도 음악으로 힐링되길 바라요!`,
    author: "홍길동",
    createdAt: "2025-05-26",
    likeCount: 7,
    isLiked: false
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderBox />
      <div className="max-w-[1200px] mx-auto pt-[102px] flex justify-center">
        {/* 게시글 본문 영역 */}
        <div className="flex-1 max-w-[600px]">
          {/* 게시글 제목 및 내용 */}
          <div className="border rounded bg-white mb-6">
            <div className="px-6 py-4 border-b">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {postData.title}
              </h1>
              <div className="text-sm text-gray-500">
                {postData.author} • {postData.createdAt}
              </div>
            </div>
            <div className="px-6 py-6">
              <div
                className="text-gray-800 whitespace-pre-wrap leading-relaxed"
                style={{ minHeight: "400px" }}
              >
                {postData.content}
              </div>
            </div>
          </div>

          {/* 플레이리스트 2개 (가로 배치) */}
          <div className="flex flex-row gap-15 mb-6 justify-center">
            <UserPlayListBox showEditButton={false} />
            <UserPlayListBox showEditButton={false} />
          </div>

          {/* 댓글 영역 */}
          <CommentSection
            initialLikeCount={postData.likeCount}
            initialIsLiked={postData.isLiked}
          />
        </div>
      </div>
    </div>
  );
}
