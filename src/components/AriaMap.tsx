"use client";

import { APIProvider, Map, Marker, InfoWindow, useMarkerRef } from "@vis.gl/react-google-maps";
import { Place } from "@/types/place";
import { useState } from "react";
import { MapPin, Info } from "lucide-react";

interface AriaMapProps {
  places: Place[];
  onMarkerClick?: (place: Place) => void;
}

export default function AriaMap({ places, onMarkerClick }: AriaMapProps) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // 정선 중심부 좌표
  const defaultCenter = { lat: 37.3806, lng: 128.6608 };

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
    <div className="w-full h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-forest-dark relative group">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={11}
          mapId="aria-wellness-map"
          gestureHandling={"greedy"}
          disableDefaultUI={false}
          className="w-full h-full"
        >
          {places.map((place) => (
            <CustomMarker 
              key={place.id} 
              place={place} 
              onClick={() => {
                setSelectedPlace(place);
                onMarkerClick?.(place);
              }}
            />
          ))}

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
              <div className="max-w-xs space-y-2 p-1">
                <p className="text-xs text-forest/70 font-medium leading-relaxed">
                  {selectedPlace.description || "이 장소에 대한 신비로운 이야기가 곧 추가될 예정입니다."}
                </p>
                <div className="text-[10px] uppercase tracking-widest font-bold text-accent">
                  {selectedPlace.category}
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
      
      {/* Map Overlay Decor */}
      <div className="absolute top-6 left-6 z-10 px-6 py-3 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-forest/5 flex items-center gap-3">
        <div className="w-3 h-3 bg-accent rounded-full animate-ping" />
        <span className="text-xs font-bold text-forest uppercase tracking-widest">Live Exploration</span>
      </div>
    </div>
  );
}

function CustomMarker({ place, onClick }: { place: Place; onClick: () => void }) {
  const [markerRef, marker] = useMarkerRef();

  return (
    <Marker
      ref={markerRef}
      position={{ lat: place.coordinates.lat, lng: place.coordinates.lng }}
      onClick={onClick}
      title={place.name}
    />
  );
}
