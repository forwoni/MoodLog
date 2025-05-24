import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultProfile from '../assets/defaultProfile.png';

function MyPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('홍길동');
  const [email, setEmail] = useState('abcdef@gmail.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [profileImage, setProfileImage] = useState<string | null>(null); // 미리보기용
  const [profileFile, setProfileFile] = useState<File | null>(null); // 저장용

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setShowPopup(true);

    // 서버 전송 준비 (예시)
    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('email', email);
    formData.append('password', password);
    if (profileFile) {
      formData.append('profileImage', profileFile);
    }

    // 예시용 코드: 실제 전송은 axios.post('/api/update', formData)
  };

  const handleConfirm = () => {
    setShowPopup(false);
    navigate('/main');
  };

  const handleCancel = () => setShowPopup(false);

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setProfileFile(file);
    }
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
            <div className="w-24 h-24 rounded-full overflow-hidden border">
              <img
                src={profileImage || defaultProfile}
                alt="프로필"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={handleChangePhotoClick}
              className="text-sm border px-4 py-1 rounded mt-2"
            >
              사진 변경
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* 오른쪽: 입력 필드 */}
          <div className="w-1/2 space-y-3">
            {/* 닉네임 */}
            <div>
              <label className="font-bold block mb-1">닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full h-10 px-3 border rounded focus:outline-none focus:border-black"
              />
            </div>

            {/* 이메일 */}
            <div>
              <label className="font-bold block mb-1">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 border rounded focus:outline-none focus:border-black"
              />
            </div>

            {/* 비밀번호 */}
            <div className="relative w-full">
              <label className="font-bold block mb-1">비밀번호</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 pr-16 border rounded focus:outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-0 bottom-0 my-auto h-fit text-sm text-black"
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
            onClick={() => navigate('/main')}
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
//변경사항항



