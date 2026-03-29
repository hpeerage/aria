"use client";

import { motion } from "framer-motion";
import { Map, Users, Sparkles, Calendar, ArrowUpRight, TrendingUp, Info } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { label: "Total Asset Count", value: "82", trend: "+4 this month", icon: Map, color: "text-accent" },
    { label: "Active Exploration Paths", value: "12", trend: "Maintained", icon: TrendingUp, color: "text-blue-400" },
    { label: "Wellness Vitality Score", value: "98%", trend: "+2% growth", icon: Sparkles, color: "text-purple-400" },
    { label: "Registered Operators", value: "24", trend: "Stable", icon: Users, color: "text-white" },
  ];

  return (
    <div className="space-y-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden group hover:bg-white/10 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20"
          >
            <div className={`p-4 bg-white/10 rounded-2xl w-fit mb-6 ${stat.color} group-hover:bg-accent group-hover:text-white transition-all`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2">{stat.label}</p>
            <div className="flex items-end gap-3">
              <h3 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h3>
              <p className="text-[10px] font-bold text-accent mb-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                {stat.trend}
              </p>
            </div>
            {/* Background Accent */}
            <div className="absolute -right-6 -bottom-6 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
               <stat.icon className="w-24 h-24" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Sync Status Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-10 bg-forest/40 border border-white/10 rounded-[3rem] space-y-8 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 text-accent/20">
            <Sparkles className="w-32 h-32 rotate-12" />
          </div>
          <div className="relative z-10 space-y-6">
            <h4 className="text-2xl font-black text-white tracking-tight">System Integrity Check</h4>
            <p className="text-white/60 leading-relaxed max-w-md">
              Google Sheets (ID: 1Setffm...) 데이터와 실시간 동기화 상태입니다. 
              최근 업데이트 이후 모든 치유 자산의 맵핑 데이터가 정상적으로 보호되고 있습니다.
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-bold border-b border-white/5 pb-4">
                <span className="text-white/60 uppercase tracking-widest (prefers-color-scheme: dark)">Connectivity Status</span>
                <span className="text-accent flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-ping" />
                  Stable Connection
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold border-b border-white/5 pb-4">
                <span className="text-white/60 uppercase tracking-widest (prefers-color-scheme: dark)">Last Database Sync</span>
                <span className="text-white">Today 21:30 PM</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-white/40 uppercase tracking-widest">Missing Images</span>
                <span className="text-yellow-400">0 Items</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Insights */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-10 bg-white/5 border border-white/10 rounded-[3rem] space-y-8 relative overflow-hidden hover:bg-white/[0.08] transition-all"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-2xl font-black text-white tracking-tight">Wellness Loop Analytics</h4>
            <div className="p-3 bg-white/5 rounded-2xl">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-white/40 text-sm leading-relaxed border-l-4 border-accent pl-6 italic">
              "정선군 8월 방문자 선호도 분석 결과, 자연 경관(Nature) 카테고리의 체류 시간이 전월 대비 15% 상승했습니다."
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 text-center">
                <p className="text-[10px] font-black uppercase text-white/30 mb-2">Popular Region</p>
                <p className="text-xl font-black text-white">Jeongseon-eup</p>
              </div>
              <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 text-center">
                <p className="text-[10px] font-black uppercase text-white/30 mb-2">Peak Time</p>
                <p className="text-xl font-black text-white">14:00 - 16:00</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Guide Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-accent text-forest-dark rounded-[2rem] flex items-center justify-between shadow-2xl shadow-accent/20 border-b-4 border-black/10 active:translate-y-1 transition-all"
      >
        <div className="flex items-center gap-6">
          <div className="p-4 bg-forest-dark/10 rounded-2xl">
            <Info className="w-8 h-8" />
          </div>
          <div>
            <h5 className="text-xl font-black tracking-tight">관리자 전용 운영 가이드 v2.0</h5>
            <p className="text-forest-dark/60 text-sm font-bold tracking-tight">장소 데이터 수정 시 다국어(영어) 필드 누락 여부를 반드시 확인해 주세요.</p>
          </div>
        </div>
        <button className="px-8 py-4 bg-forest-dark text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-black hover:scale-105 transition-all">
          Download PDF Guide
        </button>
      </motion.div>
    </div>
  );
}
