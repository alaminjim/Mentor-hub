"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, MapPin, Search, ArrowRight, Filter, 
  Users, Bookmark, Share2, Sparkles, Globe, GraduationCap
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/dashboard/events/public").then(r => r.json());
      if (res.success) setEvents(res.data);
    } catch (err) {
      console.error("Events sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filtered = events.filter(ev => {
    const matchesSearch = ev.title.toLowerCase().includes(search.toLowerCase()) || 
                          ev.location.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    return matchesSearch && ev.status.toLowerCase() === filter.toLowerCase();
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="size-16 rounded-[2rem] bg-primary/10 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 animate-pulse" />
        <Calendar className="size-8 text-primary animate-bounce" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Syncing Calendar...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* ── Hero Header ─────────────────────────────────────────────── */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex items-center justify-center gap-2"
           >
              <div className="h-px w-8 bg-primary/30" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Academic Gatherings</span>
              <div className="h-px w-8 bg-primary/30" />
           </motion.div>
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-5xl md:text-7xl font-black tracking-tighter italic leading-none"
           >
             Platform <span className="text-primary underline decoration-primary/10">Events.</span>
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed"
           >
             Connect with global mentors through immersive workshops, expert webinars, and academic roundtables.
           </motion.p>
        </div>

        {/* ── Filters & Search ────────────────────────────────────────── */}
        <div className="sticky top-24 z-30 bg-background/80 backdrop-blur-xl p-4 rounded-[2.5rem] border border-border shadow-2xl shadow-black/5 flex flex-col md:flex-row items-center gap-4">
           <div className="relative w-full md:flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Search events, locations, or organizers..."
                 className="w-full h-14 pl-14 pr-6 rounded-[1.8rem] bg-muted/50 border border-transparent focus:border-primary/20 focus:bg-background transition-all outline-none text-sm font-bold"
              />
           </div>
           <div className="flex items-center gap-2 p-1.5 bg-muted/50 rounded-[1.8rem] border border-transparent">
              {["all", "upcoming", "ongoing"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                    filter === f ? "bg-white text-primary shadow-xl" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f}
                </button>
              ))}
           </div>
        </div>

        {/* ── Events Grid ─────────────────────────────────────────────── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((ev, i) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group bg-card border border-border rounded-[3rem] p-10 space-y-8 relative overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-primary/5 transition-all hover:-translate-y-2"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Globe className="size-32" />
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-widest text-primary">
                         {ev.status}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground">
                         <Users className="size-3.5" /> {ev.capacity} left
                      </div>
                   </div>
                   <Link href={`/events/${ev.id}`}>
                     <h3 className="text-3xl font-black tracking-tighter italic leading-tight group-hover:text-primary transition-colors line-clamp-2">
                       {ev.title}
                     </h3>
                   </Link>
                </div>

                <div className="space-y-4 flex-1">
                   <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border">
                      <div className="size-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                         <Calendar className="size-5" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase text-muted-foreground">Date & Time</p>
                         <p className="text-xs font-bold">{new Date(ev.date).toLocaleString('en-US', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border">
                      <div className="size-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                         <MapPin className="size-5" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase text-muted-foreground">Location</p>
                         <p className="text-xs font-bold line-clamp-1">{ev.location}</p>
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t border-border flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-[10px] uppercase">
                         {ev.organizer?.name?.[0] || 'O'}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">By {ev.organizer?.name || 'Organizer'}</span>
                   </div>
                   <Link href={`/events/${ev.id}`} className="p-3 rounded-2xl bg-muted hover:bg-primary hover:text-white transition-all">
                      <ArrowRight className="size-4" />
                   </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center space-y-8 px-4">
             <div className="size-24 bg-muted rounded-[2.5rem] flex items-center justify-center mx-auto opacity-20 border border-border transform rotate-12">
                <Calendar className="size-10" />
             </div>
             <div className="max-w-sm mx-auto space-y-2">
                <h2 className="text-3xl font-black lowercase tracking-tighter italic">quiet calendar.</h2>
                <p className="text-muted-foreground text-sm font-medium lowercase">No upcoming academic sessions matched your filters at the moment.</p>
             </div>
             <button 
               onClick={() => { setSearch(""); setFilter("all"); }}
               className="h-14 px-10 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-95"
             >
                Reset Exploration
             </button>
          </div>
        )}

      </div>
    </div>
  );
}
