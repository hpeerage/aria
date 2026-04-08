"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Map, Settings, Globe, LogOut, Compass, Sparkles, User, HelpCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import GithubPushBtn from "@/components/admin/GithubPushBtn";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { dict } = useLanguage();

  // 로그인 페이지는 레이아웃에서 제외하거나 별도로 처리해야 함
  if (pathname === "/admin/login") return <>{children}</>;

  const menuItems = [
    { title: dict.admin.dashboard, icon: LayoutDashboard, href: "/admin/dashboard" },
    { title: dict.admin.places, icon: Map, href: "/admin/places" },
    { title: `i18n ${dict.admin.settings}`, icon: Globe, href: "/admin/i18n" },
    { title: dict.admin.settings, icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-forest-dark text-white font-sans selection:bg-accent/30">
      {/* Sidebar */}
      <aside className="w-80 h-screen fixed top-0 left-0 bg-white/5 border-r border-white/5 backdrop-blur-2xl z-50 flex flex-col p-8 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-4 mb-16 group">
          <div className="relative h-10 w-24 transition-transform duration-500 overflow-hidden">
            <Image src="/aria/images/logo.svg" alt="Aria Logo" fill className="object-contain filter brightness-0 invert opacity-80" />
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
              <div className="p-3 bg-white/10 rounded-2xl">
                <User className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-black">Hoon Lee</p>
                <p className="text-[10px] font-bold text-white/30">Master Operator</p>
              </div>
            </div>
            <Link 
              href="/"
              className="w-full py-3 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-white/20"
            >
              <LogOut className="w-4 h-4" />
              {dict.admin.logout}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-80 p-12 overflow-x-hidden pt-16">
        <header className="flex justify-between items-center mb-16 relative">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter mb-2">{dict.admin.explorerTitle}</h2>
            <p className="text-white/40 font-medium">{dict.admin.explorerDesc}</p>
          </div>
          <div className="flex items-center gap-4">
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
