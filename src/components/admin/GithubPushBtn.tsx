"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, RefreshCcw, CheckCircle2, AlertCircle, Send, Lock, Cloud } from "lucide-react";
import { commitFileToGitHub, collectAllLocalData, GitHubConfig } from "@/lib/github-api";

export default function GithubPushBtn() {
  const [mounted, setMounted] = useState(false);
  const [hasCloudToken, setHasCloudToken] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMounted(true);
    const configStr = localStorage.getItem("aria_github_config");
    if (configStr) {
      const config = JSON.parse(configStr);
      setHasCloudToken(!!config.token);
    }
  }, []);

  const isLocal = typeof window !== "undefined" && 
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  const handlePush = async () => {
    const configStr = localStorage.getItem("aria_github_config");
    const cloudConfig: GitHubConfig | null = configStr ? JSON.parse(configStr) : null;
    const currentHasToken = !!cloudConfig?.token;

    if (!isLocal && !currentHasToken) return;
    if (status === "loading") return;

    setStatus("loading");
    setMessage(currentHasToken ? "GitHub API를 통해 클라우드 동기화 중..." : "로컬 서버를 통해 동기화 중...");

    try {
      if (currentHasToken) {
        // 1. Cloud Push (GitHub API)
        const allData = collectAllLocalData();
        await commitFileToGitHub(
          cloudConfig!,
          "public/data/places.json", // 웹에서 접근 가능한 데이터 경로
          JSON.stringify(allData, null, 2),
          `[ARIA] web: update registry from console at ${new Date().toLocaleString()}`
        );
      } else {
        // 2. Local Push (Legacy)
        const response = await fetch("/api/admin/push", { method: "POST" });
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
      }

      setStatus("success");
      setMessage("성공적으로 동기화되었습니다!");
      
      // [v0.9.7] 동기화 성공 후 로컬 변경 이력 마킹 (선택적: 사이트에서 서버 데이터를 우선하도록 유도)
      localStorage.setItem('aria_last_sync', new Date().toISOString());
      
      setTimeout(() => setStatus("idle"), 3000);
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
        whileHover={(isLocal || hasCloudToken) ? { scale: 1.02 } : {}}
        whileTap={(isLocal || hasCloudToken) ? { scale: 0.98 } : {}}
        onClick={handlePush}
        disabled={status === "loading" || (!isLocal && !hasCloudToken)}
        className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${
          !isLocal && !hasCloudToken
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
          {!isLocal && !hasCloudToken ? (
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
            <motion.div key="idle" className="flex items-center gap-3 relative">
              {hasCloudToken ? <Cloud className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
              <span>{hasCloudToken ? "Cloud Sync to GitHub" : isLocal ? "Local Push to Git" : "Setup Cloud Sync"}</span>
              {(isLocal || hasCloudToken) && <Send className="w-4 h-4 opacity-30" />}
              
              {/* [v0.9.7] Unsynced changes indicator dot */}
              {mounted && localStorage.getItem('aria_local_places') && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-forest ring-4 ring-rose-500/20 animate-pulse" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {status === "loading" && <span>Processing...</span>}
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
