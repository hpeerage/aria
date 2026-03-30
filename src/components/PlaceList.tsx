"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Place } from "@/types/place";
import { Search, Filter, Compass, ArrowRight, Navigation } from "lucide-react";
import AriaMap from "./AriaMap";
import AriaDetailModal from "./AriaDetailModal";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";

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

export default function PlaceList({ initialPlaces }: PlaceListProps) {
  const { dict } = useLanguage();
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(dict.common.all);
  const [activePlace, setActivePlace] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    // Merge with LocalStorage changes for real-time update in the same browser
    const localData = localStorage.getItem('aria_local_places');
    if (localData) {
      const parsed = JSON.parse(localData);
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
    }
  }, [initialPlaces]);

  const categories = [dict.common.all, dict.common.nearMe, ...Array.from(new Set(places.map((p) => p.category)))];

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
      const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase());
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
      return 0;
    });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 space-y-12">
      
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

      {/* Search and Filter Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-forest-dark p-6 rounded-[2.5rem] shadow-2xl border border-forest/5 sticky top-6 z-20 backdrop-blur-3xl bg-opacity-90 transition-all duration-500"
      >
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/40 group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder={dict.common.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-forest/5 dark:bg-white/5 border-none focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-forest/30 dark:placeholder:text-white/30 font-bold dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter className="w-5 h-5 text-forest/40 mr-2 flex-shrink-0" />
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (cat === dict.common.nearMe) {
                  if (!userLocation) {
                    handleLocateMe();
                  } else {
                    setSelectedCategory(cat);
                  }
                } else {
                  setSelectedCategory(cat);
                }
              }}
              className={`px-6 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap uppercase tracking-widest flex items-center gap-2 ${
                selectedCategory === cat
                  ? "bg-forest text-white shadow-xl shadow-forest/20 scale-105 dark:bg-accent dark:shadow-accent/20"
                  : "bg-forest/5 text-forest/80 dark:bg-white/5 dark:text-white/60 hover:bg-forest/10 hover:text-forest dark:hover:text-white"
              }`}
            >
              {cat === dict.common.nearMe && (
                <Navigation className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`} />
              )}
              {(dict.categories as any)[cat.toLowerCase()] || cat}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Stats Summary */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-forest/60 dark:text-white/60 text-sm font-bold tracking-tight px-4 flex items-center gap-2"
      >
        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
        {dict.common.placesFound.replace("{count}", filteredPlaces.length.toString())}
      </motion.p>

      {/* Place Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
      >
        <AnimatePresence mode="popLayout">
          {filteredPlaces.map((place) => (
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
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-1000 grayscale-[0.3] group-hover:grayscale-0"
                    style={{ backgroundImage: `url('${place.images?.[0] || 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1950'}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white bg-forest/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                      No. {place.id}
                    </span>
                  </div>
                </div>

                <div className="px-6 pb-8 flex-grow flex flex-col justify-between space-y-6 relative z-10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.1em] text-accent-light bg-accent/5 px-3 py-1 rounded-lg border border-accent/10">
                        <CustomTag className="w-3 h-3 mr-2" />
                        {(dict.categories as any)[place.category.toLowerCase()] || place.category}
                      </div>
                      {userLocation && (
                        <div className="flex items-center text-[10px] font-black uppercase tracking-[0.1em] text-accent font-mono ml-auto">
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
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full -mr-24 -mt-24 group-hover:bg-accent/10 transition-all duration-1000 blur-3xl opacity-0 group-hover:opacity-100" />
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
