"use client";

import { motion } from "framer-motion";
import { Sparkles, Lock, ArrowRight, Compass } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";

export default function AdminLoginPage() {
  const { dict } = useLanguage();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // 임시 로직: 실제 Supabase Auth 연동 전까지 /admin/dashboard로 이동
    setTimeout(() => {
      router.push("/admin/dashboard");
    }, 1500);
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

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-accent px-1">{dict.admin.loginTitle}</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-accent transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={dict.admin.placeholderName}
                  className="w-full pl-12 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent outline-none transition-all font-bold"
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full py-5 bg-accent text-white rounded-2xl font-black text-lg hover:bg-white hover:text-forest transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent/20 disabled:opacity-50 group"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {dict.admin.loginTitle}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
