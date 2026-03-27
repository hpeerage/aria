"use client";

import { useState } from "react";
import { Place } from "@/types/place";
import { Tag, MapPin, Search, Filter, Compass } from "lucide-react";
import AriaMap from "./AriaMap";

interface PlaceListProps {
  initialPlaces: Place[];
}

export default function PlaceList({ initialPlaces }: PlaceListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const categories = ["전체", ...Array.from(new Set(initialPlaces.map((p) => p.category)))];

  const filteredPlaces = initialPlaces.filter((place) => {
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "전체" || place.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 space-y-12">
      
      {/* Interactive Map Section */}
      <section className="space-y-6 animate-in fade-in duration-1000 scale-95 hover:scale-[0.98] transition-transform">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent rounded-2xl text-white shadow-xl shadow-accent/20">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-forest">정선 아리아 지도</h2>
              <p className="text-sm font-bold text-forest/40 uppercase tracking-widest leading-none">Interactive Exploration</p>
            </div>
          </div>
          
          <div className="hidden md:flex gap-4 text-[10px] font-black uppercase tracking-widest text-forest/30">
            <span>82 Assets Mapped</span>
            <span>•</span>
            <span>Real-time Sync</span>
          </div>
        </div>
        
        <AriaMap places={filteredPlaces} />
      </section>

      {/* Search and Filter Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-forest-dark p-6 rounded-[2.5rem] shadow-2xl border border-forest/5 sticky top-6 z-20 backdrop-blur-3xl bg-opacity-90">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/40" />
          <input
            type="text"
            placeholder="장소 이름을 검색하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-forest/5 border-none focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-forest/30 font-bold"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter className="w-5 h-5 text-forest/40 mr-2 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap uppercase tracking-widest ${
                selectedCategory === cat
                  ? "bg-accent text-white shadow-xl shadow-accent/30 scale-105"
                  : "bg-forest/5 text-forest/60 hover:bg-forest/10 hover:text-forest"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <p className="text-forest/60 text-sm font-bold tracking-tight px-4">
        당신을 기다리는 <span className="text-accent underline underline-offset-4 decoration-accent/20 font-black">{filteredPlaces.length}</span>개의 보물 같은 공간들
      </p>

      {/* Place Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {filteredPlaces.map((place) => (
          <div
            key={place.id}
            className="group relative bg-white dark:bg-forest p-1 rounded-[2.5rem] border border-forest/5 shadow-xl hover:shadow-[0_45px_100px_-20px_rgba(26,67,47,0.1)] hover:-translate-y-3 transition-all duration-700 overflow-hidden"
          >
            <div className="p-8 h-full flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-accent/80 bg-accent/5 px-3 py-1.5 rounded-xl border border-accent/10">
                    No. {place.id}
                  </span>
                  <div className="p-3 rounded-full bg-forest/5 text-forest group-hover:bg-accent group-hover:text-white transition-all duration-500 transform group-hover:rotate-12 shadow-sm group-hover:shadow-lg group-hover:shadow-accent/40">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-forest group-hover:text-accent transition-colors leading-tight">
                  {place.name}
                </h3>
                
                <div className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.1em] text-forest/50 bg-forest/5 px-3 py-1 rounded-lg">
                  <Tag className="w-3 h-3 mr-2" />
                  {place.category}
                </div>

                <p className="text-sm text-forest/60 line-clamp-3 leading-relaxed font-bold italic opacity-80 group-hover:opacity-100 transition-opacity">
                  {place.description || "이 장소에 대한 신비로운 이야기가 곧 추가될 예정입니다."}
                </p>
              </div>

              <div className="pt-6 border-t border-forest/5 flex justify-between items-center text-[10px] font-black tracking-widest font-mono text-forest/20 group-hover:text-forest/40 transition-colors uppercase">
                <span>Lat: {place.coordinates.lat.toFixed(4)}</span>
                <span>Lng: {place.coordinates.lng.toFixed(4)}</span>
              </div>
            </div>
            
            {/* Hover Decor - Luxury Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full -mr-24 -mt-24 group-hover:bg-accent/10 transition-all duration-1000 blur-3xl opacity-0 group-hover:opacity-100" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-forest/5 rounded-full group-hover:bg-forest/10 transition-all duration-1000 blur-2xl opacity-0 group-hover:opacity-100" />
          </div>
        ))}
      </div>

      {filteredPlaces.length === 0 && (
        <div className="py-48 text-center space-y-8 animate-in zoom-in duration-500">
          <div className="w-32 h-32 bg-forest/[0.02] rounded-full flex items-center justify-center mx-auto text-forest/10 border-2 border-dashed border-forest/5">
            <Search className="w-16 h-16 animate-pulse" />
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-black text-forest/50 italic tracking-tighter">오리무중 (五里霧中)</p>
            <p className="text-forest/30 font-bold uppercase tracking-widest">찾으시는 장소가 아직 안개 속에 있습니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Tag({ className }: { className?: string }) {
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
