import { useEffect, useState } from 'react';
import api from '../services/axiosInstance';
import { Music2 } from 'lucide-react';

interface Track {
  title: string;
  artist: string;
  albumImageUrl: string;
  spotifyId: string;
  likes: number;
}

export default function PopularChart() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const response = await api.get('/api/spotify/chart/popular');
      setTracks(response.data);
    } catch (error) {
      console.error('차트 데이터 불러오기 실패', error);
      setError('차트 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      <div className="text-center text-red-500 p-4 rounded-lg bg-red-50">
        <Music2 className="w-8 h-8 mx-auto mb-2 text-red-400" />
        {error}
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4 rounded-lg bg-gray-50">
        <Music2 className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        현재 인기 차트 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {tracks.map((track) => (
        <div
          key={track.spotifyId}
          onClick={() => window.open(`https://open.spotify.com/track/${track.spotifyId}`, '_blank')}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group"
        >
          <div className="aspect-square overflow-hidden">
            <img
              src={track.albumImageUrl}
              alt={track.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1 truncate">{track.title}</h3>
            <p className="text-gray-600 truncate">{track.artist}</p>
            <div className="mt-2 flex items-center gap-2 text-purple-600">
              <Music2 className="w-4 h-4" />
              <span className="text-sm">인기도: {track.likes}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
