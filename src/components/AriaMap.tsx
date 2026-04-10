"use client";

import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import { Place } from "@/types/place";
import { useState, useEffect } from "react";
import { MapPin, Info, ArrowRight, Mountain, Palette, Utensils, Sparkles, Landmark, Bed, Trees, Palmtree, Home, MoreHorizontal, Droplets } from "lucide-react";

const getMarkerConfig = (category: string) => {
  const c = category.toLowerCase();
  
  if (c === "nature") 
    return { icon: Trees, color: "#10b981", bg: "bg-emerald-500" }; // Emerald-500

  if (c === "water") 
    return { icon: Droplets, color: "#0ea5e9", bg: "bg-sky-500" }; // Sky-500
  
  if (c === "activity") 
    return { icon: Sparkles, color: "#f43f5e", bg: "bg-rose-500" }; // Rose-500
  
  if (c === "food") 
    return { icon: Utensils, color: "#f97316", bg: "bg-orange-500" }; // Orange-500

  if (c === "culture") 
    return { icon: Palmtree, color: "#f59e0b", bg: "bg-amber-500" }; // Amber-500

  if (c === "stay") 
    return { icon: Home, color: "#6366f1", bg: "bg-indigo-500" }; // Indigo-500

  return { icon: Droplets, color: "#64748b", bg: "bg-slate-500" }; // Gray fallback
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
      key={`map-container-${places.length}`} 
      className={className || "w-full h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-forest-dark relative group"}
    >
      <APIProvider apiKey={apiKey} version="beta" libraries={['marker']}>
        <Map
          defaultCenter={{ lat: 37.3806, lng: 128.6608 }}
          defaultZoom={11}
          gestureHandling={"greedy"}
          disableDefaultUI={false}
          className="w-full h-full"
          mapId="8c0d537b1e8dd38f35e7ec6e" 
          clickableIcons={false}
        >
          <MapController places={places} focusedPlace={focusedPlace} />
          {places.map((place) => (
            <CustomMarker 
              key={`${place.id}-${places.length}`} 
              place={place} 
              onClick={() => {
                setSelectedPlace(place);
              }}
            />
          ))}

          {userLocation && (
            <AdvancedMarker
              position={userLocation}
              title="현재 위치"
            >
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
            </AdvancedMarker>
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
                <button 
                  onClick={() => onMarkerClick?.(selectedPlace)}
                  className="w-full py-2 bg-forest text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-accent transition-all flex items-center justify-center gap-2 group/btn"
                >
                  상세 정보 탐색
                  <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                </button>
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
  const config = getMarkerConfig(place.category);
  const Icon = config.icon;

  return (
    <AdvancedMarker
      position={{ lat: place.coordinates.lat, lng: place.coordinates.lng }}
      onClick={onClick}
      title={place.name}
    >
       <div className="relative group cursor-pointer">
          {/* Enhanced Glow Effect (Radial Gradient for smoothness) */}
          <div className="absolute -inset-2 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-500" 
               style={{ background: `radial-gradient(circle, ${config.color} 0%, transparent 70%)` }} />
          
          <div 
            className={`relative flex items-center justify-center w-7 h-7 rounded-full border-2 border-white shadow-[0_5px_15px_-3px_rgba(0,0,0,0.3)] transform group-hover:scale-125 group-hover:-translate-y-2 transition-all duration-500 text-white`}
            style={{ backgroundColor: config.color }}
          >
             <Icon className="w-3.5 h-3.5 drop-shadow-sm" />
             
             {/* Vibrant Pin Tail */}
             <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-white shadow-sm" />
             <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45" style={{ backgroundColor: config.color }} />
          </div>
       </div>
    </AdvancedMarker>
  );
}

