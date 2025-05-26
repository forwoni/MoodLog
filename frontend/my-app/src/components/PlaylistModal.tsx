interface PlaylistModalProps {
  onClose: () => void;
}

function PlaylistModal({ onClose }: PlaylistModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-[400px] max-h-[80vh] overflow-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl font-bold"
        >
          ✕
        </button>

        {/* 플레이리스트 아이템들 */}
        <div className="space-y-4 mt-4">
          {[...Array(7)].map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-gray-100 p-3 rounded"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-300 flex items-center justify-center text-sm">
                  노래 이미지
                </div>
                <div>
                  <div className="text-sm font-semibold">노래 제목</div>
                  <div className="text-sm text-gray-500">🎵 아티스트 명</div>
                </div>
              </div>
              <button className="text-xl text-gray-600 hover:text-black">✕</button>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-6 space-x-2 text-sm">
          {Array.from({ length: 10 }).map((_, i) => (
            <button key={i} className="px-2 py-1 rounded hover:underline">
              {i + 1}
            </button>
          ))}
          <span>다음 &gt;</span>
        </div>
      </div>
    </div>
  );
}

export default PlaylistModal;
