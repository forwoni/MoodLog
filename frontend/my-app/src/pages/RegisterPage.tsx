import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "../assets/moodlog_logo_transparent.png";
import { User, Mail, Lock, Loader2, ArrowLeft, Music, Heart } from "lucide-react";

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 회원가입
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!username || !email || !pw || !pwCheck) {
      setError('모든 항목을 입력해 주세요.');
      setIsLoading(false);
      return;
    }
    if (pw !== pwCheck) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post('/api/auth/signup', {
        username,
        email,
        password: pw,
      });
      if (res.status === 201) {
        setSuccess('회원가입이 완료되었습니다!');
        setUsername('');
        setEmail('');
        setPw('');
        setPwCheck('');

        // 1초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response && err.response.status === 400) {
        setError(
          (err.response.data as string) ||
            '유효성 검사 실패: 닉네임/이메일 중복 또는 형식 오류'
        );
      } else {
        setError('회원가입 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-white via-purple-50 to-blue-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Music Notes */}
        <div className="absolute w-20 h-20 top-1/3 right-1/4 text-purple-200 opacity-30 animate-float-slow">
          <Music size={80} />
        </div>
        <div className="absolute w-16 h-16 bottom-1/3 left-1/3 text-blue-200 opacity-20 animate-float-slower">
          <Music size={64} />
        </div>
        <div className="absolute w-12 h-12 top-1/4 left-1/4 text-purple-200 opacity-25 animate-float">
          <Music size={48} />
        </div>

        {/* Hearts */}
        <div className="absolute w-16 h-16 bottom-1/4 right-1/3 text-pink-200 opacity-20 animate-float-slow">
          <Heart size={64} />
        </div>
        <div className="absolute w-12 h-12 top-1/3 left-1/4 text-pink-200 opacity-25 animate-float-slower">
          <Heart size={48} />
        </div>

        {/* Gradient Blobs */}
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/4 right-1/2 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md px-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-purple-100">
          <div className="flex flex-col items-center mb-8">
            <img
              src={logo}
              alt="Mood Log"
              className="h-20 mb-4 hover:scale-105 transition-transform"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
              Create Account
            </h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-center text-sm animate-in fade-in slide-in-from-top-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl text-green-600 text-center text-sm animate-in fade-in slide-in-from-top-4">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="닉네임"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-purple-100 rounded-xl outline-none placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-shadow"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-purple-100 rounded-xl outline-none placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-shadow"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-purple-100 rounded-xl outline-none placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-shadow"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  placeholder="비밀번호 확인"
                  value={pwCheck}
                  onChange={(e) => setPwCheck(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-purple-100 rounded-xl outline-none placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-shadow"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    <span>가입 중...</span>
                  </div>
                ) : (
                  "가입하기"
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="flex items-center justify-center gap-2 w-full py-3 border border-purple-100 text-gray-600 rounded-xl font-medium hover:bg-purple-50 transition-colors"
              >
                <ArrowLeft size={20} />
                로그인으로 돌아가기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
