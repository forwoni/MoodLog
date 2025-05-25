import React from "react";
import pencil_icon from "../assets/pencil_icon.svg";
import { useNavigate } from "react-router-dom";

interface UserPlayListBoxProps {
  showEditButton?: boolean;
}

export const UserPlayListBox = ({
  showEditButton = true,
}: UserPlayListBoxProps): React.JSX.Element => {
  const navigate = useNavigate();

  // 전체 박스 클릭 핸들러
  const handleBoxClick = () => {
    navigate("/playlisteditor");
  };

  // 수정 버튼 클릭 핸들러 (이벤트 버블링 방지)
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 요소로의 이벤트 전파 막기
    navigate("/playlisteditor");
  };

  return (
    <div
      className="w-60 h-[348px] mt-[30px] cursor-pointer"
      onClick={handleBoxClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleBoxClick();
      }}
      aria-label="플레이리스트 편집 페이지로 이동"
    >
      <div className="flex w-60 items-start gap-10 relative">
        <div className="flex flex-col items-center flex-1 grow rounded-md overflow-hidden border border-solid border-[#0000001a] bg-white">
          {/* 이미지 영역 */}
          <div className="flex h-60 items-start relative self-stretch w-full">
            <div className="relative flex-1 self-stretch grow bg-[#d8d8d880]">
              <div className="absolute w-[209px] h-4 top-[111px] left-4 font-normal text-black text-center tracking-[0] leading-4 whitespace-nowrap flex items-center justify-center">
                노래 이미지
              </div>
              {/* 수정 버튼 (조건부 렌더링) */}
              {showEditButton && (
                <img
                  className="absolute left-[216px] top-[9px] w-6 h-6 cursor-pointer z-10" // z-10으로 버튼이 최상단에 오도록
                  src={pencil_icon}
                  alt="이미지 수정"
                  onClick={handleEditClick}
                />
              )}
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

