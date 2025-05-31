// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HistoryPage from "./pages/HistoryPage";
import PlayListEditor from "./pages/PlayListEditor";
import PostPage from "./pages/PostPage";
import MainPage from "./pages/MainPage";
import PopularPostsPage from "./pages/PopularPostsPage";
import PostDetail from "./pages/PostDetail";
import PostEditPage from "./pages/PostEditPage";
import OtherUserHistoryPage from "./pages/OtherUserHistoryPage";
import FollowManagementPage from "./pages/FollowManagementPage";
import SearchPage from "./pages/SearchPage";
import { UserProvider } from "./contexts/UserContext"; 

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
          <Route path="/popular" element={<PopularPostsPage />} />
          <Route path="/postdetail/:id" element={<PostDetail />} />
          <Route path="/edit/:id" element={<PostEditPage />} />
          <Route path="/user/:username/posts" element={<OtherUserHistoryPage />} />
          <Route path="/followmanagement" element={<FollowManagementPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
