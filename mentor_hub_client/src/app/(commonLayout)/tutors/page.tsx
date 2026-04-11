"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Sparkles,
  SearchCheck,
  Zap,
  LayoutGrid,
  List,
} from "lucide-react";
import TutorCard from "../tutorCard/tutorsCard";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// ── Skeleton card ─────────────────────────────────────────────────────────────
function TutorSkeleton() {
  return (
    <div className="rounded-[2rem] overflow-hidden border border-white/5 bg-white/[0.03] animate-pulse h-[420px]">
      <div className="h-48 bg-white/10" />
      <div className="p-6 space-y-3">
        <div className="h-5 w-2/3 rounded-full bg-white/10" />
        <div className="h-4 w-1/2 rounded-full bg-white/10" />
        <div className="flex gap-2 pt-2">
          <div className="h-7 w-20 rounded-full bg-white/10" />
          <div className="h-7 w-20 rounded-full bg-white/10" />
        </div>
        <div className="h-4 w-full rounded-full bg-white/10 mt-4" />
        <div className="h-10 w-full rounded-full bg-white/10 mt-2" />
      </div>
    </div>
  );
}

export default function TutorsPage() {
  const [allTutors, setAllTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price_asc" | "price_desc" | "rating">("default");

  const [bookmarkedSet, setBookmarkedSet] = useState<Set<string>>(new Set());

  // Fetch ALL tutors ONCE
  useEffect(() => {
    let cancelled = false;

    const fetchTutors = async () => {
      setLoading(true);
      setError(null);
      try {
        const { bookmarkService } = await import("@/components/service/bookmark.service");
        const [tutorsRes, bookmarksRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/tutor`, { cache: "no-store" }),
          bookmarkService.getMyBookmarks()
        ]);
        
        if (!tutorsRes.ok) throw new Error(`Server error: ${tutorsRes.status}`);
        
        const json = await tutorsRes.json();
        if (!cancelled) {
          let data = json?.data ?? json ?? [];
          
          // Fallback if no tutors in DB
          if (!Array.isArray(data) || data.length === 0) {
            data = [
                { id: "v1", name: "Dr. Sarah Johnson", bio: "Expert mathematics mentor with 10+ years of academic research.", subjects: ["Mathematics", "Physics"], rating: 4.9, experience: 12, hourlyRate: 45 },
                { id: "v2", name: "Mark Thompson", bio: "Dedicated coding specialist focusing on hands-on learning.", subjects: ["Coding", "JavaScript", "React"], rating: 4.7, experience: 8, hourlyRate: 35 },
                { id: "v3", name: "Elena Rodriguez", bio: "Senior languages consultant helping students master Spanish.", subjects: ["Spanish", "Languages"], rating: 4.8, experience: 15, hourlyRate: 60 },
                { id: "v4", name: "David Chen", bio: "Tech lead and full-stack architecture mentor.", subjects: ["Coding", "System Design"], rating: 4.9, experience: 10, hourlyRate: 55 },
                { id: "v5", name: "Sophie Brown", bio: "Professional music theory and piano instructor.", subjects: ["Music", "Piano"], rating: 4.6, experience: 7, hourlyRate: 40 },
                { id: "v6", name: "Michael Ross", bio: "Humanities and social sciences professor.", subjects: ["Humanities", "Philosophy"], rating: 4.9, experience: 20, hourlyRate: 70 },
            ];
          }

          setAllTutors(data);
          
          if (bookmarksRes.success && Array.isArray(bookmarksRes.data)) {
              setBookmarkedSet(new Set(bookmarksRes.data));
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error("Tutor fetch error:", err);
          setError("could not connect to tutor database.");
          setLoading(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTutors();
    return () => {
      cancelled = true;
    };
  }, []);

  // Client-side filter + sort — instant, zero network calls
  const displayedTutors = useMemo(() => {
    let tutors = allTutors;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      tutors = tutors.filter(
        (t) =>
          t.name?.toLowerCase().includes(q) ||
          t.subjects?.some((s: string) => s.toLowerCase().includes(q)) ||
          t.bio?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price_asc") {
      tutors = [...tutors].sort((a, b) => (a.hourlyRate ?? 0) - (b.hourlyRate ?? 0));
    } else if (sortBy === "price_desc") {
      tutors = [...tutors].sort((a, b) => (b.hourlyRate ?? 0) - (a.hourlyRate ?? 0));
    } else if (sortBy === "rating") {
      tutors = [...tutors].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    return tutors;
  }, [allTutors, searchTerm, sortBy]);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 lg:px-24">
      {/* Hero */}
      <div className="max-w-4xl mb-16">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 lowercase leading-tight">
          match. <br />
          <span className="text-gradient">mentors.</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium lowercase max-w-2xl">
          browse through our global network of elite mentors and find the
          perfect partner for your growth journey.
        </p>
      </div>

      {/* Filters & Tools */}
      <div className="mb-12 flex flex-col lg:flex-row gap-6 items-center justify-between border-y border-white/5 py-8">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Sort buttons */}
          <button
            onClick={() => setSortBy(sortBy === "rating" ? "default" : "rating")}
            className={`flex items-center gap-2 px-6 py-3 border rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              sortBy === "rating"
                ? "bg-primary border-primary text-white"
                : "bg-white/5 border-white/10 hover:border-primary/50"
            }`}
          >
            <Filter className="size-4" /> top rated
          </button>
          <button
            onClick={() =>
              setSortBy(
                sortBy === "price_asc"
                  ? "price_desc"
                  : sortBy === "price_desc"
                  ? "default"
                  : "price_asc"
              )
            }
            className={`flex items-center gap-2 px-6 py-3 border rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              sortBy === "price_asc" || sortBy === "price_desc"
                ? "bg-primary border-primary text-white"
                : "bg-white/5 border-white/10 hover:border-primary/50"
            }`}
          >
            <Zap className="size-4" />
            {sortBy === "price_desc" ? "price: high → low" : "price: low → high"}
          </button>

          <div className="h-8 w-px bg-white/10 hidden md:block" />

          {/* View mode */}
          <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-full transition-all ${
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-full transition-all ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <List className="size-4" />
            </button>
          </div>
        </div>

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
      </div>

      {/* Result count */}
      {!loading && (
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">
          showing {displayedTutors.length} of {allTutors.length} mentors
        </p>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <TutorSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-32 rounded-[4rem] border border-red-500/20 bg-red-500/5">
          <Zap className="size-16 text-red-500/40 mx-auto mb-8" />
          <h2 className="text-3xl font-black tracking-tighter lowercase mb-4 text-red-400">
            {error}
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="btn-premium px-10 py-4 mt-4"
          >
            retry.
          </button>
        </div>
      ) : displayedTutors.length === 0 ? (
        <div className="text-center py-32 rounded-[4rem] glass border border-white/10">
          <SearchCheck className="size-16 text-primary/40 mx-auto mb-8" />
          <h2 className="text-4xl font-black tracking-tighter lowercase mb-4">
            no mentors found matching your criteria.
          </h2>
          <p className="text-muted-foreground font-medium lowercase">
            try adjusting your filters or search terms.
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-6 px-8 py-3 rounded-full border border-white/20 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              clear search
            </button>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              : "flex flex-col gap-6"
          }
        >
          {displayedTutors.map((tutor) => (
            <TutorCard key={tutor.id || tutor._id} tutor={tutor} initialBookmarked={bookmarkedSet.has(tutor.id || tutor._id)} />
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-32 p-12 md:p-24 rounded-[4rem] bg-gradient-to-br from-primary/10 to-cyan-500/10 border border-primary/20 relative overflow-hidden text-center">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <Sparkles className="size-12 text-primary mx-auto mb-8" />
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter lowercase mb-8">
          don't see what you're <br />{" "}
          <span className="text-gradient">looking for?</span>
        </h2>
        <button className="btn-premium px-12 py-5 uppercase font-black tracking-widest">
          tell us your needs.
        </button>
      </div>
    </div>
  );
}
