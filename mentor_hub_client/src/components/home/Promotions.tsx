"use client";

import { Ticket, ArrowRight, Zap, Loader2, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { ScrollReveal, RevealItem } from "../animations/ScrollReveal";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Promotions() {
  const [isClaiming, setIsClaiming] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClaim = () => {
    setIsClaiming(true);
    setTimeout(() => {
      toast.success("Premium Trial Unlocked! $0 pass applied.", {
        icon: '🎟️',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      setIsClaiming(false);
      setIsClaimed(true);
    }, 1500);
  };
  return (
    <section className="py-12 relative overflow-hidden">
      <ScrollReveal>
        <RevealItem>
          <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-primary via-sky-600 to-indigo-700 p-10 md:p-20 shadow-[0_50px_100px_-20px_oklch(0.6_0.18_245/0.3)] border border-white/20 group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-1000 -rotate-12 translate-x-1/4 -translate-y-1/4">
               <Ticket className="size-[500px]" />
            </div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs font-black tracking-[0.2em] uppercase">
                    <Zap className="size-4 fill-amber-400 text-amber-400 animate-pulse" />
                    limited time.
                  </div>
                  <div className="flex items-center gap-2 text-cyan-200 font-mono font-bold text-sm bg-black/20 px-4 py-2 rounded-full border border-white/5">
                    <Clock className="size-4" />
                    <span>{String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s</span>
                  </div>
                </div>
                <h2 className="text-5xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter lowercase">
                  get your. <br /> first session. <br /> <span className="text-cyan-300">free.</span>
                </h2>
                <p className="text-blue-50 text-xl max-w-md font-medium lowercase leading-relaxed">
                  try mentorhub today and see the difference a great mentor can make. no credit card required for your first trial.
                </p>
                
                <div className="flex flex-wrap gap-6 items-center pt-4">
                  {isClaimed ? (
                    <Link href="/dashboard" className="px-12 py-6 btn-premium rounded-full font-black uppercase tracking-widest text-lg shadow-2xl bg-emerald-500 text-white hover:bg-emerald-600 flex items-center gap-3 transition-colors">
                      go to dashboard
                      <ArrowRight className="size-5" />
                    </Link>
                  ) : (
                    <button 
                      onClick={handleClaim}
                      disabled={isClaiming}
                      className="px-12 py-6 btn-premium rounded-full font-black uppercase tracking-widest text-lg shadow-2xl bg-white text-primary hover:bg-white/90 disabled:opacity-80 disabled:cursor-not-allowed flex items-center gap-3"
                    >
                      {isClaiming ? "claiming..." : "claim now."}
                      {isClaiming && <Loader2 className="size-5 animate-spin" />}
                      {!isClaiming && <CheckCircle2 className="size-5" />}
                    </button>
                  )}
                  <div className="px-8 py-5 border-2 border-dashed border-white/30 rounded-full flex flex-col items-center">
                    <span className="text-white/60 text-[10px] uppercase font-black tracking-widest mb-1">use code</span>
                    <span className="text-white font-mono font-black text-2xl tracking-[0.3em]">FREEPASS</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:flex items-center justify-center relative">
                <div className="relative w-[400px] h-[400px]">
                   <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl animate-pulse" />
                   <div className="absolute inset-10 border-2 border-white/20 rounded-full animate-spin-slow" />
                   <div className="absolute inset-16 border border-white/10 rounded-full animate-spin-reverse-slow" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                         <span className="block text-[120px] font-black text-white leading-none tracking-tighter">$0.</span>
                         <span className="block text-2xl font-black text-cyan-300 uppercase tracking-[0.2em] mt-2">trial pass.</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </RevealItem>
      </ScrollReveal>
    </section>
  );
}
