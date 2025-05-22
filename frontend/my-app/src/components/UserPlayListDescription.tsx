import React, { useRef, useState } from "react";

interface UserPlayListDescriptionProps {
  initialDescription?: string;
}

export const UserPlayListDescription = ({
  initialDescription = "사용자의 플레이 리스트 설명",
}: UserPlayListDescriptionProps): React.JSX.Element => {
  const [editing, setEditing] = useState(false);
  const [desc, setDesc] = useState(initialDescription);
  const inputRef = useRef<HTMLInputElement>(null);

  // 더블클릭 시 편집 모드로 전환
  const handleDoubleClick = () => {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // 엔터 또는 포커스 아웃 시 편집 종료
  const handleBlur = () => setEditing(false);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") setEditing(false);
  };

  return (
    <div className="w-[520px] mt-[69px]">
      {editing ? (
        <input
          ref={inputRef}
          value={desc}
          onChange={e => setDesc(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full font-normal text-black text-base leading-6 tracking-[0] bg-transparent outline-none border-b border-gray-300"
        />
      ) : (
        <div
          className="font-normal text-black text-base leading-6 tracking-[0] cursor-pointer select-none"
          onDoubleClick={handleDoubleClick}
          title="더블클릭해서 설명을 수정하세요"
        >
          {desc}
        </div>
      )}
    </div>
  );
};
