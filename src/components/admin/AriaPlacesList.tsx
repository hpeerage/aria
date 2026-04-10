"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Edit2, Trash2, Eye, MapPin, Tag, Sparkles, AlertCircle, CheckCircle2, Trees, Droplets, Utensils, Palmtree, Home, Star, Heart, Camera, Landmark, Bed, Mountain, Palette, Compass, Navigation, Coffee, ShoppingBag, Ticket, Flag, Flame, Wind, Sunrise } from "lucide-react";
import Link from "next/link";
import { Place } from "@/types/place";

import { useLanguage } from "@/lib/i18n/context";
import { normalizeCategory } from "@/lib/google-sheets";
import { dictionaries } from "@/lib/i18n/dictionaries";

interface AriaPlacesListProps {
  places: Place[];
  setPlaces: (places: Place[]) => void;
  serverPlaces: Place[];
  onFocus?: (place: Place) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

const ICON_MAP: Record<string, any> = {
  Trees, Droplets, Sparkles, Utensils, Palmtree, Home, 
  Star, Heart, Camera, Landmark, Bed, 
  Mountain, Palette, MapPin, Compass, Navigation, Coffee,
  ShoppingBag, Ticket, Flag, Flame, Wind, Sunrise
};

export default function AriaPlacesList({ places, setPlaces, serverPlaces, onFocus, selectedCategory, setSelectedCategory }: AriaPlacesListProps) {
  const { dict } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const getSyncStatus = (place: Place) => {
    const serverPlace = serverPlaces.find(p => p.id === place.id);
    if (!serverPlace) return "new";
    
    const isSameCoords = 
      place.coordinates.lat.toFixed(6) === serverPlace.coordinates.lat.toFixed(6) && 
      place.coordinates.lng.toFixed(6) === serverPlace.coordinates.lng.toFixed(6);
      
    const isSameData = 
      place.name === serverPlace.name && 
      place.category === serverPlace.category && 
      isSameCoords;
      
    return isSameData ? "synced" : "modified";
  };

  const categories = [
    dict.common.all, 
    ...Array.from(new Set(places.map(p => normalizeCategory(p.category))))
      .sort((a, b) => {
        const order = ["activity", "nature", "water", "food", "culture", "stay"];
        return order.indexOf(a) - order.indexOf(b);
      })
  ];

  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === dict.common.all || place.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      const updatedPlaces = places.filter(p => p.id !== id);
      setPlaces(updatedPlaces);
      
      // Update LocalStorage to persist deletion
      const localData = localStorage.getItem('aria_local_places');
      if (localData) {
        const parsed = JSON.parse(localData);
        const filtered = parsed.filter((p: Place) => p.id !== id);
        localStorage.setItem('aria_local_places', JSON.stringify(filtered));
      }
      
      alert("Asset successfully decommissioned from the registry.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative group w-full md:max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-[2rem] text-white placeholder:text-white/40 focus:ring-2 focus:ring-accent outline-none transition-all font-bold"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter className="w-5 h-5 text-white/20 mr-2 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${
                selectedCategory === cat 
                  ? "bg-accent text-white shadow-lg shadow-accent/20 scale-105 border-b-2 border-white/20" 
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat === dict.common.all 
                ? (dictionaries.en.common.all) 
                : ((dictionaries.en.categories as any)[cat] || cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Place Grid/Table */}
      <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-accent">Identification</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-accent">Category & Tags</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-accent">Geo-Coordinates</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-accent text-center">Data Integrity</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-accent text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredPlaces.map((place, idx) => (
                  <motion.tr 
                    key={place.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-white/[0.02] group transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => onFocus?.(place)}
                          className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:border-accent hover:bg-accent/10 group/focus transition-all relative overflow-hidden"
                          title="Focus on Map"
                        >
                          {place.icon && ICON_MAP[place.icon] ? (
                            (() => {
                              const IconComp = ICON_MAP[place.icon];
                              return <IconComp className="w-4 h-4 text-accent group-hover/focus:scale-125 transition-transform" />;
                            })()
                          ) : (
                            <Search className="w-4 h-4 text-accent group-hover/focus:scale-125 transition-transform" />
                          )}
                          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover/focus:opacity-100 transition-opacity" />
                        </button>
                        <div>
                          <p 
                            className="font-black text-white text-lg tracking-tight mb-1 cursor-pointer hover:text-accent transition-colors"
                            onClick={() => onFocus?.(place)}
                          >
                            {place.name}
                          </p>
                          <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                            ID: {String(place.id).padStart(3, '0')}
                            <span className="w-1 h-1 bg-white/40 rounded-full" />
                            {place.description.slice(0, 30)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-forest/40 border border-white/10 rounded-full text-[10px] font-black text-white/50 uppercase tracking-widest shadow-sm">
                          {(dict.categories as any)[place.category] || place.category}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-black text-accent/40 px-3 uppercase tracking-widest">
                          <Tag className="w-3 h-3" />
                          Wellness
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-mono text-[10px] text-white/60 space-y-1">
                        <p>LAT: {place.coordinates.lat.toFixed(6)}</p>
                        <p>LNG: {place.coordinates.lng.toFixed(6)}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        {(() => {
                          const status = getSyncStatus(place);
                          if (status === "synced") return (
                            <div className="flex items-center gap-2 px-4 py-2 bg-accent/5 rounded-xl border border-accent/20">
                              <CheckCircle2 className="w-4 h-4 text-accent" />
                              <span className="text-[10px] font-black text-accent uppercase tracking-widest">Synced</span>
                            </div>
                          );
                          if (status === "modified") return (
                            <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/5 rounded-xl border border-orange-500/20">
                              <AlertCircle className="w-4 h-4 text-orange-500" />
                              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Modified</span>
                            </div>
                          );
                          return (
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
                              <Sparkles className="w-4 h-4 text-emerald-500" />
                              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">New</span>
                            </div>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/places/${place.id}`}
                          className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-white/40 hover:text-white border border-white/5 group-hover:scale-105"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link 
                          href={`/admin/places/${place.id}/edit`}
                          className="p-3 bg-forest/60 hover:bg-forest text-white rounded-xl transition-all border border-white/10 group-hover:scale-105 shadow-lg shadow-black/20"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(place.id, place.name)}
                          className="p-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all border border-red-500/10 group-hover:scale-105"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredPlaces.length === 0 && (
          <div className="p-32 text-center space-y-4">
            <div className="p-8 bg-white/5 inline-flex rounded-full mb-4">
              <AlertCircle className="w-12 h-12 text-white/10" />
            </div>
            <h5 className="text-2xl font-black text-white tracking-tight">System Search Failure</h5>
            <p className="text-white/30 font-bold">The current registry does not contain assets matching your exploration sequence.</p>
          </div>
        )}

        {/* Table Footer / Summary */}
        <div className="bg-white/[0.02] p-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-forest-dark bg-white/10 flex items-center justify-center">
                   <Sparkles className="w-4 h-4 text-accent" />
                </div>
              ))}
            </div>
            <p className="text-sm font-bold text-white/40 italic">Currently monitoring {filteredPlaces.length} segments of Jeongseon Wellness Loop.</p>
          </div>
          <div className="flex gap-4">
             <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black text-white/20 hover:text-white transition-all">Previous Block</button>
             <button className="px-6 py-3 bg-forest-dark border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-xl">Next Segment</button>
          </div>
        </div>
      </div>
    </div>
  );
}
