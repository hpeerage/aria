"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, MessageSquare, Sparkles, ShieldCheck, Heart, Mail, Lock, ArrowRight, ChevronLeft, User } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { useState } from "react";

interface AriaAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = "social" | "email" | "signup";

export default function AriaAuthModal({ isOpen, onClose }: AriaAuthModalProps) {
  const { login, loginWithEmail, signUpWithEmail, isLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>("social");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loginError, setLoginError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSocialLogin = async (provider: "kakao" | "google") => {
    setLoginError("");
    setSuccessMessage("");
    try {
      await login(provider);
      onClose();
    } catch (err: any) {
      console.error(err);
      setLoginError("소셜 로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoginError("");
    setSuccessMessage("");
    try {
      await loginWithEmail(email, password);
      onClose();
      resetForm();
    } catch (err: any) {
      console.error(err);
      if (err.message === "Invalid login credentials") {
        setLoginError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setLoginError(err.message || "로그인에 실패했습니다.");
      }
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    setLoginError("");
    setSuccessMessage("");
    try {
      await signUpWithEmail(email, password, name);
      setSuccessMessage("회원가입이 완료되었습니다! 확인 이메일이 발송되었다면 이메일 링크를 인증해 주세요.");
      setTimeout(() => {
        setMode("email");
        setSuccessMessage("");
      }, 4000);
    } catch (err: any) {
      console.error(err);
      setLoginError(err.message || "회원가입에 실패했습니다.");
    }
  };

  const resetForm = () => {
    setMode("social");
    setEmail("");
    setPassword("");
    setName("");
    setLoginError("");
    setSuccessMessage("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { onClose(); resetForm(); }}
            className="absolute inset-0 bg-forest-dark/80 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-[#0C1A14] rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />
            
            <div className="relative p-10 md:p-12 space-y-8">
              {/* Top Controls */}
              <div className="flex justify-between items-center">
                {mode !== "social" ? (
                  <button 
                    onClick={() => { setMode("social"); setLoginError(""); setSuccessMessage(""); }}
                    className="p-2 rounded-full bg-forest/5 dark:bg-white/5 text-forest/40 dark:text-white/40 hover:text-accent transition-all flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                ) : <div />}
                <button 
                  onClick={() => { onClose(); resetForm(); }}
                  className="p-2 rounded-full bg-forest/5 dark:bg-white/5 text-forest/40 dark:text-white/40 hover:text-accent transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Header */}
              <div className="text-center space-y-3">
                <motion.div 
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-1"
                >
                  <Sparkles size={12} className="animate-pulse" />
                  Jeongseon Aria
                </motion.div>
                <h2 className="text-3xl font-black text-forest dark:text-white tracking-tighter leading-tight">
                  {mode === "social" ? "나만의 숲, 아리아" : mode === "email" ? "이메일 로그인" : "회원가입"}
                </h2>
                <p className="text-xs font-bold text-forest/40 dark:text-white/40 leading-relaxed">
                  {mode === "social" 
                    ? "로그인하고 당신의 웰니스 여정을 기록해보세요." 
                    : mode === "email"
                    ? "등록하신 이메일과 비밀번호를 입력해주세요."
                    : "아리아 계정을 만들고 여행을 시작해보세요."}
                </p>
              </div>

              {/* Message Banner */}
              {loginError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs font-bold text-red-500 text-center leading-relaxed"
                >
                  {loginError}
                </motion.div>
              )}

              {successMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-accent/10 border border-accent/20 rounded-2xl text-xs font-bold text-accent text-center leading-relaxed"
                >
                  {successMessage}
                </motion.div>
              )}

              {/* Body Content */}
              <AnimatePresence mode="wait">
                {mode === "social" ? (
                  <motion.div
                    key="social"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <SocialButton 
                      icon={<MessageSquare size={20} fill="#3C1E1E" className="text-[#3C1E1E]" />}
                      label="카카오로 시작하기"
                      bg="bg-[#FEE500]"
                      color="text-[#3C1E1E]"
                      onClick={() => handleSocialLogin("kakao")}
                    />
                    <SocialButton 
                      icon={<Globe size={20} className="text-blue-500" />}
                      label="구글로 로그인"
                      bg="bg-white"
                      color="text-forest"
                      onClick={() => handleSocialLogin("google")}
                    />
                    
                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-forest/5 dark:border-white/5"></div></div>
                      <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]"><span className="px-4 bg-white dark:bg-[#0C1A14] text-forest/20 dark:text-white/20">or</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setMode("email")}
                        className="py-4 rounded-2xl border border-forest/10 dark:border-white/10 text-[11px] font-black text-forest/40 dark:text-white/40 uppercase tracking-widest hover:bg-forest/5 dark:hover:bg-white/5 hover:text-accent transition-all"
                      >
                        이메일 로그인
                      </button>
                      <button 
                        onClick={() => setMode("signup")}
                        className="py-4 rounded-2xl bg-white/5 border border-accent/20 text-[11px] font-black text-accent uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-lg shadow-accent/5"
                      >
                        회원가입
                      </button>
                    </div>
                  </motion.div>
                ) : mode === "email" ? (
                  <motion.form
                    key="email"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleEmailLogin}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/20 dark:text-white/20 group-focus-within:text-accent transition-colors" />
                        <input 
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="이메일 주소"
                          required
                          className="w-full pl-12 pr-6 py-4 bg-forest/[0.03] dark:bg-white/[0.03] border border-forest/5 dark:border-white/10 rounded-2xl outline-none focus:border-accent/40 focus:bg-white dark:focus:bg-white/5 transition-all text-sm font-bold text-forest dark:text-white"
                        />
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/20 dark:text-white/20 group-focus-within:text-accent transition-colors" />
                        <input 
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="비밀번호"
                          required
                          className="w-full pl-12 pr-6 py-4 bg-forest/[0.03] dark:bg-white/[0.03] border border-forest/5 dark:border-white/10 rounded-2xl outline-none focus:border-accent/40 focus:bg-white dark:focus:bg-white/5 transition-all text-sm font-bold text-forest dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-forest shadow-xl shadow-accent/20 transition-all flex items-center justify-center gap-2"
                    >
                      {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Login <ArrowRight size={14} /></>}
                    </button>

                    <div className="flex justify-between items-center text-[10px] font-black text-forest/30 dark:text-white/30 uppercase tracking-widest pt-2 px-1">
                      <button type="button" onClick={() => setMode("signup")} className="hover:text-accent text-accent">회원가입하기</button>
                      <div className="flex gap-2">
                        <button type="button" className="hover:text-accent">비밀번호 찾기</button>
                      </div>
                    </div>
                  </motion.form>
                ) : (
                  <motion.form
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleEmailSignUp}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/20 dark:text-white/20 group-focus-within:text-accent transition-colors" />
                        <input 
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="이름 (닉네임)"
                          required
                          className="w-full pl-12 pr-6 py-4 bg-forest/[0.03] dark:bg-white/[0.03] border border-forest/5 dark:border-white/10 rounded-2xl outline-none focus:border-accent/40 focus:bg-white dark:focus:bg-white/5 transition-all text-sm font-bold text-forest dark:text-white"
                        />
                      </div>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/20 dark:text-white/20 group-focus-within:text-accent transition-colors" />
                        <input 
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="이메일 주소"
                          required
                          className="w-full pl-12 pr-6 py-4 bg-forest/[0.03] dark:bg-white/[0.03] border border-forest/5 dark:border-white/10 rounded-2xl outline-none focus:border-accent/40 focus:bg-white dark:focus:bg-white/5 transition-all text-sm font-bold text-forest dark:text-white"
                        />
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/20 dark:text-white/20 group-focus-within:text-accent transition-colors" />
                        <input 
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="비밀번호 (6자리 이상)"
                          required
                          minLength={6}
                          className="w-full pl-12 pr-6 py-4 bg-forest/[0.03] dark:bg-white/[0.03] border border-forest/5 dark:border-white/10 rounded-2xl outline-none focus:border-accent/40 focus:bg-white dark:focus:bg-white/5 transition-all text-sm font-bold text-forest dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-forest shadow-xl shadow-accent/20 transition-all flex items-center justify-center gap-2"
                    >
                      {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>가입하기 <ArrowRight size={14} /></>}
                    </button>

                    <div className="flex justify-center text-[10px] font-black text-forest/30 dark:text-white/30 uppercase tracking-widest pt-2">
                      <button type="button" onClick={() => setMode("email")} className="hover:text-accent">이미 계정이 있으신가요? 로그인하기</button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Footer Info */}
              <div className="pt-6 border-t border-forest/5 dark:border-white/5 flex flex-col items-center gap-4">
                <div className="flex gap-6">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-forest/30 dark:text-white/30 uppercase tracking-tighter">
                    <ShieldCheck size={14} /> 보안 로그인
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-forest/30 dark:text-white/30 uppercase tracking-tighter">
                    <Heart size={14} /> 위시리스트
                  </div>
                </div>
                <p className="text-[10px] font-bold text-forest/20 dark:text-white/20 uppercase tracking-widest">
                  &copy; 2026 Jeongseon Wellness Aria
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SocialButton({ icon, label, bg, color, onClick }: any) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 ${bg} ${color} rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group`}
    >
      <div className="flex-shrink-0 transition-transform group-hover:scale-110 duration-500">
        {icon}
      </div>
      <span className="text-sm font-black tracking-tight">{label}</span>
    </motion.button>
  );
}
