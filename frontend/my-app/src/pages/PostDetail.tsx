import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HeaderBox } from "../layouts/headerBox";
import { UserPlayListBox } from "../components/UserPlayListBox";
import { OtherUserPlayListBox } from "../components/OtherUserPlayListBox";
import api from "../services/axiosInstance";

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // 좋아요 관련
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 댓글 입력 관련
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState("");

  // 사용자 정보
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await api.get("/users/me");
        setCurrentUser(res.data);
      } catch {
        setCurrentUser(null);
      }
    };
    fetchCurrentUser();
  }, []);

  // 게시글 및 댓글 목록
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
        setLikeCount(res.data.likeCount || 0);
        setLiked(res.data.likedByCurrentUser || false);
        setError("");

        // 댓글 목록 별도 API로 불러오기
        await fetchComments();
      } catch (err: any) {
        setError("게시글이 존재하지 않습니다.");
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [id]);

  // 댓글 목록만 새로 불러오는 함수
  const fetchComments = async () => {
    const commentsRes = await api.get(`/posts/${id}/comments`);
    const filtered = (commentsRes.data || []).filter((c: any) => !!c.id);
    setComments(filtered);
  };

  const isMyPost =
    currentUser &&
    post &&
    currentUser.username &&
    post.authorName &&
    currentUser.username.trim().toLowerCase() === post.authorName.trim().toLowerCase();

  // 좋아요 토글
  const handleLike = async () => {
    try {
      const newLiked = !liked;
      setLiked(newLiked);
      setLikeCount((prev) => newLiked ? prev + 1 : prev - 1);

      await api.post(`/posts/${id}/like`, { like: newLiked });
    } catch {
      setLiked((prev) => !prev);
      setLikeCount((prev) => liked ? prev + 1 : prev - 1);
      alert("좋아요 처리 실패");
    }
  };

  // 댓글 등록 (POST 후 GET)
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      setCommentError("댓글 내용을 입력하세요");
      return;
    }
    try {
      await api.post(`/posts/${id}/comments`, { content: newComment });
      await fetchComments();
      setNewComment("");
      setCommentError("");
    } catch {
      alert("댓글 등록 실패");
    }
  };

  // 댓글 삭제 (DELETE 후 GET)
  const handleCommentDelete = async (commentId: string) => {
    if (!commentId) return;
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/posts/${id}/comments/${commentId}`);
      await fetchComments();
    } catch (error: any) {
      alert(
        error.response?.status === 403
          ? "작성자만 삭제할 수 있습니다"
          : "댓글 삭제 실패"
      );
    }
  };

  const handleEdit = () => navigate(`/edit/${id}`);
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/posts/${id}`);
      alert("게시글이 삭제되었습니다.");
      navigate("/main");
    } catch {
      alert("삭제 실패");
    }
  };

  if (error) {
    return (
      <div className="w-full min-h-screen bg-white">
        <HeaderBox />
        <div className="pt-[120px] flex flex-col items-center text-xl text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!post)
    return (
      <div className="w-full min-h-screen bg-white">
        <HeaderBox />
        <div className="pt-[160px] text-center text-lg">로딩 중...</div>
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-white">
      <HeaderBox
        showEditDelete={isMyPost}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <div className="h-[102px]" />
      <div className="max-w-[1200px] mx-auto pt-6">
        <div className="flex flex-col items-center">
          <div className="w-[600px] bg-white rounded-lg shadow border border-black p-10">
            {/* 제목 */}
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
            <div className="border-b border-gray-300 mb-6"></div>

            {/* 본문 (HTML 적용) */}
            <div
              className="text-black whitespace-pre-line leading-relaxed mb-10 min-h-[500px]"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="border-b border-gray-300 mb-6"></div>

            {/* 플레이리스트 박스 하나 중앙 정렬 */}
            <div className="flex justify-center mb-8">
              {isMyPost ? (
                <UserPlayListBox showEditButton={true} username={post.authorName} />
              ) : (
                <OtherUserPlayListBox username={post.authorName} />
              )}
            </div>

            <div className="border-b border-gray-300 mb-6"></div>

            {/* 좋아요/댓글 수 + 좋아요 버튼 */}
            <div className="text-sm text-gray-600 mb-4 flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`mr-2 text-xl ${liked ? "text-red-500" : "text-gray-400"}`}
                aria-label="좋아요"
              >
                ❤️
              </button>
              {likeCount} · 💬 댓글 {comments.length}
            </div>

            {/* 댓글 입력 */}
            <div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                placeholder="댓글을 입력하세요"
                className="w-full border rounded-md p-3 text-sm"
              />
              <button
                onClick={handleCommentSubmit}
                className="mt-2 px-4 py-2 bg-black text-white rounded"
              >
                등록
              </button>
              {commentError && (
                <div className="text-red-500 text-sm mt-1">{commentError}</div>
              )}
            </div>

            {/* 댓글 목록 */}
            <div className="mt-6">
              {comments
                .filter((comment: any) => !!comment.id)
                .map((comment: any) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    currentUser={currentUser}
                    onDelete={() => handleCommentDelete(comment.id)}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 댓글 컴포넌트 (수정 기능 없음)
function CommentItem({
  comment,
  currentUser,
  onDelete,
}: {
  comment: any;
  currentUser: any;
  onDelete: () => void;
}) {
  // API 명세에 따라 작성자 확인
  const isAuthor =
    currentUser &&
    comment.authorUsername &&
    currentUser.username &&
    currentUser.username.trim().toLowerCase() ===
      comment.authorUsername.trim().toLowerCase();

  return (
    <div className="border-b py-4">
      <div className="flex justify-between items-start">
        <div>
          <span className="font-bold">{comment.authorUsername}</span>
          <p className="mt-1">{comment.content}</p>
          <div className="text-xs text-gray-500 mt-1">
            {comment.createdAt && new Date(comment.createdAt).toLocaleString()}
          </div>
        </div>
        {isAuthor && (
          <button
            onClick={onDelete}
            className="text-sm text-red-500 h-8 px-2 rounded hover:bg-gray-100"
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
}

export default PostDetailPage;
