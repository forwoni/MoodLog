import React, { useState } from "react";

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  initialLikeCount: number;
  initialIsLiked: boolean;
}

export default function CommentSection({ 
  initialLikeCount, 
  initialIsLiked 
}: CommentSectionProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "댓글 작성자1",
      content: "정말 공감되는 플레이리스트네요!",
      createdAt: "2025-05-26 10:30",
    },
    {
      id: 2,
      author: "댓글 작성자2", 
      content: "저도 이 노래 좋아해요.",
      createdAt: "2025-05-26 11:15",
    }
  ]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now(),
        author: "현재 사용자",
        content: newComment,
        createdAt: new Date().toLocaleString('ko-KR')
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  return (
    <div className="border rounded bg-white">
      {/* 좋아요 영역 */}
      <div className="px-6 py-4 border-b">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
            isLiked 
              ? "bg-red-50 text-red-600 border border-red-200" 
              : "bg-gray-50 text-gray-600 border border-gray-200"
          }`}
        >
          <span className={`text-lg ${isLiked ? "text-red-500" : "text-gray-400"}`}>
            {isLiked ? "❤️" : "❤️"}
          </span>
          <span className="font-medium">좋아요 {likeCount}</span>
        </button>
      </div>

      {/* 댓글 목록 */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="font-semibold text-gray-800">댓글</span>
          <span className="text-gray-500">({comments.length})</span>
        </div>

        {/* 댓글 리스트 */}
        <div className="space-y-4 mb-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-gray-800">{comment.author}</span>
                <span className="text-sm text-gray-500">{comment.createdAt}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{comment.content}</p>
              <div className="flex gap-2 mt-2">
                <button className="text-sm text-gray-500 hover:text-gray-700">
                  답글
                </button>
                <button className="text-sm text-gray-500 hover:text-gray-700">
                  좋아요
                </button>
              </div>
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
          </div>
        )}

        {/* 댓글 작성 (리스트 아래로 이동) */}
        <div className="mt-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="w-full p-3 border border-gray-200 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleCommentSubmit}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              댓글 작성
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
