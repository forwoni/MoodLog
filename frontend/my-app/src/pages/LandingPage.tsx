import { useNavigate } from 'react-router-dom';
import logo from '../assets/moodlog_logo_transparent.png';
import { Music, Heart, Sparkles } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-white via-purple-50 to-blue-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Background Text */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div 
            className="text-[400px] font-serif text-purple-600 select-none pointer-events-none whitespace-nowrap"
            style={{
              fontFamily: "'Playfair Display', serif",
              letterSpacing: '0.1em',
              transform: 'rotate(-12deg) translateY(-5%)',
              opacity: '0.04',
            }}
          >
            Mood
          </div>
        </div>
      </div>

      {/* Add Playfair Display font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital@1&display=swap');
        `}
      </style>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center max-w-2xl mx-auto">
          {/* Logo & Title Section */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <div className="absolute -inset-2 bg-white/40 rounded-full blur-lg"></div>
              <img
                src={logo}
                alt="Mood Log"
                className="w-20 h-20 relative"
              />
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-blue-700">
              나를 위한 음악으로<br />
              채워지는 특별한 순간
            </h1>

            {/* CTA Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="min-w-[120px] px-6 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transform hover:-translate-y-1 transition-all shadow-md text-base"
              >
                시작하기
              </button>
              <button
                onClick={() => navigate('/register')}
                className="min-w-[120px] px-6 py-2.5 bg-white/80 backdrop-blur-sm text-gray-700 rounded-lg font-semibold hover:bg-white transform hover:-translate-y-1 transition-all shadow-md border border-purple-100 text-base"
              >
                회원가입
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-purple-100 transform hover:-translate-y-1 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-800 mb-0.5">감정 기록</h3>
                  <p className="text-gray-600 text-sm">당신의 감정을 음악과 함께 기록하세요</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-purple-100 transform hover:-translate-y-1 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shrink-0">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-800 mb-0.5">음악 추천</h3>
                  <p className="text-gray-600 text-sm">AI가 당신의 감정에 맞는 음악을 추천해드려요</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-purple-100 transform hover:-translate-y-1 transition-all md:col-span-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-800 mb-0.5">특별한 순간</h3>
                  <p className="text-gray-600 text-sm">소중한 순간을 플레이리스트로 간직하세요</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
