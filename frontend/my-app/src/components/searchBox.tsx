// import React from "react";
// import magnifier_icon from "../assets/magnifier_icon.svg"
// import x_icon from "../assets/react.svg"

// export const SearchBox = (): React.JSX.Element => {
//     return(
//         <div className="flex w-[956px] h-[55px] items-center justify-center gap-2.5 px-[395px] py-[5] relative bg-[#ededed] rounded-[25px]">
//             <div className="relative w-[910px] h-[29px] ml-[-371px] mr-[-373px]">
//                 <img
//                     className="!absolute !left-0 !top-[3px]"
//                     src={magnifier_icon}
//                     alt="magnigier_icon"
//                 />
//                 <div className="relative w-[847px] h-[29px] ml-[335px] mr-[-345.px] [font-family:'Roboto-Light',Helvetica] font-light text-[$717171] text-[25px] tracking-[0] leading-[normal] whitespace-nowrap">
//                     검색어 입력
//                 </div>
//                 <img
//                     className="!h-[16.5px] !mr-[-371.68px] !relative !left-[unset] !w[16.75px] !top-[unset]"
//                     src={x_icon}
//                     alt="x_icon"
//                 />
//             </div>
//         </div>
//     );
// };

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
    