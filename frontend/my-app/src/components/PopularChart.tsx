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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const res = await axios.get('/api/spotify/charts');
      setTracks(res.data);
    } catch (error) {
      console.error('차트 데이터 불러오기 실패', error);
      setError('차트 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // 5분마다 데이터 갱신
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">{error}</div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center text-gray-500">차트 데이터가 없습니다.</div>
    );
  }

  return (
    <div className="space-y-4">
      {tracks.map((track) => (
        <div
          key={track.trackId}
          className="flex items-center gap-4 w-full min-w-0 py-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <span className="w-8 text-xl font-semibold shrink-0">{track.rankNum}</span>
          <img
            src={track.imageUrl}
            alt={track.title}
            className="w-14 h-14 rounded-md shrink-0 object-cover"
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
      ))}
    </div>
  );
}
