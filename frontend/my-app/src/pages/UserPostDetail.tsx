import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import logoImg from '../assets/moodlog_logo_transparent.png';

function UserPostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement | null>(null);

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(''); // ← 에러 메시지 상태 추가

  const songsPerPage = 5;
  const pagedSongs = post?.songs?.slice((currentPage - 1) * songsPerPage, currentPage * songsPerPage) || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setPlaylistOpen(false);
      }
    };
    if (playlistOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [playlistOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/posts/${id}`);
        setPost(res.data);
        setComments(res.data.comments || []);
        setError('');
      } catch (err: any) {
        console.error('데이터 불러오기 실패:', err);
        setError('게시글이 존재하지 않습니다.');
      }
    };
    fetchData();
  }, [id]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-xl text-red-500">
        <img src={logoImg} alt="logo" className="w-36 mb-4 cursor-pointer" onClick={() => navigate('/main')} />
        <p>{error}</p>
      </div>
    );
  }

  if (!post) return <div className="text-center mt-10 text-lg">로딩 중...</div>;

  return (
    <div className="min-h-[2048px] w-[1440px] mx-auto bg-white overflow-y-auto scrollbar-hide">
      {/* 로고 */}
      <div className="border-b border-gray-300 p-4">
        <img src={logoImg} alt="Mood Logo" className="w-24 cursor-pointer" onClick={() => navigate('/main')} />
      </div>

      <div className="border-b border-gray-300"></div>

      <div className="max-w-4xl mx-auto bg-white mt-6 p-10 rounded-lg shadow border border-black">
        {/* 제목 */}
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <div className="border-b border-gray-300 mb-6"></div>

        {/* 본문 */}
        <div className="text-black whitespace-pre-line leading-relaxed mb-10 min-h-[500px]">
          {post.content}
        </div>

        <div className="border-b border-gray-300 mb-6"></div>

        {/* 플레이리스트 카드 */}
        <div className="flex gap-4 mb-8">
          {[1, 2].map((_, idx) => (
            <div
              key={idx}
              onClick={() => setPlaylistOpen(true)}
              className="w-1/2 bg-white hover:bg-gray-100 rounded-lg p-4 cursor-pointer shadow border border-gray-200"
            >
              <div className="h-32 bg-gray-200 rounded mb-2 flex items-center justify-center text-sm text-gray-600">
                노래 이미지
              </div>
              <p className="text-sm text-black">이미지 노래 제목</p>
              <p className="font-semibold text-black">플레이 리스트 이름</p>
              <p className="text-sm mt-1">🎵</p>
            </div>
          ))}
        </div>

        <div className="border-b border-gray-300 mb-6"></div>

        {/* 댓글 */}
        <div className="text-sm text-gray-600 mb-4">
          ❤️ {post.likeCount} · 💬 댓글 {comments.length}
        </div>

        <div>
          <textarea
            rows={3}
            placeholder="댓글을 입력하세요"
            className="w-full border rounded-md p-3 text-sm"
          />
          <button className="mt-2 px-4 py-2 bg-black text-white rounded">등록</button>
        </div>
      </div>

      {/* 플레이리스트 모달 */}
      {playlistOpen && (
        <div className="absolute top-0 left-0 w-full flex justify-center z-50 mt-20">
          <div
            ref={modalRef}
            className="bg-white rounded-lg w-[420px] max-h-[80vh] overflow-y-auto p-6 shadow-lg relative"
          >
            <button
              onClick={() => setPlaylistOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <div className="space-y-4 mt-4">
              {pagedSongs.map((song: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between bg-gray-100 p-3 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                      노래 이미지
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{song.title}</div>
                      <div className="text-xs text-gray-500">🎵 {song.artist}</div>
                    </div>
                  </div>
                  <button className="text-lg text-gray-500 hover:text-black">✕</button>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-center mt-6 text-sm space-x-2">
              {[...Array(Math.ceil((post.songs?.length || 0) / songsPerPage))].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-2 py-1 rounded hover:underline ${currentPage === i + 1 ? 'font-bold underline' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
              <span className="ml-2">다음 &gt;</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPostDetailPage;
