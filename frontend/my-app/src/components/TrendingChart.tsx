import React, { useState, useEffect } from "react";
import api from "../services/axiosInstance";
import { ChevronLeft, ChevronRight, TrendingUp, BarChart3 } from "lucide-react";

interface TrendingPost {
  id: number;
  title: string;
  likeCount: number;
  viewCount: number;
  authorName: string;
}

export function TrendingChart() {
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchTrendingPosts = async (pageNum: number) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await api.get(`/spotify/chart/popular?page=${pageNum - 1}&size=5`);
      setTrendingPosts(response.data.content);
    } catch (error) {
      console.error("트렌딩 포스트 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingPosts(page);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-purple-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
              실시간 급상승
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-500 animate-pulse" />
          </div>
        </div>

        {/* 로딩 애니메이션 */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div key={index} className="flex items-center gap-4 animate-pulse">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-transparent">{index + 1}</span>
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-purple-100 rounded w-3/4"></div>
                <div className="flex gap-3">
                  <div className="h-3 bg-purple-100 rounded w-20"></div>
                  <div className="h-3 bg-purple-100 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled
            className="w-8 h-8 rounded-lg bg-white border border-purple-200 text-purple-300"
          >
            <ChevronLeft size={16} className="mx-auto" />
          </button>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                disabled
                className={`w-8 h-8 rounded-lg ${
                  num === page
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-white border border-purple-200 text-purple-300"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <button
            disabled
            className="w-8 h-8 rounded-lg bg-white border border-purple-200 text-purple-300"
          >
            <ChevronRight size={16} className="mx-auto" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-purple-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
            실시간 급상승
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-500" />
        </div>
      </div>

      <div className="space-y-4">
        {trendingPosts.map((post, index) => (
          <div key={post.id} className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">{index + 1}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-gray-800 font-medium mb-1 line-clamp-1">
                {post.title}
              </h3>
              <div className="flex gap-3 text-sm text-gray-500">
                <span>{post.authorName}</span>
                <span>조회 {post.viewCount}</span>
                <span>좋아요 {post.likeCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="w-8 h-8 rounded-lg bg-white border border-purple-200 text-purple-600 disabled:text-purple-300 hover:bg-purple-50 transition-colors"
        >
          <ChevronLeft size={16} className="mx-auto" />
        </button>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              className={`w-8 h-8 rounded-lg transition-all ${
                num === page
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "bg-white border border-purple-200 text-gray-600 hover:bg-purple-50"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        <button
          onClick={() => handlePageChange(Math.min(4, page + 1))}
          disabled={page === 4}
          className="w-8 h-8 rounded-lg bg-white border border-purple-200 text-purple-600 disabled:text-purple-300 hover:bg-purple-50 transition-colors"
        >
          <ChevronRight size={16} className="mx-auto" />
        </button>
      </div>
    </div>
  );
} 