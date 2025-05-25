import React, { useState } from "react";
import left_icon from "../assets/left_icon.svg";
import center_icon from "../assets/center_icon.svg";
import right_icon from "../assets/right_icon.svg";

const alignList = [
  { value: "left", icon: left_icon },
  { value: "center", icon: center_icon },
  { value: "right", icon: right_icon },
];

export default function AlignDropdown({
  value,
  onChange,
}: {
  value?: string;
  onChange: (align: string) => void;
}) {
  const [open, setOpen] = useState(false);

  // 기본값 "left"
  const selected = alignList.find((a) => a.value === value) || alignList[0];

  return (
    <div className="relative">
      <button
        className="flex items-center px-2 py-1 border rounded bg-white min-w-[40px]"
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <img src={selected.icon} alt={selected.value} className="w-5 h-5" />
        <span className="ml-1">▼</span>
      </button>
      {open && (
        <ul className="absolute left-0 top-full mt-1 w-full bg-white border rounded shadow z-10">
          {alignList.map((align) => (
            <li
              key={align.value}
              className="flex items-center px-3 py-1 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(align.value);
                setOpen(false);
              }}
            >
              <img src={align.icon} alt={align.value} className="w-5 h-5" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
