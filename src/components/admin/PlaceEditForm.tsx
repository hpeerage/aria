"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Save, MapPin, Tag, Sparkles, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Place } from "@/types/place";

export default function PlaceEditForm() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  
  const [place, setPlace] = useState<Place | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [wellnessTips, setWellnessTips] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [unsplashKeyword, setUnsplashKeyword] = useState("");

  useEffect(() => {
    // 82개 데이터 중 id기반으로 가져오는 로직 (임시 목업)
    const mockImages = [
      "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1950",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1950",
    ];
    const mockTips = [
        "해발 1,000m 이상의 고원 지대에서 뿜어져 나오는 신선한 산소와 피톤치드를 온몸으로 느껴보세요.",
        "천천히 걸으며 발바닥에 닿는 숲길의 촉감에 집중해 보세요. 명상의 효과를 극대화할 수 있습니다."
    ];
    setPlace({
      id: Number(id),
      name: "정선 숲속의 집",
      category: "Nature",
      coordinates: { lat: 37.38, lng: 128.66 },
      description: "정선의 깊은 숲속에서 즐기는 온전한 휴식.",
      images: mockImages,
      wellnessTips: mockTips
    });
    setImages(mockImages);
    setWellnessTips(mockTips);
  }, [id]);

  const handleAddImage = () => {
    const newImg = prompt("Enter Image URL (Unsplash or direct URL):");
    if (newImg) setImages([...images, newImg]);
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleAddTip = () => {
      const newTip = prompt("Enter a new wellness insight/tip:");
      if (newTip) setWellnessTips([...wellnessTips, newTip]);
  };

  const removeTip = (idx: number) => {
      setWellnessTips(wellnessTips.filter((_, i) => i !== idx));
  };

  if (!place) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32">
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/places" 
          className="flex items-center gap-3 text-white/60 hover:text-white transition-all text-xs font-black uppercase tracking-widest group"
        >
          <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-accent/10 transition-all">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
          Return to Registry
        </Link>
        <button 
          onClick={() => {
            setIsSaving(true);
            setTimeout(() => {
                setIsSaving(false);
                router.push("/admin/places");
            }, 2000);
          }}
          className="px-10 py-4 bg-accent text-white rounded-[1.5rem] font-black flex items-center gap-3 shadow-xl shadow-accent/20 hover:scale-105 transition-all"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Commit Changes
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

        <div className="relative z-10 space-y-10">
          <header className="space-y-4">
             <div className="flex items-center gap-3 text-accent font-black uppercase text-[10px] tracking-[0.2em]">
                <Sparkles className="w-4 h-4" />
                Asset Configurator
             </div>
             <h2 className="text-5xl font-black text-white tracking-tighter">Edit <span className="text-accent underline decoration-white/10">{place.name}</span></h2>
          </header>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <FormItem label="Asset Name" placeholder="e.g. Jeongseon Forest House" value={place.name} />
             <FormItem label="Connectivity Category" placeholder="e.g. Nature, Culture" value={place.category} />
             <FormItem label="Latitude Core" placeholder="e.g. 37.380000" value={String(place.coordinates.lat)} />
             <FormItem label="Longitude Core" placeholder="e.g. 128.660000" value={String(place.coordinates.lng)} />
             
             <div className="md:col-span-2 space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-accent px-1">Wellness Story (KO)</label>
               <textarea 
                 rows={4}
                 className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:ring-2 focus:ring-accent outline-none transition-all font-bold resize-none"
                 defaultValue={place.description}
               />
             </div>

             <div className="md:col-span-2 space-y-6 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-accent px-1">Wellness Insights & Tips</p>
                   </div>
                   <button 
                    type="button"
                    onClick={handleAddTip}
                    className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-black text-white/60 hover:text-white uppercase tracking-widest rounded-xl transition-all"
                   >
                    + Add Insight
                   </button>
                </div>
                <div className="space-y-3">
                   {wellnessTips.map((tip, idx) => (
                      <div key={idx} className="flex gap-4 group">
                          <div className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white/60">
                             {tip}
                          </div>
                          <button 
                             type="button"
                             onClick={() => removeTip(idx)}
                             className="p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                          >
                             <ArrowLeft className="w-4 h-4 rotate-45" />
                          </button>
                      </div>
                   ))}
                </div>
             </div>

             <div className="md:col-span-2 space-y-6 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between">
                   <p className="text-[10px] font-black uppercase tracking-widest text-accent px-1">Visual Asset Mapping</p>
                   <button 
                    type="button"
                    onClick={handleAddImage}
                    className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest rounded-xl transition-all"
                   >
                    + Registry New Asset
                   </button>
                </div>
                <div className="relative group">
                   <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                   <input 
                      type="text" 
                      placeholder="Enter Unsplash keyword..."
                      className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white outline-none focus:ring-2 focus:ring-accent/50 transition-all italic"
                      value={unsplashKeyword}
                      onChange={(e) => setUnsplashKeyword(e.target.value)}
                   />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-[16/10] bg-white/5 rounded-3xl border border-white/5 group overflow-hidden shadow-2xl">
                         <img src={img} alt="Preview" className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                         <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all">
                             <div 
                              onClick={() => removeImage(idx)}
                              className="p-2 bg-red-500/80 text-white rounded-xl shadow-xl cursor-pointer hover:bg-red-500"
                             >
                                <ArrowLeft className="w-4 h-4 rotate-45" />
                             </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function FormItem({ label, placeholder, value }: { label: string; placeholder: string; value?: string }) {
    return (
        <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-accent px-1">{label}</label>
            <div className="relative group">
                <input 
                    type="text" 
                    defaultValue={value}
                    placeholder={placeholder}
                    className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:ring-2 focus:ring-accent outline-none transition-all font-bold"
                />
            </div>
        </div>
    );
}
