// import React from "react";
// import moodlog_logo_transparent from "../assets/moodlog_logo_transparent.png"

// export const headerBox = (): React.JSX.Element => {
//     return (
//         <div className="w-[1440px] h-[102px]">
//             <header className="fixed w-[1440px] h-[102px] top-0 left-0 bg-transparet">
//                 <div className="relative w=[1440px] h-[203px] border-solid border-black">
//                     <img
//                         className="absolute w-[109px] h-[98px] top-0.5 left-2 object-cover"
//                         alt="Logo"
//                         src={moodlog_logo_transparent}
//                     />
//                 </div>
//             </header> 
//         </div>
//     )
// }

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


