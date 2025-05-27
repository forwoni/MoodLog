import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Clock } from "lucide-react";
import api from "../services/axiosInstance";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

// 타입 정의
interface SearchHistory {
  keyword: string;
  searchedAt: string;
}

interface SearchResult {
  posts: Array<{ id: number; title: string; content: string; authorName: string; createdAt: string; }>;
  users: Array<{ id: number; username: string; email: string; }>;
}

interface Suggestion {
  keyword: string;
}

interface SearchBoxProps {
  className?: string;
  placeholder?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  className = "relative w-[1200px]",
  placeholder = "검색어를 입력하세요"
}) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useUser();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 디바운스: 입력 후 300ms 후에 연관검색어/검색 실행
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // 연관검색어 불러오기 (입력 중에만)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        // 연관검색어 API가 있다고 가정
        const { data } = await api.get<{ suggestions: Suggestion[] }>("/suggest", {
          params: { query: debouncedQuery }
        });
        setSuggestions(data.suggestions || []);
      } catch {
        setSuggestions([]);
      }
    };
    if (debouncedQuery) fetchSuggestions();
    else setSuggestions([]);
  }, [debouncedQuery]);

  // 검색 기록 불러오기 (드롭다운 열릴 때만)
  const fetchSearchHistory = useCallback(async () => {
    if (!currentUser) return;
    try {
      const { data } = await api.get<SearchHistory[]>("/search/histories");
      setSearchHistory(data.slice(0, 8));
    } catch { /* 무시 */ }
  }, [currentUser]);

  // 검색 실행 (검색 기록 저장/조회는 여기서만)
  const executeSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) return;
      setIsLoading(true);
      try {
        const { data } = await api.get<SearchResult>("/search", {
          params: { query: searchQuery }
        });
        setSearchResults(data);
        if (currentUser) await fetchSearchHistory();
      } finally {
        setIsLoading(false);
      }
    },
    [currentUser, fetchSearchHistory]
  );

  // 디바운스된 쿼리로 자동 검색 결과(미리보기)도 가능
  useEffect(() => {
    if (debouncedQuery) {
      executeSearch(debouncedQuery);
    } else {
      setSearchResults(null);
    }
  }, [debouncedQuery, executeSearch]);

  // 드롭다운 열릴 때만 기록 조회
  useEffect(() => {
    if (showDropdown && currentUser) {
      fetchSearchHistory();
    }
  }, [showDropdown, currentUser, fetchSearchHistory]);

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;
    const totalItems =
      searchHistory.length +
      suggestions.length +
      (searchResults?.posts.length || 0) +
      (searchResults?.users.length || 0);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < totalItems - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : totalItems - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleItemClick(selectedIndex);
        } else if (query.trim()) {
          handleSearch();
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // 아이템 클릭 처리 (검색 기록, 연관검색어, 결과)
  const handleItemClick = (index: number) => {
    let clickedItem: string | undefined;
    if (index < searchHistory.length) {
      clickedItem = searchHistory[index].keyword;
    } else if (index < searchHistory.length + suggestions.length) {
      clickedItem = suggestions[index - searchHistory.length].keyword;
    } else {
      // 결과 클릭은 아래에서 처리
      return;
    }
    setQuery(clickedItem);
    setShowDropdown(false);
    executeSearch(clickedItem);
    navigate(`/search?q=${encodeURIComponent(clickedItem)}`);
  };

  // 검색 실행 (Enter, 버튼, 검색 기록/연관검색어 클릭)
  const handleSearch = () => {
    if (query.trim()) {
      executeSearch(query);
      setShowDropdown(false);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 검색 기록 삭제
  const deleteHistoryItem = async (keyword: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchHistory((prev) => prev.filter((item) => item.keyword !== keyword));
    // 실제 삭제 API가 있다면 여기에 호출
  };

  return (
    <div className={className} ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          className="w-full px-24 py-6 pr-16 rounded-full outline-none text-2xl bg-white placeholder-gray-400 shadow focus:ring-2 focus:ring-blue-500"
        />
        <Search
          className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          size={28}
          onClick={handleSearch}
        />
        {query && (
          <X
            className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-700"
            size={28}
            onClick={() => {
              setQuery("");
              setSearchResults(null);
              setSuggestions([]);
              inputRef.current?.focus();
            }}
          />
        )}
      </div>
      {showDropdown && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
          {isLoading && (
            <div className="p-4 text-center text-gray-500">검색 중...</div>
          )}
          {/* 검색 기록 */}
          {!query && searchHistory.length > 0 && (
            <div className="border-b border-gray-100">
              <div className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50">
                최근 검색어
              </div>
              {searchHistory.map((item, index) => (
                <div
                  key={`history-${index}`}
                  className={`px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-gray-50 ${
                    selectedIndex === index ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleItemClick(index)}
                >
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-700">{item.keyword}</span>
                  </div>
                  <X
                    size={16}
                    className="text-gray-400 hover:text-gray-600"
                    onClick={(e) => deleteHistoryItem(item.keyword, e)}
                  />
                </div>
              ))}
            </div>
          )}
          {/* 연관검색어(자동완성) */}
          {query && suggestions.length > 0 && (
            <div className="border-b border-gray-100">
              <div className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50">
                연관검색어
              </div>
              {suggestions.map((item, index) => (
                <div
                  key={`suggestion-${index}`}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                    selectedIndex === searchHistory.length + index
                      ? "bg-blue-50"
                      : ""
                  }`}
                  onClick={() => handleItemClick(searchHistory.length + index)}
                >
                  <span className="text-gray-700">{item.keyword}</span>
                </div>
              ))}
            </div>
          )}
          {/* 검색 결과 미리보기 */}
          {query && searchResults && (
            <>
              {searchResults.posts.length > 0 && (
                <div className="border-b border-gray-100">
                  <div className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50">
                    게시글
                  </div>
                  {searchResults.posts.slice(0, 3).map((post, index) => (
                    <div
                      key={`post-${post.id}`}
                      className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                        selectedIndex ===
                        searchHistory.length + suggestions.length + index
                          ? "bg-blue-50"
                          : ""
                      }`}
                      onClick={() => navigate(`/userpostdetail/${post.id}`)}
                    >
                      <div className="font-medium text-gray-900 truncate">
                        {post.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {post.authorName}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {searchResults.users.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50">
                    사용자
                  </div>
                  {searchResults.users.slice(0, 3).map((user, index) => (
                    <div
                      key={`user-${user.id}`}
                      className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                        selectedIndex ===
                        searchHistory.length +
                          suggestions.length +
                          searchResults.posts.length +
                          index
                          ? "bg-blue-50"
                          : ""
                      }`}
                      onClick={() => navigate(`/profile/${user.username}`)}
                    >
                      <div className="font-medium text-gray-900">
                        @{user.username}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {/* 검색 결과 없음 */}
          {query &&
            searchResults &&
            searchResults.posts.length === 0 &&
            searchResults.users.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                검색 결과가 없습니다.
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
