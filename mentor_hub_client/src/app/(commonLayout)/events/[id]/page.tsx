"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, MapPin, Search, ArrowRight, Filter, 
  Users, Bookmark, Share2, Sparkles, Globe, 
  GraduationCap, Clock, CheckCircle, ChevronLeft,
  Mail, Link as LinkIcon, ShieldCheck, Loader2,
  Ticket, Zap, PhoneCall
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [status, setStatus] = useState({ isRegistered: false, isBookmarked: false });
  const [actionLoading, setActionLoading] = useState({ register: false, bookmark: false });

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/dashboard/events/public/${id}`).then(r => r.json());
      if (res.success) setEvent(res.data);
    } catch (err) {
      console.error("Event fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch(`/api/dashboard/events/status/${id}`).then(r => r.json());
      if (res.success) setStatus(res.data);
    } catch (err) {
      console.error("Status check failed");
    }
  };

  useEffect(() => {
    const init = async () => {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        const user = session.data.user as any;
        setUser(user);
        
        // Premium Check: If student is not subscribed, redirect to pricing
        if (user.role === "STUDENT" && !user.isSubscribed) {
          toast.error("This is a Premium Session. Please subscribe to access details.");
          return router.push("/pricing");
        }
        
        fetchStatus();
      } else {
        // If not logged in, they can't see details either (optional but safe)
        toast.error("Please sign in to view event details");
        return router.push("/signin");
      }
      if (id) fetchEvent();
    };
    init();
  }, [id]);

  const handleRegister = async () => {
    if (!user) {
      toast.error("Please sign in to register interest");
      return router.push("/signin");
    }

    setActionLoading(prev => ({ ...prev, register: true }));
    try {
      const res = await fetch("/api/dashboard/events/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: id })
      }).then(r => r.json());

      if (res.success) {
        setStatus(prev => ({ ...prev, isRegistered: res.data.registered }));
        toast.success(res.data.registered ? "Participation Confirmed!" : "Registration Cancelled");
      }
    } catch (err) {
      toast.error("Process failed. Try again.");
    } finally {
      setActionLoading(prev => ({ ...prev, register: false }));
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error("Please sign in to save events");
      return router.push("/signin");
    }

    setActionLoading(prev => ({ ...prev, bookmark: true }));
    try {
      const res = await fetch("/api/dashboard/events/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: id })
      }).then(r => r.json());

      if (res.success) {
        setStatus(prev => ({ ...prev, isBookmarked: res.data.bookmarked }));
        toast.success(res.data.bookmarked ? "Event added to Wishlist" : "Removed from Wishlist");
      }
    } catch (err) {
      toast.error("Failed to save event");
    } finally {
      setActionLoading(prev => ({ ...prev, bookmark: false }));
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="size-20 rounded-[2.5rem] bg-primary/10 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 animate-pulse" />
        <Zap className="size-10 text-primary animate-bounce" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Syncing Intel...</p>
    </div>
  );

  if (!event) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
       <div className="size-20 bg-muted rounded-[2rem] flex items-center justify-center opacity-20 border border-border">
          <Globe className="size-10" />
       </div>
       <div className="space-y-2">
          <h2 className="text-3xl font-black italic tracking-tighter capitalize">Event not found.</h2>
          <p className="text-muted-foreground text-sm font-medium lowercase">The academic gathering you are seeking has vanished or expired.</p>
       </div>
       <Link href="/events" className="h-12 px-8 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl hover:shadow-primary/20 transition-all">Back to Calendar</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-32 pb-32">
       <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* ── Left Content: Details (Col-span 8) ─────────────────────── */}
          <div className="lg:col-span-8 space-y-12">
             <Link 
               href="/events" 
               className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group w-fit"
             >
                <ChevronLeft className="size-3 group-hover:-translate-x-1 transition-transform" /> Back to Explorations
             </Link>
             
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="px-5 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary italic">
                      {event.status} Session
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground">
                      <Clock className="size-3" /> Scheduled Update
                   </div>
                </div>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic leading-[0.85] text-foreground">
                  {event.title}
                </h1>
                <div className="flex flex-wrap gap-4 pt-6">
                   <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-muted/50 border border-border text-[11px] font-bold text-muted-foreground shadow-sm">
                      <MapPin className="size-4 text-primary" /> {event.location}
                   </div>
                   <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-600 italic">
                      <ShieldCheck className="size-4 fill-emerald-500/20" /> Verified Content
                   </div>
                </div>
             </div>

             <div className="space-y-12 pt-8">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                   <div className="flex items-center gap-2 mb-6">
                      <div className="h-px w-8 bg-primary/30" />
                      <h2 className="text-2xl font-black tracking-tighter italic m-0">About the event.</h2>
                   </div>
                   <p className="text-muted-foreground leading-relaxed text-lg font-medium py-2">
                     {event.description || "No description provided for this academic gathering. This session aims to bridge the gap between theoretical knowledge and industry practices through immersive collaboration."}
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <motion.div 
                     whileHover={{ y: -5 }}
                     className="p-10 rounded-[3rem] bg-card border border-border space-y-5 relative overflow-hidden group"
                   >
                      <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary italic font-black text-xl group-hover:scale-110 transition-transform shadow-inner">?</div>
                      <h4 className="text-2xl font-black tracking-tighter italic">Why Participate?</h4>
                      <p className="text-sm text-muted-foreground font-medium lowercase leading-relaxed">Gain direct insights from filtered experts and expand your professional network globally through real-time academic exchange.</p>
                      <div className="absolute top-0 right-0 p-8 opacity-5">
                         <Sparkles className="size-24" />
                      </div>
                   </motion.div>
                   <motion.div 
                     whileHover={{ y: -5 }}
                     className="p-10 rounded-[3rem] bg-card border border-border space-y-5 relative overflow-hidden group"
                   >
                      <div className="size-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 italic font-black text-xl group-hover:scale-110 transition-transform shadow-inner">!</div>
                      <h4 className="text-2xl font-black tracking-tighter italic">Key Learning</h4>
                      <p className="text-sm text-muted-foreground font-medium lowercase leading-relaxed">Master the core principles and frameworks discussed during the session, with actionable takeaways for your career path.</p>
                      <div className="absolute top-0 right-0 p-8 opacity-5">
                         <GraduationCap className="size-24" />
                      </div>
                   </motion.div>
                </div>
             </div>
          </div>

          {/* ── Right Content: Sidebar (Col-span 4) ────────────────────── */}
          <div className="lg:col-span-4 space-y-8">
             <div className="p-10 rounded-[3.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-3xl shadow-black/5 space-y-12 sticky top-32 overflow-hidden group/sidebar">
                
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-3xl rounded-full -mr-24 -mt-24 group-hover/sidebar:bg-primary/10 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 blur-2xl rounded-full -ml-16 -mb-16" />
                
                <div className="space-y-10 relative z-10">
                   <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Session Intel</p>
                        <div className="h-1 w-6 bg-primary rounded-full" />
                      </div>
                      <button className="size-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                        <Share2 className="size-4" />
                      </button>
                   </div>
                   
                   {/* Price/Type Section */}
                   <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-between group/price">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Pricing</p>
                        <p className="text-3xl font-black tracking-tighter italic text-foreground flex items-baseline gap-1">
                          Free<span className="text-sm text-primary group-hover:animate-pulse">.</span>
                        </p>
                      </div>
                      <div className="size-12 rounded-2xl bg-white dark:bg-slate-800 border border-border flex items-center justify-center shadow-lg transform rotate-6 group-hover:rotate-0 transition-transform">
                        <Ticket className="size-6 text-primary" />
                      </div>
                   </div>

                   <div className="space-y-6 pt-2">
                      <div className="flex items-center gap-5 group/item">
                         <div className="size-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-primary shadow-sm group-hover/item:bg-primary group-hover/item:text-white transition-all duration-500">
                            <Calendar className="size-6" />
                         </div>
                         <div>
                            <p className="text-[9px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Scheduled For</p>
                            <p className="text-base font-black tracking-tight">{new Date(event.date).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                            <p className="text-[10px] font-bold text-primary italic">{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Hub Time</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-5 group/item">
                         <div className="size-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-primary shadow-sm group-hover/item:bg-primary group-hover/item:text-white transition-all duration-500">
                            <Users className="size-6" />
                         </div>
                         <div>
                            <p className="text-[9px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Entry Capacity</p>
                            <p className="text-base font-black tracking-tight">{event.capacity} Slots Remaining</p>
                            <div className="w-32 h-1 bg-muted rounded-full mt-1.5 overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: "65%" }}
                                 className="h-full bg-primary" 
                               />
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="pt-6 gap-4 flex flex-col">
                      <button 
                        onClick={handleRegister}
                        disabled={actionLoading.register}
                        className={cn(
                          "w-full h-20 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 group/btn border-none relative overflow-hidden",
                          status.isRegistered 
                            ? "bg-emerald-500 text-white shadow-3xl shadow-emerald-500/20" 
                            : "bg-primary text-white hover:shadow-3xl hover:shadow-primary/30"
                        )}
                      >
                         <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                         {actionLoading.register ? (
                           <Loader2 className="size-5 animate-spin" />
                         ) : status.isRegistered ? (
                           <>Participation Confirmed <CheckCircle className="size-5" /></>
                         ) : (
                           <>Claim Your Spot <ArrowRight className="size-5 group-hover/btn:translate-x-1 transition-transform" /></>
                         )}
                      </button>
                      
                      <button 
                        onClick={handleBookmark}
                        disabled={actionLoading.bookmark}
                        className={cn(
                          "w-full h-16 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 italic border",
                          status.isBookmarked 
                            ? "bg-primary/5 border-primary/20 text-primary" 
                            : "bg-transparent border-slate-200 dark:border-white/10 text-muted-foreground hover:bg-slate-50 dark:hover:bg-white/5"
                        )}
                      >
                         {actionLoading.bookmark ? (
                           <Loader2 className="size-4 animate-spin" />
                         ) : (
                           <><Bookmark className={cn("size-4", status.isBookmarked && "fill-current")} /> {status.isBookmarked ? "Saved in Interest Vault" : "Save for reference"}</>
                         )}
                      </button>
                   </div>
                </div>

                {/* Organizer Intel */}
                <div className="pt-10 space-y-8 relative z-10 border-t border-slate-100 dark:border-white/5 mt-4">
                   <div className="flex items-center gap-4 group/org">
                      <div className="size-16 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-primary italic font-black text-2xl overflow-hidden relative shadow-inner group-hover/org:scale-105 transition-transform">
                         {event.organizer?.image ? (
                           <img src={event.organizer.image} className="w-full h-full object-cover" />
                         ) : (
                           event.organizer?.name?.[0] || 'O'
                         )}
                         <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-black uppercase text-primary tracking-widest">Hosted By</p>
                         <h5 className="text-2xl font-black tracking-tighter italic line-clamp-1 group-hover/org:text-primary transition-colors">{event.organizer?.name || 'Academic Lab'}</h5>
                         <div className="flex items-center gap-1.5 opacity-60">
                            <ShieldCheck className="size-3 text-emerald-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest italic">Verified Mentor</span>
                         </div>
                      </div>
                   </div>
                   
                   <a 
                     href={`mailto:${event.organizer?.email}?subject=Inquiry about ${event.title}`}
                     className="w-full h-14 bg-muted hover:bg-primary hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/contact"
                   >
                      <PhoneCall className="size-4 group-hover/contact:rotate-12 transition-transform" /> Contact Organizer
                   </a>
                </div>
             </div>
          </div>

       </div>
    </div>
  );
}
