import api from "./axiosInstance";

interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RefreshRequest {
  refreshToken: string;
}

// 회원가입
export const signup = async (data: SignupRequest) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};

// 로그인
export const login = async (data: LoginRequest) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

// 토큰 재발급
export const refreshToken = async (data: RefreshRequest) => {
  const res = await api.post("/auth/refresh", data);
  return res.data;
};

// 로그아웃
export const logout = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};