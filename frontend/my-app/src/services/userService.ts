import api from "./axiosInstance";

interface UpdateUserRequest {
  currentPassword: string;
  newUsername?: string;
  newPassword?: string;
}

// 내 정보 조회
export const getMyInfo = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

// 내 정보 수정
export const updateMyInfo = async (data: UpdateUserRequest) => {
  const res = await api.put("/users/me", data);
  return res.data;
};

// 프로필 이미지 업로드 (새 이미지 업로드)
export const uploadProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/users/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 프로필 이미지 수정 (기존 이미지 교체)
export const updateProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.put("/users/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};