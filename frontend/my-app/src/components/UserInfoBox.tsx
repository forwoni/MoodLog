import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "lucide-react";

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
    <div className="flex items-center gap-4">
      {/* 프로필 이미지 */}
      <div className="w-[104px] h-[104px] bg-white rounded-full flex items-center justify-center overflow-hidden">
        {userInfo?.profileImage ? (
          <img
            src={userInfo.profileImage}
            alt="프로필"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-12 h-12 text-gray-300" />
        )}
      </div>

      {/* 사용자 정보 */}
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800">
          {userInfo?.username || "사용자 이름"}
        </h2>
        <p className="text-gray-600 mt-1">
          {userInfo?.email || "이메일 정보 없음"}
        </p>
      </div>
    </div>
  );
};
