import api from "./axiosInstance";

// 알림 목록 조회
export const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

// 알림 읽음 처리
export const markNotificationAsRead = async (notificationId: number) => {
  const res = await api.put(`/notifications/${notificationId}/read`);
  return res.data;
};