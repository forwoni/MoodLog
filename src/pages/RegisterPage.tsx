import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (pw !== pwCheck) {
      alert('❌ 비밀번호가 일치하지 않습니다.');
      return;
    }

    console.log({ id, pw });
    alert('✅ 회원가입 완료!');
    navigate('/login');
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-200 overflow-hidden">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-xl px-10 py-12">
        <h2 className="text-2xl font-extrabold text-gray-800 text-center mb-8">
          회원가입
        </h2>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* 아이디 */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              아이디
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded placeholder-gray-400 outline-none"
              placeholder="아이디"
              required
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded placeholder-gray-400 outline-none"
              placeholder="비밀번호"
              required
            />
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              비밀번호 확인
            </label>
            <input
              type="password"
              value={pwCheck}
              onChange={(e) => setPwCheck(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded placeholder-gray-400 outline-none"
              placeholder="비밀번호 확인"
              required
            />
          </div>

          {/* 가입 버튼 */}
          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition"
          >
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
