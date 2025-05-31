import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { HeaderBox } from "../layouts/headerBox";
import SearchBox from "../components/SearchBox";

interface SearchResult {
  posts: Array<{ id: number; title: string; content: string; authorName: string; createdAt: string; }>;
  users: Array<{ id: number; username: string; email: string; }>;
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) return;
      setIsLoading(true);
      try {
        const { data } = await axios.get<SearchResult>("/api/search", {
          params: { query }
        });
        setResults(data);
      } catch (error) {
        console.error("검색 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  // 사용자 프로필로 이동
  const handleUserClick = (username: string) => {
    navigate(`/user/${username}/posts`);
  };

  // 게시글 상세 페이지로 이동
  const handlePostClick = (postId: number) => {
    navigate(`/postdetail/${postId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9f9]">
      <HeaderBox />
      
      <main className="max-w-[1440px] w-full mx-auto px-8 mt-[102px]">
        <SearchBox />
        
        <div className="mt-8">
          {isLoading ? (
            <div className="text-center text-gray-600">검색 중...</div>
          ) : !results ? (
            <div className="text-center text-gray-600">검색어를 입력하세요</div>
          ) : (
            <div className="space-y-8">
              {/* 사용자 검색 결과 */}
              <section>
                <h2 className="text-xl font-bold mb-4">사용자 검색 결과</h2>
                {results.users.length === 0 ? (
                  <p className="text-gray-500">검색된 사용자가 없습니다.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {results.users.map(user => (
                      <div
                        key={user.id}
                        className="p-4 bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer"
                        onClick={() => handleUserClick(user.username)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleUserClick(user.username);
                          }
                        }}
                      >
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* 게시글 검색 결과 */}
              <section>
                <h2 className="text-xl font-bold mb-4">게시글 검색 결과</h2>
                {results.posts.length === 0 ? (
                  <p className="text-gray-500">검색된 게시글이 없습니다.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {results.posts.map(post => (
                      <div
                        key={post.id}
                        className="p-4 bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer"
                        onClick={() => handlePostClick(post.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handlePostClick(post.id);
                          }
                        }}
                      >
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        <p className="text-gray-600 mt-2">{post.content}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          <span>{post.authorName}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 