// import { DivWrapper } from "./DIvWrapper";
// import { OverlapWrapper } from "./OverlapWrapper";
// import moodlog_logo_transparent from "./assets/moodlog_logo_transparent.png"
// import image from image.png;
// import rectangle from SVGAElement;
// import vector from SVGAElement;
// src/pages/HistoryPage.tsx

// src/pages/HistoryPage.tsx

import { UserInfoBox } from "../components/UserInfoBox";

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <UserInfoBox
        userName="사용자 이름"
        userDescription="사용자에 대한 간단한 설명"
      />
      {/* 아래에 다른 콘텐츠 추가 */}
    </div>
  );
}


