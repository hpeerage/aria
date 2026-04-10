"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Place } from "@/types/place";
import { X, MapPin, Tag, Sparkles, Navigation, Share2, Compass, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface AriaDetailModalProps {
  place: Place | null;
  onClose: () => void;
  allPlaces?: Place[]; // 주변 추천을 위한 전체 데이터
}

export default function AriaDetailModal({ place, onClose, allPlaces }: AriaDetailModalProps) {
  const { dict } = useLanguage();
  if (!place) return null;

  // 단순 거리 계산 (피타고라스) 기반 주변 추천 (임시 로직)
  const nearbyPlaces = allPlaces
    ? allPlaces
        .filter((p) => p.id !== place.id)
        .sort((a, b) => {
          const distA = Math.pow(a.coordinates.lat - place.coordinates.lat, 2) + Math.pow(a.coordinates.lng - place.coordinates.lng, 2);
          const distB = Math.pow(b.coordinates.lat - place.coordinates.lat, 2) + Math.pow(b.coordinates.lng - place.coordinates.lng, 2);
          return distA - distB;
        })
        .slice(0, 3)
    : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-forest/40 backdrop-blur-xl"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#F8FAF9] dark:bg-forest-dark rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Left: Visual & Quick Info */}
          <div className="md:w-2/5 relative bg-forest overflow-hidden min-h-[300px] md:min-h-full">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-60 scale-105"
              style={{ backgroundImage: `url('${(place.images && place.images.length > 0) ? place.images[0] : 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1950'}')` }}
            />
            {/* Background Texture/Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg width="100%" height="100%">
                <pattern id="modal-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M20 0 L40 40 L0 40 Z" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#modal-pattern)" />
              </svg>
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/40 to-transparent z-[5]" />

            <div className="h-full flex flex-col justify-center p-12 text-white space-y-6 relative z-10">
              <div className="p-4 bg-white/10 rounded-full w-fit backdrop-blur-md">
                <Compass className="w-10 h-10 text-accent animate-pulse" />
              </div>
              
              <div className="space-y-4">
                <span className="text-xs font-black tracking-widest text-accent uppercase bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/20">
                  No. {place.id}
                </span>
                <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter">
                  {place.name}
                </h2>
                <div className="flex items-center gap-2 text-white/60 font-bold text-sm">
                  <Tag className="w-4 h-4" />
                  {dict.common.category}: {(dict.categories as any)[place.category.toLowerCase()] || place.category}
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{dict.common.location}</p>
                <div className="font-mono text-[10px] text-white/40 space-y-1 lowercase">
                  <p>latitude: {place.coordinates.lat}</p>
                  <p>longitude: {place.coordinates.lng}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Detailed Content */}
          <div className="md:w-3/5 overflow-y-auto custom-scrollbar-forest">
            <div className="p-8 md:p-12 space-y-10">
              {/* Header Actions */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-4">
                <button 
                  onClick={() => {
                    const { lat, lng } = place.coordinates;
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                    window.open(url, '_blank');
                  }}
                  className="p-3 bg-foreground/5 text-foreground hover:bg-accent hover:text-white rounded-2xl transition-all active:scale-95 shadow-sm"
                >
                  <Navigation className="w-5 h-5" />
                </button>
                  <button className="p-3 bg-foreground/5 text-foreground hover:bg-foreground/10 rounded-2xl transition-all active:scale-95">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
                <button 
                   onClick={onClose}
                   className="p-3 bg-foreground text-background rounded-2xl hover:bg-accent transition-all active:scale-90"
                 >
                   <X className="w-6 h-6" />
                 </button>
               </div>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-accent rounded-full" />
                  <h4 className="text-2xl font-black text-foreground dark:text-white">{dict.common.story}</h4>
                </div>
                <p className="text-lg text-foreground/80 dark:text-white/80 font-bold leading-relaxed italic">
                  {place.description || "이 장소의 깊은 역사와 웰니스 리듬을 발견할 수 있는 상세한 이야기가 준비되고 있습니다."}
                </p>
              </section>

              {/* Wellness Tip */}
              <section className="bg-accent/[0.05] dark:bg-white/10 p-8 rounded-[2rem] border border-accent/20 dark:border-white/20 relative overflow-hidden group hover:bg-accent/[0.08] transition-colors shadow-lg shadow-black/10">
                <div className="absolute -right-8 -bottom-8 text-accent/10 group-hover:text-accent/20 transition-all duration-500">
                  <Sparkles className="w-32 h-32 rotate-12" />
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2 text-accent font-black uppercase text-xs tracking-widest">
                    <Sparkles className="w-4 h-4" />
                    Wellness Insight
                  </div>
                  <h4 className="text-xl font-black text-foreground dark:text-white">{dict.common.wellnessTip}</h4>
                  <div className="space-y-3">
                    {place.wellnessTips && place.wellnessTips.length > 0 ? (
                      place.wellnessTips.map((tip, idx) => (
                        <div key={idx} className="flex gap-3 text-sm font-bold text-foreground/70 dark:text-white/90 leading-relaxed list-item list-inside marker:text-accent">
                          {tip}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm font-bold text-foreground/70 dark:text-white/90 leading-relaxed">
                        숨겨진 82개의 보물 중 하나인 이곳은 바쁜 일상을 잠시 잊고, 정선의 맑은 정기와 함께 영혼의 질서를 되찾기에 가장 최적화된 공간입니다. 30분 정도의 느린 걸음으로 공간의 정적을 느껴보세요.
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Nearby Recommendations */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-black text-foreground dark:text-white">{dict.common.nearbyTreasures}</h4>
                  <div className="text-[10px] font-black uppercase tracking-widest text-foreground/20 dark:text-white/30">Discovery Loop</div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {nearbyPlaces.map((np) => (
                    <div key={np.id} className="flex items-center justify-between p-5 bg-white dark:bg-white/[0.08] border border-foreground/5 dark:border-white/10 rounded-[1.5rem] hover:border-accent/40 group transition-all hover:translate-x-2 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-foreground/5 dark:bg-white/10 text-foreground dark:text-white group-hover:bg-accent group-hover:text-white rounded-xl transition-all">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-black text-foreground dark:text-white group-hover:text-accent transition-colors">{np.name}</p>
                          <p className="text-[10px] font-bold text-foreground/40 dark:text-white/40 uppercase tracking-widest">{np.category}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-foreground/10 dark:text-white/20 group-hover:text-accent transition-colors" />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
