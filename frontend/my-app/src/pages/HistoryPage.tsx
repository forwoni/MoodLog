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
import { UserPlayListDescription } from "../components/UserPlayListDescription";
import { UserPlayListBox } from "../components/UserPlayLIstBox";
import { HistoryBox } from "../components/HistoryBox";

export default function HistoryPage(){
    return(
        <div className="w-[1440px] mx-auto flex flex-col items-center">
            <HeaderBox />
            <div className="w-[1440px] mx-auto mt-[102px]"> 
                <UserInfoBox
                userName="사용자 이름"
                userDescription="사용자에 대한 간단한 설명명"
                />
            </div>
            <div className="mt-[23px] flex justify-center">
                <SearchBox />
            </div>
            <div className="flex flex-row mt-[40px]">
            {/* 왼쪽: 플레이리스트 */}
                <div>
                    <UserPlayListTitle />
                    <UserPlayListDescription />
                    <UserPlayListBox />
                </div>
            {/* 오른쪽: 게시글(HistoryBox) */}
                <div className="ml-[70px] flex-1">
                    <HistoryBox />
                </div>
            </div>
        </div>

    )
}



// export default function HistoryPage() {
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-[102px] whitespace-nowrap">
//       {/* 헤더 고정 */}
//       <HeaderBox />

//       {/* 헤더 높이만큼 padding-top 추가! */}
//       <UserInfoBox
//         userName="사용자 이름"
//         userDescription="사용자에 대한 간단한 설명"
//       />

//       <div className="mt-[23px]">
//         <SearchBox />
//       </div>

//       <div className="self-start ml-[190px] ">
//         <UserPlayListTitle/>
//       </div>

//       <div className="self-start ml-[190px] mt-[69px]">
//         <UserPlayListDescription/>
//       </div>

//       <div className="self-start ml-[190px] mt-[30px]">
//         <UserPlayListBox/>
//       </div>

//       <HistoryBox/>


//       {/* ...아래에 다른 내용 */}
//     </div>
//   );
// }



