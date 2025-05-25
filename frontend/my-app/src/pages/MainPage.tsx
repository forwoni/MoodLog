import React from "react";
import OptimizedSpotifyChart from "../components/PopularChart";

export default function MainPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-8">MoodLog 임시 메인 페이지</h1>
      <OptimizedSpotifyChart />
    </div>
  );
}
