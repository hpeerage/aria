"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, CheckCircle2, MapPin, X, AlertCircle } from "lucide-react";
import { Place } from "@/types/place";
import Image from "next/image";
import { getPlacesFromGoogleSheet } from "@/lib/google-sheets";

export default function MobileSnapPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | "">("");
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadPlaces() {
      // 1. LocalStorage 확인
      const localData = localStorage.getItem("aria_local_places");
      let mergedPlaces: Place[] = [];
      
      if (localData) {
        mergedPlaces = JSON.parse(localData);
      }

      // 2. Google Sheet에서 가져와서 병합 (로컬 데이터가 우선)
      try {
        const sheetPlaces = await getPlacesFromGoogleSheet('1Setffm27HQ8LyOM3N9o9V8eA0ihGbZeZgN763jkm1WU');
        sheetPlaces.forEach(sp => {
          if (!mergedPlaces.find(lp => lp.id === sp.id)) {
            mergedPlaces.push(sp);
          }
        });
      } catch (err) {
        console.error("Failed to fetch sheet", err);
      }
      
      // 이름순 정렬
      mergedPlaces.sort((a, b) => a.name.localeCompare(b.name));
      setPlaces(mergedPlaces);
    }
    loadPlaces();
  }, []);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!selectedPlaceId) {
      setErrorMsg("사진을 추가할 장소를 먼저 선택해 주세요.");
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setErrorMsg("Cloudinary 설정이 누락되었습니다.");
      return;
    }

    setIsUploading(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      // 1. Cloudinary 업로드
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      const newImageUrl = data.secure_url;

      // 2. 선택된 장소 찾기 및 업데이트
      const targetPlaceIndex = places.findIndex(p => p.id === Number(selectedPlaceId));
      if (targetPlaceIndex === -1) throw new Error("Place not found");

      const updatedPlace = { ...places[targetPlaceIndex] };
      updatedPlace.images = [...(updatedPlace.images || []), newImageUrl];
      updatedPlace.lastUpdated = new Date().toISOString();

      // 3. LocalStorage 업데이트
      const newPlaces = [...places];
      newPlaces[targetPlaceIndex] = updatedPlace;
      setPlaces(newPlaces);

      localStorage.setItem(`aria_place_${updatedPlace.id}`, JSON.stringify(updatedPlace));
      
      const localListStr = localStorage.getItem('aria_local_places');
      const localList = localListStr ? JSON.parse(localListStr) : [];
      const listPlace = { ...updatedPlace, images: updatedPlace.images.length > 0 ? [updatedPlace.images[0]] : [] };
      const existingIdx = localList.findIndex((p: Place) => p.id === updatedPlace.id);
      
      if (existingIdx >= 0) {
        localList[existingIdx] = listPlace;
      } else {
        localList.push(listPlace);
      }
      localStorage.setItem('aria_local_places', JSON.stringify(localList));

      // 4. 성공 메시지
      setSuccessMsg("성공적으로 업로드되었습니다! 상단의 [Cloud Sync]를 눌러 전체 서버에 반영해주세요.");
      setTimeout(() => setSuccessMsg(""), 5000);

    } catch (err) {
      console.error(err);
      setErrorMsg("업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-4 bg-accent/20 border border-accent/50 rounded-2xl flex items-start gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-white/90">{successMsg}</p>
          </motion.div>
        )}

        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-white/90">{errorMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl space-y-8 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="text-center space-y-3 relative z-10">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent/20">
            <Camera className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter">Mobile Snap</h1>
          <p className="text-white/40 text-sm font-medium">현장에서 폰으로 바로 찍어 아리아에 업데이트하세요.</p>
        </div>

        <div className="space-y-6 relative z-10 pt-4">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-accent px-2">1. 장소 선택</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <select
                value={selectedPlaceId}
                onChange={(e) => {
                  setSelectedPlaceId(e.target.value ? Number(e.target.value) : "");
                  setErrorMsg("");
                }}
                className="w-full pl-12 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-accent transition-all font-bold appearance-none"
              >
                <option value="" className="text-gray-500">사진을 추가할 장소를 선택하세요...</option>
                {places.map(p => (
                  <option key={p.id} value={p.id} className="bg-forest-dark text-white">
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-accent px-2">2. 사진 촬영 및 업로드</label>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || !selectedPlaceId}
              className="w-full aspect-[4/3] bg-white/5 hover:bg-white/10 border-2 border-dashed border-white/20 hover:border-accent/50 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              {isUploading ? (
                <>
                  <div className="w-10 h-10 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
                  <span className="text-sm font-bold text-white/70">업로드 중입니다...</span>
                </>
              ) : (
                <>
                  <div className="p-4 bg-accent/10 rounded-2xl group-hover:scale-110 transition-transform">
                    <Camera className="w-8 h-8 text-accent" />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-white/90 text-lg mb-1">여기를 눌러 촬영하기</p>
                    <p className="text-xs font-medium text-white/40">휴대폰 카메라가 즉시 실행됩니다</p>
                  </div>
                </>
              )}
            </button>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handleCapture}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
