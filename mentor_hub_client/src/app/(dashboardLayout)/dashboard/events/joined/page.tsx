"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, MapPin, Search, ArrowRight, Filter, 
  Users, Bookmark, Share2, Sparkles, Globe, 
  GraduationCap, Clock, CheckCircle, ChevronLeft,
  Mail, Link as LinkIcon, ShieldCheck, Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function JoinedEventsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/dashboard/events/joined").then(r => r.json());
      if (res.success) setData(res.data);
    } catch (err) {
      console.error("Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <Loader size="lg" />
    </div>
  );

  return (
    <div className="space-y-10 group">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
             <div className="flex items-center gap-2">
                <div className="h-px w-8 bg-primary/30" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Confidential Engagement</span>
             </div>
             <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic lowercase">Joined <span className="text-primary italic">Events.</span></h1>
             <p className="text-muted-foreground text-sm font-medium lowercase">Academic sessions you have pledged to participate in.</p>
          </div>
       </div>

       {data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
             {data.map((item, i) => {
                const ev = item.event;
                return (
                   <motion.div
                      key={ev.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group/card bg-card border border-border rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-primary/5 transition-all"
                   >
                      <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover/card:opacity-10 transition-opacity">
                         <Zap className="size-24" />
                      </div>

                      <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1.5">
                               <CheckCircle className="size-2.5" /> Participation Confirmed
                            </div>
                         </div>
                         <h3 className="text-2xl font-black tracking-tighter italic leading-tight group-hover/card:text-primary transition-colors line-clamp-2">
                           {ev.title}
                         </h3>
                      </div>

                      <div className="space-y-3 flex-1">
                         <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground">
                            <Calendar className="size-3 text-primary" /> {new Date(ev.date).toLocaleDateString()}
                         </div>
                         <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground">
                            <MapPin className="size-3 text-primary" /> {ev.location}
                         </div>
                      </div>

                      <div className="pt-6 border-t border-border flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-black uppercase text-primary">
                               {ev.organizer?.name?.[0]}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-60">By {ev.organizer?.name}</span>
                         </div>
                         <Link href={`/events/${ev.id}`} className="p-3 rounded-2xl bg-muted hover:bg-primary hover:text-white transition-all transform group-hover/card:scale-110">
                            <ArrowRight className="size-4" />
                         </Link>
                      </div>
                   </motion.div>
                );
             })}
          </div>
       ) : (
          <div className="py-24 text-center space-y-6">
             <div className="size-20 bg-muted rounded-[2rem] flex items-center justify-center mx-auto opacity-10 border border-border">
                <Globe className="size-10" />
             </div>
             <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tighter italic">Silent Agenda.</h3>
                <p className="text-muted-foreground text-xs font-medium lowercase">You have not joined any academic gatherings yet.</p>
             </div>
             <Link href="/events" className="inline-flex h-12 px-8 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest items-center">Explore Calendar</Link>
          </div>
       )}
    </div>
  );
}

function Loader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
   return (
      <div className={cn(
         "rounded-full border-2 border-primary/20 border-t-primary animate-spin",
         size === "sm" ? "size-4" : size === "md" ? "size-8" : "size-12"
      )} />
   );
}
