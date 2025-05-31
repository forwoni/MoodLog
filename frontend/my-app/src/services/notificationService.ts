import api from "./axiosInstance";

// 알림 목록 조회
export const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

// 알림 읽음 처리
export const markNotificationAsRead = async (notificationId: number) => {
  console.log(`[Debug] Marking notification ${notificationId} as read`);
  try {
    const res = await api.put(`/notifications/${notificationId}/read`);
    console.log(`[Debug] Successfully marked notification as read:`, res.data);
    return res.data;
  } catch (error) {
    console.error(`[Debug] Failed to mark notification as read:`, error);
    throw error;
  }
};