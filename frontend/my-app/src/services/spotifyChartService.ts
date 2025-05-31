import axiosInstance from './axiosInstance';

export const getTop10SpotifyCharts = async () => {
  const res = await axiosInstance.get('/api/spotify/charts');
  return res.data;
};
