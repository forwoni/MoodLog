import { useState } from 'react';

function RegisterPage() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (pw !== pwCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    console.log({ id, pw });
    alert('회원가입 완료!');
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-300 overflow-hidden">
      <div className="w-[1440px] h-[1024px] flex items-center justify-center">
        <form
          onSubmit={handleRegister}
          className="w-[400px] bg-white rounded-2xl shadow-md px-10 py-12"
        >
          {/* 제목 */}
          <h2 className="text-2xl font-extrabold text-black mb-8">회원가입</h2>

          {/* 아이디 */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">아이디</label>
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
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">비밀번호</label>
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
          <div className="mb-8">
            <label className="block mb-1 text-sm font-medium text-gray-700">비밀번호 확인</label>
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
            className="w-full py-3 bg-black text-white rounded font-semibold hover:bg-gray-800 transition"
          >
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;

//테스트용 주석입니다.