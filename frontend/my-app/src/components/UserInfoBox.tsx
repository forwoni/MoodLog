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
    <div
      className="flex w-[1440px] items-center justify-center gap-10 px-[170px] py-[60px] relative bg-white"
      style={{
        background:
          "linear-gradient(90deg, rgba(160,127,176,0.6) 0%, rgba(238,204,255,0.6) 100%)"
      }}
    >
      {/* 프로필 이미지 자리 (원형) */}
      <div className="relative w-[120px] h-[120px] bg-[#fff9fa] rounded-[50px]" />

      {/* 사용자 정보 */}
      <div className="flex flex-col gap-3 flex-1 grow items-center relative">
        <div className="self-stretch mt-[-1px] font-bold text-[32px] leading-8 tracking-[0]">
          {userInfo ? userInfo.username : "닉네임 없음"}
        </div>
        <div className="flex gap-1.5 self-stretch w-full items-center relative">
          <div className="inline-flex justify-center gap-0.5 px-1 py-0.5 bg-[#d8d8d880] rounded-sm overflow-hidden border border-solid border-[#0000001a] items-center">
            <div className="w-fit mt-[-0.5px] font-normal text-black text-xs leading-4 whitespace-nowrap">
              {userInfo ? userInfo.email : "이메일 정보 없음"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
