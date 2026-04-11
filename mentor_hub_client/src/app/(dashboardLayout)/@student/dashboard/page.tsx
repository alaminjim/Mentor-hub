"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Calendar, 
  Star, 
  Zap, 
  ArrowUpRight, 
  Sparkles,
  Search,
  BookOpen
} from "lucide-react";
import { 
  getStudentStats, 
  StudentStats 
} from "@/components/service/student.service";
import { getSession } from "@/components/service/auth.service";

export default function StudentDashboard() {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, sessionRes] = await Promise.all([
          getStudentStats(),
          getSession()
        ]);
        setStats(statsRes);
        setUser(sessionRes?.data);
      } catch (error) {
        console.error("Dashboard load failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bento-item h-32 animate-pulse bg-white/5 border-white/5" />
        ))}
      </div>
    );
  }

  const statCards = [
    { label: "total tutors", value: stats?.totalTutors || 0, icon: <Users className="size-5 text-blue-400" />, trend: "+12%" },
    { label: "total students", value: stats?.totalStudents || 0, icon: <Sparkles className="size-5 text-primary" />, trend: "+5%" },
    { label: "total sessions", value: stats?.totalSessions || 0, icon: <Calendar className="size-5 text-emerald-400" />, trend: "8 new" },
    { label: "avg. rating", value: stats?.averageRating.toFixed(1) || 0, icon: <Star className="size-5 text-amber-400" />, trend: "top tier" },
  ];

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter lowercase leading-tight mb-4">
             welcome back, <br />
             <span className="text-gradient">{user?.name || "scholar"}.</span>
           </h1>
           <p className="text-xl text-muted-foreground font-medium lowercase">
             your learning journey is accelerating. here is your current perspective.
           </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden md:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">current plan.</p>
              <p className="text-sm font-bold text-white uppercase tracking-tighter">premium student.</p>
           </div>
           <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Zap className="size-8 text-primary shadow-glow" />
           </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bento-item group hover:border-primary/30 transition-all duration-500 overflow-hidden">
            <div className="flex items-start justify-between mb-8">
               <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                  {stat.icon}
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{stat.trend}</span>
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{stat.label}.</p>
               <p className="text-4xl font-black tracking-tighter text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bento-item p-0 overflow-hidden min-h-[400px]">
           <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tighter lowercase">upcoming sessions.</h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:translate-x-1 transition-transform">view all →</button>
           </div>
           <div className="p-12 text-center space-y-6">
              <div className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto opacity-40">
                 <BookOpen className="size-8" />
              </div>
              <div>
                <p className="text-lg font-bold text-white lowercase">no sessions scheduled yet.</p>
                <p className="text-sm text-muted-foreground lowercase">find a mentor to start your learning journey.</p>
              </div>
              <button className="btn-premium px-8 py-3 uppercase font-black tracking-widest text-[10px]">
                browse mentors.
              </button>
           </div>
        </div>

        <div className="bento-item group overflow-hidden bg-gradient-to-br from-primary/5 to-transparent">
           <h3 className="text-xl font-black tracking-tighter lowercase mb-8">learning roadmap.</h3>
           <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4 group/item cursor-pointer">
                   <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:border-primary transition-colors">
                      <p className="text-xs font-black text-muted-foreground group-hover/item:text-primary">0{i}.</p>
                   </div>
                   <div className="flex-1">
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-primary" style={{ width: `${100 - (i * 20)}%` }} />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mt-2">module {i}. complete.</p>
                   </div>
                </div>
              ))}
           </div>
           <div className="mt-12 pt-8 border-t border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">recommended for you.</p>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all">
                 <div className="flex items-center gap-3">
                    <Search className="size-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-tighter truncate">advanced algorithms.</span>
                 </div>
                 <ArrowUpRight className="size-4" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
