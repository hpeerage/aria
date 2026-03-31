"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Save, Search, Languages, AlertCircle, CheckCircle2,
  ArrowRight, RotateCcw, Info, ChevronDown, Edit3, Sparkles,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { dictionaries } from "@/lib/i18n/dictionaries";

// ─── 토스트 컴포넌트 ────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: "success" | "error" | "info"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  const colors = { success: "bg-emerald-500", error: "bg-red-500", info: "bg-accent" };
  const icons = { success: <CheckCircle2 className="w-4 h-4" />, error: <AlertCircle className="w-4 h-4" />, info: <Info className="w-4 h-4" /> };
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl text-white font-bold shadow-2xl ${colors[type]}`}
    >
      {icons[type]}
      {message}
    </motion.div>
  );
}

// ─── 편집 상태 타입 ────────────────────────────────
type EditMap = Record<string, Record<string, { ko: string; en: string }>>;

export default function AdminI18nPage() {
  const { dict, allDicts, updateDict, resetDict, overrides } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("common");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [localEdits, setLocalEdits] = useState<EditMap>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
  };

  // 네임스페이스 목록 (locale 제외)
  const namespaces = Object.keys(dictionaries.ko).filter(k => k !== "locale");

  // 현재 탭의 KO/EN 데이터 — 저장된 오버라이드 포함
  const koData = useMemo(() => (allDicts.ko as Record<string, Record<string, string>>)[activeTab] || {}, [allDicts, activeTab]);
  const enData = useMemo(() => (allDicts.en as Record<string, Record<string, string>>)[activeTab] || {}, [allDicts, activeTab]);

  // 로컬 편집값 초기화 (탭 전환 시)
  useEffect(() => {
    setLocalEdits(prev => {
      if (prev[activeTab]) return prev;
      const init: Record<string, { ko: string; en: string }> = {};
      Object.keys(koData).forEach(key => {
        init[key] = { ko: koData[key] || "", en: enData[key] || "" };
      });
      return { ...prev, [activeTab]: init };
    });
  }, [activeTab, koData, enData]);

  const currentEdits = localEdits[activeTab] || {};

  // 변경된 항목 수
  const dirtyCount = useMemo(() => {
    return Object.entries(currentEdits).filter(([key, vals]) => {
      return vals.ko !== (koData[key] || "") || vals.en !== (enData[key] || "");
    }).length;
  }, [currentEdits, koData, enData]);

  // 검색 필터
  const filteredKeys = useMemo(() => {
    const keys = Object.keys(currentEdits);
    if (!searchTerm) return keys;
    const q = searchTerm.toLowerCase();
    return keys.filter(k =>
      k.toLowerCase().includes(q) ||
      (currentEdits[k]?.ko || "").toLowerCase().includes(q) ||
      (currentEdits[k]?.en || "").toLowerCase().includes(q)
    );
  }, [currentEdits, searchTerm]);

  const handleChange = (key: string, locale: "ko" | "en", value: string) => {
    setLocalEdits(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [key]: { ...prev[activeTab]?.[key], [locale]: value },
      },
    }));
  };

  const handleSave = async () => {
    if (dirtyCount === 0) {
      showToast("변경된 항목이 없습니다.", "info");
      return;
    }
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 600));

    // 변경된 항목만 context에 저장
    Object.entries(currentEdits).forEach(([key, vals]) => {
      const origKo = koData[key] || "";
      const origEn = enData[key] || "";
      if (vals.ko !== origKo) updateDict("ko", activeTab, key, vals.ko);
      if (vals.en !== origEn) updateDict("en", activeTab, key, vals.en);
    });

    setIsSaving(false);
    showToast(`✅ ${dirtyCount}개 항목이 저장되었습니다. 브라우저 전체에 즉시 반영됩니다.`);
  };

  const handleReset = () => {
    resetDict();
    setLocalEdits({});
    setShowResetConfirm(false);
    showToast("모든 번역이 기본값으로 복원되었습니다.", "info");
  };

  // 오버라이드 카운트 계산
  const totalOverrides = useMemo(() => {
    let count = 0;
    try {
      const stored = localStorage.getItem("aria_i18n_overrides");
      if (stored) {
        const o = JSON.parse(stored);
        ["ko", "en"].forEach(loc => {
          if (o[loc]) {
            Object.values(o[loc] as Record<string, Record<string, unknown>>).forEach(ns => {
              count += Object.keys(ns).length;
            });
          }
        });
      }
    } catch {}
    return count;
  }, [overrides]);

  return (
    <div className="space-y-10 pb-32">
      {/* 토스트 */}
      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/5 p-10 rounded-[3rem] border border-white/10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 text-accent/5 pointer-events-none">
          <Globe className="w-48 h-48 rotate-12" />
        </div>
        <div className="space-y-3 relative z-10">
          <div className="flex items-center gap-3 text-accent font-black uppercase text-[10px] tracking-[0.2em]">
            <Languages className="w-4 h-4" />
            {dict.admin.globalEngine}
          </div>
          <h3 className="text-4xl font-black text-white tracking-tighter">{dict.admin.dictManager}</h3>
          <p className="text-white/40 text-sm font-bold max-w-md">{dict.admin.dictManagerDesc}</p>
          {totalOverrides > 0 && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-xl text-accent text-xs font-black">
              <Edit3 className="w-3 h-3" />
              {totalOverrides}개 항목 커스텀 적용 중
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 relative z-10 flex-wrap">
          {/* 기본값 복원 버튼 */}
          {totalOverrides > 0 && !showResetConfirm && (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-6 py-4 bg-white/5 border border-white/10 text-white/60 rounded-[1.5rem] font-black flex items-center gap-2 hover:bg-red-500/10 hover:border-red-400/20 hover:text-red-400 transition-all text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              기본값 복원
            </button>
          )}
          {showResetConfirm && (
            <div className="flex gap-2">
              <button onClick={handleReset} className="px-5 py-3 bg-red-500 text-white rounded-xl font-black text-sm">초기화 확인</button>
              <button onClick={() => setShowResetConfirm(false)} className="px-5 py-3 bg-white/10 text-white rounded-xl font-black text-sm">취소</button>
            </div>
          )}
          {/* Push 버튼 */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-10 py-5 bg-accent text-white rounded-[1.5rem] font-black flex items-center gap-3 shadow-xl shadow-accent/20 hover:scale-105 hover:bg-accent/80 transition-all disabled:opacity-60 disabled:scale-100"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {dict.admin.pushTranslations}
            {dirtyCount > 0 && (
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                {dirtyCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── 주의 배너 ── */}
      <div className="flex items-start gap-4 p-6 bg-blue-400/5 border border-blue-400/20 rounded-[1.5rem]">
        <Info className="w-5 h-5 text-blue-400/60 flex-shrink-0 mt-0.5" />
        <div className="text-sm font-bold text-blue-400/70 leading-relaxed space-y-1">
          <p>저장된 번역은 <strong>이 브라우저의 localStorage</strong>에 보관되며 즉시 반영됩니다.</p>
          <p>모든 사용자에게 영구 반영하려면 <code className="bg-white/5 px-1 rounded">dictionaries.ts</code>를 직접 수정 후 재배포가 필요합니다.</p>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar */}
        <aside className="space-y-3">
          <div className="text-[10px] font-black uppercase tracking-widest text-white/20 px-4 mb-4">
            {dict.admin.namespaceSelect}
          </div>
          {namespaces.map(ns => {
            // 해당 네임스페이스의 오버라이드 수 계산
            let nsOverrideCount = 0;
            try {
              const stored = localStorage.getItem("aria_i18n_overrides");
              if (stored) {
                const o = JSON.parse(stored);
                ["ko", "en"].forEach(loc => {
                  if (o[loc]?.[ns]) nsOverrideCount += Object.keys(o[loc][ns]).length;
                });
              }
            } catch {}

            return (
              <button
                key={ns}
                onClick={() => setActiveTab(ns)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all ${
                  activeTab === ns
                    ? "bg-white text-forest-dark shadow-xl scale-[1.02]"
                    : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{ns}</span>
                <div className="flex items-center gap-2">
                  {nsOverrideCount > 0 && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                      activeTab === ns ? "bg-accent/20 text-accent" : "bg-accent/10 text-accent/60"
                    }`}>
                      {nsOverrideCount}
                    </span>
                  )}
                  {activeTab === ns && <ArrowRight className="w-4 h-4" />}
                </div>
              </button>
            );
          })}
        </aside>

        {/* 편집 영역 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 검색 */}
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder={`${dict.admin.searchKeys} (${activeTab})`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent outline-none transition-all font-bold"
            />
            {filteredKeys.length !== Object.keys(currentEdits).length && (
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs text-accent font-black">
                {filteredKeys.length}/{Object.keys(currentEdits).length}
              </span>
            )}
          </div>

          {/* 편집 카드 */}
          <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-3xl">
            <div className="p-8 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
              <h5 className="font-black text-white uppercase tracking-widest text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                {dict.admin.editingNamespace} {activeTab.toUpperCase()} NAMESPACE
              </h5>
              <div className="flex items-center gap-3">
                {dirtyCount > 0 && (
                  <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {dirtyCount}개 수정됨
                  </span>
                )}
                <span className="text-[10px] font-bold text-white/20">{filteredKeys.length}개 항목</span>
              </div>
            </div>

            <div className="p-10 space-y-8">
              {/* 컬럼 헤더 */}
              <div className="grid grid-cols-2 gap-6 px-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full" />
                  KOREAN (KO)
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                  ENGLISH (EN)
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                {filteredKeys.map((key) => {
                  const vals = currentEdits[key] || { ko: "", en: "" };
                  const origKo = koData[key] || "";
                  const origEn = enData[key] || "";
                  const koChanged = vals.ko !== origKo;
                  const enChanged = vals.en !== origEn;
                  const isChanged = koChanged || enChanged;

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      key={key}
                      className={`space-y-3 group p-4 rounded-2xl transition-all ${
                        isChanged ? "bg-amber-400/5 border border-amber-400/20" : "hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center justify-between px-1">
                        <code className="text-accent text-[10px] font-black uppercase tracking-widest">
                          {key}
                        </code>
                        {isChanged && (
                          <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider">
                            수정됨
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* KO */}
                        <div className="space-y-1.5">
                          <textarea
                            rows={1}
                            value={vals.ko}
                            onChange={(e) => handleChange(key, "ko", e.target.value)}
                            className={`w-full px-5 py-3 bg-white/5 border rounded-2xl text-sm font-bold text-white focus:bg-white/10 transition-all outline-none resize-none leading-relaxed ${
                              koChanged ? "border-amber-400/40 focus:ring-1 focus:ring-amber-400/40" : "border-white/10 focus:ring-1 focus:ring-white/20"
                            }`}
                          />
                        </div>
                        {/* EN */}
                        <div className="space-y-1.5">
                          <textarea
                            rows={1}
                            value={vals.en}
                            onChange={(e) => handleChange(key, "en", e.target.value)}
                            placeholder="Translate to English..."
                            className={`w-full px-5 py-3 bg-white/5 border rounded-2xl text-sm font-bold text-white focus:bg-white/10 transition-all outline-none italic placeholder:text-white/20 resize-none leading-relaxed ${
                              enChanged ? "border-emerald-400/40 focus:ring-1 focus:ring-emerald-400/40" : "border-white/10 focus:ring-1 focus:ring-white/20"
                            }`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredKeys.length === 0 && (
                <div className="py-16 text-center text-white/20 font-black uppercase tracking-widest">
                  검색 결과가 없습니다
                </div>
              )}
            </div>

            {/* 주의 배너 */}
            <div className="m-8 p-5 bg-yellow-400/5 border border-yellow-400/20 rounded-[1.5rem] flex items-center gap-4">
              <AlertCircle className="w-5 h-5 text-yellow-400/60 flex-shrink-0" />
              <p className="text-[10px] font-bold text-yellow-400/60 leading-relaxed uppercase tracking-tighter">
                {dict.admin.warningDict}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
