
import React from "react";
import magnifier_icon from "../assets/magnifier_icon.svg";
import x_icon from "../assets/x_icon.svg"; // 실제 X 아이콘 SVG로 교체

export const SearchBox = (): React.JSX.Element => {
  return (
    <div className="flex w-[956px] h-[55px] items-center justify-center px-[30px] bg-[#ededed] rounded-[25px]">
      {/* 돋보기 아이콘 */}
      <img
        className="w-[25px] h-[25px] mr-3"
        src={magnifier_icon}
        alt="검색"
      />
      {/* 검색 입력창 */}
      <input
        type="text"
        placeholder="검색어 입력"
        className="flex-1 bg-transparent border-none outline-none text-[#717171] text-[25px] font-light placeholder-[#717171]"
      />
      {/* X(지우기) 아이콘 */}
      <img
        className="w-[17px] h-[17px] ml-3 cursor-pointer"
        src={x_icon}
        alt="지우기"
      />
    </div>
  );
};
    