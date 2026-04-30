"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Link2, X, Check } from "lucide-react";
import Image from "next/image";
import { Place } from "@/types/place";
import { useLanguage } from "@/lib/i18n/context";

interface ShareButtonProps {
  place: Place;
  className?: string;
}

export default function ShareButton({ place, className = "" }: ShareButtonProps) {
  const { dict } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/aria/places/${place.id}/` : "";

  const shareTitle = (dict.common.shareTitle as string).replace("{name}", place.name);
  const shareText = place.description || (dict.common.shareDescription as string).replace("{name}", place.name);

  const handleShare = () => {
    setIsOpen(true);
  };


  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareToInstagram = () => {
    copyToClipboard();
    alert("링크가 복사되었습니다. 인스타그램 스토리나 게시물에 붙여넣어 공유해 보세요!");
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const shareToKakao = () => {
    if (window.Kakao && window.Kakao.isInitialized()) {
      const rawImageUrl = place.images?.[0] || 'https://hpeerage.github.io/aria/og-image.jpg';
      const absoluteImageUrl = rawImageUrl.startsWith('http') 
        ? rawImageUrl 
        : `${window.location.origin}${rawImageUrl}`;

      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: shareTitle,
          description: shareText,
          imageUrl: absoluteImageUrl,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },

        buttons: [
          {
            title: '자세히 보기',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });
    } else {
      // 카카오 미설치 또는 초기화 실패 시 링크 복사로 유도
      alert(dict.common.kakaoNotReady);
      copyToClipboard();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button 
        onClick={handleShare}
        className="p-3 bg-foreground/5 text-foreground hover:bg-foreground/10 rounded-2xl transition-all active:scale-95 shadow-sm"
        aria-label={dict.common.share}
      >
        <Share2 className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[110] bg-forest/20 dark:bg-black/40 backdrop-blur-sm md:absolute md:inset-auto md:fixed"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="fixed bottom-0 left-0 right-0 z-[120] bg-white dark:bg-forest-light p-8 rounded-t-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.1)] border-t border-forest/5 dark:border-white/5 md:absolute md:bottom-auto md:top-full md:right-0 md:left-auto md:mt-4 md:w-80 md:rounded-[2rem] md:border"
            >
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-black text-forest dark:text-white uppercase tracking-[0.2em]">{dict.common.share}</h4>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 hover:bg-forest/5 dark:hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-forest/40" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-8">
                <ShareIcon 
                  onClick={shareToKakao} 
                  label="Kakao" 
                  color="bg-[#FEE500]" 
                  icon={<Image src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png" width={24} height={24} className="w-6 h-6" alt="Kakao" />} 
                />
                <ShareIcon 
                  onClick={shareToInstagram} 
                  label="Instagram" 
                  color="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]" 
                  icon={<svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>} 
                />
                <ShareIcon 
                  onClick={shareToTwitter} 
                  label="X" 
                  color="bg-black" 
                  icon={<svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>} 
                />
                <ShareIcon 
                  onClick={copyToClipboard} 
                  label="Link" 
                  color="bg-forest/5 dark:bg-white/10" 
                  icon={isCopied ? <Check className="w-5 h-5 text-accent" /> : <Link2 className="w-5 h-5 text-forest dark:text-white" />} 
                />
              </div>

              <div className="relative group overflow-hidden rounded-2xl bg-forest/[0.03] dark:bg-white/5 border border-forest/10 dark:border-white/10 p-4 transition-all hover:border-accent/30">
                <div className="pr-16">
                  <p className="text-[10px] font-mono text-forest/40 dark:text-white/40 truncate">
                    {shareUrl}
                  </p>
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-forest dark:bg-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-md"
                >
                  {isCopied ? "Done" : "Copy"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShareIcon({ onClick, label, color, icon }: { onClick: () => void, label: string, color: string, icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-2 group"
    >
      <div className={`w-14 h-14 ${color} rounded-[1.25rem] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-black/10 group-active:scale-95`}>
        {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-forest/30 dark:text-white/30 group-hover:text-accent transition-colors">
        {label}
      </span>
    </button>
  );
}
