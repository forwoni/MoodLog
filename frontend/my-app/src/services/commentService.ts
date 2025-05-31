import api from "./axiosInstance";

interface CommentRequest {
  content: string;
}

// 댓글 작성
export const createComment = async (postId: number, data: CommentRequest) => {
  const res = await api.post(`/posts/${postId}/comments`, data);
  return res.data;
};

// 댓글 목록 조회
export const getComments = async (postId: number) => {
  const res = await api.get(`/posts/${postId}/comments`);
  return res.data;
};

// 댓글 삭제
export const deleteComment = async (postId: number, commentId: number) => {
  const res = await api.delete(`/posts/${postId}/comments/${commentId}`);
  return res.data;
};