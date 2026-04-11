"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Sparkles,
  SearchCheck,
  Zap,
  LayoutGrid,
  List
} from "lucide-react";
import { ScrollReveal, RevealItem } from "@/components/animations/ScrollReveal";
import { tutorService } from "@/components/service/tutor.service";
import TutorCard from "../tutorCard/tutorsCard";

export default function BrowsePage() {
  const [allTutors, setAllTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const { data } = await tutorService.getTutors();
        let tutorsData = data || [];
        
        // Fallback if no mentors in DB
        if (tutorsData.length === 0) {
            tutorsData = [
                { id: "v1", name: "Dr. Sarah Johnson", bio: "Expert mathematics mentor with 10+ years of academic research.", subjects: ["Mathematics", "Physics"], rating: 4.9, experience: 12, hourlyRate: 45 },
                { id: "v2", name: "Mark Thompson", bio: "Dedicated coding specialist focusing on hands-on learning.", subjects: ["Coding", "JavaScript", "React"], rating: 4.7, experience: 8, hourlyRate: 35 },
                { id: "v3", name: "Elena Rodriguez", bio: "Senior languages consultant helping students master Spanish.", subjects: ["Spanish", "Languages"], rating: 4.8, experience: 15, hourlyRate: 60 },
                { id: "v4", name: "David Chen", bio: "Tech lead and full-stack architecture mentor.", subjects: ["Coding", "System Design"], rating: 4.9, experience: 10, hourlyRate: 55 },
                { id: "v5", name: "Sophie Brown", bio: "Professional music theory and piano instructor.", subjects: ["Music", "Piano"], rating: 4.6, experience: 7, hourlyRate: 40 },
                { id: "v6", name: "Michael Ross", bio: "Humanities and social sciences professor.", subjects: ["Humanities", "Philosophy"], rating: 4.9, experience: 20, hourlyRate: 70 },
            ];
        }
        setAllTutors(tutorsData);
      } catch (error) {
        console.error("Failed to fetch tutors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  const displayedTutors = useMemo(() => {
    if (!searchTerm.trim()) return allTutors;
    const q = searchTerm.toLowerCase();
    return allTutors.filter(t => 
        t.name?.toLowerCase().includes(q) || 
        t.subjects?.some((s: string) => s.toLowerCase().includes(q)) ||
        t.bio?.toLowerCase().includes(q)
    );
  }, [allTutors, searchTerm]);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <ScrollReveal>
        <div className="max-w-4xl mb-16">
          <RevealItem>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 lowercase leading-tight">
              match. <br />
              <span className="text-gradient">mentors.</span>
            </h1>
          </RevealItem>
          <RevealItem>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium lowercase max-w-2xl">
              browse through our global network of elite mentors and find the perfect partner for your growth journey.
            </p>
          </RevealItem>
        </div>

        {/* Filters & Tools */}
        <div className="mb-12 flex flex-col lg:flex-row gap-6 items-center justify-between border-y border-white/5 py-8">
           <RevealItem>
             <div className="flex items-center gap-4 flex-wrap">
                <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest hover:border-primary/50 transition-all">
                  <Filter className="size-4" /> filter by rating
                </button>
                <div className="h-8 w-px bg-white/10 hidden md:block" />
                <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
                   <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-full transition-all ${viewMode === "grid" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}
                   >
                     <LayoutGrid className="size-4" />
                   </button>
                   <button 
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-full transition-all ${viewMode === "list" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}
                   >
                     <List className="size-4" />
                   </button>
                </div>
             </div>
           </RevealItem>
           
           <RevealItem>
              <div className="relative group min-w-[320px] w-full lg:w-auto">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="search mentors..." 
                  className="w-full bg-white dark:bg-white/5 border border-primary/20 dark:border-white/10 rounded-full py-4 pl-14 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                />
              </div>
           </RevealItem>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bento-item h-[450px] animate-pulse bg-white/5 border-white/5" />
            ))}
          </div>
        ) : displayedTutors.length > 0 ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            : "flex flex-col gap-6"
          }>
            {displayedTutors.map((tutor) => (
              <RevealItem key={tutor.id}>
                 <TutorCard tutor={tutor} />
              </RevealItem>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 rounded-[4rem] glass border border-white/10">
             <RevealItem>
               <SearchCheck className="size-16 text-primary/40 mx-auto mb-8" />
             </RevealItem>
             <RevealItem>
               <h2 className="text-4xl font-black tracking-tighter lowercase mb-4">no mentors found matching your criteria.</h2>
               <p className="text-muted-foreground font-medium lowercase">try adjusting your filters or search terms.</p>
               {searchTerm && (
                 <button onClick={() => setSearchTerm("")} className="mt-8 px-8 py-3 rounded-full border border-primary/20 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 transition-all">clear search.</button>
               )}
             </RevealItem>
          </div>
        )}

        {/* CTA */}
        <div className="mt-32 p-12 md:p-24 rounded-[4rem] bg-gradient-to-br from-primary/10 to-cyan-500/10 border border-primary/20 relative overflow-hidden text-center">
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
           <RevealItem>
             <Sparkles className="size-12 text-primary mx-auto mb-8" />
           </RevealItem>
           <RevealItem>
             <h2 className="text-4xl md:text-6xl font-black tracking-tighter lowercase mb-8">
               don't see what you're <br /> <span className="text-gradient">looking for?</span>
             </h2>
           </RevealItem>
           <RevealItem>
              <button className="btn-premium px-12 py-5 uppercase font-black tracking-widest">
                tell us your needs.
              </button>
           </RevealItem>
        </div>
      </ScrollReveal>
    </div>
  );
}
