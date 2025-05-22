// export default function UserInfoBox({
//   userName = "사용자 이름",
//   userEmail = "honggildong@example.com",
//   profileImg,
// }: {
//   userName?: string;
//   userEmail?: string;
//   profileImg?: string;
// }) {
//   return (
//     <div className="w-[1440px] h-[240px] bg-gradient-to-r from-purple-200 to-purple-300 rounded-2xl flex items-center px-16 shadow-md mx-auto mt-8">
//       {/* 프로필 이미지 */}
//       <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mr-10 text-gray-400 text-lg font-bold overflow-hidden">
//         {profileImg ? (
//           <img
//             src={profileImg}
//             alt="프로필"
//             className="w-full h-full object-cover rounded-full"
//           />
//         ) : (
//           <span>프로필</span>
//         )}
//       </div>
//       {/* 사용자 정보 */}
//       <div className="flex flex-col justify-center">
//         <span className="text-white text-3xl font-bold">{userName}</span>
//         <span className="text-white/90 text-lg mt-2">이메일: {userEmail}</span>
//       </div>
//     </div>
//   );
// }
// src/components/UserInfoBox.tsx
import React from "react";
interface UserInfoBoxProps {
  userName: string;
  userDescription: string;
}

export const UserInfoBox = ({
  userName,
  userDescription,
}: UserInfoBoxProps): React.JSX.Element => {
  return (
    <div className="flex w-[1440px] items-center justify-center gap-10 px-[170px] py-[60px] relative bg-white"
      style={{
        background: "linear-gradient(90deg, rgba(160,127,176,0.6) 0%, rgba(238,204,255,0.6) 100%)"
      }}
    >
      {/* 프로필 이미지 자리 (원형) */}
      <div className="relative w-[120px] h-[120px] bg-[#fff9fa] rounded-[50px]" />

      {/* 사용자 정보 */}
      <div className="flex flex-col gap-3 flex-1 grow items-center relative">
        <div className="self-stretch mt-[-1px] font-bold text-[32px] leading-8 tracking-[0]">
          {userName}
        </div>
        <div className="flex gap-1.5 self-stretch w-full items-center relative">
          <div className="inline-flex justify-center gap-0.5 px-1 py-0.5 bg-[#d8d8d880] rounded-sm overflow-hidden border border-solid border-[#0000001a] items-center">
            <div className="w-fit mt-[-0.5px] font-normal text-black text-xs leading-4 whitespace-nowrap">
              {userDescription}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
