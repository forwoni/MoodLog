import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HistoryPage from './pages/HistoryPage';
import PlayListEditor from "./pages/PlayListEditor";
import PostPage from "./pages/PostPage";
import MainPage from './pages/MainPage';
import OtherUserHistoryPage from './pages/OtherUserHistroyPage';

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
        <Route path='/main' element={<MainPage/>}/>
        <Route path='/otheruserhistory' element={<OtherUserHistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
