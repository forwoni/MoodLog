import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// 타입 정의
interface ChartTrack {
  rank: number;
  title: string;
  artist: string;
  albumImage: string;
  trackId: string;
}

interface SpotifyTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface SpotifyPlaylistTracksResponse {
  items: SpotifyTrackItem[];
}

interface SpotifyTrackItem {
  track: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
      images: { url: string }[];
    };
  };
}

const spotifyService = {
  getToken: async (): Promise<string> => {
    try {
      const { data } = await axios.get<SpotifyTokenResponse>('/api/spotify/token');
      return data.access_token;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else if (typeof error === "string") {
        throw new Error(error);
      } else {
        throw new Error("토큰 발급 실패(알 수 없는 오류)");
      }
    }
  },

  getKoreaTop50: async (token: string): Promise<ChartTrack[]> => {
    try {
      const { data } = await axios.get<SpotifyPlaylistTracksResponse>(
        'https://api.spotify.com/v1/playlists/37i9dQZEVXbJZyENOWUFo7/tracks?limit=4',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return data.items.map((item: SpotifyTrackItem, index: number) => ({
        rank: index + 1,
        title: item.track.name,
        artist: item.track.artists.map((a) => a.name).join(', '),
        albumImage: item.track.album.images[1]?.url || '/default-album.png',
        trackId: item.track.id
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else if (typeof error === "string") {
        throw new Error(error);
      } else {
        throw new Error("차트 데이터 조회 실패(알 수 없는 오류)");
      }
    }
  }
};

export default function OptimizedSpotifyChart() {
  const [tracks, setTracks] = useState<ChartTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortController = useRef(new AbortController());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await spotifyService.getToken();
        const chartData = await spotifyService.getKoreaTop50(token);
        setTracks(chartData);
        setLoading(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else if (typeof error === "string") {
          setError(error);
        } else {
          setError("알 수 없는 오류");
        }
        setLoading(false);
      }
    };

    fetchData();

    return () => abortController.current.abort();
  }, []);

  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await spotifyService.getToken();
      const chartData = await spotifyService.getKoreaTop50(token);
      setTracks(chartData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === "string") {
        setError(error);
      } else {
        setError("재시도 실패(알 수 없는 오류)");
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="w-[325px] h-[440px] bg-white rounded-lg border border-gray-200 flex items-center justify-center">
        <div className="text-gray-400">차트 로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[325px] h-[440px] bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center">
        <div className="text-red-400 mb-2">오류: {error}</div>
        <button onClick={handleRetry} className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200">
          재시도
        </button>
      </div>
    );
  }

  return (
    <div className="w-[325px] h-[440px] bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      {/* 헤더 */}
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-gray-800 rounded mr-3 flex items-center justify-center">
          <span className="text-white text-sm">♪</span>
        </div>
        <h2 className="text-lg font-bold text-gray-800">실시간 노래차트</h2>
      </div>

      {/* 차트 리스트 */}
      <div className="border border-gray-200 rounded-lg p-3">
        <div className="space-y-3">
          {tracks.map((track) => (
            <div 
              key={track.trackId}
              className="flex items-center p-2 hover:bg-gray-50 rounded transition-colors"
            >
              {/* 순위 */}
              <div className="w-8 text-center">
                <span className="text-lg font-bold text-gray-700">{track.rank}</span>
              </div>

              {/* 앨범 커버 */}
              <div className="w-[60px] h-[60px] bg-gray-200 rounded-md mr-3 overflow-hidden">
                <img 
                  src={track.albumImage} 
                  alt={track.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default-album.png';
                  }}
                />
              </div>

              {/* 곡 정보 */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm truncate mb-1">
                  {track.title}
                </h3>
                <p className="text-gray-500 text-xs truncate">
                  {track.artist}
                </p>
              </div>

              {/* 재생 버튼 */}
              <button 
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors ml-2"
                onClick={() => console.log(`재생: ${track.title}`)}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path 
                    d="M2 1.5L10 6L2 10.5V1.5Z" 
                    fill="#374151"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
