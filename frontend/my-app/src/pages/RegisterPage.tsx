import { useState } from 'react';
import axios from 'axios';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 회원가입
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !email || !pw || !pwCheck) {
      setError('모든 항목을 입력해 주세요.');
      return;
    }
    if (pw !== pwCheck) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8081/api/auth/signup', {
        username,
        email,
        password: pw,
      });
      if (res.status === 201) {
        setSuccess('회원가입이 완료되었습니다! 로그인 페이지로 이동해 주세요.');
        setUsername('');
        setEmail('');
        setPw('');
        setPwCheck('');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response && err.response.status === 400) {
        setError(
          (err.response.data as string) ||
            '유효성 검사 실패: 이메일/아이디 중복 또는 형식 오류'
        );
      } else {
        setError('회원가입 중 오류가 발생했습니다.');
      }
    }
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

          {/* 에러/성공 메시지 */}
          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          {success && <div className="mb-4 text-green-600 text-center">{success}</div>}

          {/* 아이디 */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">아이디</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded placeholder-gray-400 outline-none"
              placeholder="아이디"
              required
            />
          </div>

          {/* 이메일 */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded placeholder-gray-400 outline-none"
              placeholder="이메일"
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
