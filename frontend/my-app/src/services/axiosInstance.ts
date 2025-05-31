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
      const refreshToken = getRefreshToken();
  
      // 여기를 이렇게 고쳐보자:
      if (
        (error.response?.status === 401 || error.response?.status === 403) &&
        refreshToken &&
        refreshToken.trim() !== "" &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const res = await axios.post("/api/auth/refresh", { refreshToken });
  
          const { accessToken, refreshToken: newRefreshToken } = res.data;
          setTokens(accessToken, newRefreshToken);
          window.dispatchEvent(new Event("tokenRefreshed"));
  
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
  
      // 위 조건에 해당 안되면 (예: 404, 500 등) 그냥 에러만 넘기자
      return Promise.reject(error);
    }
  );
  

export default api;