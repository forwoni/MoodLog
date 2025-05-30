import api from "./axiosInstance";

// 이웃 추가 (팔로우)
export const followUser = async (followingUsername: string) => {
  const res = await api.post("/social/follow", { followingUsername });
  return res.data;
};

// 이웃 제거 (언팔로우)
export const unfollowUser = async (followingUsername: string) => {
  const res = await api.delete("/social/unfollow", { data: { followingUsername } });
  return res.data;
};

// 팔로우 여부 확인
export const isFollowing = async (targetUsername: string) => {
  const res = await api.get(`/social/is-following?target=${targetUsername}`);
  return res.data;
};

// 이웃 목록 조회 (내가 팔로우한 사람들)
export const getFollowings = async () => {
  const res = await api.get("/social/followings");
  return res.data;
};

// 내 팔로워 목록 조회
export const getFollowers = async () => {
  const res = await api.get("/social/followers");
  return res.data;
};