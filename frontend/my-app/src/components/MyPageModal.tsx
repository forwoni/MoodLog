import React, { useState, useEffect } from 'react';
import { X, Camera, User, Mail, Key } from 'lucide-react';
import api from '../services/axiosInstance';

interface MyPageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserProfile {
  id: number;
  username: string;
  email: string;
  profileImage?: string;
}

export default function MyPageModal({ isOpen, onClose }: MyPageModalProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get<UserProfile>('/users/me');
      setProfile(response.data);
      if (response.data.profileImage) {
        setPreviewUrl(response.data.profileImage);
      }
    } catch (error) {
      console.error('프로필 조회 실패:', error);
      setError('프로필을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        setError('이미지 크기는 5MB를 초과할 수 없습니다.');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      // 이미지가 선택되면 자동으로 업로드
      handleProfileUpdate(file);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      setError('');
      await api.post('/users/change-password', { newPassword });
      setSuccess('비밀번호가 성공적으로 변경되었습니다.');
      setNewPassword('');
      setConfirmPassword('');
      // 3초 후 성공 메시지 제거
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      setError('비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleProfileUpdate = async (file: File) => {
    try {
      setError('');
      const formData = new FormData();
      formData.append('profileImage', file);
      
      await api.post('/users/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccess('프로필 이미지가 업데이트되었습니다.');
      // 3초 후 성공 메시지 제거
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      setError('프로필 이미지 업데이트에 실패했습니다. 잠시 후 다시 시도해주세요.');
      // 업로드 실패시 미리보기 이미지 원복
      setPreviewUrl(profile?.profileImage || '');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-purple-100/50 to-blue-100/50 p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
            마이페이지
          </h2>
        </div>

        {/* 프로필 섹션 */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-4">로딩 중...</div>
          ) : (
            <div className="space-y-6">
              {/* 프로필 이미지 */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 border-4 border-white shadow-md">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="프로필"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={40} className="text-purple-300" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-purple-600 transition-colors">
                    <Camera size={16} className="text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              {/* 사용자 정보 */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <User size={16} />
                    사용자 이름
                  </label>
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">
                    {profile?.username}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <Mail size={16} />
                    이메일
                  </label>
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">
                    {profile?.email}
                  </div>
                </div>

                {/* 비밀번호 변경 폼 */}
                <form onSubmit={handlePasswordChange} className="space-y-3">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <Key size={16} />
                      새 비밀번호
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="새 비밀번호 입력"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <Key size={16} />
                      비밀번호 확인
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="비밀번호 확인"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
                  >
                    비밀번호 변경
                  </button>
                </form>

                {/* 알림 메시지 */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm">
                    {success}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 