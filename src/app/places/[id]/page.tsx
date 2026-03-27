import { getPlacesFromGoogleSheet } from "@/lib/google-sheets";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowLeft, MapPin, Tag, Sparkles, Navigation, Share2, Compass, MoveRight } from "lucide-react";
import Link from "next/link";
import * as motion from "framer-motion/client";

// 정적 페이지 생성을 위한 파라미터 설정 (82개 장소 사전 빌드)
export async function generateStaticParams() {
  const places = await getPlacesFromGoogleSheet();
  return places.map((place) => ({
    id: place.id.toString(),
  }));
}

// 메타데이터 설정 (SEO 최적화)
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const places = await getPlacesFromGoogleSheet();
  const place = places.find((p) => p.id.toString() === params.id);
  
  if (!place) return { title: "Place Not Found - Jeongseon Aria" };

  return {
    title: `${place.name} - 정선 아리아 웰니스 큐레이션`,
    description: place.description || `${place.name}에서 경험하는 정선의 치유 에너지.`,
    openGraph: {
      title: place.name,
      description: place.description,
      images: ["/aria/og-image.jpg"], // 대표 이미지 경로 설정 시 수정 필요
    },
  };
}

export default async function PlaceDetailPage({ params }: { params: { id: string } }) {
  const places = await getPlacesFromGoogleSheet();
  const place = places.find((p) => p.id.toString() === params.id);

  if (!place) {
    notFound();
  }

  // 주변 장소 추천 (거리 기반 정렬)
  const nearbyPlaces = places
    .filter((p) => p.id !== place.id)
    .sort((a, b) => {
      const distA = Math.pow(a.coordinates.lat - place.coordinates.lat, 2) + Math.pow(a.coordinates.lng - place.coordinates.lng, 2);
      const distB = Math.pow(b.coordinates.lat - place.coordinates.lat, 2) + Math.pow(b.coordinates.lng - place.coordinates.lng, 2);
      return distA - distB;
    })
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#F8FAF9] dark:bg-forest-dark pb-32">
      {/* Premium Hero Header */}
      <section className="relative h-[60vh] bg-forest flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1950')] bg-cover bg-center opacity-30 grayscale blur-sm scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAF9] via-forest/80 to-transparent" />
        
        <div className="relative z-10 text-center space-y-8 px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-accent text-xs font-black tracking-widest uppercase"
          >
            No. {place.id} • {place.category}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-black text-white tracking-tighter"
          >
            {place.name}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-6 text-white/60 font-bold"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              정선군 고유 자산
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5" />
              82 치유 거점
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Story & Description Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-forest p-10 md:p-16 rounded-[4rem] shadow-2xl border border-forest/5 space-y-10"
            >
              <div className="flex justify-between items-center">
                <Link 
                  href="/aria" 
                  className="group flex items-center gap-3 text-forest/40 hover:text-accent font-black text-xs tracking-widest uppercase transition-all"
                >
                  <div className="p-3 bg-forest/5 rounded-2xl group-hover:bg-accent/10 transition-all">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </div>
                  Back to List
                </Link>
                <div className="flex gap-4">
                  <button className="p-3 bg-forest/5 text-forest hover:bg-forest/10 rounded-2xl transition-all active:scale-95">
                    <Navigation className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-forest/5 text-forest hover:bg-forest/10 rounded-2xl transition-all active:scale-95">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-10 bg-accent rounded-full" />
                  <h2 className="text-3xl font-black text-forest">공간의 리듬과 역사</h2>
                </div>
                <p className="text-xl text-forest/70 font-bold leading-relaxed italic">
                  {place.description || "이 장소의 깊은 역사와 웰니스 리듬을 발견할 수 있는 상세한 이야기가 준비되고 있습니다. 정선의 자연이 빚어낸 이곳에서 당신만의 새로운 아리아를 시작해 보세요."}
                </p>
              </div>

              {/* Specialized Wellness Tip Section */}
              <div className="relative group bg-accent/5 p-10 rounded-[3rem] border border-accent/10 overflow-hidden">
                <Sparkles className="absolute -right-6 -bottom-6 w-32 h-32 text-accent/10 group-hover:rotate-12 transition-transform duration-1000" />
                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-accent/10 rounded-xl text-accent text-[10px] font-black uppercase tracking-[0.2em]">
                    <Sparkles className="w-4 h-4" />
                    Wellness Insight
                  </div>
                  <h3 className="text-2xl font-black text-forest">정선 아리아가 전하는 웰니스 팁</h3>
                  <p className="text-forest/60 font-bold leading-relaxed">
                    82개의 관광 자원 중 한 곳인 이곳은 특히 아침의 정운과 저녁의 노을이 아름다운 곳입니다. 
                    스마트폰을 잠시 내려놓고 공간이 들려주는 소리에 집중해 보세요. 
                    이곳의 기운은 당신의 지친 영혼에 새로운 질서를 부여할 것입니다.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Nearby Places Section */}
            <section className="space-y-8">
              <div className="flex items-center justify-between px-6">
                <h3 className="text-2xl font-black text-forest tracking-tight">이어서 여행하기 좋은 주변 장소</h3>
                <div className="text-[10px] font-black uppercase tracking-widest text-forest/20">Discovery Loop</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {nearbyPlaces.map((np) => (
                  <Link key={np.id} href={`/places/${np.id}`} className="block group">
                    <motion.div 
                      whileHover={{ x: 10 }}
                      className="p-6 bg-white dark:bg-forest border border-forest/5 rounded-[2.5rem] flex items-center justify-between hover:border-accent/30 transition-all hover:shadow-xl shadow-forest/5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-forest/5 text-forest group-hover:bg-accent group-hover:text-white rounded-2xl transition-all">
                          <Tag className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-black text-forest group-hover:text-accent transition-colors">{np.name}</p>
                          <p className="text-[10px] font-bold text-forest/40 uppercase tracking-widest">{np.category}</p>
                        </div>
                      </div>
                      <MoveRight className="w-5 h-5 text-forest/10 group-hover:text-accent transition-all" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar / Quick View */}
          <aside className="space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-forest p-10 rounded-[3rem] shadow-xl border border-forest/5 space-y-8 sticky top-32"
            >
              <h4 className="text-lg font-black text-forest uppercase tracking-widest border-b border-forest/5 pb-4">Quick Fact</h4>
              <div className="space-y-6">
                <SidebarItem label="위치" value="강원도 정선군 일대" />
                <SidebarItem label="카테고리" value={place.category} />
                <SidebarItem label="좌표" value={`${place.coordinates.lat.toFixed(4)}, ${place.coordinates.lng.toFixed(4)}`} />
              </div>
              <div className="pt-6">
                <button className="w-full py-5 bg-forest text-white rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-accent transition-all shadow-lg active:scale-95">
                  길 찾기 (Google Maps)
                </button>
              </div>
            </motion.div>

            <div className="px-10 space-y-4">
              <p className="text-forest/30 text-[10px] font-black uppercase tracking-widest leading-loose">
                Jeongseon Aria Wellness Project <br />
                Asset Inventory ID: {place.id}
              </p>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}

function SidebarItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase tracking-widest text-forest/30">{label}</p>
      <p className="text-sm font-black text-forest">{value}</p>
    </div>
  );
}
