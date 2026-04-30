"use client";

import { APIProvider, Map, Marker, InfoWindow, useMap, AdvancedMarker } from "@vis.gl/react-google-maps";
import { Place } from "@/types/place";
import { useState, useEffect } from "react";
import { MapPin, Info, ArrowRight, Mountain, Palette, Utensils, Sparkles, Landmark, Bed, Trees, Palmtree, Home, Droplets, Navigation, Star, Heart, Camera, Compass, Coffee, ShoppingBag, Ticket, Flag, Flame, Wind, Sunrise } from "lucide-react";
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
  let bg = "bg-slate-500";

  // 색상 결정 (커스텀 -> 카테고리 기본)
  if (customColor && colorMap[customColor]) {
    color = colorMap[customColor].hex;
    bg = colorMap[customColor].bg;
  } else {
    const c = category.toLowerCase();
    if (c === "nature") { color = "#10b981"; bg = "bg-emerald-500"; }
    else if (c === "water") { color = "#0ea5e9"; bg = "bg-sky-500"; }
    else if (c === "activity") { color = "#f43f5e"; bg = "bg-rose-500"; }
    else if (c === "food") { color = "#f97316"; bg = "bg-orange-500"; }
    else if (c === "culture") { color = "#f59e0b"; bg = "bg-amber-500"; }
    else if (c === "stay") { color = "#6366f1"; bg = "bg-indigo-500"; }
  }

  // 아이콘 결정 (아이콘이 없으면 카테고리 기본 아이콘 매핑)
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

  return { icon, color, bg };
};

interface AriaMapProps {
  places: Place[];
  onMarkerClick?: (place: Place) => void;
  userLocation?: { lat: number; lng: number } | null;
  focusedPlace?: Place | null;
  className?: string;
}

export default function AriaMap({ places, onMarkerClick, userLocation, focusedPlace, className }: AriaMapProps) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [navTarget, setNavTarget] = useState<NavTarget | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  if (!apiKey) {
    return (
      <div className="w-full h-[500px] bg-forest/5 rounded-[2rem] flex flex-col items-center justify-center border-2 border-dashed border-forest/10 space-y-4">
        <div className="p-4 bg-accent/10 text-accent rounded-full animate-pulse">
          <Info className="w-8 h-8" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-forest">Google Maps API Key Missing</h3>
          <p className="text-sm text-forest/60">.env.local 파일에 NEXT_PUBLIC_GOOGLE_MAPS_API_KEY를 설정해 주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      key="map-container-fixed" 
      className={className || "w-full h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-forest-dark relative group"}
    >

      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={{ lat: 37.3806, lng: 128.6608 }}
          defaultZoom={11}
          gestureHandling={"greedy"}
          disableDefaultUI={false}
          className="w-full h-full"
          clickableIcons={false}
          mapId="DEMO_MAP_ID"
        >
          <MapController places={places} focusedPlace={focusedPlace} />
          {places.map((place) => (
            <CustomMarker 
              key={`${place.id}-${places.length}`}
              place={place}
              onClick={() => setSelectedPlace(place)}
            />
          ))}

          {userLocation && (
            <Marker
              position={userLocation}
              title="현재 위치"
            />
          )}

          {selectedPlace && (
            <InfoWindow
              position={{ lat: selectedPlace.coordinates.lat, lng: selectedPlace.coordinates.lng }}
              onCloseClick={() => setSelectedPlace(null)}
              headerContent={
                <div className="font-bold text-forest py-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  {selectedPlace.name}
                </div>
              }
            >
              <div className="max-w-xs space-y-3 p-1">
                <p className="text-xs text-forest/70 font-medium leading-relaxed line-clamp-2">
                  {selectedPlace.description || "이 장소에 대한 신비로운 이야기가 곧 추가될 예정입니다."}
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onMarkerClick?.(selectedPlace)}
                    className="flex-1 py-2 bg-forest text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-accent transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    상세 정보
                    <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const { name, coordinates } = selectedPlace;
                      const target: NavTarget = { name, lat: coordinates.lat, lng: coordinates.lng };
                      
                      if (typeof window !== "undefined" && window.innerWidth < 768) {
                        setNavTarget(target);
                        setIsNavOpen(true);
                      } else {
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${target.lat},${target.lng}`, '_blank');
                      }
                    }}
                    className="px-3 bg-accent text-white rounded-lg hover:bg-forest transition-all shadow-md active:scale-95 flex items-center justify-center"
                    title="Directions"
                  >
                    <Navigation className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
      
      {/* Map Overlay Decor */}
      <div className="absolute top-6 left-6 z-10 px-6 py-3 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-forest/5 flex items-center gap-3">
        <div className="w-3 h-3 bg-accent rounded-full animate-ping" />
        <span className="text-xs font-bold text-forest uppercase tracking-widest leading-none">Live Exploration</span>
      </div>

      <NavigationSelector 
        isOpen={isNavOpen} 
        onClose={() => setIsNavOpen(false)} 
        target={navTarget}
      />
    </div>
  );
}

function MapController({ places, focusedPlace }: { places: Place[], focusedPlace?: Place | null }) {
  const map = useMap();

  useEffect(() => {
    if (!map || places.length === 0) return;

    // [v0.9.8] 강제 포커스 요청이 있는 경우 해당 지점으로 즉시 이동 및 확대
    if (focusedPlace) {
      map.panTo(focusedPlace.coordinates);
      map.setZoom(17); // 좌표 검증을 위해 매우 가깝게 확대
      return;
    }

    // 만약 장소가 하나면 그곳으로 이동, 여러개면 전체를 다 보이게 함
    if (places.length === 1) {
      map.panTo(places[0].coordinates);
      map.setZoom(15);
    } else {
      const bounds = new google.maps.LatLngBounds();
      places.forEach(p => bounds.extend(p.coordinates));
      map.fitBounds(bounds);
    }
  }, [map, places, focusedPlace]);

  return null;
}

function CustomMarker({ place, onClick }: { place: Place; onClick: () => void }) {
  const { icon, color } = getMarkerConfig(place.category, place.icon, place.color);
  const IconComp = icon;

  return (
    <AdvancedMarker
      position={{ lat: place.coordinates.lat, lng: place.coordinates.lng }}
      onClick={onClick}
      title={place.name}
    >
       <div className="relative group cursor-pointer">
          {/* Enhanced Glow Effect (Radial Gradient for smoothness) */}
          <div className="absolute -inset-1 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-500" 
               style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }} />
          
          <div 
            className={`relative flex items-center justify-center w-[18px] h-[18px] rounded-full border border-white shadow-[0_3px_10px_-2px_rgba(0,0,0,0.3)] transform group-hover:scale-150 group-hover:-translate-y-1.5 transition-all duration-500 text-white`}
            style={{ backgroundColor: color }}
          >
             <IconComp className="w-2.5 h-2.5 drop-shadow-sm" />
             
             {/* Vibrant Pin Tail */}
             <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 bg-white shadow-sm" />
             <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rotate-45" style={{ backgroundColor: color }} />
          </div>
       </div>
    </AdvancedMarker>
  );
}

