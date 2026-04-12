"use client";

import { useState } from "react";
import { 
  Settings, User, Lock, Bell, Shield, 
  Moon, Globe, Save, Loader2, ChevronRight,
  Database, Zap, Eye
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Preferences updated successfully");
    }, 1500);
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header Segment */}
      <div className="p-8 rounded-[2.5rem] bg-card border border-border relative overflow-hidden group shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -mr-32 -mt-32 transition-all group-hover:bg-primary/10" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
             <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Settings className="size-4 text-primary" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">System Config</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter">Account <span className="text-primary">Settings.</span></h1>
          <p className="text-muted-foreground text-sm font-medium">Fine-tune your MentorHub experience and security protocols.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-2xl transition-all border group relative overflow-hidden",
                activeTab === tab.id 
                  ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" 
                  : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3 relative z-10">
                <tab.icon className={cn("size-4", activeTab === tab.id ? "text-white" : "text-primary")} />
                <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
              </div>
              <ChevronRight className={cn("size-4 opacity-0 group-hover:opacity-100 transition-all", activeTab === tab.id && "opacity-100")} />
              {activeTab === tab.id && (
                 <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/80" />
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Content Area */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
            
            {activeTab === "general" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between pb-6 border-b border-border">
                   <div>
                      <h3 className="text-xl font-black tracking-tight">System Preferences</h3>
                      <p className="text-xs text-muted-foreground font-medium mt-1">Global settings for your interface</p>
                   </div>
                   <Zap className="size-6 text-amber-500 opacity-20" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Language & Region</label>
                    <div className="relative group/field">
                       <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within/field:text-primary transition-colors" />
                       <select className="w-full h-14 pl-12 pr-4 bg-background border border-border rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 outline-none appearance-none">
                          <option>English (US)</option>
                          <option>Bangla (BD)</option>
                          <option>Spanish (ES)</option>
                       </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Interface Mode</label>
                    <div className="relative group/field">
                       <Moon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within/field:text-primary transition-colors" />
                       <select className="w-full h-14 pl-12 pr-4 bg-background border border-border rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 outline-none appearance-none">
                          <option>System Default</option>
                          <option>Light Mode</option>
                          <option>Dark Mode</option>
                       </select>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-muted/30 border border-border space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="size-10 rounded-xl bg-background border border-border flex items-center justify-center shadow-sm">
                            <Eye className="size-4 text-primary" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest">Accessibility Mode</p>
                            <p className="text-xs text-muted-foreground font-semibold">High contrast and screen reader optimization</p>
                         </div>
                      </div>
                      <div className="w-12 h-6 bg-border rounded-full relative cursor-pointer">
                         <div className="absolute right-1 top-1 size-4 bg-white rounded-full transition-all" />
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between pb-6 border-b border-border">
                   <div>
                      <h3 className="text-xl font-black tracking-tight">Authentication Shield</h3>
                      <p className="text-xs text-muted-foreground font-medium mt-1">Secure your account credentials</p>
                   </div>
                   <Database className="size-6 text-rose-500 opacity-20" />
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">New password</label>
                    <div className="relative group/field">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within/field:text-primary transition-colors" />
                       <input type="password" placeholder="••••••••" className="w-full h-14 pl-12 pr-4 bg-background border border-border rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 outline-none" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Two-Factor Authentication</label>
                    <button className="w-full h-14 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/20 text-primary text-xs font-black uppercase tracking-widest hover:bg-primary/5 transition-all">
                       Add Authentication Layer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Fallback for other tabs */}
            {(activeTab === "notifications" || activeTab === "privacy") && (
               <div className="py-20 text-center space-y-4">
                  <div className="size-20 bg-muted rounded-[2rem] flex items-center justify-center mx-auto opacity-40">
                     <Settings className="size-8" />
                  </div>
                  <h3 className="text-xl font-black">Coming Soon</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto font-medium leading-relaxed">
                     We are currently fine-tuning these protocols to ensure maximum efficiency. Check back later!
                  </p>
               </div>
            )}

            <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">All changes are encrypted</p>
               </div>
               <button 
                  onClick={handleSave}
                  disabled={isLoading}
                  className="h-14 px-8 bg-foreground text-background rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/5"
               >
                  {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  Finalize Config
               </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
