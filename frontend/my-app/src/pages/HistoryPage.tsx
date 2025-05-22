// import { DivWrapper } from "./DIvWrapper";
// import { OverlapWrapper } from "./OverlapWrapper";
// import image from image.png;
// import rectangle from SVGAElement;
// import vector from SVGAElement;
// src/pages/HistoryPage.tsx

// src/pages/HistoryPage.tsx
import { HeaderBox } from "../layouts/headerBox";
import { UserInfoBox } from "../components/UserInfoBox";
import { SearchBox } from "../components/searchBox";
import { UserPlayListTitle} from "../components/UserPlayListTitle"
export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-[102px]">
      {/* 헤더 고정 */}
      <HeaderBox />
      {/* 헤더 높이만큼 padding-top 추가! */}
      <UserInfoBox
        userName="사용자 이름"
        userDescription="사용자에 대한 간단한 설명"
      />
      <div className="mt-[23px]">
        <SearchBox />
      </div>
      <div className="self-start ml-[99px] ">
        <UserPlayListTitle/>
      </div>
        

      {/* ...아래에 다른 내용 */}
    </div>
  );
}



