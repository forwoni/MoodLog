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

// 알림 삭제
export const deleteNotification = async (notificationId: number) => {
  console.log(`[Debug] Deleting notification ${notificationId}`);
  try {
    const res = await api.delete(`/notifications/${notificationId}`);
    console.log(`[Debug] Successfully deleted notification:`, res.data);
    return res.data;
  } catch (error) {
    console.error(`[Debug] Failed to delete notification:`, error);
    throw error;
  }
};

// 모든 알림 삭제
export const deleteAllNotifications = async () => {
  console.log(`[Debug] Deleting all notifications`);
  try {
    const res = await api.delete(`/notifications`);
    console.log(`[Debug] Successfully deleted all notifications:`, res.data);
    return res.data;
  } catch (error) {
    console.error(`[Debug] Failed to delete all notifications:`, error);
    throw error;
  }
};