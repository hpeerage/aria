"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Save, MapPin, Tag, Sparkles, Image as ImageIcon, CheckCircle2, Upload, X, Trees, Droplets, Utensils, Palmtree, Home, Star, Heart, Camera, Info, Landmark, Bed, Mountain, Palette, Compass, Navigation, Coffee, ShoppingBag, Ticket, Flag, Flame, Wind, Sunrise, Landmark as LandmarkIcon } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Place } from "@/types/place";
import { getPlacesFromGoogleSheet } from "@/lib/google-sheets";
import { useLanguage } from "@/lib/i18n/context";
import { compressImage } from "@/lib/image-compressor";

const AVAILABLE_ICONS = [
  { id: "Trees", icon: Trees },
  { id: "Droplets", icon: Droplets },
  { id: "Sparkles", icon: Sparkles },
  { id: "Utensils", icon: Utensils },
  { id: "Palmtree", icon: Palmtree },
  { id: "Home", icon: Home },
  { id: "Star", icon: Star },
  { id: "Heart", icon: Heart },
  { id: "Camera", icon: Camera },
  { id: "Landmark", icon: Landmark },
  { id: "Bed", icon: Bed },
  { id: "Mountain", icon: Mountain },
  { id: "Palette", icon: Palette },
  { id: "MapPin", icon: MapPin },
  { id: "Compass", icon: Compass },
  { id: "Navigation", icon: Navigation },
  { id: "Coffee", icon: Coffee },
  { id: "ShoppingBag", icon: ShoppingBag },
  { id: "Ticket", icon: Ticket },
  { id: "Flag", icon: Flag },
  { id: "Flame", icon: Flame },
  { id: "Wind", icon: Wind },
  { id: "Sunrise", icon: Sunrise },
];

const AVAILABLE_COLORS = [
  { id: "emerald", hex: "#10b981", bg: "bg-emerald-500", label: "Nature" },
  { id: "sky", hex: "#0ea5e9", bg: "bg-sky-500", label: "Water" },
  { id: "rose", hex: "#f43f5e", bg: "bg-rose-500", label: "Activity" },
  { id: "orange", hex: "#f97316", bg: "bg-orange-500", label: "Food" },
  { id: "amber", hex: "#f59e0b", bg: "bg-amber-500", label: "Culture" },
  { id: "indigo", hex: "#6366f1", bg: "bg-indigo-500", label: "Stay" },
  { id: "slate", hex: "#64748b", bg: "bg-slate-500", label: "Default" },
  { id: "forest", hex: "#2E4D3E", bg: "bg-forest", label: "Signature" },
  { id: "accent", hex: "#FF7F50", bg: "bg-accent", label: "Highlight" },
];

export default function PlaceEditForm({ isNew = false }: { isNew?: boolean }) {
  const { dict } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Place | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [wellnessTips, setWellnessTips] = useState<string[]>([]);
  const [tipInput, setTipInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPlace() {
      setIsLoading(true);
      
      // 1. Check LocalStorage first (Persistence Mock)
      const cached = localStorage.getItem(`aria_place_${id || 'new'}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        setFormData(parsed);
        setImages(parsed.images || []);
        setWellnessTips(parsed.wellnessTips || []);
        setIsLoading(false);
        return;
      }

      if (isNew || !id) {
        const newPlace = {
          id: Date.now(),
          name: "",
          category: "nature",
          coordinates: { lat: 37.38, lng: 128.66 },
          description: "",
          images: [],
          wellnessTips: []
        };
        setFormData(newPlace);
        setIsLoading(false);
        return;
      }

      // 2. Fetch from Google Sheet
      try {
        const allPlaces = await getPlacesFromGoogleSheet('1Setffm27HQ8LyOM3N9o9V8eA0ihGbZeZgN763jkm1WU');
        const targetPlace = allPlaces.find(p => p.id === Number(id));
        
        if (targetPlace) {
          setFormData(targetPlace);
          setImages(targetPlace.images || []);
          setWellnessTips(targetPlace.wellnessTips || []);
        } else {
          // If not found in sheet, check if it's the 83rd or custom
          setFormData({
            id: Number(id),
            name: "Unknown Asset",
            category: "nature",
            coordinates: { lat: 37.38, lng: 128.66 },
            description: "",
            images: [],
            wellnessTips: []
          });
        }
      } catch (err) {
        console.error("Failed to fetch sheet data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPlace();
  }, [id, isNew]);

  const handleInputChange = (field: string, value: any) => {
    if (!formData) return;
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData({
        ...formData,
        [parent]: { ...((formData as any)[parent]), [child]: value }
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          // 기본 압축 설정(1000px, 0.6) 적용
          const compressed = await compressImage(base64);
          setImages(prev => [...prev, compressed]);
        } catch (err) {
          console.error("Image compression failed:", err);
          setImages(prev => [...prev, base64]); // 실패 시 원본이라도 추가
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleAddTip = () => {
    if (tipInput.trim()) {
      setWellnessTips([...wellnessTips, tipInput.trim()]);
      setTipInput("");
    }
  };

  const removeTip = (idx: number) => {
    setWellnessTips(wellnessTips.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!formData) return;
    setIsSaving(true);
    
    // Final data construction
    const finalData = {
      ...formData,
      images,
      wellnessTips,
      lastUpdated: new Date().toISOString()
    };

    // Simulate Network Delay and Persist to LocalStorage
    setTimeout(() => {
        try {
          localStorage.setItem(`aria_place_${id || 'new'}`, JSON.stringify(finalData));
          
          // 2. 전체 목록 캐시 업데이트 (용량 절약을 위해 대표 이미지만 목록 데이터에 포함)
          const listData = { 
            ...finalData, 
            images: finalData.images.length > 0 ? [finalData.images[0]] : [] 
          }; 
          
          const localListStr = localStorage.getItem('aria_local_places');
          const localList = localListStr ? JSON.parse(localListStr) : [];
          const existingIdx = localList.findIndex((p: any) => p.id === finalData.id);
          
          if (existingIdx >= 0) {
            localList[existingIdx] = listData;
          } else {
            localList.push(listData);
          }
          localStorage.setItem('aria_local_places', JSON.stringify(localList));

          setIsSaving(false);
          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
            router.push("/admin/places");
          }, 1500);
        } catch (error: any) {
          console.error("Save failed:", error);
          setIsSaving(false);
          if (error.name === 'QuotaExceededError') {
            alert("저장 공간이 부족합니다! ⚠️\n\n현재 브라우저의 저장 용량(5MB)이 가득 찼습니다.\n\n[해결 방법]\n1. 상단 [Cloud Sync] 버튼을 눌러 지금까지의 수정을 GitHub에 저장하세요.\n2. [Settings] 메뉴로 이동하여 'Clear Local Cache'를 클릭해 공간을 비워주세요.");
          } else {
            alert("저장 중 예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
          }
        }
    }, 1500);
  };

  if (isLoading || !formData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-[0.3em] text-xs animate-pulse">{dict.admin.syncing}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32">
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 bg-accent text-white rounded-2xl font-black shadow-2xl flex items-center gap-3 border border-white/20"
          >
            <CheckCircle2 className="w-5 h-5" />
            {dict.admin.saveSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <Link 
          href="/admin/places" 
          className="flex items-center gap-3 text-white/60 hover:text-white transition-all text-xs font-black uppercase tracking-widest group"
        >
          <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-accent/10 transition-all">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
          {dict.common.backToList}
        </Link>
        <button 
          onClick={handleSave}
          disabled={isSaving || isSuccess}
          className="px-10 py-4 bg-accent text-white rounded-[1.5rem] font-black flex items-center gap-3 shadow-xl shadow-accent/20 hover:scale-105 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isSaving ? dict.admin.saving : isSuccess ? dict.admin.saveSuccess : dict.admin.save}
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-[3.5rem] p-12 overflow-hidden relative shadow-2xl backdrop-blur-3xl"
      >
        <div className="absolute top-0 right-0 p-12 text-accent/10">
             <MapPin className="w-64 h-64 rotate-12" />
        </div>

        <div className="relative z-10 space-y-12">
          <header className="space-y-4">
             <div className="flex items-center gap-3 text-accent font-black uppercase text-[10px] tracking-[0.2em]">
                <Sparkles className="w-4 h-4" />
                Asset Configurator v2.5
             </div>
              <h2 className="text-5xl font-black text-white tracking-tighter">
                {isNew ? dict.admin.addPlace : dict.admin.editPlace} <span className="text-accent">#{formData.id}</span> <span className="text-white underline decoration-white/10">{formData.name || "Asset"}</span>
              </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <FormItem 
              label={dict.admin.name} 
              placeholder={dict.admin.placeholderName} 
              value={formData.name} 
              onChange={(v) => handleInputChange('name', v)}
             />
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-accent px-1">{dict.admin.category}</label>
                <select 
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-accent transition-all font-bold appearance-none cursor-pointer"
                >
                  {Object.entries(dict.categories).map(([key, label]) => (
                    <option key={key} value={key} className="bg-forest-dark text-white">{label}</option>
                  ))}
                </select>
             </div>
             <FormItem 
              label={dict.admin.coordinates + " (LAT)"} 
              type="number"
              placeholder="37.380000" 
              value={String(formData.coordinates.lat)} 
              onChange={(v) => handleInputChange('coordinates.lat', Number(v))}
             />
             <FormItem 
              label={dict.admin.coordinates + " (LNG)"} 
              type="number"
              placeholder="128.660000" 
              value={String(formData.coordinates.lng)} 
              onChange={(v) => handleInputChange('coordinates.lng', Number(v))}
             />
             
             <div className="md:col-span-2 space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-accent px-1">{dict.admin.description}</label>
               <textarea 
                 rows={4}
                 value={formData.description}
                 onChange={(e) => handleInputChange('description', e.target.value)}
                 className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:ring-2 focus:ring-accent outline-none transition-all font-bold resize-none"
                 placeholder={dict.admin.placeholderDesc}
               />
             </div>

             {/* [v0.12.6] 커스텀 테마 색상 선택기 추가 */}
             <div className="md:col-span-2 space-y-6 pt-10 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-accent px-1">Theme Color Selection</label>
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Select brand color palette</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {AVAILABLE_COLORS.map((color) => {
                    const isSelected = formData.color === color.id;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => handleInputChange('color', color.id)}
                        className={`relative group flex flex-col items-center gap-2`}
                        title={color.label}
                      >
                        <div 
                          className={`w-12 h-12 rounded-full transition-all flex items-center justify-center border-2 ${
                            isSelected 
                              ? 'border-white scale-125 shadow-[0_0_25px_rgba(255,255,255,0.3)]' 
                              : 'border-white/5 hover:border-white/20'
                          } ${color.bg}`}
                        >
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-white" />}
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-widest ${isSelected ? 'text-white' : 'text-white/20'}`}>
                          {color.id}
                        </span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => handleInputChange('color', undefined)}
                    className={`relative group flex flex-col items-center gap-2`}
                  >
                    <div 
                      className={`w-12 h-12 rounded-full transition-all flex items-center justify-center border-2 border-dashed ${
                        !formData.color 
                          ? 'border-white/40 bg-white/10 scale-125' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      {!formData.color && <CheckCircle2 className="w-5 h-5 text-white/40" />}
                      {formData.color && <X className="w-5 h-5 text-white/20" />}
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${!formData.color ? 'text-white' : 'text-white/20'}`}>
                      Auto
                    </span>
                  </button>
                </div>
             </div>

             {/* [v0.11.0] 커스텀 마커 아이콘 선택기 추가 */}
             <div className="md:col-span-2 space-y-6 pt-10 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-accent px-1">Marker Icon Selection</label>
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Select custom symbol</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
                  {AVAILABLE_ICONS.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = formData.icon === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleInputChange('icon', item.id)}
                        className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'bg-accent text-white shadow-lg shadow-accent/20 scale-110' 
                            : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                        title={item.id}
                      >
                        <IconComp size={20} strokeWidth={isSelected ? 3 : 2} />
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => handleInputChange('icon', undefined)}
                    className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                      !formData.icon 
                        ? 'bg-white/20 text-white border-2 border-white/30' 
                        : 'bg-white/5 text-white/20 hover:text-white border border-white/5'
                    }`}
                    title="Default (Category)"
                  >
                    <X size={16} />
                  </button>
                </div>
             </div>

             <div className="md:col-span-2 space-y-6 pt-10 border-t border-white/5">
                <label className="text-[10px] font-black uppercase tracking-widest text-accent px-1">{dict.admin.wellnessInsight}</label>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                   <div className="flex-1 w-full relative">
                     <input 
                       type="text"
                       value={tipInput}
                       onChange={(e) => setTipInput(e.target.value)}
                       placeholder={dict.admin.placeholderInsight}
                       className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent outline-none transition-all font-bold"
                       onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTip())}
                     />
                   </div>
                   <button 
                    type="button"
                    onClick={handleAddTip}
                    disabled={!tipInput.trim()}
                    className="px-8 py-5 bg-accent/10 hover:bg-accent text-accent hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all disabled:opacity-30"
                   >
                    {dict.admin.addInsight}
                   </button>
                </div>
                <div className="space-y-3">
                   {wellnessTips.map((tip, idx) => (
                      <div key={idx} className="flex gap-4 group">
                          <div className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white/60 group-hover:text-white transition-colors">
                             {tip}
                          </div>
                          <button 
                             type="button"
                             onClick={() => removeTip(idx)}
                             className="p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                          >
                             <X className="w-4 h-4" />
                          </button>
                      </div>
                   ))}
                </div>
             </div>

             <div className="md:col-span-2 space-y-8 pt-10 border-t border-white/5">
                <div className="flex items-center justify-between">
                   <p className="text-[10px] font-black uppercase tracking-widest text-accent px-1">{dict.admin.assetRegistry}</p>
                   <div className="flex gap-2">
                     <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 bg-accent/10 hover:bg-accent text-accent hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                     >
                      <Upload className="w-4 h-4" />
                      {dict.admin.uploadImage}
                     </button>
                     <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      accept="image/*" 
                      className="hidden" 
                     />
                   </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                   {images.map((img, idx) => (
                      <motion.div 
                        key={idx} 
                        layoutId={`img-${idx}`}
                        className="relative aspect-video bg-white/5 rounded-3xl border border-white/10 group overflow-hidden shadow-2xl hover:border-accent/40 transition-all cursor-pointer"
                      >
                         <img src={img} alt="Preview" className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                         
                         {idx === 0 && (
                           <div className="absolute top-4 left-4 px-3 py-1.5 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xl border border-white/20 z-20">
                             Preview
                           </div>
                         )}

                         <button 
                            onClick={() => removeImage(idx)}
                            className="absolute top-4 right-4 p-2 bg-red-500/80 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 shadow-xl"
                          >
                            <X className="w-4 h-4" />
                         </button>
                      </motion.div>
                   ))}
                   <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3 text-white/20 hover:text-accent hover:border-accent/40 transition-all cursor-pointer group"
                   >
                     <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-accent/10 transition-all">
                       <ImageIcon className="w-6 h-6" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest">{dict.admin.uploadImage}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function FormItem({ label, placeholder, value, onChange, type = "text" }: { label: string; placeholder: string; value: string; onChange: (v: string) => void; type?: string }) {
    return (
        <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-accent px-1">{label}</label>
            <div className="relative group">
                <input 
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent outline-none transition-all font-bold"
                />
            </div>
        </div>
    );
}
