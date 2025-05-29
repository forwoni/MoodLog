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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
        setComments(res.data.comments || []);
        setError("");
      } catch (err: any) {
        setError("게시글이 존재하지 않습니다.");
      }
    };
    fetchData();
  }, [id]);

  const isMyPost =
    currentUser &&
    post &&
    currentUser.username &&
    post.authorName &&
    currentUser.username.trim().toLowerCase() === post.authorName.trim().toLowerCase();

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

            {/* 댓글 */}
            <div className="text-sm text-gray-600 mb-4">
              ❤️ {post.likeCount} · 💬 댓글 {comments.length}
            </div>

            <div>
              <textarea
                rows={3}
                placeholder="댓글을 입력하세요"
                className="w-full border rounded-md p-3 text-sm"
              />
              <button className="mt-2 px-4 py-2 bg-black text-white rounded">등록</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;