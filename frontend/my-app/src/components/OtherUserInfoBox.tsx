import React from "react";

interface OtherUserInfoBoxProps {
  authorName: string;
}

const OtherUserInfoBox: React.FC<OtherUserInfoBoxProps> = ({ authorName }) => {
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
          {authorName}
        </div>
        {/* 이메일 등은 필요 없으므로 제외 */}
      </div>
    </div>
  );
};

export default OtherUserInfoBox;
