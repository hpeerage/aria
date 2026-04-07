"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowUp } from "lucide-react";
import { useWishlist } from "@/lib/wishlist/context";
import { useEffect, useState } from "react";

export default function FloatingCart() {
  const { wishlist, isWishlistOpen, toggleWishlistPanel } = useWishlist();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down a bit to not clutter the hero section
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isWishlistOpen) return null; // Hide when panel is open

  return (
    <AnimatePresence>
      {(isVisible || wishlist.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed bottom-8 right-8 z-[100]"
        >
          <button
            onClick={() => toggleWishlistPanel(true)}
            className="group relative flex items-center justify-center p-4 bg-forest dark:bg-white text-white dark:text-forest rounded-full shadow-[0_10px_40px_-10px_rgba(26,67,47,0.5)] dark:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)] hover:scale-110 transition-all duration-300"
          >
            <ShoppingBag className="w-6 h-6" />
            
            {wishlist.length > 0 && (
              <motion.div 
                key={wishlist.length}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#F8FAF9] dark:border-forest-dark"
              >
                {wishlist.length}
              </motion.div>
            )}

            {/* Tooltip Overlay */}
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-white dark:bg-forest border border-forest/10 dark:border-white/10 text-forest dark:text-white text-[10px] uppercase font-black tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
              담은 장소 확인
            </div>
          </button>

          {/* Helper: Scroll to top if no wishlist items and just scrolled down */}
          {wishlist.length === 0 && isVisible && (
             <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="absolute -top-14 left-1/2 -translate-x-1/2 p-2 bg-white/50 backdrop-blur border border-forest/5 text-forest/40 rounded-full hover:bg-white hover:text-forest transition-all"
             >
               <ArrowUp className="w-4 h-4" />
             </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
