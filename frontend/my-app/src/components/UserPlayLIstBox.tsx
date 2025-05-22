import React from "react";
import pencil_icon from "../assets/pencil_icon.svg";

export const UserPlayListBox = (): React.JSX.Element => {
  return (
    <div className="w-60 h-[348px] mt-[30px]">
      <div className="flex w-60 items-start gap-10 relative">
        <div className="flex flex-col items-center flex-1 grow rounded-md overflow-hidden border border-solid border-[#0000001a] bg-white">
          {/* 이미지 영역 */}
          <div className="flex h-60 items-start relative self-stretch w-full">
            <div className="relative flex-1 self-stretch grow bg-[#d8d8d880]">
              <div className="absolute w-[209px] h-4 top-[111px] left-4 font-normal text-black text-center tracking-[0] leading-4 whitespace-nowrap">
                노래 이미지
              </div>
              <img
                className="absolute left-[216px] top-[9px] w-6 h-6 cursor-pointer"
                src={pencil_icon}
                alt="내용 수정"
              />
            </div>
          </div>
          {/* 텍스트 정보 영역 */}
          <div className="flex flex-col items-start gap-1 p-3 self-stretch w-full">
            <div className="self-stretch mt-[-1px] font-normal text-base leading-6 text-black tracking-[0]">
              이미지 노래 제목
            </div>
            <div className="self-stretch font-normal text-base leading-7 text-black tracking-[0]">
              플레이 리스트 이름
            </div>
            <div className="flex items-center gap-2 self-stretch w-full">
              <div className="w-6 h-6 mt-[-1px] font-normal text-base text-center leading-6 whitespace-nowrap overflow-hidden text-ellipsis text-black tracking-[0]">
                🎵
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
