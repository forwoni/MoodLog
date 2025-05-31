import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HeaderBox } from '../layouts/headerBox';
import api from '../services/axiosInstance';
import { User, FileText, Heart, MessageCircle, Music, Calendar, Search, Users, Loader2 } from 'lucide-react';

interface SearchUser {
  id: number;
  username: string;
  profileImage?: string;
  isFollowing: boolean;
  followerCount: number;
  postCount: number;
}

interface SearchPost {
  id: number;
  title: string;
  content: string;
  authorName: string;
  authorProfileImage?: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  hasPlaylist: boolean;
}

interface SearchResult {
  users: SearchUser[];
  posts: SearchPost[];
  userCount: number;
  postCount: number;
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchType, setSearchType] = useState<'all' | 'users' | 'posts'>(
    (searchParams.get('type') as 'all' | 'users' | 'posts') || 'all'
  );
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [searchResult, setSearchResult] = useState<SearchResult>({
    users: [],
    posts: [],
    userCount: 0,
    postCount: 0
  });
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // URL 파라미터 업데이트
  useEffect(() => {
    if (debouncedQuery) {
      setSearchParams({ q: debouncedQuery, type: searchType });
    }
  }, [debouncedQuery, searchType]);

  // 검색 실행
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedQuery) {
        setSearchResult({ users: [], posts: [], userCount: 0, postCount: 0 });
        return;
      }

      try {
        setLoading(true);
        const response = await api.get<SearchResult>('/search', {
          params: {
            query: debouncedQuery,
            type: searchType
          }
        });
        setSearchResult(response.data);
      } catch (error) {
        console.error('검색 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery, searchType]);

  const handleFollowToggle = async (userId: number, isFollowing: boolean, username: string) => {
    try {
      if (isFollowing) {
        await api.delete('/social/unfollow', { data: { followingUsername: username } });
      } else {
        await api.post('/social/follow', { followingUsername: username });
      }
      // 검색 결과 새로고침
      const response = await api.get<SearchResult>('/search', {
        params: {
          query: debouncedQuery,
          type: searchType
        }
      });
      setSearchResult(response.data);
    } catch (error) {
      console.error('팔로우 상태 변경 실패:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-blue-50">
      <HeaderBox />
      
      <div className="max-w-[1200px] mx-auto px-6 pt-24">
        {/* 검색 헤더 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100 p-6 mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text mb-4">
            검색
          </h1>
          
          {/* 검색 입력 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50"
            />
          </div>

          {/* 검색 타입 선택 */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setSearchType('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                searchType === 'all'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'bg-white/50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Search size={18} />
              전체
            </button>
            <button
              onClick={() => setSearchType('users')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                searchType === 'users'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'bg-white/50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users size={18} />
              사용자 ({searchResult.userCount})
            </button>
            <button
              onClick={() => setSearchType('posts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                searchType === 'posts'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'bg-white/50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText size={18} />
              게시글 ({searchResult.postCount})
            </button>
          </div>
        </div>

        {/* 검색 결과 */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-purple-500" size={32} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* 사용자 결과 */}
            {(searchType === 'all' || searchType === 'users') && searchResult.users.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <Users size={20} className="text-purple-500" />
                  사용자 검색 결과
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResult.users.map((user) => (
                    <div
                      key={user.id}
                      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-purple-100 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/user/${user.username}/posts`)}>
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-white shadow-sm">
                            {user.profileImage ? (
                              <img src={user.profileImage} alt={user.username} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User size={24} className="text-purple-300" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{user.username}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>팔로워 {user.followerCount}</span>
                              <span>게시글 {user.postCount}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleFollowToggle(user.id, user.isFollowing, user.username)}
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            user.isFollowing
                              ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
                              : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                          }`}
                        >
                          {user.isFollowing ? '언팔로우' : '팔로우'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 게시글 결과 */}
            {(searchType === 'all' || searchType === 'posts') && searchResult.posts.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <FileText size={20} className="text-purple-500" />
                  게시글 검색 결과
                </h2>
                <div className="space-y-4">
                  {searchResult.posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-purple-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/postdetail/${post.id}`)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-white shadow-sm">
                          {post.authorProfileImage ? (
                            <img src={post.authorProfileImage} alt={post.authorName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User size={20} className="text-purple-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{post.authorName}</h3>
                          <div className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h4>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Heart size={16} />
                          {post.likeCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={16} />
                          {post.commentCount}
                        </span>
                        {post.hasPlaylist && (
                          <span className="flex items-center gap-1 text-purple-500">
                            <Music size={16} />
                            플레이리스트
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 검색 결과 없음 */}
            {!loading && query && searchResult.users.length === 0 && searchResult.posts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">검색 결과가 없습니다</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 