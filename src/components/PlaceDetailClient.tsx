"use client";
import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Tag, Sparkles, Navigation, Share2, Compass, MoveRight, X, Maximize2 } from "lucide-react";
import Link from "next/link";
import { Place } from "@/types/place";
import { useLanguage } from "@/lib/i18n/context";

interface PlaceDetailClientProps {
  place: Place;
  nearbyPlaces: Place[];
}

export default function PlaceDetailClient({ place, nearbyPlaces }: PlaceDetailClientProps) {
  const { dict } = useLanguage();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const displayImages = place.images && place.images.length > 0 ? place.images : ["https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1950"];

  // Auto-play gallery
  useEffect(() => {
    if (displayImages.length <= 1 || isLightboxOpen) return;
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % displayImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [displayImages.length, isLightboxOpen]);

  return (
    <main className="min-h-screen bg-[#F8FAF9] dark:bg-forest-dark pb-32">
      {/* Lightbox Overlay */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-forest/95 backdrop-blur-3xl flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-6xl w-full h-full flex items-center justify-center"
            >
              <img 
                src={displayImages[currentImgIndex]} 
                alt={place.name} 
                className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl"
              />
              <button 
                className="absolute top-4 right-4 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all"
                onClick={() => setIsLightboxOpen(false)}
              >
                <X className="w-8 h-8" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Hero Header */}
      <section 
        className="relative h-[65vh] bg-forest flex items-center justify-center overflow-hidden cursor-zoom-in"
        onClick={() => setIsLightboxOpen(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentImgIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.4, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-cover bg-center grayscale blur-xs"
            style={{ backgroundImage: `url('${displayImages[currentImgIndex]}')` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAF9] via-forest/60 to-transparent" />
        
        {/* Floating Expand Icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="p-6 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20">
            <Maximize2 className="w-8 h-8" />
          </div>
        </div>
        {/* Image Indicator Dots */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            {displayImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImgIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  currentImgIndex === idx ? "bg-accent w-8" : "bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
        <div className="relative z-10 text-center space-y-8 px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-accent text-xs font-black tracking-widest uppercase"
          >
            No. {place.id} • {place.category}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-black text-white tracking-tighter"
          >
            {place.name}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-6 text-white/60 font-bold"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              {dict.common.location}
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5" />
              82 {dict.stats.assets}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-forest p-10 md:p-16 rounded-[4rem] shadow-2xl border border-forest/5 space-y-10"
            >
              <div className="flex justify-between items-center">
                <Link 
                  href="/" 
                  className="group flex items-center gap-3 text-forest/40 hover:text-accent font-black text-xs tracking-widest uppercase transition-all"
                >
                  <div className="p-3 bg-forest/5 rounded-2xl group-hover:bg-accent/10 transition-all">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </div>
                  {dict.common.backToList}
                </Link>
                <div className="flex gap-4">
                  <button className="p-3 bg-forest/5 text-forest hover:bg-forest/10 rounded-2xl transition-all active:scale-95">
                    <Navigation className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-forest/5 text-forest hover:bg-forest/10 rounded-2xl transition-all active:scale-95">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-10 bg-accent rounded-full" />
                  <h2 className="text-3xl font-black text-forest">{dict.common.story}</h2>
                </div>
                <p className="text-xl text-forest/70 font-bold leading-relaxed italic">
                  {place.description || "이 장소의 깊은 역사와 웰니스 리듬을 발견할 수 있는 상세한 이야기가 준비되고 있습니다. 정선의 자연이 빚어낸 이곳에서 당신만의 새로운 아리아를 시작해 보세요."}
                </p>
              </div>

              <div className="relative group bg-accent/5 p-10 rounded-[3rem] border border-accent/10 overflow-hidden">
                <Sparkles className="absolute -right-6 -bottom-6 w-32 h-32 text-accent/10 group-hover:rotate-12 transition-transform duration-1000" />
                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-accent/10 rounded-xl text-accent text-[10px] font-black uppercase tracking-[0.2em]">
                    <Sparkles className="w-4 h-4" />
                    Wellness Insight
                  </div>
                  <h3 className="text-2xl font-black text-forest">{dict.common.wellnessTip}</h3>
                  <p className="text-forest/60 font-bold leading-relaxed">
                    82개의 관광 자원 중 한 곳인 이곳은 특히 아침의 정운과 저녁의 노을이 아름다운 곳입니다. 
                    스마트폰을 잠시 내려놓고 공간이 들려주는 소리에 집중해 보세요. 
                    이곳의 기운은 당신의 지친 영혼에 새로운 질서를 부여할 것입니다.
                  </p>
                </div>
              </div>
            </motion.div>

            <section className="space-y-8">
              <div className="flex items-center justify-between px-6">
                <h3 className="text-2xl font-black text-forest tracking-tight">{dict.common.nearbyTreasures}</h3>
                <div className="text-[10px] font-black uppercase tracking-widest text-forest/20">Discovery Loop</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {nearbyPlaces.map((np) => (
                  <Link key={np.id} href={`/places/${np.id}`} className="block group">
                    <motion.div 
                      whileHover={{ x: 10 }}
                      className="p-6 bg-white dark:bg-forest border border-forest/5 rounded-[2.5rem] flex items-center justify-between hover:border-accent/30 transition-all hover:shadow-xl shadow-forest/5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-forest/5 text-forest group-hover:bg-accent group-hover:text-white rounded-2xl transition-all">
                          <Tag className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-black text-forest group-hover:text-accent transition-colors">{np.name}</p>
                          <p className="text-[10px] font-bold text-forest/40 uppercase tracking-widest">{np.category}</p>
                        </div>
                      </div>
                      <MoveRight className="w-5 h-5 text-forest/10 group-hover:text-accent transition-all" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-forest p-10 rounded-[3rem] shadow-xl border border-forest/5 space-y-8 sticky top-32"
            >
              <h4 className="text-lg font-black text-forest uppercase tracking-widest border-b border-forest/5 pb-4">{dict.common.quickFact}</h4>
              <div className="space-y-6">
                <SidebarItem label={dict.common.location} value="Jeongseon, Gangwon-do" />
                <SidebarItem label={dict.common.category} value={place.category} />
                <SidebarItem label={dict.common.coordinates} value={`${place.coordinates.lat.toFixed(4)}, ${place.coordinates.lng.toFixed(4)}`} />
              </div>
              <div className="pt-6">
                <button className="w-full py-5 bg-forest text-white rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-accent transition-all shadow-lg active:scale-95">
                  {dict.common.findRoute} (Google Maps)
                </button>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function SidebarItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase tracking-widest text-forest/30">{label}</p>
      <p className="text-sm font-black text-forest">{value}</p>
    </div>
  );
}
