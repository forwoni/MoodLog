// src/contexts/UserContext.tsx

import React, { createContext, useContext, useState } from "react";

// 사용자 타입 정의 (필요에 따라 확장 가능)
interface User {
  username: string;
  // 다른 정보들 예: email, id 등
}

// context의 값 타입 정의
interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

// context 생성
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider 컴포넌트
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

// context를 쉽게 사용하기 위한 커스텀 훅
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
