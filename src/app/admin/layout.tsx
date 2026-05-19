"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Map, Settings, Globe, LogOut, Compass, Sparkles, User, HelpCircle, Camera, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";
import GithubPushBtn from "@/components/admin/GithubPushBtn";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { dict } = useLanguage();
  const { user, logout, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 경로 변경 시 모바일 사이드바 자동으로 닫기
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const normalizedPathname = pathname.replace(/\/$/, "");

  // 인증 상태 감지 및 비로그인 시 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && !user && normalizedPathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [user, isLoading, normalizedPathname, router]);

  // 로그인 페이지는 레이아웃에서 제외하거나 별도로 처리해야 함
  if (normalizedPathname === "/admin/login") return <>{children}</>;

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="min-h-screen bg-forest-dark flex flex-col items-center justify-center space-y-6 text-white">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-[0.3em] text-xs animate-pulse">Initializing System Session...</p>
      </div>
    );
  }

  // 비로그인 상태일 때는 렌더링을 차단하고 리다이렉트를 대기
  if (!user) return null;

  const menuItems = [
    { title: dict.admin.dashboard, icon: LayoutDashboard, href: "/admin/dashboard" },
    { title: dict.admin.places, icon: Map, href: "/admin/places" },
    { title: "모바일 스냅", icon: Camera, href: "/admin/snap" },
    { title: `i18n ${dict.admin.settings}`, icon: Globe, href: "/admin/i18n" },
    { title: dict.admin.settings, icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-forest-dark text-white font-sans selection:bg-accent/30">
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-6 left-6 z-[60] md:hidden p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl text-white hover:bg-white/20 active:scale-95 transition-all"
        title="Toggle Menu"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`w-80 h-screen fixed top-0 left-0 bg-[#0c1a14]/90 md:bg-white/5 border-r border-white/5 backdrop-blur-2xl z-50 flex flex-col p-8 overflow-y-auto transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center gap-4 mb-16 group">
          <div className="relative h-10 w-24 transition-transform duration-500 overflow-hidden">
            <Image src="/images/logo.svg" alt="Aria Logo" fill className="object-contain filter brightness-0 invert opacity-80" />
          </div>
          <div>
            <h5 className="text-xl font-black tracking-tight leading-none mb-1 text-white">Aria <span className="text-accent underline decoration-accent/20">Console</span></h5>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Admin Platform</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-4">
          <div className="flex items-center gap-2 mb-4 px-2">
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Operations</span>
          </div>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <motion.div key={item.href}>
                <Link 
                  href={item.href}
                  className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-bold transition-all group ${
                    isActive 
                      ? "bg-forest/60 text-white border border-white/10 shadow-2xl shadow-black/40 translate-x-2" 
                      : "text-white/40 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-accent" : "text-white/20 group-hover:text-accent"} transition-colors`} />
                  {item.title}
                  {isActive && <motion.div layoutId="activeDot" className="w-1.5 h-1.5 bg-accent rounded-full ml-auto" />}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="mt-auto pt-8 border-t border-white/5">
          <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl shrink-0 overflow-hidden relative w-11 h-11">
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.name} fill className="object-cover animate-fade-in" />
                ) : (
                  <User className="w-5 h-5 text-accent" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black truncate">{user.name}</p>
                <p className="text-[10px] font-bold text-white/30 truncate">
                  {user.email === "kococo81@gmail.com" || user.email === "ngy5966@naver.com" || user.email === "ngy5966@gmail.com" 
                    ? "Master Operator" 
                    : "Operator"}
                </p>
              </div>
            </div>
            <button 
              onClick={async () => {
                await logout();
                router.push("/admin/login");
              }}
              className="w-full py-3 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-white/20"
            >
              <LogOut className="w-4 h-4" />
              {dict.admin.logout}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-80 p-6 md:p-12 overflow-x-hidden pt-28 md:pt-16">
        <header className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-16 relative">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-2">{dict.admin.explorerTitle}</h2>
            <p className="text-white/40 font-medium text-sm md:text-base">{dict.admin.explorerDesc}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <GithubPushBtn />
            <div className="flex gap-2">
              <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-white/40 hover:text-accent">
                <HelpCircle className="w-5 h-5" />
              </button>
              <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-white/40 hover:text-accent">
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <section className="relative min-h-[calc(100vh-250px)]">
          {children}
        </section>

        {/* Footer Decor */}
        <footer className="mt-32 pt-8 border-t border-white/5 flex justify-between items-center opacity-20">
          <p className="text-[10px] font-black uppercase tracking-widest">Aria Console v6.0</p>
          <p className="text-[10px] font-black uppercase tracking-widest">© 2026 Jeongseon Wellness Project</p>
        </footer>
      </main>
    </div>
  );
}
