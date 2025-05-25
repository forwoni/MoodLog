import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import defaultProfile from '../assets/defaultProfile.png';

function MyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });

  const [nickname, setNickname] = useState('홍길동');
  const [email, setEmail] = useState('abcde@gmail.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [profileImage, setProfileImage] = useState<string>(defaultProfile);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const handleMouseUp = () => setDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setScale(1);
        setTranslate({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    setScale((prev) => {
      const newScale = prev + (e.deltaY < 0 ? 0.05 : -0.05);
      return Math.min(Math.max(newScale, 0.5), 2);
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStart.current = {
      x: e.clientX - translate.x,
      y: e.clientY - translate.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setTranslate({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleSave = () => setShowPopup(true);
  const handleConfirm = () => {
    setShowPopup(false);
    navigate(from || '/main');
  };
  const handleCancel = () => {
    setShowPopup(false);
    navigate(from || '/main');
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="w-[420px] h-[580px] border rounded-md shadow-md flex flex-col px-6 py-4 justify-between">
        {/* 헤더 */}
        <header className="border-b pb-3">
          <h1 className="text-2xl font-bold">마이 페이지</h1>
        </header>

        {/* 본문 */}
        <div className="flex gap-4 mt-4">
          {/* 왼쪽: 프로필 */}
          <div className="flex flex-col items-center w-1/2">
            <div
              className="w-24 h-24 rounded-full overflow-hidden border cursor-move select-none"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setDragging(false)}
            >
              <img
                src={profileImage}
                alt="프로필"
                className="w-full h-full object-cover transition-transform duration-150 pointer-events-none"
                style={{
                  transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
                }}
              />
            </div>
            <button
              className="text-sm border px-4 py-1 rounded mt-2"
              onClick={() => fileInputRef.current?.click()}
            >
              사진 변경
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* 오른쪽: 입력 필드 */}
          <div className="w-1/2 space-y-3">
            <div>
              <label className="font-bold block mb-1">닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full h-10 px-3 border rounded focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 border rounded focus:outline-none focus:border-black"
              />
            </div>
            <div className="relative w-full">
              <label className="font-bold block mb-1">비밀번호</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 pr-20 border rounded focus:outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 text-sm text-black flex items-center justify-center leading-none"
              >
                {showPassword ? '숨기기' : '보기'}
              </button>
            </div>
          </div>
        </div>

        {/* 저장 / 취소 버튼 */}
        <div className="flex justify-center gap-6 mt-6">
          <button
            onClick={handleSave}
            className="bg-black text-white px-10 py-2.5 rounded-2xl text-base font-semibold"
          >
            저장
          </button>
          <button
            onClick={() => navigate(from || '/main')}
            className="bg-black text-white px-10 py-2.5 rounded-2xl text-base font-semibold"
          >
            취소
          </button>
        </div>

        {/* 팝업 */}
        {showPopup && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40 z-10">
            <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
              <p className="mb-4 text-lg font-semibold">수정하시겠습니까?</p>
              <div className="flex justify-around">
                <button
                  onClick={handleConfirm}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  확인
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPage;
