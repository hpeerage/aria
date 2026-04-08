"use client";

import { motion } from "framer-motion";
import { Settings, Save, Shield, Database, Bell, Layout, Palette, Sliders } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/context";

export default function AdminSettingsPage() {
  const { dict } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState({
    token: "",
    owner: "hpeerage",
    repo: "aria",
    branch: "main"
  });

  useEffect(() => {
    const saved = localStorage.getItem("aria_github_config");
    if (saved) {
      setConfig(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem("aria_github_config", JSON.stringify(config));
    setTimeout(() => {
      setIsSaving(false);
      alert("설정이 안전하게 저장되었습니다.");
    }, 1000);
  };

  return (
    <div className="space-y-12 pb-32 font-sans">
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
          onClick={handleSave}
          disabled={isSaving}
          className="px-10 py-5 bg-accent text-white rounded-[1.5rem] font-black flex items-center gap-3 shadow-xl shadow-accent/20 hover:scale-105 transition-all relative z-10 disabled:opacity-50"
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
        {/* GitHub Integration Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-10 bg-white/5 border border-white/10 rounded-[3rem] space-y-8 hover:bg-white/10 transition-all group lg:col-span-2 shadow-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-accent/20 text-accent rounded-2xl group-hover:bg-accent group-hover:text-white transition-all">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-white tracking-tight">Cloud Sync Integration</h4>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{dict.admin.securityDesc}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-accent px-1">GitHub Personal Access Token (Classic)</label>
                <input 
                  type="password"
                  value={config.token}
                  onChange={(e) => setConfig({...config, token: e.target.value})}
                  placeholder="ghp_xxxxxxxxxxxx"
                  className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/10 outline-none focus:ring-2 focus:ring-accent transition-all font-bold"
                />
                <p className="text-[10px] text-white/20 px-2 leading-relaxed">토큰은 브라우저에만 저장되며 외부로 전송되지 않습니다. 필요한 권한: [repo] 전체 권한.</p>
             </div>
             <div className="space-y-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-accent px-1">Repository Path (Owner/Repo)</label>
                   <div className="flex gap-4">
                      <input 
                        type="text"
                        value={config.owner}
                        onChange={(e) => setConfig({...config, owner: e.target.value})}
                        placeholder="Owner"
                        className="flex-1 px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-accent transition-all font-bold"
                      />
                      <input 
                        type="text"
                        value={config.repo}
                        onChange={(e) => setConfig({...config, repo: e.target.value})}
                        placeholder="Repo"
                        className="flex-1 px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-accent transition-all font-bold"
                      />
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-accent px-1">Target Branch</label>
                   <input 
                      type="text"
                      value={config.branch}
                      onChange={(e) => setConfig({...config, branch: e.target.value})}
                      placeholder="main"
                      className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-accent transition-all font-bold"
                   />
                </div>
             </div>
          </div>
        </motion.div>
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
