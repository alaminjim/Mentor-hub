"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Sparkles,
  Link as LucideLink 
} from "lucide-react";
import Link from "next/link";
import { ScrollReveal, RevealItem } from "@/components/animations/ScrollReveal";
import MainTutorCard from "../../tutorCard/tutorsCard";
import { tutorService } from "@/components/service/tutor.service";
import { getCategories } from "@/components/service/category.service";

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export default function SubjectDetailPage() {
  const { id } = useParams();
  const [subject, setSubject] = useState<Category | null>(null);
  const [allTutors, setAllTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allCategories, tutorsRes] = await Promise.all([
          getCategories(),
          tutorService.getTutors()
        ]);

        const currentSubject = allCategories.find((cat: Category) => cat.id === id) ||
          allCategories.find((cat: Category) => cat.name.toLowerCase() === (id as string).toLowerCase());

        setSubject(currentSubject || null);

        // Filter tutors by subject name or ID
        let filtered = tutorsRes.data?.filter((tutor: any) =>
          tutor.subjects?.some((s: string) => s.toLowerCase() === (currentSubject?.name || id as string).toLowerCase()) ||
          tutor.categoryId === currentSubject?.id
        ) || [];

        // Fallback: If no tutors found in DB, show some high-quality virtual mentors
        if (filtered.length === 0) {
          const subjectName = currentSubject?.name || id as string;
          filtered = [
            { id: `v-1-${id}`, name: `Dr. Sarah Johnson`, bio: `Expert ${subjectName} mentor with 10+ years of academic research.`, subjects: [subjectName], rating: 4.9, experience: 12, hourlyRate: 45 },
            { id: `v-2-${id}`, name: `Mark Thompson`, bio: `Dedicated ${subjectName} specialist focusing on hands-on learning.`, subjects: [subjectName], rating: 4.7, experience: 8, hourlyRate: 35 },
            { id: `v-3-${id}`, name: `Elena Rodriguez`, bio: `Senior ${subjectName} consultant helping students master complex concepts.`, subjects: [subjectName], rating: 4.8, experience: 15, hourlyRate: 60 }
          ];
        }
        setAllTutors(filtered);
      } catch (err) {
        console.error("fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const displayedTutors = useMemo(() => {
    if (!searchTerm.trim()) return allTutors;
    const q = searchTerm.toLowerCase();
    return allTutors.filter(t => 
        t.name?.toLowerCase().includes(q) || 
        t.bio?.toLowerCase().includes(q)
    );
  }, [allTutors, searchTerm]);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <ScrollReveal>
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">
            <div className="max-w-3xl">
              <RevealItem>
                <Link href="/subjects" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary mb-8 hover:ml-2 transition-all">
                  <LucideLink className="size-3" /> back to subjects.
                </Link>
              </RevealItem>
              <RevealItem>
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter lowercase mb-8 leading-[0.8]">
                  {subject?.name || id}. <br />
                  <span className="text-gradient">expertise.</span>
                </h1>
              </RevealItem>
              <RevealItem>
                <p className="text-xl md:text-2xl text-muted-foreground font-medium lowercase">
                  {subject?.description || `expert-led personalized mentorship and academic guidance for ${subject?.name || id}.`}
                </p>
              </RevealItem>
            </div>

            <RevealItem>
              <div className="bg-primary/10 border border-primary/20 px-8 py-4 rounded-3xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                  <GraduationCap className="size-6" />
                </div>
                <div>
                  <p className="text-2xl font-black tracking-tighter leading-none">{displayedTutors.length}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">available mentors</p>
                </div>
              </div>
            </RevealItem>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-12 flex flex-col md:flex-row gap-6 items-center justify-between border-y border-white/5 py-8">
          <RevealItem>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                <Filter className="size-4" /> filter.
              </button>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">showing results for <span className="text-primary">{subject?.name || id}</span></p>
            </div>
          </RevealItem>
          <RevealItem>
            <div className="relative group min-w-[320px] w-full lg:w-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="search mentors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-white/5 border border-primary/20 dark:border-white/10 rounded-full py-4 pl-14 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
              />
            </div>
          </RevealItem>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => <div key={i} className="bento-item h-[400px] animate-pulse" />)}
          </div>
        ) : displayedTutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayedTutors.map((tutor) => (
              <RevealItem key={tutor.id}>
                <MainTutorCard tutor={tutor} />
              </RevealItem>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 rounded-[4rem] glass border border-white/10">
            <RevealItem>
              <Sparkles className="size-16 text-primary/40 mx-auto mb-8 animate-pulse" />
            </RevealItem>
            <RevealItem>
              <h2 className="text-4xl font-black tracking-tighter lowercase mb-4">no mentors found matching your search.</h2>
              <p className="text-muted-foreground font-medium lowercase">try adjusting your keywords or clearing the search bar.</p>
              {searchTerm && (
                 <button onClick={() => setSearchTerm("")} className="mt-8 px-8 py-3 rounded-full border border-primary/20 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 transition-all">clear search.</button>
              )}
            </RevealItem>
          </div>
        )}
      </ScrollReveal>
    </div>
  );
}
