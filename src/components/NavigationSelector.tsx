"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Navigation, ExternalLink, Map as MapIcon } from "lucide-react";
import { NavTarget, NavApp, openNavApp } from "@/lib/navigation";
import { useLanguage } from "@/lib/i18n/context";

interface NavigationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  target: NavTarget | null;
}

export default function NavigationSelector({ isOpen, onClose, target }: NavigationSelectorProps) {
  const { dict } = useLanguage();

  if (!target) return null;

  const apps: { id: NavApp; name: string; color: string; bgColor: string; desc: string }[] = [
    { 
      id: 'kakao', 
      name: 'KakaoNavi', 
      color: 'text-black', 
      bgColor: 'bg-[#FEE500]',
      desc: '카카오내비 앱으로 길찾기'
    },
    { 
      id: 'naver', 
      name: 'Naver Map', 
      color: 'text-white', 
      bgColor: 'bg-[#03C75A]',
      desc: '네이버 지도 앱으로 길찾기'
    },
    { 
      id: 'tmap', 
      name: 'T Map', 
      color: 'text-white', 
      bgColor: 'bg-[#E3000E]',
      desc: 'T맵 앱으로 길찾기'
    },
    { 
      id: 'google', 
      name: 'Google Maps', 
      color: 'text-white', 
      bgColor: 'bg-[#4285F4]',
      desc: '구글 맵 (Web/App)'
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm md:hidden"
          />

          {/* Action Sheet (Mobile only) */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[120] bg-white dark:bg-forest-dark rounded-t-[2.5rem] p-8 pb-12 shadow-2xl md:hidden"
          >
            <div className="w-12 h-1.5 bg-forest/10 dark:bg-white/10 rounded-full mx-auto mb-8" />
            
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-forest dark:text-white tracking-tight">{target.name}</h3>
                <p className="text-xs font-bold text-forest/40 dark:text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Navigation className="w-3 h-3" />
                  Select Navigation App
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-forest/5 dark:bg-white/5 rounded-2xl text-forest dark:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {apps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    openNavApp(app.id, target);
                    onClose();
                  }}
                  className="flex items-center gap-4 p-5 bg-white dark:bg-white/5 border border-forest/5 dark:border-white/10 rounded-[1.5rem] hover:border-accent group transition-all active:scale-[0.98] text-left"
                >
                  <div className={`w-12 h-12 ${app.bgColor} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <MapIcon className={`w-6 h-6 ${app.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-forest dark:text-white text-base">{app.name}</p>
                    <p className="text-[10px] font-bold text-forest/40 dark:text-white/40 uppercase tracking-widest">{app.desc}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-forest/10 dark:text-white/20 group-hover:text-accent transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
