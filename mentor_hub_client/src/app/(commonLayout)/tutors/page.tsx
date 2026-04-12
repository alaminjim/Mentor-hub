"use client";

import { useEffect, useMemo, useState } from "react";
import { 
  Search, Filter, Sparkles, SearchCheck, Zap, 
  LayoutGrid, List, SlidersHorizontal, Star, 
  DollarSign, ChevronLeft, ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TutorCard } from "../tutorCard/tutorsCard";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://mentor-hub-server.vercel.app";

function TutorSkeleton() {
  return (
    <div className="rounded-[4rem] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 space-y-8 h-[520px] animate-pulse">
      <div className="size-24 rounded-full bg-slate-200 dark:bg-slate-800 mx-auto" />
      <div className="space-y-4">
        <div className="h-8 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-xl mx-auto" />
        <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-xl mx-auto" />
      </div>
      <div className="space-y-4 pt-6">
        <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-16 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      </div>
    </div>
  );
}

export default function TutorsPage({ isFeatured = false }: { isFeatured?: boolean }) {
  const [allTutors, setAllTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price_asc" | "price_desc" | "rating">("default");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minRating, setMinRating] = useState(0);

  const [bookmarkedSet, setBookmarkedSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const tutorsRes = await fetch(`${BACKEND_URL}/api/tutor`, { cache: "no-store" });
        if (!tutorsRes.ok) throw new Error("Could not fetch tutors");
        const json = await tutorsRes.json();
        
        if (!cancelled) {
          setAllTutors(json?.data || []);
        }

        import("@/components/service/bookmark.service").then(({ bookmarkService }) => {
          bookmarkService.getMyBookmarks().then(res => {
             if (res.success && !cancelled) setBookmarkedSet(new Set(res.data));
          });
        });

      } catch (err) {
        if (!cancelled) setError("Database connection error. Please try again later.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, []);

  // Filtered Results
  const filteredTutors = useMemo(() => {
    let result = allTutors;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.name?.toLowerCase().includes(q) || 
        t.subjects?.some((s: string) => s.toLowerCase().includes(q)) ||
        t.bio?.toLowerCase().includes(q)
      );
    }

    result = result.filter(t => (t.hourlyRate || t.price || 0) <= maxPrice);
    result = result.filter(t => (t.rating || 0) >= minRating);

    if (isFeatured) {
       result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
    } else if (sortBy === "price_asc") {
       result = [...result].sort((a, b) => (a.hourlyRate || a.price || 0) - (b.hourlyRate || b.price || 0));
    } else if (sortBy === "price_desc") {
       result = [...result].sort((a, b) => (b.hourlyRate || b.price || 0) - (a.hourlyRate || a.price || 0));
    } else if (sortBy === "rating") {
       result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [allTutors, searchTerm, sortBy, maxPrice, minRating, isFeatured]);

  // Paginated Slicing
  const displayedTutors = useMemo(() => {
    if (isFeatured) return filteredTutors;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTutors.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTutors, currentPage, itemsPerPage, isFeatured]);

  const totalPages = Math.ceil(filteredTutors.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <div className={cn("min-h-screen pb-24 px-4 md:px-12 lg:px-24", isFeatured ? "bg-transparent p-0 pb-10" : "bg-slate-50 dark:bg-slate-950")}>
      {/* Header */}
      {!isFeatured && (
        <div className="max-w-7xl mx-auto mb-16 pt-32 text-center">
            <div className="inline-flex items-center gap-2 mb-8 p-2 rounded-full bg-white/50 dark:bg-white/5 border border-white dark:border-white/10 shadow-sm">
                <div className="px-4 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest">
                  {filteredTutors.length} mentors
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3">
                  Discover Expertise
                </div>
            </div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-slate-900 dark:text-white mb-8">
              Grow <span className="text-primary italic">Better.</span>
            </h1>
            
            <div className="relative group max-w-2xl mx-auto">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 size-6 text-slate-300 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                placeholder="Search mentors by name, subject, or bio..."
                className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-full py-7 pl-20 pr-10 text-lg font-bold focus:outline-none focus:ring-8 focus:ring-primary/5 transition-all shadow-2xl"
              />
            </div>
        </div>
      )}

      {/* Filter Bar */}
      {!isFeatured && (
        <div className="max-w-7xl mx-auto mb-16 p-8 rounded-[4rem] bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white dark:border-white/10 shadow-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-end">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <SlidersHorizontal className="size-3" /> filter by rating
            </label>
            <div className="flex gap-2">
              {[0, 4, 5].map((r) => (
                <button
                  key={r} onClick={() => {setMinRating(r); setCurrentPage(1);}}
                  className={cn(
                    "flex-1 h-14 rounded-2xl flex items-center justify-center transition-all border font-black text-xs",
                    minRating === r ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-white/5 text-slate-400"
                  )}
                >
                  {r === 0 ? "ALL" : `${r}+ Stars`}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <DollarSign className="size-3" /> max budget: ${maxPrice}
            </label>
            <input 
              type="range" min="0" max="1000" step="50" value={maxPrice}
              onChange={(e) => {setMaxPrice(Number(e.target.value)); setCurrentPage(1);}}
              className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Zap className="size-3" /> sort order
            </label>
            <select 
              value={sortBy}
              onChange={(e: any) => {setSortBy(e.target.value); setCurrentPage(1);}}
              className="w-full h-14 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-2xl px-6 text-xs font-black uppercase outline-none focus:ring-4 focus:ring-primary/10"
            >
              <option value="default">Default</option>
              <option value="rating">Top Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-white/5 h-14">
             <button onClick={() => setViewMode("grid")} className={cn("flex-1 rounded-xl flex items-center justify-center transition-all", viewMode === "grid" ? "bg-white dark:bg-slate-700 text-primary shadow-md" : "text-slate-400")}>
                <LayoutGrid className="size-5" />
             </button>
             <button onClick={() => setViewMode("list")} className={cn("flex-1 rounded-xl flex items-center justify-center transition-all", viewMode === "list" ? "bg-white dark:bg-slate-700 text-primary shadow-md" : "text-slate-400")}>
                <List className="size-5" />
             </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="max-w-[1400px] mx-auto">
        {loading ? (
          <div className={cn("grid gap-8", isFeatured ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4")}>
            {Array.from({ length: isFeatured ? 3 : 8 }).map((_, i) => <TutorSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[5rem] shadow-2xl border border-slate-100 dark:border-white/5">
            <Zap className="size-20 text-rose-500 mx-auto mb-8 animate-bounce" />
            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">{error}</h2>
            <button onClick={() => window.location.reload()} className="px-12 py-5 bg-primary text-white rounded-full font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/30">retry connection</button>
          </div>
        ) : displayedTutors.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[5rem] shadow-2xl border border-slate-100 dark:border-white/5">
            <SearchCheck className="size-24 text-slate-200 mx-auto mb-8" />
            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">No results found.</h2>
            <p className="text-slate-400 mb-8 font-medium italic">Try adjusting your filters or search terms.</p>
            <button onClick={() => { setSearchTerm(""); setMaxPrice(1000); setMinRating(0); setCurrentPage(1); }} className="text-primary font-black uppercase text-xs tracking-widest hover:underline">Clear all filters</button>
          </div>
        ) : (
          <>
            <div className={cn(
              viewMode === "grid" 
                ? cn("grid gap-8", isFeatured ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4")
                : "flex flex-col gap-10"
            )}>
              {displayedTutors.map((t) => (
                <TutorCard 
                  key={t.id} 
                  tutor={t} 
                  initialBookmarked={bookmarkedSet.has(t.id)} 
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {!isFeatured && totalPages >= 1 && (
                <div className="mt-20 flex items-center justify-center gap-4">
                    <button 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="size-16 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl"
                    >
                        <ChevronLeft className="size-6" />
                    </button>
                    
                    <div className="flex gap-2 p-2 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl border border-white dark:border-white/5 shadow-inner">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => handlePageChange(i + 1)}
                              className={cn(
                                "size-12 rounded-full font-black text-sm transition-all duration-500",
                                currentPage === i + 1 
                                  ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110" 
                                  : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                              )}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="size-16 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl"
                    >
                        <ChevronRight className="size-6" />
                    </button>
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
