import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "lucide-react";

interface UserInfo {
  username: string;
  email: string;
  profileImage?: string;
}

interface UserInfoBoxProps {
  username?: string;
}

export const UserInfoBox = ({ username }: UserInfoBoxProps): React.JSX.Element => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const endpoint = username ? `/api/users/profile/${username}` : "/api/users/me";
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(res.data);
      } catch (err) {
        console.error("사용자 정보 조회 실패:", err);
        setUserInfo(null);
      }
    };
    fetchUserInfo();
  }, [username]);

  return (
    <div className="flex items-center gap-6">
      {/* 프로필 이미지 */}
      <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center overflow-hidden shadow-sm border border-purple-100">
        {userInfo?.profileImage ? (
          <img
            src={userInfo.profileImage}
            alt="프로필"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-8 h-8 text-purple-200" />
        )}
      </div>

      {/* 사용자 정보 */}
      <div className="flex flex-col">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
          {userInfo?.username || username || "사용자 이름"}
        </h2>
        {/* 다른 사용자의 경우 이메일을 표시하지 않음 */}
        {!username && userInfo?.email && (
          <p className="text-sm text-gray-500 mt-0.5">
            {userInfo.email}
          </p>
        )}
      </div>
    </div>
  );
};
