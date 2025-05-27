import React from "react";
import BotAngleBracket from "../assets/BotAngleBracket.svg";

// 게시글 데이터 타입 예시
interface Post {
  id: number;
  title: string;
  content: string;
  date: string;
}

// props 타입 정의
interface HistoryBoxProps {
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  posts?: Post[]; // 게시글 목록 (없으면 "게시물 없음" 표시)
}

export const HistoryBox = ({
  showEditButton = true,
  showDeleteButton = true,
  posts = [],
}: HistoryBoxProps): React.JSX.Element => {
  return (
    <div className="flex flex-col w-[800px] min-h-[400px] items-center gap-5 pt-10 pb-5 px-0 relative bg-white rounded-lg shadow">
      {/* 정렬 기준 + 최신순 드롭다운 */}
      <div className="flex w-[570px] items-center justify-end gap-2 relative">
        <div className="w-[332px] h-[21px] text-right leading-7 whitespace-nowrap font-normal text-black text-lg tracking-[0]">
          정렬 기준
        </div>
        {/* 최신순 선택 박스 */}
        <div className="relative w-[123px] h-[30px] ml-2">
          <div className="w-full h-full rounded-md absolute top-0 left-0 bg-white border border-black/30" />
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <span className="text-center leading-[30px] whitespace-nowrap font-normal text-black text-lg tracking-[0]">
              최신순
            </span>
            <img
              className="w-6 h-6 ml-1"
              src={BotAngleBracket}
              alt="아래 꺽쇠"
            />
          </div>
        </div>
      </div>

      {/* 게시글 목록 */}
      <div className="w-full flex flex-col items-center gap-4">
        {posts.length === 0 ? (
          <div className="w-[100px] text-right leading-7 font-normal text-black text-lg tracking-[0]">
            게시물 없음
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="w-[700px] p-4 border-b border-gray-200 flex justify-between items-center"
            >
              <div>
                <div className="font-semibold text-lg text-black">{post.title}</div>
                <div className="text-gray-600 text-sm">{post.date}</div>
                <div className="mt-2 text-base text-black">{post.content}</div>
              </div>
              <div className="flex gap-2">
                {showEditButton && (
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                    수정
                  </button>
                )}
                {showDeleteButton && (
                  <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                    삭제
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="flex h-7 items-end justify-end gap-5 relative self-stretch w-full">
        <div className="w-fit mt-[-1px] font-normal text-black text-lg text-right tracking-[0] leading-7 whitespace-nowrap">
          1
        </div>
        <div className="w-fit mt-[-1px] font-normal text-black text-lg text-right tracking-[0] leading-7 whitespace-nowrap flex items-center gap-1 cursor-pointer hover:underline">
          다음
          <span className="ml-1">&gt;</span>
        </div>
      </div>
    </div>
  );
};
