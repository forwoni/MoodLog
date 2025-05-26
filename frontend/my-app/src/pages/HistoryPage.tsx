
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
                userDescription="사용자에 대한 간단한 설명"
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
                    <UserPlayListBox showEditButton={true} />
                </div>
            {/* 오른쪽: 게시글(HistoryBox) */}
                <div className="ml-[70px] flex-1">
                    <HistoryBox />
                </div>
            </div>
        </div>

    )
}
