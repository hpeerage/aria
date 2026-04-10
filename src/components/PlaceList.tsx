"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Place } from "@/types/place";
import { Search, Compass, ArrowRight, Navigation, LayoutGrid, Trees, Sparkles, UtensilsCrossed, Landmark, Home, MoreHorizontal, Palmtree, X, Heart, Droplets } from "lucide-react";
import AriaMap from "./AriaMap";
import AriaDetailModal from "./AriaDetailModal";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { useWishlist } from "@/lib/wishlist/context";
import { validateImagePaths } from "@/lib/place-images";
import { normalizeCategory } from "@/lib/google-sheets";

interface PlaceListProps {
  initialPlaces: Place[];
}

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
};

const getCategoryConfig = (cat: string, dict: any, customIcon?: string, customColor?: string) => {
  const iconMap: Record<string, any> = {
    nature: Trees, water: Droplets, activity: Sparkles, food: UtensilsCrossed, culture: Palmtree, stay: Home,
    Trees, Droplets, Sparkles, UtensilsCrossed, Palmtree, Home, 
    Star, Heart, Camera, Landmark, Bed, 
    Mountain, Palette, MapPin, Compass, Navigation, Coffee,
    ShoppingBag, Ticket, Flag, Flame, Wind, Sunrise
  };

  const colorMap: Record<string, { color: string, bg: string }> = {
    nature: { color: "text-emerald-500", bg: "bg-emerald-500/10" },
    water: { color: "text-sky-500", bg: "bg-sky-500/10" },
    activity: { color: "text-rose-500", bg: "bg-rose-500/10" },
    food: { color: "text-orange-500", bg: "bg-orange-500/10" },
    culture: { color: "text-amber-500", bg: "bg-amber-500/10" },
    stay: { color: "text-indigo-500", bg: "bg-indigo-500/10" },
    emerald: { color: "text-emerald-500", bg: "bg-emerald-500/10" },
    sky: { color: "text-sky-500", bg: "bg-sky-500/10" },
    rose: { color: "text-rose-500", bg: "bg-rose-500/10" },
    orange: { color: "text-orange-500", bg: "bg-orange-500/10" },
    amber: { color: "text-amber-500", bg: "bg-amber-500/10" },
    indigo: { color: "text-indigo-500", bg: "bg-indigo-500/10" },
    slate: { color: "text-slate-500", bg: "bg-slate-500/10" },
    forest: { color: "text-forest", bg: "bg-forest/10" },
    accent: { color: "text-accent", bg: "bg-accent/10" },
  };

  if (cat === dict.common.all) return { icon: LayoutGrid, label: dict.common.all, bg: "bg-forest/10 dark:bg-white/20", color: "text-forest dark:text-white" };
  if (cat === dict.common.nearMe) return { icon: Navigation, label: dict.common.nearMe, bg: "bg-accent/10", color: "text-accent" };
  if (cat === "water") 
    return { icon: Droplets, label: (dict.categories as any).water || cat, bg: "bg-sky-500/10", color: "text-sky-500" };
  
  if (cat === "activity") 
    return { icon: Sparkles, label: (dict.categories as any).activity || cat, bg: "bg-rose-500/10", color: "text-rose-500" };
  
  if (cat === "food") 
    return { icon: UtensilsCrossed, label: (dict.categories as any).food || cat, bg: "bg-orange-500/10", color: "text-orange-500" };
  
  if (cat === "culture") 
    return { icon: Palmtree, label: (dict.categories as any).culture || cat, bg: "bg-amber-500/10", color: "text-amber-500" };
  
  if (cat === "stay") 
    return { icon: Home, label: (dict.categories as any).stay || cat, bg: "bg-indigo-500/10", color: "text-indigo-500" };
  
  return { icon: Droplets, label: (dict.categories as any).etc || cat, bg: "bg-slate-500/10", color: "text-slate-500" }; 
};
export default function PlaceList({ initialPlaces }: PlaceListProps) {
  const { dict } = useLanguage();
  const { togglePlace, isInWishlist } = useWishlist();
  const searchParams = useSearchParams();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(dict.common.all);
  const [activePlace, setActivePlace] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Sync search term from URL param ?q=
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchTerm(decodeURIComponent(q));
      setSelectedCategory(dict.common.all);
    }
  }, [searchParams, dict.common.all]);

  const clearSearch = () => {
    setSearchTerm("");
    router.push("/");
  };

  useEffect(() => {
    const syncLocalChanges = async () => {
      // 1. [v0.8.1] 런타임 GitHub 서버 데이터 동동기화 (최우선)
      try {
        const isProd = typeof window !== 'undefined' && 
                       (window.location.hostname.includes('github.io') || window.location.hostname.includes('vercel.app'));
        const basePath = isProd ? '/aria' : '';
        const timestamp = new Date().getTime();
        const syncRes = await fetch(`${basePath}/data/places.json?t=${timestamp}`, { cache: 'no-store' });
        
        if (syncRes.ok) {
          const syncedFromGithub: Place[] = await syncRes.json();
          const merged = [...initialPlaces];
          
          syncedFromGithub.forEach((remotePlace: Place) => {
            const idx = merged.findIndex(p => p.id === remotePlace.id);
            if (idx >= 0) {
              merged[idx] = remotePlace;
            } else {
              merged.push(remotePlace);
            }
          });
          
          // 2. LocalStorage 데이터 병합 (서버 데이터보다 최신일 경우에만 우선순위)
          const localData = localStorage.getItem('aria_local_places');
          if (localData) {
            const parsed = JSON.parse(localData);
            parsed.forEach((localPlace: Place) => {
              const idx = merged.findIndex(p => p.id === localPlace.id);
              if (idx >= 0) {
                // [v0.9.7] 서버 데이터와 로컬 데이터 중 더 최신 업데이트된 것을 선택
                const serverPlace = merged[idx];
                const serverTime = new Date(serverPlace.lastUpdated || 0).getTime();
                const localTime = new Date(localPlace.lastUpdated || 0).getTime();
                
                if (localTime >= serverTime) {
                  merged[idx] = localPlace;
                }
              } else {
                merged.push(localPlace);
              }
            });
          }
          
          // [v0.8.3] 최종 좌표 유효성 검사 (0,0 방지)
          const JEONGSEON_CENTER = { lat: 37.3806, lng: 128.6608 };
          const validated = merged.map(p => {
            if (!p.coordinates || !p.coordinates.lat || !p.coordinates.lng || p.coordinates.lat === 0 || p.coordinates.lng === 0) {
              return { ...p, coordinates: JEONGSEON_CENTER };
            }
            return p;
          }).map(p => {
            const normalizedCategory = normalizeCategory(p.category);
            return {
              ...p,
              category: normalizedCategory,
              images: validateImagePaths(p.images || [], p.id, normalizedCategory)
            };
          });
          
          setPlaces(validated);
          return;
        }
      } catch (err) {
        console.warn("Runtime github sync failed, fallback to local only:", err);
      }

      // 기존 폴백 로직 (로컬 스토리지 한정)
      const localData = localStorage.getItem('aria_local_places');
      if (localData) {
        const JEONGSEON_CENTER = { lat: 37.3806, lng: 128.6608 };
        const parsed = JSON.parse(localData).map((p: Place) => {
          if (!p.coordinates || !p.coordinates.lat || !p.coordinates.lng || p.coordinates.lat === 0 || p.coordinates.lng === 0) {
            return { ...p, coordinates: JEONGSEON_CENTER };
          }
          return p;
        }).map((p: Place) => {
          const normalizedCategory = normalizeCategory(p.category);
          return {
            ...p,
            category: normalizedCategory,
            images: validateImagePaths(p.images || [], p.id, normalizedCategory)
          };
        });
        const merged = [...initialPlaces];
        
        parsed.forEach((localPlace: Place) => {
          const idx = merged.findIndex(p => p.id === localPlace.id);
          if (idx >= 0) {
            merged[idx] = localPlace;
          } else {
            merged.push(localPlace);
          }
        });
        setPlaces(merged);
      } else {
        setPlaces(initialPlaces);
      }
    };

    // Initial sync
    syncLocalChanges();

    // Listen to storage changes across tabs for real-time map updates
    window.addEventListener('storage', syncLocalChanges);
    return () => window.removeEventListener('storage', syncLocalChanges);
  }, [initialPlaces]);

  const categories = [dict.common.all, dict.common.nearMe, ...Array.from(new Set(places.map((p) => p.category)))];

  // Handle horizontal mouse wheel scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollTo({
        left: el.scrollLeft + e.deltaY * 2,
        behavior: "smooth"
      });
    };

    el.addEventListener("wheel", onWheel);
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const handleLocateMe = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert("브라우저가 위치 정보를 지원하지 않습니다.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
        setSelectedCategory(dict.common.nearMe);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("위치 정보를 가져오는 데 실패했습니다.");
        setIsLocating(false);
      }
    );
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filteredPlaces = places
    .filter((place) => {
      const lowerSearch = searchTerm.toLowerCase();
      const localizedCategory = (dict.categories as any)[place.category] || "";
      
      const matchesSearch = 
        place.name.toLowerCase().includes(lowerSearch) ||
        place.category.toLowerCase().includes(lowerSearch) ||
        localizedCategory.toLowerCase().includes(lowerSearch);
      
      const matchesCategory =
        selectedCategory === dict.common.all ||
        (selectedCategory === dict.common.nearMe && userLocation) ||
        place.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (selectedCategory === dict.common.nearMe && userLocation) {
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.coordinates.lat, a.coordinates.lng);
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.coordinates.lat, b.coordinates.lng);
        return distA - distB;
      }
      
      // [v0.8.6] "전체" 탭에서 카테고리별 그룹화 정렬 (시트 순서와 관계없이 묶어서 표시)
      if (selectedCategory === dict.common.all) {
        const categoryOrder = ["nature", "water", "activity", "food", "culture", "stay"];
        const orderA = categoryOrder.indexOf(a.category);
        const orderB = categoryOrder.indexOf(b.category);
        
        if (orderA !== orderB) {
          return (orderA === -1 ? 99 : orderA) - (orderB === -1 ? 99 : orderB);
        }
        // 같은 카테고리 내에서는 ID 순서(기본 시트 순서) 유지
        return a.id - b.id;
      }
      
      return 0;
    });

  return (
    <div id="list" className="w-full max-w-7xl mx-auto px-4 py-12 space-y-12 scroll-mt-24 md:scroll-mt-32">
      
      {/* Interactive Map Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-3 bg-accent rounded-2xl text-white shadow-xl shadow-accent/20"
            >
              <Compass className="w-6 h-6" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-black text-forest dark:text-white tracking-tighter">정선 아리아 지도</h2>
              <p className="text-sm font-bold text-forest/70 dark:text-white/40 uppercase tracking-widest leading-none">Interactive Exploration</p>
            </div>
          </div>
          
          <div className="hidden md:flex gap-4 text-[10px] font-black uppercase tracking-widest text-forest/50 dark:text-white/30 italic">
            <span>82 Local Jewels Mapped</span>
            <span>•</span>
            <span>Live Data Sync</span>
          </div>
        </div>
        
        <AriaMap 
          places={filteredPlaces} 
          onMarkerClick={(place) => setActivePlace(place)}
          userLocation={userLocation}
        />
      </motion.section>

      {/* Search and Advanced Filter Header - Made Sticky for better UX */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10 sticky top-[80px] md:top-[120px] z-[50] transition-all duration-500 pointer-events-auto"
      >
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/90 dark:bg-forest-dark/90 p-4 md:p-6 rounded-3xl md:rounded-[3rem] shadow-2xl border border-forest/5 backdrop-blur-3xl transition-all duration-500">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/40 group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder={dict.common.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-12 py-4 rounded-[2rem] bg-forest/5 dark:bg-white/5 border-none focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-forest/30 dark:placeholder:text-white/30 font-bold dark:text-white"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-forest/10 dark:bg-white/10 text-forest/50 dark:text-white/50 hover:bg-accent hover:text-white transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 px-6 w-full md:w-auto">
            {searchTerm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-2xl"
              >
                <Search className="w-3 h-3 text-accent" />
                <span className="text-xs font-black text-accent">&quot;{searchTerm}&quot;</span>
                <button onClick={clearSearch} className="ml-1 text-accent/60 hover:text-accent">
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-forest/60 dark:text-white/60 text-sm font-black tracking-widest uppercase flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              {dict.common.placesFound.replace("{count}", filteredPlaces.length.toString())}
            </motion.p>
          </div>
        </div>

        {/* Category Filters - Responsive: Dropdown for Mobile, Icon Grid for Desktop */}
        <div className="relative -mx-4 -my-8 md:-my-16 px-4 py-8 md:py-16 group/scroll">
          
          {/* 📱 Mobile Dropdown View (Hidden per user request - "not working properly") */}
          <div className="hidden px-4 relative z-[100]">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-8 py-5 bg-white dark:bg-forest border border-forest/10 dark:border-white/10 rounded-3xl shadow-xl backdrop-blur-3xl group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${getCategoryConfig(selectedCategory, dict).bg} ${getCategoryConfig(selectedCategory, dict).color}`}>
                  {(() => {
                    const Icon = getCategoryConfig(selectedCategory, dict).icon;
                    return <Icon className="w-5 h-5" />;
                  })()}
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-accent uppercase tracking-widest leading-none mb-1">Category</p>
                  <p className="text-base font-black text-forest dark:text-white">{getCategoryConfig(selectedCategory, dict).label}</p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                className="text-forest/30 dark:text-white/30"
              >
                <MoreHorizontal className="w-6 h-6" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsDropdownOpen(false)}
                    className="fixed inset-0 z-[-1] bg-black/5 backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="absolute top-[110%] left-4 right-4 bg-white/95 dark:bg-forest-dark/95 border border-forest/10 dark:border-white/10 rounded-[2.5rem] shadow-2xl backdrop-blur-3xl overflow-hidden p-3 space-y-2"
                  >
                    {categories.map((cat) => {
                      const catConfig = getCategoryConfig(cat, dict);
                      const isActive = selectedCategory === cat;
                      const Icon = catConfig.icon;

                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            if (cat === dict.common.nearMe) {
                              if (!userLocation) handleLocateMe();
                              else setSelectedCategory(cat);
                            } else {
                              setSelectedCategory(cat);
                            }
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                            isActive 
                              ? "bg-accent text-white shadow-lg shadow-accent/20" 
                              : "hover:bg-forest/5 dark:hover:bg-white/5 text-forest/70 dark:text-white/70"
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${isActive ? "bg-white/20 text-white" : `${catConfig.bg} ${catConfig.color}`}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-black tracking-tight">{catConfig.label}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* 💻 Desktop Icon Grid View (hidden md:flex) */}
          <div 
            ref={scrollRef}
            className="hidden md:flex gap-6 md:gap-8 overflow-x-auto py-10 md:py-16 scrollbar-hide snap-x snap-proximity px-12 pb-24 md:pb-40"
          >
            {categories.map((cat) => {
              const catConfig = getCategoryConfig(cat, dict);
              const isActive = selectedCategory === cat;
              const Icon = catConfig.icon;

              return (
                <motion.button
                  key={cat}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -15,
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    if (cat === dict.common.nearMe) {
                      if (!userLocation) handleLocateMe();
                      else setSelectedCategory(cat);
                    } else {
                      setSelectedCategory(cat);
                    }
                  }}
                  className={`relative group flex-shrink-0 flex flex-col items-center justify-center p-8 md:p-10 min-w-[140px] md:min-w-[160px] h-40 md:h-44 rounded-[3rem] transition-all duration-700 border snap-center ${
                    isActive 
                      ? `bg-white dark:bg-white/10 shadow-[0_45px_100px_-15px_rgba(0,0,0,0.5)] border-white/20 z-20 backdrop-blur-3xl` 
                      : "bg-white/[0.03] dark:bg-white/[0.02] border-white/5 dark:border-white/[0.03] hover:bg-white/[0.08] hover:border-white/10 shadow-2xl backdrop-blur-md"
                  }`}
                >
                  {/* Premium Neon Glow for Active Category */}
                  {isActive && (
                    <motion.div 
                      layoutId="active-glow"
                      className={`absolute inset-0 rounded-[3rem] blur-[60px] opacity-40 transition-all duration-1000 ${catConfig.bg}`}
                    />
                  )}
                  
                  <div className={`p-4 rounded-[1.5rem] mb-4 transition-all duration-500 group-hover:rotate-12 relative z-10 ${
                    isActive ? `${catConfig.bg} ${catConfig.color} shadow-[0_10px_30px_rgba(0,0,0,0.2)]` : "bg-white/5 text-white/20 group-hover:text-white/60"
                  }`}>
                    <Icon className={`w-7 h-7 ${cat === dict.common.nearMe && isLocating ? "animate-spin" : ""}`} />
                  </div>
                  
                  <span className={`text-[13px] font-black uppercase tracking-[0.25em] text-center relative z-10 whitespace-nowrap transition-colors duration-500 ${
                    isActive ? "text-forest dark:text-white" : "text-white/10 group-hover:text-white/40"
                  }`}>
                    {catConfig.label}
                  </span>

                  {isActive && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute -bottom-4 w-4 h-4 bg-accent rounded-full"
                      style={{ boxShadow: "0 0 30px rgba(255,127,80,1)" }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    />
                  )}
                </motion.button>
              );
            })}
            {/* [v0.12.9] Spacer to ensure padding-right is respected in horizontal scroll */}
            <div className="flex-shrink-0 w-12 h-1" aria-hidden="true" />
          </div>
          
          {/* Subtle decoration to indicate scroll ability on desktop */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 hidden md:flex gap-1 opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-1000">
             <div className="w-12 h-1 bg-forest/5 rounded-full overflow-hidden">
                <motion.div 
                  className="w-1/3 h-full bg-accent/40"
                  animate={{ x: ["-100%", "300%"] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                />
             </div>
          </div>
        </div>
      </motion.div>

      {/* Place Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
      >
        <AnimatePresence mode="popLayout">
          {filteredPlaces.map((place) => {
            const pConfig = getCategoryConfig(place.category, dict, place.icon, place.color);
            const CustomIcon = pConfig.icon;

            return (
              <Link key={place.id} href={`/places/${place.id}`} className="block group">
                <motion.div
                  layout
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="group relative bg-white dark:bg-forest p-1 rounded-[2.5rem] border border-forest/5 shadow-xl hover:shadow-[0_45px_100px_-20px_rgba(26,67,47,0.12)] hover:-translate-y-3 cursor-pointer transition-all duration-700 overflow-hidden h-full"
                >
                  <div className="relative h-48 w-full overflow-hidden rounded-[2rem] mb-4">
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-1000"
                      style={{ backgroundImage: `url('${(place.images && place.images.length > 0) ? place.images[0] : 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1950'}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/40 to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white bg-forest/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                        No. {place.id}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        togglePlace(place);
                      }}
                      className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 shadow-xl z-50 ${
                        isInWishlist(place.id) 
                          ? 'bg-rose-500 text-white border-rose-500/50 scale-110' 
                          : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/30 hover:scale-110'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(place.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="px-6 pb-8 flex-grow flex flex-col justify-between space-y-6 relative z-10">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className={`inline-flex items-center text-[10px] font-black uppercase tracking-[0.1em] px-3 py-1 rounded-lg border ${pConfig.bg.replace('bg-', 'bg-')}/5 ${pConfig.color} ${pConfig.bg.replace('bg-', 'border-')}/10`}>
                          <CustomIcon className="w-3 h-3 mr-2" />
                          {pConfig.label}
                        </div>
                        {userLocation && (
                          <div className={`flex items-center text-[10px] font-black uppercase tracking-[0.1em] font-mono ml-auto ${pConfig.color}`}>
                          {calculateDistance(
                            userLocation.lat,
                            userLocation.lng,
                            place.coordinates.lat,
                            place.coordinates.lng
                          ).toFixed(1)}km
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-black text-forest dark:text-white group-hover:text-accent transition-colors leading-tight">
                      {place.name}
                    </h3>
                    
                    <p className="text-xs text-forest/60 dark:text-white/80 line-clamp-3 leading-relaxed font-bold italic opacity-90 group-hover:opacity-100 transition-opacity">
                      {place.description || "이 장소에 대한 신비로운 이야기가 곧 추가될 예정입니다."}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-forest/10 dark:border-white/10 flex justify-between items-center group-hover:border-accent/20 transition-colors">
                    <span className="text-[10px] font-black tracking-widest font-mono text-forest/20 dark:text-white/40 group-hover:text-accent/60 uppercase transition-colors">
                      {dict.common.viewCuration}
                    </span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowRight className="w-4 h-4 text-forest/20 dark:text-white/40 group-hover:text-accent" />
                    </motion.div>
                  </div>
                </div>
                
                {/* Hover Luxury Decor */}
                <div className={`absolute top-0 right-0 w-48 h-48 rounded-full -mr-24 -mt-24 group-hover:opacity-10 transition-all duration-1000 blur-3xl opacity-0 ${pConfig.bg.replace('bg-', 'bg-')}/5 group-hover:bg-accent/10`} />
              </motion.div>
            </Link>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredPlaces.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-48 text-center space-y-8"
        >
          <div className="w-32 h-32 bg-forest/[0.02] rounded-full flex items-center justify-center mx-auto text-forest/10 border-2 border-dashed border-forest/5">
            <Search className="w-16 h-16 animate-pulse" />
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-black text-forest/50 italic tracking-tighter">오리무중 (五里霧中)</p>
            <p className="text-forest/30 font-bold uppercase tracking-widest">찾으시는 장소가 아직 안개 속에 있습니다.</p>
          </div>
        </motion.div>
      )}

      {/* Premium Detail Quick Modal (Keep for Map interactions) */}
      <AriaDetailModal 
        place={activePlace} 
        onClose={() => setActivePlace(null)} 
        allPlaces={places}
      />
    </div>
  );
}

function CustomTag({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" strokeWidth="2" 
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/>
      <path d="M7 7h.01"/>
    </svg>
  );
}
