"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, MessageSquare, Globe, Sparkles, ShieldCheck, Heart } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import Image from "next/image";
import { useState } from "react";

interface AriaAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AriaAuthModal({ isOpen, onClose }: AriaAuthModalProps) {
  const { login, isLoading } = useAuth();
  const [hoveredProvider, setHoveredProvider] = useState<string | null>(null);

  const handleLogin = async (provider: "kakao" | "google") => {
    await login(provider);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-forest-dark/80 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-[#0C1A14] rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden"
          >
            {/* Top Pattern Decor */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"
            />

            <div className="relative p-10 md:p-12 space-y-10">
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 p-2 rounded-full bg-forest/5 dark:bg-white/5 text-forest/40 dark:text-white/40 hover:text-accent transition-all"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="text-center space-y-4">
                <motion.div 
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-2"
                >
                  <Sparkles size={12} className="animate-pulse" />
                  Welcome to Aria
                </motion.div>
                <h2 className="text-4xl font-black text-forest dark:text-white tracking-tighter leading-tight">
                  나만의 숲, <br />
                  <span className="text-accent underline decoration-forest/10 underline-offset-8">아리아</span>와 함께
                </h2>
                <p className="text-sm font-bold text-forest/40 dark:text-white/40 leading-relaxed">
                  로그인하고 당신의 웰니스 여정을 <br /> 기록하고 공유해보세요.
                </p>
              </div>

              {/* Login Buttons */}
              <div className="space-y-4">
                <LoginButton 
                  icon={<div className="p-2 bg-[#FEE500] rounded-xl text-[#3C1E1E]"><MessageSquare size={20} fill="currentColor" /></div>}
                  label="카카오로 1초 시작하기"
                  sub="Kakao Login"
                  onClick={() => handleLogin("kakao")}
                  isLoading={isLoading && hoveredProvider === "kakao"}
                  onMouseEnter={() => setHoveredProvider("kakao")}
                  onMouseLeave={() => setHoveredProvider(null)}
                  color="hover:bg-[#FEE500]/10 hover:border-[#FEE500]/30"
                />
                
                <LoginButton 
                  icon={<div className="p-2 bg-white rounded-xl shadow-sm"><Globe size={20} className="text-blue-500" /></div>}
                  label="구글 계정으로 로그인"
                  sub="Google Account"
                  onClick={() => handleLogin("google")}
                  isLoading={isLoading && hoveredProvider === "google"}
                  onMouseEnter={() => setHoveredProvider("google")}
                  onMouseLeave={() => setHoveredProvider(null)}
                  color="hover:bg-blue-50/10 hover:border-blue-500/30"
                />
              </div>

              {/* Footer Info */}
              <div className="pt-6 border-t border-forest/5 dark:border-white/5 flex flex-col items-center gap-4">
                <div className="flex gap-6">
                  <InfoItem icon={<ShieldCheck size={14} />} label="보안 로그인" />
                  <InfoItem icon={<Heart size={14} />} label="위시리스트 저장" />
                </div>
                <p className="text-[10px] font-bold text-forest/20 dark:text-white/20 uppercase tracking-widest">
                  &copy; 2026 Jeongseon Wellness Aria
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

function LoginButton({ icon, label, sub, onClick, isLoading, onMouseEnter, onMouseLeave, color }: any) {
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      disabled={isLoading}
      className={`w-full flex items-center justify-between p-5 bg-forest/[0.03] dark:bg-white/[0.03] border border-forest/5 dark:border-white/10 rounded-[2rem] transition-all duration-500 group ${color} disabled:opacity-50`}
    >
      <div className="flex items-center gap-4">
        {icon}
        <div className="text-left">
          <p className="text-[10px] font-black text-forest/30 dark:text-white/20 uppercase tracking-widest leading-none mb-1">{sub}</p>
          <p className="text-base font-black text-forest dark:text-white/90">{label}</p>
        </div>
      </div>
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      ) : (
        <div className="p-2 rounded-full bg-forest/5 dark:bg-white/5 text-forest/20 dark:text-white/20 group-hover:text-accent transition-colors">
          <Sparkles size={16} />
        </div>
      )}
    </motion.button>
  );
}

function InfoItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-black text-forest/30 dark:text-white/30 uppercase tracking-tighter">
      {icon}
      {label}
    </div>
  );
}
