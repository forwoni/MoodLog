import React, { useEffect, useState } from "react";
import axios from "axios";

interface UserInfo {
  username: string;
  email: string;
  profileImage?: string;
}

export const UserInfoBox = (): React.JSX.Element => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(res.data);
      } catch (err) {
        console.error("사용자 정보 조회 실패:", err);
        setUserInfo(null);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <div className="max-w-[1440px] w-full mx-auto px-8">
      <div className="bg-gradient-to-r from-purple-200/60 to-purple-300/60 rounded-2xl shadow-md p-8 flex items-center gap-6">
        {/* 프로필 이미지 */}
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden shadow">
          {userInfo?.profileImage ? (
            <img
              src={userInfo.profileImage}
              alt="프로필"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-gray-400 text-xl">🙂</span>
          )}
        </div>

        {/* 사용자 정보 */}
        <div className="flex flex-col">
          <div className="text-xl font-bold text-gray-800">{userInfo?.username || "닉네임 없음"}</div>
          <div className="text-sm text-gray-600">{userInfo?.email || "이메일 정보 없음"}</div>
        </div>
      </div>
    </div>
  );
};
