"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: "kakao" | "google" | "guest";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (provider: "kakao" | "google") => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로컬 스토리지에서 세션 확인
    const savedUser = localStorage.getItem("aria_session");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: "email-user-456",
      name: email.split('@')[0],
      email: email,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop",
      provider: "guest"
    };

    setUser(mockUser);
    localStorage.setItem("aria_session", JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const login = async (provider: "kakao" | "google") => {
    setIsLoading(true);
    // [v1.3.0] Mock Login - 실제 API 연동 전 UI 확인용
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: "mock-user-123",
      name: provider === "kakao" ? "카카오 여행자" : "구글 탐험가",
      email: "traveler@ariajs.kr",
      avatar: provider === "kakao" 
        ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop"
        : "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
      provider: provider
    };

    setUser(mockUser);
    localStorage.setItem("aria_session", JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("aria_session");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
