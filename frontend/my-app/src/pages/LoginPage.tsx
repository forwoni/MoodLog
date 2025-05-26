import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // 아이디 저장 기능: 컴포넌트 마운트 시 email 자동 입력
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('http://localhost:8081/api/auth/login', {
        email,
        password,
      });

      if (res.status === 200) {
        setSuccess('로그인 성공!');
        // 토큰 저장 (예시: localStorage)
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);

        // 아이디 저장 기능 (rememberMe)
        if (rememberMe) {
          localStorage.setItem('savedEmail', email);
        } else {
          localStorage.removeItem('savedEmail');
        }

        // 로그인 성공 시 메인페이지로 이동 (예: '/')
        navigate('/main');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setError('로그인 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-300 overflow-hidden">
      <div className="w-[1440px] h-[1024px] flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="w-[400px] bg-white rounded-2xl shadow-md px-10 py-12"
        >
          {/* 타이틀 */}
          <h2 className="text-3xl font-extrabold text-black text-center mb-10">
            Mood Log
          </h2>

          {/* 에러/성공 메시지 */}
          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          {success && <div className="mb-4 text-green-600 text-center">{success}</div>}

          {/* 이메일 */}
          <input
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded outline-none placeholder-gray-400"
            required
          />

          {/* 비밀번호 */}
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded outline-none placeholder-gray-400"
            required
          />

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full py-3 border-2 border-black rounded-full font-bold text-black bg-white hover:bg-gray-100 transition"
          >
            로그인
          </button>

          {/* 하단 옵션 */}
          <div className="flex justify-between items-center text-sm text-black mt-6">
            <label>
              <input
                type="checkbox"
                className="mr-1"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              아이디 저장
            </label>
            <a href="/register" className="hover:underline font-medium">
              회원가입
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
