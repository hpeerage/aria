"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

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
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. 초기 세션 확인 및 복구
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        const u = session.user;
        setUser({
          id: u.id,
          name: u.user_metadata?.full_name || u.email?.split("@")[0] || "관리자",
          email: u.email || "",
          avatar: u.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop",
          provider: (session.user.app_metadata?.provider as any) || "guest"
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // 2. 인증 상태 변경 리스너 등록
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        const u = session.user;
        setUser({
          id: u.id,
          name: u.user_metadata?.full_name || u.email?.split("@")[0] || "관리자",
          email: u.email || "",
          avatar: u.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop",
          provider: (session.user.app_metadata?.provider as any) || "guest"
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 이메일 로그인 연동
  const loginWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) {
      setIsLoading(false);
      throw error;
    }
  };

  // 소셜 로그인 연동 (Redirect 방식)
  const login = async (provider: "kakao" | "google") => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: typeof window !== 'undefined' 
          ? `${window.location.origin}/admin` 
          : undefined,
      }
    });
    if (error) {
      setIsLoading(false);
      throw error;
    }
  };

  // 로그아웃 연동
  const logout = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out failed:", error);
    }
    setUser(null);
    setIsLoading(false);
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
