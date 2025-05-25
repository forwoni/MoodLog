import React from "react";
import moodlog_logo_transparent from "../assets/moodlog_logo_transparent.png";

export const HeaderBox = (): React.JSX.Element => {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-[1440px] h-[102px] bg-white z-50 shadow">
      <div className="relative w-full h-full flex items-center">
        <img
          className="ml-4 w-[109px] h-[98px] object-cover"
          alt="Logo"
          src={moodlog_logo_transparent}
        />
      </div>
    </header>
  );
};


