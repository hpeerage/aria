"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Place } from "@/types/place";
import { validateImagePaths } from "@/lib/place-images";

interface WishlistContextType {
  wishlist: Place[];
  isWishlistOpen: boolean;
  toggleWishlistPanel: (open?: boolean) => void;
  togglePlace: (place: Place) => void;
  removePlace: (id: number) => void;
  reorderPlace: (id: number, direction: "up" | "down") => void;
  clearWishlist: () => void;
  isInWishlist: (id: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Place[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("aria_wishlist");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const healed = parsed.map((p: Place) => ({
          ...p,
          images: validateImagePaths(p.images || [], p.id, p.category)
        }));
        setWishlist(healed);
      } catch (e) {
        console.error("Failed to parse wishlist from LocalStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("aria_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isMounted]);

  const toggleWishlistPanel = (open?: boolean) => {
    setIsWishlistOpen((prev) => (open !== undefined ? open : !prev));
  };

  const togglePlace = (place: Place) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => Number(p.id) === Number(place.id));
      if (exists) {
        return prev.filter((p) => Number(p.id) !== Number(place.id));
      }
      const healedPlace = {
        ...place,
        images: validateImagePaths(place.images || [], place.id, place.category)
      };
      return [...prev, healedPlace];
    });
  };

  const removePlace = (id: number) => {
    setWishlist((prev) => prev.filter((p) => Number(p.id) !== Number(id)));
  };

  const reorderPlace = (id: number, direction: "up" | "down") => {
    setWishlist((prev) => {
      const idx = prev.findIndex((p) => Number(p.id) === Number(id));
      if (idx === -1) return prev;

      const newOrder = [...prev];
      if (direction === "up" && idx > 0) {
        [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
      } else if (direction === "down" && idx < prev.length - 1) {
        [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
      }
      return newOrder;
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const isInWishlist = (id: number) => {
    return wishlist.some((p) => Number(p.id) === Number(id));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isWishlistOpen,
        toggleWishlistPanel,
        togglePlace,
        removePlace,
        reorderPlace,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
