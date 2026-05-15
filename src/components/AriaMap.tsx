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
        gl: true, // 벡터 지도 엔진 활성화 (커스텀 스타일 필수)
        customStyleId: 'ca4b9679-d588-4538-b4f1-e98f5ac0a743',
        mapStyleId: 'ca4b9679-d588-4538-b4f1-e98f5ac0a743' // 호환성 유지
      };

      const map = new naver.maps.Map(mapElement.current, mapOptions);
      mapRef.current = map;
      
      // 지도가 생성된 후 스타일을 강제로 다시 주입 (벡터 모드 호환성 확인)
      map.setOptions({
        gl: true,
        customStyleId: 'ca4b9679-d588-4538-b4f1-e98f5ac0a743',
        mapStyleId: 'ca4b9679-d588-4538-b4f1-e98f5ac0a743'
      });
      infoWindowRef.current = new naver.maps.InfoWindow({
        content: '',
        backgroundColor: "transparent",
        borderWidth: 0,
        disableAnchor: true,
        pixelOffset: new naver.maps.Point(0, -10)
      });

      // 지도 배경 클릭 시 정보 창 닫기
      naver.maps.Event.addListener(map, 'click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
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

    const bounds = new naver.maps.LatLngBounds(
      new naver.maps.LatLng(37.3806, 128.6608),
      new naver.maps.LatLng(37.3806, 128.6608)
    );

    places.forEach((place) => {
      const { color } = getMarkerConfig(place.category, place.icon, place.color);
      const position = new naver.maps.LatLng(place.coordinates.lat, place.coordinates.lng);
      
      // 카테고리별 아이콘 SVG 정의 (대시보드 및 프로젝트 공통 아이콘)
      const getIconSvg = (category: string) => {
        const c = category.toLowerCase();
        // Nature -> Mountain
        if (c === 'nature') return '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>';
        // Water -> Wind/Wave
        if (c === 'water') return '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>';
        // Activity -> Sparkles
        if (c === 'activity') return '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>';
        // Culture -> Compass
        if (c === 'culture') return '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>';
        // Stay -> Bed
        if (c === 'stay') return '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>';
        // Food -> Utensils
        if (c === 'food') return '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z"/><path d="M18 15v7"/>';
        // Default -> MapPin
        return '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>';
      };

      const marker = new naver.maps.Marker({
        position,
        map: mapRef.current!,
        title: place.name,
        icon: {
          content: `
            <div class="relative group cursor-pointer" style="transform: translate(-50%, -100%)">
              <svg width="24" height="29" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="transition-transform duration-300 group-hover:scale-110">
                <!-- 핀 배경 -->
                <path d="M20 48C20 48 40 32.8 40 20C40 9.0 31.0 0 20 0C9.0 0 0 9.0 0 20C0 32.8 20 48 20 48Z" fill="white"/>
                <path d="M20 44C20 44 36 30.8 36 20C36 11.2 28.8 4 20 4C11.2 4 4 11.2 4 20C4 30.8 20 44 20 44Z" fill="${color}"/>
                <!-- 아이콘 영역 -->
                <g transform="translate(10, 10)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    ${getIconSvg(place.category)}
                  </svg>
                </g>
              </svg>
            </div>
          `,
          size: new naver.maps.Size(24, 29),
          anchor: new naver.maps.Point(12, 29),
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
      mapRef.current.setZoom(16);
    } else if (places.length > 0) {
      if (places.length === 1) {
        const pos = new naver.maps.LatLng(places[0].coordinates.lat, places[0].coordinates.lng);
        mapRef.current.setCenter(pos);
        mapRef.current.setZoom(15);
      } else {
        // 모든 마커가 중앙에 오도록 여백(padding)을 주어 맞춤
        mapRef.current.fitBounds(bounds, {
          top: 80,
          right: 80,
          bottom: 80,
          left: 80
        });
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
