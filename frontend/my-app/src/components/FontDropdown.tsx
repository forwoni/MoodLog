import React, { useState } from "react";

const fonts = ["글씨체 1", "글씨체 2", "글씨체 3"];

export default function FontDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (font: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        className="flex items-center px-2 py-1 border rounded bg-white min-w-[80px]"
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        {value}
        <span className="ml-1">▼</span>
      </button>
      {open && (
        <ul className="absolute left-0 top-full mt-1 w-full bg-white border rounded shadow z-10">
          {fonts.map((font) => (
            <li
              key={font}
              className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(font);
                setOpen(false);
              }}
            >
              {font}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
