import api from "./axiosInstance";

interface PostRequest {
  title: string;
  content: string;
  autoSaved: boolean;
}

// 게시글 작성
export const createPost = async (data: PostRequest) => {
  const res = await api.post("/posts", data);
  return res.data;
};

// 전체 게시글 조회
export const getAllPosts = async () => {
  const res = await api.get("/posts");
  return res.data;
};

// Top 게시글 조회
export const getTopPosts = async (sort: "likes" | "comments", size = 10) => {
  const res = await api.get(`/posts/top?sort=${sort}&size=${size}`);
  return res.data;
};

// 게시글 상세 조회
export const getPostById = async (postId: number) => {
  const res = await api.get(`/posts/${postId}`);
  return res.data;
};

// 게시글 수정
export const updatePost = async (postId: number, data: PostRequest) => {
  const res = await api.put(`/posts/${postId}`, data);
  return res.data;
};

// 게시글 삭제
export const deletePost = async (postId: number) => {
  await api.delete(`/posts/${postId}`);
  return true; // 성공적으로 삭제되면 true 반환
};

// 좋아요 토글
export const toggleLike = async (postId: number) => {
  const res = await api.post(`/posts/${postId}/like`);
  return res.data;
};