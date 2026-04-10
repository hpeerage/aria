"use client";

import { motion } from "framer-motion";
import { 
  Map as MapIcon, Sparkles, ArrowUpRight, TrendingUp, Info, 
  Database, RefreshCcw, PlusSquare, AlertTriangle,
  Trees, Droplets, Utensils, Palmtree, Home, Activity
} from "lucide-react";

import { useEffect, useState } from "react";
import { getPlacesFromGoogleSheet } from "@/lib/google-sheets";
import { useLanguage } from "@/lib/i18n/context";
import { Place } from "@/types/place";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  const { dict } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    modified: 0,
    new: 0,
    integrity: 100,
    categories: {} as Record<string, number>
  });
  const [isLoading, setIsLoading] = useState(true);

  // v0.12.2: Hydration Guard
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    async function calculateStats() {
      setIsLoading(true);
      try {
        // 1. Fetch Server Data (GitHub/Sheet)
        const serverPlaces = await getPlacesFromGoogleSheet('1Setffm27HQ8LyOM3N9o9V8eA0ihGbZeZgN763jkm1WU');
        
        // 2. Load Local Data (Defensive Parsing)
        let localPlaces: Place[] = [];
        try {
          if (typeof window !== 'undefined') {
            const localData = localStorage.getItem('aria_local_places');
            if (localData) {
              localPlaces = JSON.parse(localData);
            }
          }
        } catch (e) {
          console.warn("Failed to parse local places", e);
        }

        // 3. Aggregate Stats
        let modifiedCount = 0;
        let newCount = 0;
        const categoryMap: Record<string, number> = {};

        // Merge logic to find modified/new
        const serverMap = new Map<number, Place>();
        if (serverPlaces && Array.isArray(serverPlaces)) {
          serverPlaces.forEach(p => {
            if (p && p.id) serverMap.set(p.id, p);
          });
        }

        if (Array.isArray(localPlaces)) {
          localPlaces.forEach(lp => {
            if (!lp || !lp.id) return;

            const sp = serverMap.get(lp.id);
            if (!sp) {
              newCount++;
            } else {
              // Defensive comparison for coordinates
              const lpCoords = lp.coordinates || { lat: 0, lng: 0 };
              const spCoords = sp.coordinates || { lat: 0, lng: 0 };
              
              const isSame = 
                lp.name === sp.name && 
                lp.category === sp.category && 
                Number(lpCoords.lat || 0).toFixed(6) === Number(spCoords.lat || 0).toFixed(6) &&
                Number(lpCoords.lng || 0).toFixed(6) === Number(spCoords.lng || 0).toFixed(6);
              
              if (!isSame) modifiedCount++;
            }
          });
        }

        // Combined unique places for total count & category distribution
        const combinedMap = new Map<number, Place>();
        if (serverPlaces && Array.isArray(serverPlaces)) {
          serverPlaces.forEach(p => combinedMap.set(p.id, p));
        }
        if (Array.isArray(localPlaces)) {
          localPlaces.forEach(p => {
            if (p && p.id) combinedMap.set(p.id, p);
          });
        }
        
        const allPlaces = Array.from(combinedMap.values());
        allPlaces.forEach(p => {
          if (p && p.category) {
            categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
          }
        });

        const integrity = serverPlaces && serverPlaces.length > 0 
          ? Math.max(0, Math.min(100, Math.round(((serverPlaces.length - modifiedCount) / serverPlaces.length) * 100)))
          : 100;

        setStats({
          total: allPlaces.length,
          modified: modifiedCount,
          new: newCount,
          integrity: isNaN(integrity) ? 100 : integrity,
          categories: categoryMap
        });
      } catch (err) {
        console.error("Dashboard calculation failed", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    calculateStats();
  }, [mounted]);

  // Safe dictionary access guards
  const metricCards = [
    { label: "Total Assets", value: stats.total, trend: "Master Registry", icon: Database, color: "text-white", bg: "bg-white/5" },
    { label: "Sync Pending", value: stats.modified, trend: "Modified", icon: RefreshCcw, color: "text-orange-400", bg: "bg-orange-500/10" },
    { label: "New Entries", value: stats.new, trend: "Locally Added", icon: PlusSquare, color: "text-accent", bg: "bg-accent/10" },
    { label: "Data Integrity", value: `${stats.integrity}%`, trend: "Optimal Health", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  const categoryConfigs: Record<string, any> = {
    nature: { icon: Trees, color: "text-emerald-400" },
    water: { icon: Droplets, color: "text-sky-400" },
    activity: { icon: Activity, color: "text-rose-400" },
    food: { icon: Utensils, color: "text-orange-400" },
    culture: { icon: Palmtree, color: "text-amber-400" },
    stay: { icon: Home, color: "text-indigo-400" },
  };

  // Prevent rendering anything if not mounted (Hydration Guard)
  if (!mounted || isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-[0.3em] text-xs animate-pulse">v0.12.5 Initializing Dashboard...</p>
      </div>
    );
  }

  // Safety fallback for dictionaries in case of partial load
  const categoriesDict = dict?.categories || {};
  const adminDict = dict?.admin || {};

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card) => (
          <motion.div 
            key={card.label}
            variants={item}
            className={`p-8 ${card.bg} border border-white/5 rounded-[2.5rem] relative overflow-hidden group hover:bg-white/10 transition-all hover:-translate-y-1`}
          >
            <div className={`p-4 bg-white/5 rounded-2xl w-fit mb-6 ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{card.label}</p>
              <div className="flex items-end gap-3">
                <h3 className={`text-4xl font-black text-white tracking-tighter`}>{card.value}</h3>
                <span className="text-[10px] font-bold text-white/20 mb-1">{card.trend}</span>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <card.icon className="w-24 h-24" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Category Breakdown */}
        <motion.div 
          variants={item}
          className="lg:col-span-2 p-10 bg-white/5 border border-white/10 rounded-[3.5rem] space-y-8 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-accent" />
              Category Distribution
            </h4>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Asset Taxonomy Analysis</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Object.entries(categoriesDict).map(([key, label]) => {
              const count = stats.categories[key] || 0;
              const catConfig = categoryConfigs[key] || { icon: MapIcon, color: "text-white" };
              const Icon = catConfig.icon;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;

              return (
                <Link 
                  href={`/admin/places?category=${key}`}
                  key={key} 
                  className="p-6 bg-white/5 border border-white/5 rounded-[2rem] space-y-4 group hover:border-accent/40 transition-all hover:-translate-y-1 block"
                >
                  <div className="flex items-start justify-between">
                    <div className={`p-3 bg-white/5 rounded-xl ${catConfig.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-black text-white">{count}</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-white/60">{String(label)}</p>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full bg-accent/60`} 
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Sync & System Status */}
        <motion.div 
          variants={item}
          className="p-10 bg-white/[0.03] border border-white/10 rounded-[3.5rem] space-y-10 relative overflow-hidden backdrop-blur-3xl"
        >
          <div className="space-y-4">
            <h4 className="text-2xl font-black text-white tracking-tight">{String(adminDict?.sysIntegrity || "System Integrity")}</h4>
            <p className="text-sm text-white/40 leading-relaxed">
              현재 로컬 브라우저와 클라우드 저장소 간의 데이터 불일치 여부를 모니터링합니다.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { label: "Connection", value: "Stable", color: "text-accent", pulse: true },
              { label: "Local Buffer", value: `${stats.modified + stats.new} Changes`, color: "text-white" },
              { label: "Cloud Source", value: "Verified", color: "text-blue-400" },
              { label: "Storage Capacity", value: "92% Free", color: "text-emerald-400" },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center py-4 border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{row.label}</span>
                <span className={`text-xs font-bold flex items-center gap-2 ${row.color}`}>
                  {row.pulse && <div className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />}
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <div className="p-6 bg-accent/5 border border-accent/20 rounded-2xl flex items-center gap-4">
            <AlertTriangle className="w-6 h-6 text-accent animate-pulse" />
            <p className="text-[10px] font-bold text-accent leading-relaxed">
              수정 사항이 있는 경우 우측 상단 [Cloud Sync] 버튼을 통해 GitHub에 반영해 주세요.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer Info */}
      <motion.div 
        variants={item}
        className="p-8 bg-forest-dark border border-white/10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-6 text-center md:text-left">
          <div className="p-4 bg-white/5 rounded-2xl">
            <Info className="w-6 h-6 text-white/40" />
          </div>
          <div>
            <h5 className="text-sm font-black text-white">System Monitor Active</h5>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Updates checked every route transition</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 border border-white/5">
            Registry: v2.5.0
          </div>
          <div className="px-6 py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 border border-white/5">
            Node: GH-PAGES-CDN
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
