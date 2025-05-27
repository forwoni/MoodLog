import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import defaultProfile from '../assets/defaultProfile.png';

interface UpdateUserInfoBody {
  currentPassword?: string;
  newUsername?: string;
  newPassword?: string;
}

function MyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
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

  // 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNickname(res.data.username);
      setEmail(res.data.email);
      if (res.data.profileImage) setProfileImage(res.data.profileImage);
    } catch (err) {
      console.error('사용자 정보 조회 실패:', err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // 이미지 변경은 비활성화 (UI만 남김)
  const handleImageChange = (_e: React.ChangeEvent<HTMLInputElement>) => {};

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    setScale((prev) => Math.min(Math.max(prev + (e.deltaY < 0 ? 0.05 : -0.05), 0.5), 2));
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

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem('access_token');
      // 빈 값은 body에서 제외
      const body: UpdateUserInfoBody = {};
      if (currentPassword) body.currentPassword = currentPassword;
      if (nickname) body.newUsername = nickname;
      if (password) body.newPassword = password;

      // 필수값 체크
      if (!body.currentPassword) {
        alert("현재 비밀번호를 입력하세요.");
        return;
      }
      if (!body.newUsername && !body.newPassword) {
        alert("변경할 닉네임이나 새 비밀번호를 입력하세요.");
        return;
      }

      await axios.put('/api/users/me', body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // 최신 정보 다시 조회
      await fetchUserInfo();

      alert('정보가 성공적으로 수정되었습니다.');
      setShowPopup(false);
      setPassword('');
      setCurrentPassword('');
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "isAxiosError" in err &&
        (err as AxiosError).isAxiosError
      ) {
        const axiosError = err as AxiosError<{ message?: string }>;
        alert('정보 수정 실패: ' + (axiosError.response?.data?.message || axiosError.message));
      } else if (err instanceof Error) {
        alert('정보 수정 실패: ' + err.message);
      } else {
        alert('정보 수정에 실패했습니다.');
      }
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    navigate(from || '/main');
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="w-[420px] h-[580px] border rounded-md shadow-md flex flex-col px-6 py-4 justify-between relative">
        <header className="border-b pb-3">
          <h1 className="text-2xl font-bold">마이 페이지</h1>
        </header>

        <div className="flex gap-4 mt-4">
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
                style={{ transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)` }}
              />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              disabled
            />
          </div>
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
                readOnly
                className="w-full h-10 px-3 border bg-gray-100 rounded focus:outline-none text-gray-500"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">현재 비밀번호</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-10 px-3 border rounded focus:outline-none focus:border-black"
              />
            </div>
            <div className="relative w-full">
              <label className="font-bold block mb-1">새 비밀번호</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 pr-20 border rounded focus:outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 text-sm text-black flex items-center justify-center"
              >
                {showPassword ? '숨기기' : '보기'}
              </button>
            </div>
          </div>
        </div>

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
