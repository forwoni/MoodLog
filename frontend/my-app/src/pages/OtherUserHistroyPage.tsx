import { HeaderBox } from "../layouts/headerBox";
import { UserInfoBox } from "../components/UserInfoBox";
import { UserPlayListTitle } from "../components/UserPlayListTitle";
import { UserPlayListDescription } from "../components/UserPlayListDescription";
import { UserPlayListBox } from "../components/UserPlayLIstBox";
import { HistoryBox } from "../components/HistoryBox";

export default function OtherUserHistoryPage() {
    return (
        <div className="w-[1440px] mx-auto flex flex-col items-center">
            <HeaderBox />
            {/* 사용자 정보 영역 */}
            <div className="w-[1440px] mx-auto mt-[102px]">
                <UserInfoBox
                    userName="상대방 사용자 이름"
                    userDescription="상대방에 대한 간단한 설명"
                />
            </div>
            {/* 플레이리스트 + 게시글 리스트 */}
            <div className="flex flex-row mt-[40px]">
                {/* 왼쪽: 플레이리스트 */}
                <div>
                    <UserPlayListTitle initialTitle="상대방의 플레이리스트" />
                    <UserPlayListDescription initialDescription="상대방의 플레이리스트 설명" />
                    <UserPlayListBox showEditButton={false} />
                </div>
                {/* 오른쪽: 게시글(HistoryBox) */}
                <div className="ml-[70px] flex-1">
                    <HistoryBox showEditButton={false} showDeleteButton={false} />
                </div>
            </div>
        </div>
    );
}
