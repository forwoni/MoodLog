// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import BotAngleBracket from "../assets/BotAngleBracket.svg";
// import { useUser } from "../contexts/UserContext"; // ✅ 실제 경로 확인 필요
// import { PostCard } from "./PostCard"; // ✅ 실제 존재하는지 확인 필요

// interface Post {
//   id: number;
//   title: string;
//   content: string;
//   createdAt: string;
//   authorUsername: string;
//   viewCount: number;
//   likeCount: number;
//   commentCount: number;
// }

// interface HistoryBoxProps {
//   posts?: Post[]; // props 사용 시 고려 (선택적)
// }

// export const HistoryBox = ({ posts }: HistoryBoxProps): React.JSX.Element => {
//   const { currentUser } = useUser();
//   const [allPosts, setAllPosts] = useState<Post[]>(posts || []);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [sort, setSort] = useState<"recent" | "likes" | "comments">("recent");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const paginatedPosts = useMemo(() => {
//     const sorted = [...allPosts].sort((a, b) => {
//       if (sort === "recent") {
//         return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//       } else if (sort === "likes") {
//         return b.likeCount - a.likeCount;
//       } else {
//         return b.commentCount - a.commentCount;
//       }
//     });

//     const pages = [];
//     for (let i = 0; i < sorted.length; i += 6) {
//       pages.push(sorted.slice(i, i + 6));
//     }
//     return pages;
//   }, [allPosts, sort]);

//   const fetchPosts = async () => {
//     try {
//       const { data } = await axios.get<Post[]>(
//         `/api/users/${currentUser?.username}/posts`,
//         { params: { sort: `${sort},desc` } }
//       );
//       setAllPosts(data);
//     } catch (err) {
//       setError("게시글 조회 실패");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!posts) fetchPosts();
//     else setLoading(false);
//   }, [sort]);

//   const currentPosts = paginatedPosts[currentPage] || [];
//   const totalPages = paginatedPosts.length;

//   return (
//     <div className="flex flex-col w-[800px] min-h-[400px] items-center gap-5 pt-10 pb-5 px-0 relative bg-white rounded-lg shadow">
//       <div className="flex w-[570px] items-center justify-end gap-2 relative">
//         <select
//           value={sort}
//           onChange={(e) => setSort(e.target.value as typeof sort)}
//           className="w-[123px] h-[30px] rounded-md border border-black/30 pl-2 pr-6"
//         >
//           <option value="recent">최신순</option>
//           <option value="likes">좋아요순</option>
//           <option value="comments">댓글순</option>
//         </select>
//         <img
//           src={BotAngleBracket}
//           alt="아래 꺽쇠"
//           className="w-6 h-6 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none"
//         />
//       </div>

//       <div className="w-full flex flex-col items-center gap-4 px-4">
//         {loading ? (
//           <div className="text-gray-400 text-lg">로딩 중...</div>
//         ) : error ? (
//           <div className="text-red-500 text-lg">{error}</div>
//         ) : currentPosts.length === 0 ? (
//           <div className="text-gray-400 text-lg">게시물 없음</div>
//         ) : (
//           currentPosts.map((post) => (
//             <PostCard
//               key={post.id}
//               {...post}
//               isMyPost={post.authorUsername === currentUser?.username}
//             />
//           ))
//         )}
//       </div>

//       <div className="flex items-center gap-4">
//         <button
//           onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
//           disabled={currentPage === 0}
//         >
//           &lt;
//         </button>
//         <span>
//           {currentPage + 1} / {totalPages}
//         </span>
//         <button
//           onClick={() =>
//             setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
//           }
//           disabled={currentPage === totalPages - 1}
//         >
//           &gt;
//         </button>
//       </div>
//     </div>
//   );
// };
