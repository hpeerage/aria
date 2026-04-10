"use client";

import { useEffect, useState } from "react";
import { getPlacesFromGoogleSheet } from "@/lib/google-sheets";
import AriaPlacesList from "@/components/admin/AriaPlacesList";
import AriaMap from "@/components/AriaMap";
import { validateImagePaths } from "@/lib/place-images";
import Link from "next/link";
import { Place } from "@/types/place";
import { useLanguage } from "@/lib/i18n/context";

export default function AdminPlacesPage() {
  const { dict } = useLanguage();
  const [places, setPlaces] = useState<Place[]>([]);
  const [serverPlaces, setServerPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPlaces() {
      try {
        // 1. Fetch from Google Sheet (Source of Truth for Admin)
        const sheetData = await getPlacesFromGoogleSheet('1Setffm27HQ8LyOM3N9o9V8eA0ihGbZeZgN763jkm1WU');
        
        // 2. Fetch from GitHub Server (To compare sync status)
        const isProd = typeof window !== 'undefined' && 
                       (window.location.hostname.includes('github.io') || window.location.hostname.includes('vercel.app'));
        const basePath = isProd ? '/aria' : '';
        const timestamp = new Date().getTime();
        
        try {
          const syncRes = await fetch(`${basePath}/data/places.json?t=${timestamp}`, { cache: 'no-store' });
          if (syncRes.ok) {
            const synced = await syncRes.json();
            setServerPlaces(synced);
          }
        } catch (e) {
          console.warn("Failed to fetch server data for comparison");
        }

        // 3. Merge with LocalStorage changes
        const localData = localStorage.getItem('aria_local_places');
        if (localData) {
          const parsed = JSON.parse(localData).map((p: Place) => ({
            ...p,
            images: validateImagePaths(p.images || [], p.id, p.category)
          }));
          const merged = [...sheetData];
          
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
          setPlaces(sheetData);
        }
      } catch (error) {
        console.error("Failed to fetch places:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadPlaces();
    
    // 이벤트를 통해 실시간 업데이트 반영 (선택적)
    const handleStorageChange = () => loadPlaces();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-[0.3em] text-xs animate-pulse">{dict.admin.syncing}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex justify-between items-center bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
        <div className="space-y-2">
          <h3 className="text-3xl font-black text-white tracking-tighter">{dict.admin.explorerTitle}</h3>
          <p className="text-white/40 text-sm font-bold">{dict.admin.explorerDesc}</p>
        </div>
        <Link 
          href="/admin/places/new"
          className="px-8 py-4 bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-forest transition-all shadow-xl shadow-accent/20"
        >
          + {dict.admin.addPlace}
        </Link>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 px-6">
          <div className="w-1.5 h-6 bg-accent rounded-full" />
          <h4 className="text-xl font-bold text-white uppercase tracking-widest">Map Visualization</h4>
        </div>
        <AriaMap places={places} />
      </div>

      <AriaPlacesList 
        places={places} 
        setPlaces={setPlaces} 
        serverPlaces={serverPlaces}
      />
    </div>
  );
}
