"use client";

import React, { forwardRef } from "react";
import { Place } from "@/types/place";
import Image from "next/image";
import { MapPin, Sparkles, Compass } from "lucide-react";

interface AriaItineraryTicketProps {
  wishlist: Place[];
  id?: string;
}

const AriaItineraryTicket = forwardRef<HTMLDivElement, AriaItineraryTicketProps>(
  ({ wishlist, id }, ref) => {
    const today = new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });

    return (
      <div 
        ref={ref}
        id={id}
        className="bg-[#FDFBF7] text-forest p-10 w-[800px] min-h-[1131px] relative overflow-hidden font-sans border-[16px] border-[#E8E2D9]"
        style={{ boxShadow: "0 0 40px rgba(0,0,0,0.1)" }}
      >
        {/* Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/images/felt.png')]" />

        <header className="border-b-2 border-forest/20 pb-8 mb-10 flex justify-between items-end relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-accent mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Premium Wellness Curation</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase">Jeongseon <span className="text-accent">Aria</span></h1>
            <p className="text-sm font-bold text-forest/60 italic">Your healing journey documented in the heart of nature.</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-forest/40 mb-1">Issue Date</p>
            <p className="text-sm font-black">{today}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 relative z-10">
          {wishlist.map((place, idx) => (
            <div key={place.id} className="relative flex gap-8 p-6 bg-white rounded-3xl border border-forest/5 shadow-sm group">
              {/* Numbering Circle */}
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-forest text-white rounded-full flex items-center justify-center font-black text-xl shadow-xl">
                {idx + 1}
              </div>

              <div className="w-40 h-40 relative rounded-2xl overflow-hidden flex-shrink-0 bg-forest/5">
                {place.images?.[0] ? (
                  <img src={place.images[0]} alt={place.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[10px] font-black text-forest/20 uppercase bg-forest/5">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-center space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-lg border border-accent/10">
                    {place.category}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-forest/30">
                    <MapPin className="w-3 h-3" />
                    {place.coordinates.lat.toFixed(4)}, {place.coordinates.lng.toFixed(4)}
                  </div>
                </div>
                <h3 className="text-2xl font-black tracking-tight">{place.name}</h3>
                <p className="text-xs leading-relaxed text-forest/70 font-medium">
                  {place.description || "해당 장소에 대한 웰니스 큐레이션 내용이 포함됩니다."}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer / Decorative Elements */}
        <footer className="mt-20 pt-10 border-t-2 border-dashed border-forest/20 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-forest rounded-2xl">
              <Compass className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-forest/40">Journey Ticket No.</p>
              <p className="text-lg font-mono font-black">JS-ARIA-2026-WLNS</p>
            </div>
          </div>
          
          <div className="w-32 h-32 opacity-10 grayscale invert brightness-0">
            {/* Using img for html2canvas compatibility with local assets if needed */}
            <img src="/favicon.svg" alt="" className="w-full h-full object-contain" />
          </div>

          <div className="text-right max-w-[200px]">
            <p className="text-[9px] font-bold text-forest/40 leading-tight">
              본 티켓은 정선 아리아 웰니스 관광 프로젝트의 일환으로 생성되었습니다. 자연과 함께하는 진정한 치유의 시간을 경험하세요.
            </p>
          </div>
        </footer>

        {/* Side Decorative Ticket Cutout (CSS) */}
        <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-16 bg-[#E8E2D9] rounded-r-full" />
        <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-16 bg-[#E8E2D9] rounded-l-full" />
      </div>
    );
  }
);

AriaItineraryTicket.displayName = "AriaItineraryTicket";

export default AriaItineraryTicket;
