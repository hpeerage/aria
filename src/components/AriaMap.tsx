"use client";

import { Place } from "@/types/place";
import { useState, useEffect, useRef } from "react";
import { MapPin, Info, ArrowRight, Trees, Droplets, Sparkles, Utensils, Palmtree, Home, Star, Heart, Camera, Landmark, Bed, Mountain, Palette, Compass, Navigation, Coffee, ShoppingBag, Ticket, Flag, Flame, Wind, Sunrise } from "lucide-react";
import NavigationSelector from "./NavigationSelector";
import { NavTarget } from "@/lib/navigation";

const getMarkerConfig = (category: string, customIcon?: string, customColor?: string) => {
  const iconMap: Record<string, React.ElementType> = {
    Trees, Droplets, Sparkles, Utensils, Palmtree, Home, 
    Star, Heart, Camera, Landmark, Bed, 
    Mountain, Palette, MapPin, Compass, Navigation, Coffee,
    ShoppingBag, Ticket, Flag, Flame, Wind, Sunrise
  };

  const colorMap: Record<string, { hex: string, bg: string }> = {
    emerald: { hex: "#10b981", bg: "bg-emerald-500" },
    sky: { hex: "#0ea5e9", bg: "bg-sky-500" },
    rose: { hex: "#f43f5e", bg: "bg-rose-500" },
    orange: { hex: "#f97316", bg: "bg-orange-500" },
    amber: { hex: "#f59e0b", bg: "bg-amber-500" },
    indigo: { hex: "#6366f1", bg: "bg-indigo-500" },
    slate: { hex: "#64748b", bg: "bg-slate-500" },
    forest: { hex: "#2E4D3E", bg: "bg-forest" },
    accent: { hex: "#FF7F50", bg: "bg-accent" },
  };

  let icon = iconMap[customIcon || ""] || null;
  let color = "#64748b";

  if (customColor && colorMap[customColor]) {
    color = colorMap[customColor].hex;
  } else {
    const c = category.toLowerCase();
    if (c === "nature") color = "#10b981";
    else if (c === "water") color = "#0ea5e9";
    else if (c === "activity") color = "#f43f5e";
    else if (c === "food") color = "#f97316";
    else if (c === "culture") color = "#f59e0b";
    else if (c === "stay") color = "#6366f1";
  }

  if (!icon) {
    const c = category.toLowerCase();
    if (c === "nature") icon = Trees;
    else if (c === "water") icon = Droplets;
    else if (c === "activity") icon = Sparkles;
    else if (c === "food") icon = Utensils;
    else if (c === "culture") icon = Palmtree;
    else if (c === "stay") icon = Home;
    else icon = Droplets;
  }

  return { icon, color };
};

interface AriaMapProps {
  places: Place[];
  onMarkerClick?: (place: Place) => void;
  userLocation?: { lat: number; lng: number } | null;
  focusedPlace?: Place | null;
  className?: string;
}

export default function AriaMap({ places, onMarkerClick, userLocation, focusedPlace, className }: AriaMapProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const infoWindowRef = useRef<naver.maps.InfoWindow | null>(null);
  
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [navTarget, setNavTarget] = useState<NavTarget | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapElement.current || !window.naver || !window.naver.maps) return;

      const mapOptions = {
        center: new naver.maps.LatLng(37.3806, 128.6608),
        zoom: 11,
        minZoom: 7,
        maxZoom: 21,
        zoomControl: true,
        zoomControlOptions: {
          position: naver.maps.Position.TOP_RIGHT,
        },
        mapTypeControl: true,
      };

      const map = new naver.maps.Map(mapElement.current, mapOptions);
      mapRef.current = map;
      infoWindowRef.current = new naver.maps.InfoWindow({
        content: '',
        backgroundColor: "transparent",
        borderWidth: 0,
        disableAnchor: true,
        pixelOffset: new naver.maps.Point(0, -10)
      });

      setIsMapLoaded(true);
    };

    const timeoutId = setTimeout(() => {
      if (!window.naver || !window.naver.maps) {
        setMapError("네이버 지도 API를 불러올 수 없습니다. 클라이언트 키 및 서비스 URL 설정을 확인해 주세요.");
      }
    }, 5000);

    if (window.naver && window.naver.maps) {
      initMap();
      clearTimeout(timeoutId);
    } else {
      const checkInterval = setInterval(() => {
        if (window.naver && window.naver.maps) {
          initMap();
          clearInterval(checkInterval);
          clearTimeout(timeoutId);
        }
      }, 100);
      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeoutId);
      };
    }
  }, []);

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    const bounds = new naver.maps.LatLngBounds();

    places.forEach((place) => {
      const { color } = getMarkerConfig(place.category, place.icon, place.color);
      const position = new naver.maps.LatLng(place.coordinates.lat, place.coordinates.lng);
      
      const marker = new naver.maps.Marker({
        position,
        map: mapRef.current!,
        title: place.name,
        icon: {
          content: `
            <div class="relative group cursor-pointer" style="transform: translate(-50%, -100%)">
              <div class="absolute -inset-1 rounded-full opacity-30 blur-sm transition-opacity duration-500" 
                   style="background: radial-gradient(circle, ${color} 0%, transparent 70%)"></div>
              <div class="relative flex items-center justify-center w-[20px] h-[20px] rounded-full border-2 border-white shadow-md transition-all duration-300"
                   style="background-color: ${color}">
                <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px]" style="border-t-color: white"></div>
                <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[5px]" style="border-t-color: ${color}"></div>
              </div>
            </div>
          `,
          size: new naver.maps.Size(24, 24),
          anchor: new naver.maps.Point(12, 24),
        },
      });

      naver.maps.Event.addListener(marker, 'click', () => {
        setSelectedPlace(place);
        if (infoWindowRef.current && mapRef.current) {
          const contentString = `
            <div class="bg-white rounded-2xl shadow-xl border border-forest/10 p-4 min-w-[200px] mb-2 transform-gpu transition-all">
              <div class="font-bold text-forest mb-2 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full" style="background-color: ${color}"></span>
                ${place.name}
              </div>
              <p class="text-[10px] text-forest/60 mb-3 line-clamp-2 leading-relaxed">
                ${place.description || "장소에 대한 이야기가 준비 중입니다."}
              </p>
              <div class="flex gap-2">
                <button id="iw-detail-btn" class="flex-1 py-1.5 bg-forest text-white text-[9px] font-bold rounded-lg hover:bg-accent transition-colors">상세보기</button>
                <button id="iw-nav-btn" class="px-2 bg-accent text-white rounded-lg hover:bg-forest transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                </button>
              </div>
            </div>
          `;
          infoWindowRef.current.setContent(contentString);
          infoWindowRef.current.open(mapRef.current, marker);
          
          // Add event listeners after window is open
          setTimeout(() => {
            document.getElementById('iw-detail-btn')?.addEventListener('click', () => onMarkerClick?.(place));
            document.getElementById('iw-nav-btn')?.addEventListener('click', () => {
              const target: NavTarget = { name: place.name, lat: place.coordinates.lat, lng: place.coordinates.lng };
              if (window.innerWidth < 768) {
                setNavTarget(target);
                setIsNavOpen(true);
              } else {
                window.open(`https://map.naver.com/v5/directions/-/${target.lat},${target.lng},${target.name}/-`, '_blank');
              }
            });
          }, 100);
        }
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    if (focusedPlace) {
      const pos = new naver.maps.LatLng(focusedPlace.coordinates.lat, focusedPlace.coordinates.lng);
      mapRef.current.setCenter(pos);
      mapRef.current.setZoom(17);
    } else if (places.length > 0) {
      if (places.length === 1) {
        mapRef.current.setCenter(new naver.maps.LatLng(places[0].coordinates.lat, places[0].coordinates.lng));
        mapRef.current.setZoom(15);
      } else {
        mapRef.current.fitBounds(bounds);
      }
    }
  }, [isMapLoaded, places, focusedPlace, onMarkerClick]);

  return (
    <div className={className || "w-full h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-forest-dark relative group"}>
      <div ref={mapElement} className="w-full h-full" />
      
      {!isMapLoaded && !mapError && (
        <div className="absolute inset-0 bg-forest/5 flex items-center justify-center backdrop-blur-sm z-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-forest font-bold animate-pulse">지도를 불러오는 중...</p>
          </div>
        </div>
      )}

      {mapError && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center backdrop-blur-md z-30 p-8">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Info size={32} />
            </div>
            <h3 className="text-xl font-bold text-forest mb-4">지도 로딩 실패</h3>
            <p className="text-forest/70 text-sm mb-6 leading-relaxed">
              {mapError}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-forest text-white rounded-xl font-bold hover:bg-accent transition-colors shadow-lg shadow-forest/20"
            >
              다시 시도하기
            </button>
          </div>
        </div>
      )}

      {/* Map Overlay Decor */}
      <div className="absolute top-6 left-6 z-10 px-6 py-3 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-forest/5 flex items-center gap-3">
        <div className="w-3 h-3 bg-accent rounded-full animate-ping" />
        <span className="text-xs font-bold text-forest uppercase tracking-widest leading-none">Jeongseon Exploration</span>
      </div>

      <NavigationSelector 
        isOpen={isNavOpen} 
        onClose={() => setIsNavOpen(false)} 
        target={navTarget}
      />
    </div>
  );
}
