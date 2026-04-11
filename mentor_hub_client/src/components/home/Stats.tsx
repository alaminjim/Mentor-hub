"use client";

import { Users, GraduationCap, Star, Award, Loader2 } from "lucide-react";
import { ScrollReveal, RevealItem } from "../animations/ScrollReveal";
import { useEffect, useState } from "react";

export default function Stats() {
  const [data, setData] = useState({
    students: "50,000+",
    tutors: "5,000+",
    successRate: "99%",
    awards: "24+"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/stats`);
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statsList = [
    { label: "active students", value: data.students, icon: <Users className="size-6 text-primary" />, border: "border-primary/20", bg: "bg-primary/5" },
    { label: "expert tutors", value: data.tutors, icon: <GraduationCap className="size-6 text-emerald-500" />, border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
    { label: "success rate", value: data.successRate, icon: <Star className="size-6 text-amber-500" />, border: "border-amber-500/20", bg: "bg-amber-500/5" },
    { label: "awards won", value: data.awards, icon: <Award className="size-6 text-rose-500" />, border: "border-rose-500/20", bg: "bg-rose-500/5" },
  ];

  return (
    <section className="py-20 bg-slate-50/50">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
      <ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {statsList.map((stat, i) => (
            <RevealItem key={i}>
              <div className={`flex flex-col items-center text-center p-6 md:p-8 rounded-3xl border bg-white shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-all duration-300 group ${stat.border}`}>
                  <div className={`w-16 h-16 rounded-2xl ${stat.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  {loading ? (
                    <Loader2 className="size-8 text-slate-300 animate-spin my-3" />
                  ) : (
                    <div className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-slate-800 mb-2">
                        {stat.value}
                    </div>
                  )}
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            </RevealItem>
          ))}
        </div>
      </ScrollReveal>
      </div>
    </section>
  );
}
