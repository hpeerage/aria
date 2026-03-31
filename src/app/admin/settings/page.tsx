"use client";

import { motion } from "framer-motion";
import { Settings, Save, Shield, Database, Bell, Layout, Palette, Sliders } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";

export default function AdminSettingsPage() {
  const { dict } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);

  return (
    <div className="space-y-12 pb-32">
      <div className="flex justify-between items-center bg-white/5 p-10 rounded-[3rem] border border-white/10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 text-accent/5">
             <Settings className="w-48 h-48 rotate-12" />
        </div>
        <div className="space-y-3 relative z-10">
           <div className="flex items-center gap-3 text-accent font-black uppercase text-[10px] tracking-[0.2em]">
              <Sliders className="w-4 h-4" />
              {dict.admin.coreConfig}
           </div>
           <h3 className="text-4xl font-black text-white tracking-tighter">{dict.admin.sysSettings}</h3>
           <p className="text-white/40 text-sm font-bold max-w-md">{dict.admin.sysSettingsDesc}</p>
        </div>
        <button 
          onClick={() => {
            setIsSaving(true);
            setTimeout(() => setIsSaving(false), 2000);
          }}
          className="px-10 py-5 bg-accent text-white rounded-[1.5rem] font-black flex items-center gap-3 shadow-xl shadow-accent/20 hover:scale-105 transition-all relative z-10"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {dict.admin.updateProtocols}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SettingsCard 
          icon={<Shield className="w-6 h-6 text-accent" />}
          title={dict.admin.securityAccess}
          description={dict.admin.securityDesc}
          options={["Multi-Factor Authentication", "Operator Permissions", "Audit Logging"]}
        />
        <SettingsCard 
          icon={<Database className="w-6 h-6 text-blue-400" />}
          title={dict.admin.dataSync}
          description={dict.admin.dataSyncDesc}
          options={["Sync Interval (60m)", "Cache Revalidation", "Error Reporting"]}
        />
        <SettingsCard 
          icon={<Palette className="w-6 h-6 text-purple-400" />}
          title={dict.admin.visualInterface}
          description={dict.admin.visualDesc}
          options={["Dark Mode Priority", "Brand Color Mapping", "Asset Grid Layout"]}
        />
        <SettingsCard 
          icon={<Bell className="w-6 h-6 text-yellow-400" />}
          title={dict.admin.sysNotify}
          description={dict.admin.sysNotifyDesc}
          options={["Data Integrity Alerts", "Traffic Monitoring", "Push Notifications"]}
        />
      </div>
    </div>
  );
}

function SettingsCard({ icon, title, description, options }: { icon: React.ReactNode; title: string; description: string; options: string[] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-10 bg-white/5 border border-white/10 rounded-[3rem] space-y-6 hover:bg-white/10 transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-accent group-hover:text-white transition-all">
          {icon}
        </div>
        <div>
          <h4 className="text-xl font-black text-white tracking-tight">{title}</h4>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{description}</p>
        </div>
      </div>
      <div className="space-y-3 pt-4 border-t border-white/5">
        {options.map(opt => (
          <div key={opt} className="flex items-center justify-between px-2">
            <span className="text-sm font-bold text-white/60">{opt}</span>
            <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-3 h-3 bg-accent rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
