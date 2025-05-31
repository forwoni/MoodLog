import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HeaderBox } from "../layouts/headerBox";
import  UserPlayListBox  from "../components/UserPlayListBox";
import { OtherUserPlayListBox } from "../components/OtherUserPlayListBox";
import api from "../services/axiosInstance";
import { Heart, MessageCircle, Calendar, User, Edit, Trash2 } from "lucide-react";

// 타입 선언
interface Track {
  trackName: string;
  artist: string;
  spotifyUrl: string;
  albumImage?: string;
}

interface Playlist {
  id: number;
  name: string;
  description: string;
  tracks: Track[];
}

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
  comments: any[];
  playlist: Playlist | null;
}

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
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
      } catch (error) {
        console.warn("사용자 정보 조회 실패", error);
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
    try {
      const commentsRes = await api.get(`/posts/${id}/comments`);
      const filtered = (commentsRes.data || []).filter((c: any) => !!c.id);
      setComments(filtered);
    } catch (error) {
      console.warn("댓글 조회 실패", error);
    }
  };

  const isMyPost =
    currentUser &&
    post &&
    currentUser.username &&
    post.authorName &&
    currentUser.username.trim().toLowerCase() ===
      post.authorName.trim().toLowerCase();

  // 좋아요 토글
  const handleLike = async () => {
    try {
      const newLiked = !liked;
      setLiked(newLiked);
      setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));

      await api.post(`/posts/${id}/like`, { like: newLiked });
    } catch {
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
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
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-blue-50">
      <HeaderBox
        showEditDelete={isMyPost}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      {/* 게시글 헤더 */}
      <div className="w-full bg-gradient-to-r from-purple-100/50 to-blue-100/50 backdrop-blur-sm pt-24 pb-6">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-white shadow-sm flex items-center justify-center">
                <User size={24} className="text-purple-300" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{post.authorName}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar size={14} className="mr-1" />
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            {isMyPost && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 text-gray-700 hover:bg-white transition-colors border border-purple-100"
                >
                  <Edit size={16} />
                  <span className="text-sm">수정</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 text-red-600 hover:bg-red-50 transition-colors border border-red-100"
                >
                  <Trash2 size={16} />
                  <span className="text-sm">삭제</span>
                </button>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
            {post.title}
          </h1>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-[800px] mx-auto px-6 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
          {/* 본문 */}
          <div className="p-8">
            <div
              className="prose prose-purple max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* 플레이리스트 박스 */}
          {post.playlist && (
            <div className="border-t border-purple-100 bg-gradient-to-r from-purple-50/50 to-blue-50/50 p-8">
              <div className="flex justify-center">
                {isMyPost ? (
                  <UserPlayListBox
                    showEditButton={true}
                    playlists={post.playlist ? [post.playlist] : []}
                  />
                ) : (
                  <OtherUserPlayListBox
                    username={post.authorName}
                    playlists={post.playlist ? [post.playlist] : []}
                  />
                )}
              </div>
            </div>
          )}

          {/* 좋아요/댓글 섹션 */}
          <div className="border-t border-purple-100 p-6">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  liked
                    ? "bg-rose-100 text-rose-500"
                    : "bg-gray-100 text-gray-500 hover:bg-rose-50 hover:text-rose-500"
                } transition-colors`}
              >
                <Heart size={18} className={liked ? "fill-current" : ""} />
                <span className="font-medium">{likeCount}</span>
              </button>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-500">
                <MessageCircle size={18} />
                <span className="font-medium">{comments.length}</span>
              </div>
            </div>

            {/* 댓글 입력 */}
            <div className="space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                placeholder="댓글을 입력하세요"
                className="w-full rounded-xl border border-purple-100 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50 resize-none"
              />
              <div className="flex justify-between items-center">
                {commentError && (
                  <div className="text-red-500 text-sm">{commentError}</div>
                )}
                <button
                  onClick={handleCommentSubmit}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors ml-auto"
                >
                  댓글 작성
                </button>
              </div>
            </div>

            {/* 댓글 목록 */}
            <div className="mt-8 space-y-4">
              {comments.map((comment) => (
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

// 댓글 아이템 컴포넌트
function CommentItem({
  comment,
  currentUser,
  onDelete,
}: {
  comment: any;
  currentUser: any;
  onDelete: () => void;
}) {
  const isMyComment =
    currentUser?.username &&
    comment.authorUsername &&
    currentUser.username.trim().toLowerCase() ===
      comment.authorUsername.trim().toLowerCase();

  return (
    <div className="bg-white/50 rounded-xl p-4 hover:bg-white/80 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 border border-white shadow-sm flex items-center justify-center">
            <User size={16} className="text-purple-300" />
          </div>
          <div>
            <span className="font-medium text-gray-900">{comment.authorUsername}</span>
            <span className="text-sm text-gray-500 ml-2">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        {isMyComment && (
          <button
            onClick={onDelete}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            삭제
          </button>
        )}
      </div>
      <p className="text-gray-600 pl-11">{comment.content}</p>
    </div>
  );
}

export default PostDetailPage;
