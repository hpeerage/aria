"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { dictionaries, Locale, Dictionary } from "./dictionaries";

const OVERRIDE_KEY = "aria_i18n_overrides";

// Deep merge utility: override values on top of base
function deepMerge<T extends Record<string, unknown>>(base: T, override: Partial<T>): T {
  const result = { ...base };
  for (const key in override) {
    const baseVal = base[key];
    const overVal = override[key];
    if (
      baseVal !== null && typeof baseVal === "object" && !Array.isArray(baseVal) &&
      overVal !== null && typeof overVal === "object" && !Array.isArray(overVal)
    ) {
      result[key] = deepMerge(baseVal as Record<string, unknown>, overVal as Record<string, unknown>) as T[typeof key];
    } else if (overVal !== undefined) {
      result[key] = overVal as T[typeof key];
    }
  }
  return result;
}

type Overrides = {
  ko?: Partial<Dictionary>;
  en?: Partial<Dictionary>;
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: Dictionary;
  /** 실제 사전 데이터 (KO + EN 둘 다 접근 가능) */
  allDicts: { ko: Dictionary; en: Dictionary };
  /** 번역 값을 업데이트하고 localStorage에 저장 */
  updateDict: (locale: Locale, namespace: string, key: string, value: string) => void;
  /** 모든 오버라이드를 초기화 */
  resetDict: () => void;
  /** 현재 저장된 오버라이드 반환 */
  overrides: Overrides;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ko");
  const [overrides, setOverrides] = useState<Overrides>({});
  const [isMounted, setIsMounted] = useState(false);

  // localStorage에서 오버라이드 로드
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(OVERRIDE_KEY);
      if (stored) {
        setOverrides(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // 기본 딕셔너리에 오버라이드 딥 머지
  const buildDict = useCallback((loc: Locale, ovr: Overrides): Dictionary => {
    const base = dictionaries[loc];
    // 하이드레이션 불일치 방지: 마운트 전에는 오버라이드를 적용하지 않음
    if (!isMounted) return base;
    
    const override = ovr[loc as keyof Overrides];
    if (!override) return base;
    return deepMerge(base as unknown as Record<string, unknown>, override as Record<string, unknown>) as unknown as Dictionary;
  }, [isMounted]);

  const dict = buildDict(locale, overrides);
  const allDicts = {
    ko: buildDict("ko", overrides),
    en: buildDict("en", overrides),
  };

  const updateDict = useCallback((loc: Locale, namespace: string, key: string, value: string) => {
    setOverrides(prev => {
      const next: Overrides = {
        ...prev,
        [loc]: {
          ...(prev[loc as keyof Overrides] || {}),
          [namespace]: {
            ...((prev[loc as keyof Overrides] as Record<string, unknown>)?.[namespace] || {}),
            [key]: value,
          },
        },
      };
      try {
        localStorage.setItem(OVERRIDE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const resetDict = useCallback(() => {
    setOverrides({});
    try {
      localStorage.removeItem(OVERRIDE_KEY);
    } catch {}
  }, []);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, dict, allDicts, updateDict, resetDict, overrides }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
