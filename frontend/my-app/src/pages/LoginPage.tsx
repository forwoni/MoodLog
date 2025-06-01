import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/services/authService";
import logo from "../assets/moodlog_logo_transparent.png";
import { Mail, Lock, Loader2, Music, Heart } from "lucide-react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 아이디 저장 기능: 컴포넌트 마운트 시 email 자동 입력
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const data = await login({ email, password });

      setSuccess("로그인 성공!");
      // 토큰 저장
      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("refresh_token", data.refreshToken);

      // 아이디 저장 기능 (rememberMe)
      if (rememberMe) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
      }

      // 로그인 성공 시 메인페이지로 이동
      navigate("/main");
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setError("로그인 중 오류가 발생했습니다.");
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
        <div className="absolute w-20 h-20 top-1/4 left-1/4 text-purple-200 opacity-30 animate-float-slow">
          <Music size={80} />
        </div>
        <div className="absolute w-16 h-16 top-2/3 right-1/3 text-blue-200 opacity-20 animate-float-slower">
          <Music size={64} />
        </div>
        <div className="absolute w-12 h-12 bottom-1/4 right-1/4 text-purple-200 opacity-25 animate-float">
          <Music size={48} />
        </div>

        {/* Hearts */}
        <div className="absolute w-16 h-16 top-1/3 right-1/4 text-pink-200 opacity-20 animate-float-slow">
          <Heart size={64} />
        </div>
        <div className="absolute w-12 h-12 bottom-1/3 left-1/3 text-pink-200 opacity-25 animate-float-slower">
          <Heart size={48} />
        </div>

        {/* Gradient Blobs */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
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
              Welcome Back!
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

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="이메일 주소"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-purple-100 rounded-xl outline-none placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-shadow"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 border-2 border-purple-200 rounded appearance-none checked:bg-purple-500 checked:border-purple-500 transition-colors"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 check-icon group-hover:opacity-100 transition-opacity">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>
                <span className="text-gray-600 group-hover:text-gray-900 transition-colors">아이디 저장</span>
              </label>
              <a href="/register" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                회원가입
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  <span>로그인 중...</span>
                </div>
              ) : (
                "로그인"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
