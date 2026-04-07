"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Map as MapIcon, ArrowUp, ArrowDown, FileDown, ExternalLink, Printer } from "lucide-react";
import { useWishlist } from "@/lib/wishlist/context";
import Image from "next/image";

export default function WishlistPanel() {
  const { wishlist, isWishlistOpen, toggleWishlistPanel, removePlace, reorderPlace } = useWishlist();

  const handleGenerateGoogleMapsLink = () => {
    if (wishlist.length === 0) return;
    
    // Google Maps Direction URL supports origin, destination, and up to 9 waypoints.
    // If length > 11, it will only take the first 11 points for now.
    const waypointsArr = [...wishlist];
    const origin = waypointsArr.shift();
    const destination = waypointsArr.pop() || origin;
    
    // Take up to 9 waypoints
    const maxWaypoints = waypointsArr.slice(0, 9);
    
    const originStr = `${origin?.coordinates.lat},${origin?.coordinates.lng}`;
    const destinationStr = `${destination?.coordinates.lat},${destination?.coordinates.lng}`;
    
    const waypointsStr = maxWaypoints.length > 0 
      ? `&waypoints=${maxWaypoints.map(w => `${w.coordinates.lat},${w.coordinates.lng}`).join('|')}` 
      : "";

    const url = `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destinationStr}${waypointsStr}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    // Rely on simple UI and @media print CSS targeting the panel structure
    window.print();
  };

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleWishlistPanel(false)}
            className="fixed inset-0 bg-forest/80 backdrop-blur-sm z-[110] print:hidden"
          />

          {/* Side Panel */}
          <motion.div 
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] md:w-[450px] bg-white dark:bg-forest border-l border-forest/10 dark:border-white/10 shadow-2xl z-[120] flex flex-col print:relative print:w-full print:h-auto print:border-none print:shadow-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-forest/5 dark:border-white/5 print:hidden">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-xl">
                  <MapIcon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-black text-forest dark:text-white uppercase tracking-tighter">나만의 여정</h3>
                  <p className="text-[10px] text-forest/40 dark:text-white/40 uppercase tracking-widest font-bold">
                    {wishlist.length}개의 장소가 담김
                  </p>
                </div>
              </div>
              <button 
                onClick={() => toggleWishlistPanel(false)}
                className="p-2 bg-forest/5 dark:bg-white/5 hover:bg-forest/10 dark:hover:bg-white/10 rounded-full transition-colors text-forest/40 dark:text-white/40 hover:text-forest dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Print Header Visible only on Print */}
            <div className="hidden print:block mb-8 text-center border-b border-black/10 pb-8">
              <h1 className="text-3xl font-black mb-2">정선 아리아 웰니스 여정</h1>
              <p className="text-sm text-gray-500">나만의 커스텀 여행 코스 가이드</p>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 print:overflow-visible print:p-0 print:space-y-6">
              {wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 print:hidden">
                  <div className="w-16 h-16 rounded-full bg-forest/5 dark:bg-white/5 flex items-center justify-center">
                    <MapIcon className="w-8 h-8 text-forest/20 dark:text-white/20" />
                  </div>
                  <p className="text-sm font-bold text-forest/40 dark:text-white/40">아직 담은 장소가 없습니다.<br/> 탐색 버튼을 통해 장소를 담아보세요.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {wishlist.map((place, idx) => (
                    <motion.div 
                      key={place.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group flex gap-4 p-3 bg-white dark:bg-white/5 border border-forest/5 dark:border-white/5 rounded-2xl shadow-sm hover:shadow-md transition-all print:border print:border-black/20 print:shadow-none print:break-inside-avoid print:items-center"
                    >
                       <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-forest/5 print:w-24 print:h-24">
                          {place.images?.[0] ? (
                            <Image src={place.images[0]} alt={place.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-[10px] font-black text-forest/20 uppercase">
                              No Image
                            </div>
                          )}
                          <div className="absolute top-1 left-1 w-5 h-5 bg-black/60 backdrop-blur rounded-full flex items-center justify-center text-[10px] font-black text-white">
                            {idx + 1}
                          </div>
                       </div>
                       
                       <div className="flex-1 flex flex-col justify-center">
                          <span className="text-[9px] font-black uppercase tracking-widest text-accent mb-1 print:text-black">
                            {place.category}
                          </span>
                          <h4 className="text-sm font-black text-forest dark:text-white leading-tight mb-1 print:text-black print:text-base">
                            {place.name}
                          </h4>
                          <p className="text-[10px] text-forest/50 dark:text-white/50 line-clamp-2 print:line-clamp-none print:text-xs">
                             {place.description}
                          </p>
                       </div>

                       <div className="flex flex-col justify-between items-end print:hidden">
                          <button 
                            onClick={() => removePlace(place.id)}
                            className="p-1.5 text-forest/20 dark:text-white/20 hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          
                          <div className="flex flex-col -space-y-1">
                             <button onClick={() => reorderPlace(place.id, "up")} disabled={idx === 0} className="p-1 text-forest/30 dark:text-white/30 hover:text-accent disabled:opacity-20 transition-colors">
                               <ArrowUp className="w-4 h-4" />
                             </button>
                             <button onClick={() => reorderPlace(place.id, "down")} disabled={idx === wishlist.length - 1} className="p-1 text-forest/30 dark:text-white/30 hover:text-accent disabled:opacity-20 transition-colors">
                               <ArrowDown className="w-4 h-4" />
                             </button>
                          </div>
                       </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer / Export Actions */}
            {wishlist.length > 0 && (
              <div className="p-6 border-t border-forest/5 dark:border-white/5 bg-forest/[0.02] dark:bg-white/[0.02] space-y-3 print:hidden">
                 <button 
                    onClick={handleGenerateGoogleMapsLink}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-forest dark:bg-white text-white dark:text-forest rounded-xl font-black text-xs uppercase tracking-widest hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition-all shadow-lg"
                 >
                    <ExternalLink className="w-4 h-4" />
                    구글 맵 경로 연결
                 </button>
                 <button 
                    onClick={handlePrint}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-white dark:bg-forest border-2 border-forest/10 dark:border-white/10 text-forest dark:text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-forest/5 dark:hover:bg-white/5 transition-all"
                 >
                    <Printer className="w-4 h-4" />
                    PDF 리스트 저장
                 </button>
                 
                 {wishlist.length > 11 && (
                   <p className="text-[10px] text-center text-rose-500 font-bold mt-2">
                     * 구글 지도는 최대 11개의 경유지만 연동 가능하여 초기 11개 지점만 맵핑됩니다.
                   </p>
                 )}
              </div>
            )}
            
            {/* Print Footer */}
            <div className="hidden print:block mt-12 text-center text-[10px] text-gray-400 uppercase tracking-widest font-black">
              Generated by ARIA Wellness Curation
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
