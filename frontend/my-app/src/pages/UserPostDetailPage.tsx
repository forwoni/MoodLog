import React from "react";
import { HeaderBox } from "../layouts/headerBox";
import { UserPlayListBox } from "../components/UserPlayLIstBox";
import CommentSection from "../components/CommentSection";

export default function PostDetailPage() {
  // 임시 데이터
  const postData = {
    title: "게시글 제목",
    content: `게시글
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
`,
    author: "홍길동",
    createdAt: "2025-05-26",
    likeCount: 7,
    isLiked: false
  };

  // 수정/삭제 버튼 클릭 핸들러 (원하는 기능으로 연결)
  const handleEdit = () => {
    alert("게시글 수정 페이지로 이동!");
    // 예: navigate("/edit/1");
  };
  const handleDelete = () => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      alert("게시글이 삭제되었습니다.");
      // 실제 삭제 로직 구현
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderBox />
      <div className="max-w-[1200px] mx-auto pt-[102px] flex justify-center">
        {/* 게시글 본문 영역 */}
        <div className="flex-1 max-w-[600px]">
          {/* 게시글 박스 */}
          <div className="border rounded bg-white mb-6 relative">
            {/* 게시글 제목/작성자/날짜/본문 */}
            <div className="px-6 pt-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{postData.title}</h1>
              <div className="text-sm text-gray-500 mb-4">
                {postData.author} • {postData.createdAt}
              </div>
              <div
                className="text-gray-800 whitespace-pre-wrap leading-relaxed"
                style={{ minHeight: "400px" }}
              >
                {postData.content}
              </div>
            </div>
            {/* 오른쪽 아래 버튼 영역 */}
            <div className="flex justify-end gap-3 px-6 py-4">
              <button
                onClick={handleEdit}
                className="px-6 py-2 border border-black rounded bg-white text-black font-medium transition hover:bg-gray-100"
              >
                게시글 수정
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 border border-black rounded bg-black text-white font-medium transition hover:bg-gray-800"
              >
                게시글 삭제
              </button>
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
