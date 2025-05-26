import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HistoryPage from './pages/HistoryPage';
import PlayListEditor from './pages/PlayListEditor';
import PostPage from './pages/PostPage';
import MainPage from './pages/MainPage';
import MyPage from './pages/MyPage';
import PopularPostsPage from './pages/PopularPostsPage';

// ✅ 새로 추가
import PostDetail from './pages/PostDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/playlistEditor" element={<PlayListEditor />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/popular" element={<PopularPostsPage />} />

        {/* ✅ 게시글 열람 페이지 라우트 추가 */}
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
