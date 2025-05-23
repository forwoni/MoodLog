import { useState } from 'react';
import logo from '../assets/moodlog_logo_transparent.png';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
    alert('로그인 시도!');
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-200 overflow-hidden">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-xl px-10 py-12">
        <div className="flex flex-col items-center mb-10">
          <img src={logo} alt="Mood Log" className="w-24 h-auto mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">로그인</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded outline-none placeholder-gray-400"
            required
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded outline-none placeholder-gray-400"
            required
          />

          <button
            type="submit"
            className="w-full py-3 border-2 border-black rounded-full font-bold text-black bg-white hover:bg-gray-100 transition duration-200"
          >
            로그인
          </button>

          <div className="flex items-center justify-between text-sm text-gray-700 mt-4">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              아이디 저장
            </label>
            <span
              onClick={() => navigate('/register')}
              className="hover:underline font-medium cursor-pointer"
            >
              회원가입
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
