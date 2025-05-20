import { useNavigate } from 'react-router-dom';
import logo from '../assets/moodlog_logo_transparent.png';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-white to-pink-100 overflow-hidden">
      <div className="w-[1440px] h-[1024px] flex flex-col items-center justify-center text-center space-y-6">
        <img
          src={logo}
          alt="Mood Log"
          className="w-60 h-auto mb-2"
        />

        <p className="text-base font-medium text-blue-900">
          ‘나를 위한 음악으로 채워지는 특별한 다이어리’
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-black border border-gray-300 shadow-md px-6 py-2 rounded-lg font-semibold hover:bg-gray-100"
          >
            로그인
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-gray-500 text-white shadow-md px-6 py-2 rounded-lg font-semibold hover:bg-gray-600"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
