"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { dictionaries, Locale, Dictionary } from "./dictionaries";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ko");
  const [dict, setDict] = useState<Dictionary>(dictionaries.ko);

  useEffect(() => {
    setDict(dictionaries[locale]);
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, dict }}>
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
