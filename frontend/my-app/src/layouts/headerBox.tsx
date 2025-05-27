import React from "react";
import { useNavigate } from "react-router-dom";
import moodlog_logo_transparent from "../assets/moodlog_logo_transparent.png";

export const HeaderBox = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-[1440px] h-[102px] bg-white z-50 shadow">
      <div className="relative w-full h-full flex items-center">
        <img
          className="ml-4 w-[109px] h-[98px] object-cover cursor-pointer"
          alt="Logo"
          src={moodlog_logo_transparent}
          onClick={() => navigate("/main")}
        />
      </div>
    </header>
  );
};

