// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HistoryPage from "./pages/HistoryPage";
import PlayListEditor from "./pages/PlayListEditor";
import PostPage from "./pages/PostPage";
import MainPage from "./pages/MainPage";
import MyPage from "./pages/MyPage";
import PopularPostsPage from "./pages/PopularPostsPage";
import PostDetail from "./pages/PostDetail";
import OtherUserHistoryPage from "./pages/OtherUserHistroyPage";
import UserPostDetailPage from "./pages/UserPostDetailPage";
import FollowManagementPage from "./pages/FollowManagementPage";

import { UserProvider } from "./contexts/UserContext"; // ✅ UserProvider 추가

function App() {
  return (
    <UserProvider>
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
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/otheruserhistory" element={<OtherUserHistoryPage />} />
          <Route path="/userpostdetail/:id" element={<UserPostDetailPage />} />
          <Route path="/followmanagement" element={<FollowManagementPage />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
