import { useEffect, useState } from 'react';
import axios from 'axios';

interface Track {
  trackId: string;
  title: string;
  artist: string;
  externalUrl: string;
  imageUrl: string;
  rankNum: number;
}

export default function PopularChart() {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/spotify/charts'); // ✅ 서버에서 차트 데이터 가져오기
        setTracks(res.data);
      } catch (error) {
        console.error('차트 데이터 불러오기 실패', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-4">
      {tracks.length === 0 ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        tracks.map((track) => (
          <div
            key={track.trackId}
            className="flex items-center gap-4 w-full min-w-0 py-2"
          >
            <span className="w-8 text-xl font-semibold shrink-0">{track.rankNum}</span>
            <img
              src={track.imageUrl}
              alt={track.title}
              className="w-14 h-14 rounded-md shrink-0"
            />
            <div className="flex flex-col text-lg flex-grow min-w-0">
              <a
                href={track.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium truncate hover:underline"
              >
                {track.title}
              </a>
              <span className="text-gray-500 truncate">{track.artist}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
