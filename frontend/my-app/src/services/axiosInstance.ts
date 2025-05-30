import axios from "axios";

const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");
const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
};

const api = axios.create({
  baseURL: "/api",
});

// 요청 전: accessToken 있으면 Authorization 헤더에 넣기
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 후: 401/403 에러면 refresh 로직 시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // refreshToken 가져오기
    const refreshToken = getRefreshToken();

    // 아래 조건 중 하나라도 맞으면 refresh 요청을 아예 시도하지 않고 로그인 페이지로 이동
    if (
      !refreshToken ||
      refreshToken.trim() === "" ||
      (error.response?.status !== 401 && error.response?.status !== 403) ||
      originalRequest._retry
    ) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // 여기까지 오면 refresh 요청 시도!
    originalRequest._retry = true;
    try {
      const res = await axios.post("/api/auth/refresh", { refreshToken });

      // 새 accessToken, refreshToken 저장
      const { accessToken, refreshToken: newRefreshToken } = res.data;
      setTokens(accessToken, newRefreshToken);

      // 토큰 갱신 이벤트 발생
      window.dispatchEvent(new Event("tokenRefreshed"));

      // 원래 요청 헤더에 새 accessToken 갱신 후 재시도
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      window.location.href = "/login";
      return Promise.reject(refreshError);
    }
  }
);

export default api;