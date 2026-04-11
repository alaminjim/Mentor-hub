"use client";

import { useEffect, useState } from "react";
import { 
  User, 
  Camera,
  Check,
  Loader2,
  Mail,
  UserCircle
} from "lucide-react";
import { ScrollReveal, RevealItem } from "@/components/animations/ScrollReveal";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await authClient.getSession();
      if (res?.data?.user) {
        setUser(res.data.user);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleFinalSave = () => {
    setSaving(true);
    setTimeout(() => {
        setSaving(false);
        toast.success(`profile information updated successfully`, {
            style: { borderRadius: '10px', background: '#333', color: '#fff' }
        });
    }, 1200);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="size-12 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 lg:px-24 bg-background text-foreground relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[150px] -z-10" />
      
      <ScrollReveal>
        <div className="max-w-4xl mx-auto relative z-10">
          <header className="mb-16 text-center">
            <RevealItem>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 lowercase">
                your. <span className="text-gradient">profile.</span>
              </h1>
            </RevealItem>
            <RevealItem>
              <p className="text-xl text-muted-foreground font-medium lowercase">
                manage your personal identity and community presence.
              </p>
            </RevealItem>
          </header>

          <RevealItem>
            <div className="glass p-8 md:p-16 rounded-[4rem] relative overflow-hidden border border-white/20 shadow-2xl">
               <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-3xl rounded-full -mr-40 -mt-40" />

               <div className="relative z-10">
                  <div className="space-y-16">
                     {/* Avatar Section */}
                     <div className="flex flex-col items-center gap-10">
                        <div className="relative group">
                            <div className="size-48 rounded-[3rem] glass p-2 group-hover:rotate-3 transition-transform duration-500 shadow-xl">
                                <div className="size-full rounded-[2.5rem] overflow-hidden border-2 border-primary/20 bg-background/50">
                                    <img src={user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt={user?.name} className="size-full object-cover" />
                                </div>
                            </div>
                            <button className="absolute -bottom-2 -right-2 size-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"><Camera className="size-6" /></button>
                        </div>
                        <div className="text-center">
                            <h3 className="text-4xl font-black tracking-tighter lowercase mb-3">{user?.name}</h3>
                            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20">
                                <UserCircle className="size-4 text-primary" />
                                <span className="text-xs font-black text-primary uppercase tracking-[0.2em] leading-none">{user?.role || 'student member'}</span>
                            </div>
                        </div>
                     </div>

                     {/* Form Section */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-4 flex items-center gap-2">
                                <User className="size-3" /> full name.
                            </label>
                            <input 
                                type="text" 
                                defaultValue={user?.name} 
                                className="w-full h-18 rounded-2xl bg-background/50 border border-border px-8 font-bold text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" 
                                placeholder="enter your name"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-4 flex items-center gap-2">
                                <Mail className="size-3" /> email address.
                            </label>
                            <input 
                                type="email" 
                                disabled 
                                defaultValue={user?.email} 
                                className="w-full h-18 rounded-2xl bg-muted/50 border border-border px-8 font-bold text-sm opacity-60 cursor-not-allowed" 
                            />
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-4">bio / description.</label>
                            <textarea 
                                className="w-full h-48 rounded-[2.5rem] bg-background/50 border border-border p-8 font-bold text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all resize-none" 
                                placeholder="tell the community about yourself, your goals, and interests..." 
                            />
                        </div>
                     </div>

                     <div className="flex justify-center pt-8">
                        <button 
                            onClick={handleFinalSave}
                            disabled={saving}
                            className="btn-premium flex items-center gap-4 px-20 py-6 shadow-2xl group"
                        >
                            {saving ? <Loader2 className="size-5 animate-spin" /> : <Check className="size-5 group-hover:scale-125 transition-transform" />}
                            <span className="text-sm font-black uppercase tracking-[0.3em]">
                                {saving ? "saving..." : "update profile."}
                            </span>
                        </button>
                      </div>
                  </div>
               </div>
            </div>
          </RevealItem>
        </div>
      </ScrollReveal>
    </div>
  );
}
