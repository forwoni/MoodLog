import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { HeaderBox } from "../layouts/headerBox";
import { UserPlayListBox } from "../components/UserPlayLIstBox";

interface Comment {
  id: number;
  content: string;
  authorUsername: string;
  createdAt: string;
}

interface PostData {
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
}

export default function UserPostDetailPage() {
  const { id } = useParams();
  const [postData, setPostData] = useState<PostData | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [loadError, setLoadError] = useState<boolean>(false); // 💡 추가

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/${id}`);
        setPostData(res.data);
        setIsLiked(false);
        setLikeCount(res.data.likeCount);
        setComments(res.data.comments);
        setLoadError(false);
      } catch (err) {
        console.error("게시글을 불러오는 중 오류 발생:", err);
        setPostData(null);
        setLoadError(true); // 💡 오류 상태 설정
      }
    };
    fetchPost();
  }, [id]);

  const handleLikeToggle = async () => {
    try {
      await axios.post(`/api/posts/${id}/like`);
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("좋아요 토글 중 오류 발생:", err);
    }
  };

  const handleEdit = () => {
    alert("게시글 수정 페이지로 이동!");
  };

  const handleDelete = () => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      alert("게시글이 삭제되었습니다.");
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(`/api/posts/${id}/comments`, { content: newComment });
      const updated = await axios.get(`/api/posts/${id}`);
      setComments(updated.data.comments);
      setNewComment("");
    } catch (err) {
      console.error("댓글 작성 중 오류 발생:", err);
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    try {
      await axios.delete(`/api/posts/${id}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("댓글 삭제 중 오류 발생:", err);
    }
  };

  const handleCommentEdit = (commentId: number, currentContent: string) => {
    setEditCommentId(commentId);
    setEditContent(currentContent);
  };

  const handleCommentUpdate = async (commentId: number) => {
    if (!editContent.trim()) return;
    try {
      await axios.put(`/api/posts/${id}/comments/${commentId}`, { content: editContent });
      const updated = await axios.get(`/api/posts/${id}`);
      setComments(updated.data.comments);
      setEditCommentId(null);
      setEditContent("");
    } catch (err) {
      console.error("댓글 수정 중 오류 발생:", err);
    }
  };

  if (loadError) {
    return (
      <div className="pt-32 text-center text-gray-600">
        존재하지 않는 게시글입니다.
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="pt-32 text-center text-gray-500">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderBox />
      <div className="max-w-[1200px] mx-auto pt-[102px] flex justify-center">
        <div className="flex-1 max-w-[600px]">
          <div className="border rounded bg-white mb-6 relative">
            <div className="px-6 pt-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{postData.title}</h1>
              <div className="text-sm text-gray-500 mb-4">
                {postData.authorName} • {postData.createdAt.split("T")[0]}
              </div>
              <div className="text-gray-800 whitespace-pre-wrap leading-relaxed min-h-[400px]">
                {postData.content}
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4">
              <button
                onClick={handleEdit}
                className="px-6 py-2 border border-black rounded bg-white text-black font-medium hover:bg-gray-100"
              >
                게시글 수정
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 border border-black rounded bg-black text-white font-medium hover:bg-gray-800"
              >
                게시글 삭제
              </button>
            </div>

            <div className="px-6 pb-4">
              <button
                onClick={handleLikeToggle}
                className="text-sm text-red-500 border px-3 py-1 rounded hover:bg-red-50"
              >
                ❤️ {isLiked ? "좋아요 취소" : "좋아요"} ({likeCount})
              </button>
            </div>
          </div>

          <div className="flex flex-row gap-15 mb-6 justify-center">
            <UserPlayListBox showEditButton={false} />
            <UserPlayListBox showEditButton={false} />
          </div>

          <div className="mt-8 px-2">
            <h2 className="text-xl font-bold mb-4">댓글</h2>
            <div className="mb-4">
              <textarea
                className="w-full border p-2 rounded resize-none"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요"
              />
              <button
                onClick={handleCommentSubmit}
                className="mt-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                댓글 등록
              </button>
            </div>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border rounded p-3">
                  <p className="text-sm font-medium">{comment.authorUsername}</p>
                  {editCommentId === comment.id ? (
                    <>
                      <textarea
                        className="w-full border p-2 rounded resize-none text-sm"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleCommentUpdate(comment.id)}
                          className="text-sm text-blue-500 hover:underline"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => setEditCommentId(null)}
                          className="text-sm text-gray-500 hover:underline"
                        >
                          취소
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-700 text-sm whitespace-pre-line">{comment.content}</p>
                      <p className="text-xs text-gray-500 mt-1">{comment.createdAt.split("T")[0]}</p>
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => handleCommentEdit(comment.id, comment.content)}
                          className="text-sm text-blue-500 hover:underline"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleCommentDelete(comment.id)}
                          className="text-sm text-red-500 hover:underline"
                        >
                          삭제
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
