"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, MapPin, Search, ArrowRight, Filter, 
  Users, Bookmark, Share2, Sparkles, Globe, GraduationCap,
  ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchEvents = async (currentPage: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/events/public?page=${currentPage}&limit=9`).then(r => r.json());
      if (res.success) {
        setEvents(res.data);
        setTotalPages(res.totalPages);
        setTotal(res.total);
      }
    } catch (err) {
      console.error("Events sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  const filtered = events.filter(ev => {
    const matchesSearch = ev.title.toLowerCase().includes(search.toLowerCase()) || 
                          ev.location.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    return matchesSearch && ev.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-background pt-32 pb-32 px-6">
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
             className="text-5xl md:text-8xl font-black tracking-tighter italic leading-[0.85] uppercase"
           >
             Calendar <span className="text-primary">Events.</span>
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed lowercase"
           >
             connect with global mentors through immersive workshops, expert webinars, and academic roundtables across bangladesh.
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
        <AnimatePresence mode="wait">
          {loading ? (
             <motion.div 
               key="loader"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="py-40 flex flex-col items-center gap-4"
             >
                <div className="size-16 rounded-[2rem] bg-primary/10 flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                   <Calendar className="size-8 text-primary animate-bounce" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Syncing Calendar...</p>
             </motion.div>
          ) : filtered.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-16"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((ev, i) => (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="group bg-card border border-border rounded-[3rem] p-10 space-y-10 relative overflow-hidden flex flex-col hover:shadow-3xl hover:shadow-primary/5 transition-all hover:-translate-y-2"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                       <Globe className="size-32" />
                    </div>

                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                          <div className="px-5 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-widest text-primary italic">
                             {ev.status} SESSION
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                             <Users className="size-4" /> {ev.capacity} slots left
                          </div>
                       </div>
                       <Link href={`/events/${ev.id}`}>
                         <h3 className="text-3xl font-black tracking-tighter italic leading-none group-hover:text-primary transition-colors line-clamp-2 uppercase">
                           {ev.title}
                         </h3>
                       </Link>
                    </div>

                    <div className="space-y-4 flex-1">
                       <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-muted/40 border border-border group-hover:bg-primary/5 transition-colors">
                          <div className="size-12 rounded-2xl bg-white dark:bg-slate-800 border border-border flex items-center justify-center text-primary shadow-sm">
                             <Calendar className="size-6" />
                          </div>
                          <div>
                             <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Scheduled For</p>
                             <p className="text-[13px] font-black tracking-tight">{new Date(ev.date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-muted/40 border border-border group-hover:bg-primary/5 transition-colors">
                          <div className="size-12 rounded-2xl bg-white dark:bg-slate-800 border border-border flex items-center justify-center text-primary shadow-sm">
                             <MapPin className="size-6" />
                          </div>
                          <div>
                             <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Location Intel</p>
                             <p className="text-[13px] font-black tracking-tight line-clamp-1 italic">{ev.location}</p>
                          </div>
                       </div>
                    </div>

                    <div className="pt-10 border-t border-border flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="size-10 rounded-2xl bg-primary shadow-lg shadow-primary/20 flex items-center justify-center text-white font-black text-xs">
                             {ev.organizer?.name?.[0] || 'O'}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[9px] font-black uppercase tracking-wider text-primary">Curated By</span>
                             <span className="text-[11px] font-black uppercase tracking-widest line-clamp-1">{ev.organizer?.name || 'Academic Lab'}</span>
                          </div>
                       </div>
                       <Link href={`/events/${ev.id}`} className="size-14 rounded-[1.5rem] bg-muted hover:bg-primary hover:text-white transition-all flex items-center justify-center group/btn shadow-inner">
                          <ArrowRight className="size-5 group-hover/btn:translate-x-1 transition-transform" />
                       </Link>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ── Pagination UI ─────────────────────────────────────── */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-8 pt-10">
                   <button 
                     disabled={page === 1}
                     onClick={() => setPage(p => Math.max(1, p - 1))}
                     className="h-16 px-10 rounded-3xl bg-card border border-border flex items-center gap-3 text-[11px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 group"
                   >
                     <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" /> Prev <span className="hidden sm:inline">Discovery</span>
                   </button>
                   
                   <div className="flex items-center gap-3">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i + 1)}
                          className={cn(
                            "size-12 rounded-2xl text-sm font-black transition-all active:scale-90",
                            page === i + 1 
                              ? "bg-primary text-white shadow-xl shadow-primary/20 scale-110" 
                              : "bg-card border border-border text-muted-foreground hover:border-primary hover:text-primary"
                          )}
                        >
                          {i + 1}
                        </button>
                      ))}
                   </div>

                   <button 
                     disabled={page === totalPages}
                     onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                     className="h-16 px-10 rounded-3xl bg-card border border-border flex items-center gap-3 text-[11px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 group"
                   >
                     <span className="hidden sm:inline">Next</span> Batch <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              )}

              <div className="text-center pt-8">
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40 italic">
                   Showing {filtered.length} of {total} scheduled gatherings across the grid.
                 </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-40 text-center space-y-8 px-4"
            >
               <div className="size-24 bg-muted rounded-[2.5rem] flex items-center justify-center mx-auto opacity-20 border border-border transform rotate-12">
                  <Globe className="size-10" />
               </div>
               <div className="max-w-sm mx-auto space-y-2">
                  <h2 className="text-3xl font-black lowercase tracking-tighter italic">empty grid.</h2>
                  <p className="text-muted-foreground text-sm font-medium lowercase">No upcoming academic sessions matched your filters at the moment.</p>
               </div>
               <button 
                 onClick={() => { setSearch(""); setFilter("all"); setPage(1); }}
                 className="h-14 px-10 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-95"
               >
                  Reset Exploration
               </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
