import axios from "axios";
import api from "./axiosInstance";

// 🔍 키워드 검색 (토큰 필요 X)
export const search = async (query: string) => {
  const res = await axios.get(`/api/search?query=${encodeURIComponent(query)}`);
  return res.data;
};

// 📝 검색 히스토리 조회 (토큰 필요 O)
export const getSearchHistories = async () => {
  const res = await api.get("/search/histories");
  return res.data;
};
