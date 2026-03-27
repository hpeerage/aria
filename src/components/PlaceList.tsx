"use client";

import { useState } from "react";
import { Place } from "@/types/place";
import { Tag, MapPin, Search, Filter } from "lucide-react";

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
    <div className="w-full max-w-7xl mx-auto px-4 py-12 space-y-8">
      {/* Search and Filter Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-forest-dark p-6 rounded-3xl shadow-xl border border-forest/5 sticky top-6 z-10 backdrop-blur-md bg-opacity-80">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/40" />
          <input
            type="text"
            placeholder="장소 이름을 검색하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-forest/5 border-none focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-forest/30"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter className="w-5 h-5 text-forest/40 mr-2 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-accent text-white shadow-lg shadow-accent/20"
                  : "bg-forest/5 text-forest/70 hover:bg-forest/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <p className="text-forest/60 text-sm font-medium">
        총 <span className="text-accent font-bold">{filteredPlaces.length}</span>개의 보석 같은 장소를 찾았습니다.
      </p>

      {/* Place Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredPlaces.map((place) => (
          <div
            key={place.id}
            className="group relative bg-white dark:bg-forest p-1 rounded-[2rem] border border-forest/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
          >
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-accent/80 bg-accent/5 px-2 py-1 rounded-md">
                    No. {place.id}
                  </span>
                  <div className="p-2 rounded-full bg-forest/5 text-forest group-hover:bg-accent group-hover:text-white transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>
                
                <h3 className="text-xl font-extrabold text-forest group-hover:text-accent transition-colors">
                  {place.name}
                </h3>
                
                <div className="flex items-center text-xs font-semibold text-forest/50">
                  <Tag className="w-3 h-3 mr-1" />
                  {place.category}
                </div>

                <p className="text-sm text-forest/70 line-clamp-2 leading-relaxed font-medium">
                  {place.description || "이 장소에 대한 신비로운 이야기가 곧 추가될 예정입니다."}
                </p>
              </div>

              <div className="pt-4 border-t border-forest/5 flex justify-between items-center text-[10px] font-mono text-forest/40 lowercase">
                <span>lat: {place.coordinates.lat.toFixed(4)}</span>
                <span>lng: {place.coordinates.lng.toFixed(4)}</span>
              </div>
            </div>
            
            {/* Hover Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 group-hover:bg-accent/10 transition-colors duration-500" />
          </div>
        ))}
      </div>

      {filteredPlaces.length === 0 && (
        <div className="py-32 text-center space-y-4">
          <div className="w-20 h-20 bg-forest/5 rounded-full flex items-center justify-center mx-auto text-forest/20">
            <Search className="w-10 h-10" />
          </div>
          <p className="text-forest/40 font-semibold italic">찾으시는 장소가 아직 안개 속에 있습니다.</p>
        </div>
      )}
    </div>
  );
}
