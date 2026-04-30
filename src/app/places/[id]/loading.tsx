"use client";

import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Compass, Navigation, Sparkles, Tag, Maximize2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F8FAF9] dark:bg-forest-dark pb-32 overflow-hidden">
      {/* Floating Back Button Skeleton */}
      <div className="fixed top-8 left-6 z-[95] flex items-center gap-2 px-5 py-3 bg-forest-dark/10 dark:bg-accent/10 backdrop-blur-3xl rounded-2xl border border-white/20 text-white/20 animate-pulse md:top-12 md:left-12">
        <ArrowLeft className="w-5 h-5" />
        <div className="w-16 h-3 bg-white/20 rounded" />
      </div>

      {/* Hero Header Skeleton */}
      <section className="relative h-[65vh] bg-forest/20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAF9] via-forest/20 to-transparent" />
        
        <div className="relative z-10 text-center space-y-8 px-4 w-full max-w-2xl mx-auto">
          {/* Category Chip Skeleton */}
          <div className="mx-auto w-32 h-6 rounded-full bg-white/10 animate-pulse" />
          
          {/* Title Skeleton */}
          <div className="mx-auto w-3/4 h-16 md:h-24 bg-white/20 rounded-3xl animate-pulse" />
          
          {/* Subtitle/Meta Skeleton */}
          <div className="flex items-center justify-center gap-6">
             <div className="w-24 h-4 bg-white/10 rounded animate-pulse" />
             <div className="w-24 h-4 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </section>

      {/* Content Area Skeleton */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white dark:bg-forest-light p-10 md:p-16 rounded-[4rem] shadow-2xl border border-forest/5 dark:border-white/5 space-y-10">
              {/* Action Buttons Skeleton */}
              <div className="flex justify-end items-center gap-4">
                 <div className="w-11 h-11 bg-forest/5 dark:bg-white/5 rounded-2xl animate-pulse" />
                 <div className="w-11 h-11 bg-forest/5 dark:bg-white/5 rounded-2xl animate-pulse" />
              </div>

              {/* Story Section Skeleton */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-10 bg-accent/20 rounded-full animate-pulse" />
                  <div className="w-32 h-8 bg-forest/10 dark:bg-white/10 rounded-xl animate-pulse" />
                </div>
                <div className="space-y-3">
                   <div className="w-full h-5 bg-forest/5 dark:bg-white/5 rounded-lg animate-pulse" />
                   <div className="w-full h-5 bg-forest/5 dark:bg-white/5 rounded-lg animate-pulse" />
                   <div className="w-3/4 h-5 bg-forest/5 dark:bg-white/5 rounded-lg animate-pulse" />
                </div>

                {/* Map Placeholder Skeleton */}
                <div className="pt-4">
                   <div className="w-full h-[400px] bg-forest/5 dark:bg-white/5 rounded-[3rem] animate-pulse border-4 border-white dark:border-forest-dark" />
                </div>
              </div>

              {/* Wellness Insight Skeleton */}
              <div className="p-12 rounded-[3.5rem] border border-accent/10 dark:border-white/10 bg-accent/[0.03] space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-2xl animate-pulse" />
                    <div className="w-40 h-4 bg-accent/20 rounded animate-pulse" />
                 </div>
                 <div className="w-64 h-8 bg-forest/10 dark:bg-white/10 rounded-xl animate-pulse" />
                 <div className="space-y-4">
                    <div className="w-full h-4 bg-forest/5 dark:bg-white/5 rounded animate-pulse" />
                    <div className="w-full h-4 bg-forest/5 dark:bg-white/5 rounded animate-pulse" />
                 </div>
              </div>
            </div>

            {/* Nearby Section Skeleton */}
            <section className="space-y-8">
               <div className="flex justify-between px-6">
                  <div className="w-48 h-6 bg-forest/10 dark:bg-white/10 rounded animate-pulse" />
                  <div className="w-24 h-3 bg-forest/5 dark:bg-white/5 rounded animate-pulse" />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-24 bg-white/50 dark:bg-white/5 border border-forest/5 rounded-[2.5rem] animate-pulse" />
                  ))}
               </div>
            </section>
          </div>

          {/* Sidebar Skeleton */}
          <aside className="space-y-10">
            <div className="bg-white dark:bg-forest-light p-10 rounded-[3rem] shadow-xl border border-forest/5 dark:border-white/5 space-y-8">
               <div className="w-full h-6 bg-forest/5 dark:bg-white/5 border-b border-forest/5 pb-4 rounded animate-pulse" />
               <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-2">
                       <div className="w-20 h-2 bg-forest/5 rounded animate-pulse" />
                       <div className="w-32 h-4 bg-forest/10 rounded animate-pulse" />
                    </div>
                  ))}
               </div>
               <div className="pt-6">
                  <div className="w-full h-16 bg-forest/10 dark:bg-accent/20 rounded-2xl animate-pulse" />
               </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
