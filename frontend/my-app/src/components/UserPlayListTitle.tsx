import React, { useRef, useState } from "react";

interface UserPlayListTitleProps {
  initialTitle?: string;
}

export const UserPlayListTitle = ({
  initialTitle = "사용자의 플레이리스트",
}: UserPlayListTitleProps): React.JSX.Element => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = () => {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleBlur = () => setEditing(false);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") setEditing(false);
  };

  return (
    <div className="flex flex-col w-[520px] items-start gap-6 ml-[10px] mt-[126px]">
      {editing ? (
        <input
          ref={inputRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full font-bold text-black text-[40px] leading-[48px] tracking-[0] bg-transparent outline-none border-b border-gray-300"
        />
      ) : (
        <div
          className="w-full font-bold text-black text-[40px] leading-[48px] tracking-[0] cursor-pointer select-none"
          onDoubleClick={handleDoubleClick}
          title="더블클릭해서 제목을 수정하세요"
        >
          {title}
        </div>
      )}
    </div>
  );
};
