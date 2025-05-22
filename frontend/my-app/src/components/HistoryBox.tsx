import React from "react";
import BotAngleBracket from "../assets/BotAngleBracket.svg";

export const HistoryBox = (): React.JSX.Element => {
  return (
    <div className="flex flex-col w-[800px] h-[1539px] items-center gap-5 pt-10 pb-5 px-0 relative bg-white rounded-lg shadow">
      {/* 정렬 기준 + 최신순 드롭다운 */}
      <div className="flex w-[570px] items-center justify-end gap-2 relative">
        <div className="w-[332px] h-[21px] text-right leading-7 whitespace-nowrap font-normal text-black text-lg tracking-[0]">
          정렬 기준
        </div>
        {/* 최신순 선택 박스 */}
        <div className="relative w-[123px] h-[30px] ml-2">
          {/* 바깥 테두리 */}
          <div className="w-full h-full rounded-md absolute top-0 left-0 bg-white border border-black/30" />
          {/* 텍스트 */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <span className="text-center leading-[30px] whitespace-nowrap font-normal text-black text-lg tracking-[0]">
              최신순
            </span>
            <img
              className="w-6 h-6 ml-1"
              src={BotAngleBracket}
              alt="아래 꺽쇠"
            />
          </div>
        </div>
      </div>

      {/* 게시물 없음 */}
      <div className="w-[100px] text-right leading-7 font-normal text-black text-lg tracking-[0]">
        게시물 없음
      </div>

      {/* 페이지네이션 */}
      <div className="flex h-7 items-end justify-end gap-5 relative self-stretch w-full">
        <div className="w-fit mt-[-1px] font-normal text-black text-lg text-right tracking-[0] leading-7 whitespace-nowrap">
          1
        </div>
        <div className="w-fit mt-[-1px] font-normal text-black text-lg text-right tracking-[0] leading-7 whitespace-nowrap flex items-center gap-1 cursor-pointer hover:underline">
          다음
          <span className="ml-1">&gt;</span>
        </div>
      </div>
    </div>
  );
};

// import React from "react";
// import BotAngleBracket from "../assets/BotAngleBracket.svg"

// export const HistoryBox = (): React.JSX.Element => {
//   return (
//     <div className="flex flex-col w-[574px] h-[1539px] items-center pt-[19px] pb-[5px] px-0 gap-5 relative bg-white rounded-lg shadow">
//       {/* 정렬 기준 */}
//       <div className="w-[332px] h-[21px] mt-[-1px] whitespace-nowrap relative font-normal text-black text-[21px] text-right tracking-[0] leading-7">
//         정렬 기준
//       </div>


      
//       {/* 게시물 없음 */}
//       <div className="w-[100px] relative font-normal text-black text-lg text-right tracking-[0] leading-7">
//         게시물 없음
//       </div>
//       {/* 페이지네이션 */}
//       <div className="h-7 items-end justify-end self-stretch w-full flex gap-5 relative">
//         <div className="relative w-fit mt-[-1px] font-normal text-black text-lg text-right tracking-[0] leading-7 whitespace-nowrap">
//           1
//         </div>
//         <div className="relative w-fit mt-[-1px] font-normal text-black text-lg text-right tracking-[0] leading-7 whitespace-nowrap cursor-pointer hover:underline">
//           다음 &gt;
//         </div>
//       </div>
//     </div>
//   );
// };
