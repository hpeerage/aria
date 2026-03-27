import { Sparkles, Map, Mountain, Info, Compass } from "lucide-react";
import { getPlacesFromGoogleSheet } from "@/lib/google-sheets";
import { Place } from "@/types/place";
import PlaceList from "@/components/PlaceList";

const MOCK_SHEET_ID = '1iF_89p8o3Q-G6c3L2pL7U1tK9s3W0M8_H1O3J3z_7Uo';

export default async function Home() {
  const places: Place[] = await getPlacesFromGoogleSheet(MOCK_SHEET_ID);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAF9] dark:bg-forest-dark text-forest transition-colors duration-500">
      
      {/* Premium Hero Header */}
      <header className="relative w-full h-[60vh] flex flex-col items-center justify-center overflow-hidden bg-forest text-white selection:bg-accent selection:text-white">
        {/* Animated Background SVG Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="forest-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M50 20 L80 80 L20 80 Z" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#forest-pattern)" />
          </svg>
        </div>

        {/* Floating Accents */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-accent/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-accent/10 blur-[80px] animate-pulse delay-700" />

        <div className="z-10 text-center space-y-8 max-w-5xl px-6">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-accent font-bold text-sm tracking-widest uppercase animate-in fade-in slide-in-from-top-4 duration-1000">
            <Sparkles className="w-5 h-5" />
            <span>Wellness Experience</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Jeongseon <br />
            <span className="text-accent underline decoration-white/20 underline-offset-8">Aria</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto font-medium leading-relaxed animate-in fade-in duration-1000 delay-500">
            정선의 82개 보물 같은 관광 자원을 데이터로 잇고, <br />
            당신만의 웰니스 여정을 큐레이션합니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-in fade-in duration-1000 delay-700">
            <button className="flex items-center justify-center px-10 py-5 bg-accent hover:bg-accent-dark text-white font-black rounded-[2rem] transition-all transform hover:scale-105 shadow-2xl shadow-accent/40 active:scale-95">
              <Compass className="mr-3 w-6 h-6" />
              여정 시작하기
            </button>
            <button className="flex items-center justify-center px-10 py-5 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/20 text-white font-black rounded-[2rem] transition-all active:scale-95 group">
              <Map className="mr-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
              대화형 지도 (Coming Soon)
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 animate-bounce text-white/30">
          <div className="w-1 h-12 rounded-full bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </header>

      {/* Stats Quickbar */}
      <section className="bg-white dark:bg-forest-light border-y border-forest/5 py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Assets", value: "82", icon: Mountain },
            { label: "Categories", value: "8+", icon: Tag },
            { label: "Wellness", value: "100%", icon: Sparkles },
            { label: "Data Source", value: "Sheets", icon: Info },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className="p-3 rounded-2xl bg-forest/5 text-forest group-hover:bg-accent group-hover:text-white transition-all duration-300">
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-forest/40 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-forest group-hover:text-accent transition-colors">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Content Section */}
      <main className="flex-grow pb-32">
        <PlaceList initialPlaces={places} />
      </main>

      {/* Premium Footer */}
      <footer className="bg-forest text-white/40 py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-3xl font-black text-white/90">Jeongseon Aria</h3>
            <p className="max-w-md text-sm leading-relaxed">
              정선의 웰니스 가치를 디지털 기술로 재발견합니다. 안티그래비티와 Gemini AI가 지휘하는 차세대 관광 큐레이션 플랫폼.
            </p>
          </div>
          
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-white/60">
            <a href="#" className="hover:text-accent transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms</a>
            <a href="#" className="hover:text-accent transition-colors">Contact</a>
          </div>

          <p className="text-xs">&copy; {new Date().getFullYear()} JS-aria. Crafted for Harmony.</p>
        </div>
      </footer>
    </div>
  );
}

// Re-using Tag because I removed the direct import
function Tag({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" strokeWidth="2" 
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/>
      <path d="M7 7h.01"/>
    </svg>
  );
}
