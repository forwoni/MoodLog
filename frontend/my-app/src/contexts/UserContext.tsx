import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/axiosInstance";

interface User {
  username: string;
  email: string;
  nickname: string;
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setCurrentUser(null);
        setIsLoading(false);
        return;
      }
      const res = await api.get("/users/me");
      setCurrentUser(res.data);
    } catch (_) {
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    const handleTokenRefreshed = () => {
      fetchUser();
    };

    window.addEventListener("tokenRefreshed", handleTokenRefreshed);
    return () => {
      window.removeEventListener("tokenRefreshed", handleTokenRefreshed);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {!isLoading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
