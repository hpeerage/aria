"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, RefreshCcw, CheckCircle2, AlertCircle, Send, Lock } from "lucide-react";

export default function GithubPushBtn() {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLocal = typeof window !== "undefined" && 
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  const handlePush = async () => {
    if (!isLocal) return;
    if (status === "loading") return;

    setStatus("loading");
    setMessage("GitHub에 변경 사항을 동기화 중입니다...");

    try {
      const response = await fetch("/api/admin/push", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setMessage("성공적으로 동기화되었습니다!");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        throw new Error(data.error || "동기화 중 오류가 발생했습니다.");
      }
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage(err.message || "동기화 실패");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative flex flex-col items-end gap-2">
      <motion.button
        whileHover={isLocal ? { scale: 1.02 } : {}}
        whileTap={isLocal ? { scale: 0.98 } : {}}
        onClick={handlePush}
        disabled={status === "loading" || !isLocal}
        className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${
          !isLocal
            ? "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
            : status === "loading" 
            ? "bg-accent text-white animate-pulse cursor-wait" 
            : status === "success"
            ? "bg-emerald-500 text-white"
            : status === "error"
            ? "bg-rose-500 text-white"
            : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
        }`}
      >
        <AnimatePresence mode="wait">
          {!isLocal ? (
            <motion.div key="lock">
              <Lock className="w-5 h-5 opacity-40" />
            </motion.div>
          ) : status === "loading" ? (
            <motion.div
              key="loading"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <RefreshCcw className="w-5 h-5" />
            </motion.div>
          ) : status === "success" ? (
            <motion.div
              key="success"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <CheckCircle2 className="w-5 h-5" />
            </motion.div>
          ) : status === "error" ? (
            <motion.div
              key="error"
              initial={{ x: -10 }}
              animate={{ x: 0 }}
            >
              <AlertCircle className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div key="idle" className="flex items-center gap-3">
              <Globe className="w-5 h-5" />
              <span>{isLocal ? "Sync to Production" : "Local Development Only"}</span>
              {isLocal && <Send className="w-4 h-4 opacity-30" />}
            </motion.div>
          )}
        </AnimatePresence>
        
        {status === "loading" && <span>Pushing Assets...</span>}
        {status === "success" && <span>Success</span>}
        {status === "error" && <span>Failed</span>}
      </motion.button>

      {/* Status Message Overlay */}
      <AnimatePresence>
        {(status === "loading" || status === "success" || status === "error") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute top-full mt-4 right-0 px-4 py-2 rounded-xl text-[10px] font-bold backdrop-blur-md border border-white/5 shadow-2xl z-[100] whitespace-nowrap ${
              status === "error" ? "text-rose-400 bg-rose-500/10" : "text-accent bg-white/5"
            }`}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
