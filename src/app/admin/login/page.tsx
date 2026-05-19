"use client";

import { motion } from "framer-motion";
import { Sparkles, Lock, ArrowRight, Compass, Mail, MessageSquare, Globe } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";

export default function AdminLoginPage() {
  const { dict } = useLanguage();
  const router = useRouter();
  const { login, loginWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setErrorMessage("");
    try {
      await loginWithEmail(email, password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      console.error(err);
      if (err.message === "Invalid login credentials") {
        setErrorMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setErrorMessage(err.message || "로그인에 실패했습니다.");
      }
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "kakao" | "google") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      await login(provider);
    } catch (err: any) {
      console.error(err);
      setErrorMessage("소셜 로그인에 실패했습니다. 다시 시도해주세요.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-forest-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-12 shadow-2xl space-y-8">
          {/* Logo Section */}
          <div className="text-center space-y-4">
            <motion.div 
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              className="inline-flex items-center justify-center p-4 bg-accent/20 rounded-2xl mb-2"
            >
              <Compass className="w-8 h-8 text-accent" />
            </motion.div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Aria <span className="text-accent">{dict.admin.dashboard}</span>
            </h1>
            <p className="text-white/40 text-sm font-bold uppercase tracking-[0.2em]">{dict.admin.loginSubtitle}</p>
          </div>

          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs font-bold text-red-500 text-center"
            >
              {errorMessage}
            </motion.div>
          )}

          {/* Social Logins */}
          <div className="space-y-3">
            <button
              onClick={() => handleSocialLogin("kakao")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 p-4 bg-[#FEE500] text-[#3C1E1E] rounded-2xl font-black text-sm hover:opacity-90 transition-all disabled:opacity-50"
            >
              <MessageSquare size={18} fill="#3C1E1E" className="text-[#3C1E1E]" />
              카카오로 로그인
            </button>
            <button
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 p-4 bg-white text-forest-dark rounded-2xl font-black text-sm hover:opacity-90 transition-all border border-white/10 disabled:opacity-50"
            >
              <Globe size={18} className="text-blue-500" />
              구글로 로그인
            </button>
          </div>

          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <span className="relative px-4 bg-[#0d221c] text-white/20">or</span>
          </div>

          {/* Email/Password Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-3">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-accent transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소"
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent outline-none transition-all font-bold"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-accent transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent outline-none transition-all font-bold"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-accent text-white rounded-2xl font-black text-sm hover:bg-white hover:text-forest transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent/20 disabled:opacity-50 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {dict.admin.loginTitle}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-6 text-center border-t border-white/5">
            <Link href="/" className="text-white/40 hover:text-white transition-colors text-xs font-bold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              {dict.common.backToList}
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
