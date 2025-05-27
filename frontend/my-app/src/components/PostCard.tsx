import React from "react";
import { useNavigate } from "react-router-dom";

// 게시글 타입 정의 (필요에 따라 수정)
interface Post {
  id: number;
  title: string;
  content: string;
  autoSaved: boolean;
  authorUsername: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  comments: { id: number; content: string; authorUsername: string; createdAt: string }[];
}

interface HistoryBoxProps {
  post: Post;
}

const HistoryBox: React.FC<HistoryBoxProps> = ({ post }) => {
  const navigate = useNavigate();

  // 본문 미리보기(100자 제한)
  const getPreview = (html: string) => {
    // 태그 제거 후 100자 자르기
    const plain = html.replace(/<[^>]+>/g, "");
    return plain.length > 100 ? plain.slice(0, 100) + "..." : plain;
  };

  return (
    <div
      className="border rounded-lg shadow-md bg-white p-6 mb-6 cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(`/posts/${post.id}`)}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
        <span className="text-xs text-gray-400">
          {new Date(post.createdAt).toLocaleString()}
        </span>
      </div>
      <div className="text-gray-600 mb-3">{getPreview(post.content)}</div>
      <div className="flex items-center text-sm text-gray-500 space-x-4">
        <span>작성자: {post.authorUsername}</span>
        <span>조회수: {post.viewCount}</span>
        <span>좋아요: {post.likeCount}</span>
        <span>댓글: {post.comments.length}</span>
        {post.autoSaved && (
          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
            임시저장
          </span>
        )}
      </div>
    </div>
  );
};

export default HistoryBox;
