interface PlaylistTrack {
  trackName: string;
  artist: string;
  spotifyUrl: string;
}

interface PlaylistModalProps {
  onClose: () => void;
  tracks: PlaylistTrack[]; // ✅ 이 줄 추가
}

function PlaylistModal({ onClose, tracks }: PlaylistModalProps) {
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
          {tracks.map((track, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-gray-100 p-3 rounded"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-300 flex items-center justify-center text-sm">
                  🎵
                </div>
                <div>
                  <div className="text-sm font-semibold">{track.trackName}</div>
                  <div className="text-sm text-gray-500">{track.artist}</div>
                </div>
              </div>
              <a
                href={track.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                듣기
              </a>
            </div>
          ))}
        </div>

        {/* 페이지네이션 (필요 시 추가) */}
      </div>
    </div>
  );
}

export default PlaylistModal;
