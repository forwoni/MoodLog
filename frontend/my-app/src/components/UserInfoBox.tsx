export default function UserInfoBox({
  userName = "사용자 이름",
  userSubInfo = "서브 정보가 여기에 들어갑니다.",
  profileImg,
}: {
  userName?: string;
  userSubInfo?: string;
  profileImg?: string;
}) {
  return (
    <div className="w-[1440px] h-[240px] bg-gradient-to-r from-purple-200 to-purple-300 rounded-xl flex items-center px-12 relative overflow-hidden">
      {/* 프로필 이미지 (없으면 기본 원형 배경) */}
      <div className="w-24 h-24 bg-white/80 rounded-full flex items-center justify-center mr-8 shadow-md">
        {profileImg ? (
          <img
            src={profileImg}
            alt="프로필"
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-300" />
        )}
      </div>
      {/* 사용자 정보 */}
      <div className="flex flex-col">
        <span className="text-white text-2xl font-bold">{userName}</span>
        <span className="text-white/80 text-base mt-2">{userSubInfo}</span>
      </div>
      {/* 대각선 구분선 */}
      <div className="absolute right-24 top-8 h-[180px] w-0 border-r-2 border-black/30 rotate-[20deg]" />
    </div>
  );
}
