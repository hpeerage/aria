"use client";

import { motion } from "framer-motion";
import { Sparkles, Mountain, Wind, Users, Map as MapIcon, Calendar, ArrowRight } from "lucide-react";
import PlaceList from "@/components/PlaceList";
import { Place } from "@/types/place";

interface HomeClientProps {
  places: Place[];
}

export default function HomeClient({ places }: HomeClientProps) {
  return (
    <main className="min-h-screen bg-[#F8FAF9] dark:bg-forest-dark overflow-x-hidden">
      {/* Hero Section with Animation */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-forest group">
        <motion.div 
          animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1950')] bg-cover bg-center opacity-30 grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/80 to-transparent" />
        
        <motion.div 
          animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-white/10"
        >
          <Mountain size={120} />
        </motion.div>
        <motion.div 
          animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-10 text-white/10"
        >
          <Wind size={100} />
        </motion.div>

        <div className="relative z-10 text-center px-4 space-y-12 max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-accent text-sm font-black tracking-[0.3em] uppercase mb-4"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            Wellness Curation Platform
            <Sparkles className="w-4 h-4 animate-pulse" />
          </motion.div>
          
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none"
            >
              JEONGSEON <br />
              <span className="text-accent underline decoration-white/10 decoration-8 underline-offset-8">ARIA</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.6 }}
              className="text-xl md:text-2xl text-white/60 font-medium tracking-tight max-w-2xl mx-auto"
            >
              어머니의 아리랑처럼 깊고 고요한 정선의 82개 치유 거점을 <br className="hidden md:block" />
              당신의 리듬에 맞춰 큐레이션합니다.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col md:flex-row gap-6 justify-center pt-8"
          >
            <button className="px-10 py-5 bg-accent text-white rounded-3xl font-black text-lg hover:bg-white hover:text-forest transition-all duration-500 shadow-2xl shadow-accent/20 active:scale-95 group flex items-center gap-3 justify-center">
              지금 탐험하기
              <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </button>
            <button className="px-10 py-5 bg-white/10 backdrop-blur-xl text-white border border-white/20 rounded-3xl font-black text-lg hover:bg-white/20 transition-all active:scale-95">
              기획서 내려받기
            </button>
          </motion.div>
        </div>
      </section>

      {/* Statistics Bar */}
      <section className="relative z-20 max-w-7xl mx-auto -mt-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white dark:bg-forest p-10 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-forest/5"
        >
          <StatItem icon={<MapIcon className="w-8 h-8" />} label="관광 자원" value="82" suffix="Assets" />
          <StatItem icon={<Users className="w-8 h-8" />} label="추천 경로" value="12" suffix="Paths" />
          <StatItem icon={<Calendar className="w-8 h-8" />} label="웰니스 지수" value="98%" suffix="Vitality" />
          <StatItem icon={<Sparkles className="w-8 h-8" />} label="신규 장소" value="24" suffix="Updated" />
        </motion.div>
      </section>

      {/* Dynamic Content: Place List */}
      <section className="relative py-20 px-4">
        <PlaceList initialPlaces={places} />
      </section>

      {/* Footer */}
      <footer className="py-20 bg-forest text-white/30 text-center border-t border-white/5">
        <div className="container mx-auto px-4 space-y-4">
          <p className="font-black tracking-[0.4em] uppercase text-sm">Jeongseon Aria - Wellness Curation Portal</p>
          <p className="text-[10px] font-medium">&copy; 2026 Jeongseon Wellness Tourism Project. All Rights Reserved.</p>
        </div>
      </footer>
    </main>
  );
}

function StatItem({ icon, label, value, suffix }: { icon: React.ReactNode; label: string; value: string; suffix: string }) {
  return (
    <div className="flex flex-col items-center space-y-3 group cursor-default">
      <div className="p-4 bg-forest/5 text-forest group-hover:bg-accent group-hover:text-white rounded-[2rem] transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-accent/30 group-hover:-translate-y-2">
        {icon}
      </div>
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-widest font-black text-forest/30 group-hover:text-accent transition-colors">{label}</p>
        <p className="text-3xl font-black text-forest">{value}</p>
        <p className="text-[9px] font-bold text-forest/20 uppercase tracking-tighter">{suffix}</p>
      </div>
    </div>
  );
}
