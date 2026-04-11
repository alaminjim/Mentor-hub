"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  User,
  Tag,
  Search,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const categories = ["all", "academics", "career", "technology", "productivity"];

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// ── Skeleton card ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-[2.5rem] overflow-hidden border border-white/5 bg-white/[0.03] animate-pulse">
      <div className="h-64 bg-white/10" />
      <div className="p-8 space-y-4">
        <div className="h-3 w-1/2 rounded-full bg-white/10" />
        <div className="h-6 w-3/4 rounded-full bg-white/10" />
        <div className="h-4 w-full rounded-full bg-white/10" />
        <div className="h-4 w-5/6 rounded-full bg-white/10" />
        <div className="pt-4 flex justify-between items-center">
          <div className="h-8 w-28 rounded-full bg-white/10" />
          <div className="h-10 w-10 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

// ── Blog card ─────────────────────────────────────────────────────────────────
function BlogCard({ post }: { post: any }) {
  const [imgSrc, setImgSrc] = useState(post.image || "");
  const fallbackImg = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000";

  return (
    <Link
      href={`/blog/${post.id || post._id}`}
      className="group block glass rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2"
    >
      <div className="relative h-64 overflow-hidden">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={post.title}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgSrc(fallbackImg)}
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
            <Zap className="size-16 text-primary/40" />
          </div>
        )}
        <div className="absolute top-4 right-4 px-4 py-1.5 glass rounded-full text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">
          {post.category}
        </div>
      </div>

      <div className="p-8 space-y-4">
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3" />
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : "—"}
          </span>
          <span className="flex items-center gap-1.5">
            <Tag className="size-3" />
            {post.readTime || "5 min read"}
          </span>
        </div>

        <h3 className="text-2xl font-black tracking-tighter lowercase leading-tight group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        <p className="text-muted-foreground font-medium lowercase line-clamp-2">
          {post.excerpt ||
            (post.content && post.content.substring(0, 120) + "...")}
        </p>

        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="size-4 text-primary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-tight">
              {typeof post.author === "object"
                ? post.author?.name
                : post.author || "anonymous"}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
            <ArrowUpRight className="size-5 text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch ALL blogs ONCE on mount — no extra calls for category/search
  useEffect(() => {
    let cancelled = false;

    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BACKEND_URL}/api/blog`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          let data = json?.data ?? json ?? [];
          
          // Fallback if no blogs in DB or if user wants diverse content
          if (!Array.isArray(data) || data.length === 0) {
            data = [
                { id: "b1", title: "the future of remote mentorship in 2026.", excerpt: "how virtual reality and AI are transforming the way experts and students connect across borders.", category: "technology", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000", author: { name: "Alex Rover" }, createdAt: new Date().toISOString(), readTime: "8 min read" },
                { id: "b2", title: "mastering mathematics: a mental framework.", excerpt: "breaking down complex equations into simple intuitive blocks for faster learning.", category: "academics", image: "https://images.unsplash.com/photo-1509228468518-180dd48227d8?q=80&w=1000", author: { name: "Dr. Sarah" }, createdAt: new Date().toISOString(), readTime: "12 min read" },
                { id: "b3", title: "productivity hacks for the modern student.", excerpt: "how to manage 10+ projects without burning out using the deep work method.", category: "productivity", image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=1000", author: { name: "Mark T" }, createdAt: new Date().toISOString(), readTime: "5 min read" },
                { id: "b4", title: "career paths in the age of automation.", excerpt: "identifying evergreen skills that will remain in demand for the next decade.", category: "career", image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1000", author: { name: "Elena R" }, createdAt: new Date().toISOString(), readTime: "10 min read" },
                { id: "b5", title: "building a software architect mindset.", excerpt: "beyond coding: learning how to design systems that scale to millions of users.", category: "technology", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000", author: { name: "David C" }, createdAt: new Date().toISOString(), readTime: "15 min read" },
                { id: "b6", title: "the psychology of exam preparation.", excerpt: "overcoming anxiety and improving memory retention through scientifically proven techniques.", category: "academics", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000", author: { name: "Michael R" }, createdAt: new Date().toISOString(), readTime: "7 min read" },
                { id: "b7", title: "sustainable architecture for a greener earth.", excerpt: "how modern design is integrating nature to create climate-positive living spaces.", category: "technology", image: "https://images.unsplash.com/photo-1449156001935-cf6601b0114e?q=80&w=1000", author: { name: "Sophia L" }, createdAt: new Date().toISOString(), readTime: "9 min read" },
                { id: "b8", title: "the art of effective communication.", excerpt: "why emotional intelligence is more important than technical skills in leadership.", category: "career", image: "https://images.unsplash.com/photo-1521791136364-798a7bc0d262?q=80&w=1000", author: { name: "James W" }, createdAt: new Date().toISOString(), readTime: "6 min read" },
                { id: "b9", title: "introduction to quantum computing core.", excerpt: "understanding qubits and superposition without needing a physics degree.", category: "technology", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000", author: { name: "Dr. Quantum" }, createdAt: new Date().toISOString(), readTime: "11 min read" },
                { id: "b10", title: "digital minimalism: less screen, more life.", excerpt: "reducing digital noise to reclaim your focus and mental energy in a busy world.", category: "productivity", image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000", author: { name: "Sam N" }, createdAt: new Date().toISOString(), readTime: "7 min read" },
                { id: "b11", title: "mastering data science foundations.", excerpt: "the complete roadmap from statistics to high-performance machine learning models.", category: "technology", image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=1000", author: { name: "Linda K" }, createdAt: new Date().toISOString(), readTime: "14 min read" },
                { id: "b12", title: "physics in everyday life experiences.", excerpt: "why objects fall the way they do and the hidden energy in everything around us.", category: "academics", image: "https://images.unsplash.com/photo-1636466484362-ecaa63646648?q=80&w=1000", author: { name: "Prof. Newton" }, createdAt: new Date().toISOString(), readTime: "9 min read" },
                { id: "b13", title: "navigating the hybrid workplace culture.", excerpt: "tips for staying visible and making an impact when working from anywhere.", category: "career", image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000", author: { name: "Rachel G" }, createdAt: new Date().toISOString(), readTime: "8 min read" },
                { id: "b14", title: "creative writing: finding your voice.", excerpt: "techniques to break writer's block and build compelling stories that resonate.", category: "academics", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1000", author: { name: "Emily B" }, createdAt: new Date().toISOString(), readTime: "10 min read" },
                { id: "b15", title: "the financial freedom handbook series.", excerpt: "smart investing and budget management for students and early professionals.", category: "career", image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1000", author: { name: "Gary V" }, createdAt: new Date().toISOString(), readTime: "13 min read" },
                { id: "b16", title: "web development trends for 2026.", excerpt: "exploring the shift towards serverless architecture and AI-driven code generation.", category: "technology", image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1000", author: { name: "Jason D" }, createdAt: new Date().toISOString(), readTime: "7 min read" }
            ];
          }
          setAllPosts(data);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error("Blog fetch error:", err);
          setError("Could not connect to server. Please check your connection.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBlogs();
    return () => {
      cancelled = true;
    };
  }, []);

  // Client-side filtering — instant, no API call
  const displayedPosts = useMemo(() => {
    let posts = allPosts;

    if (selectedCategory !== "all") {
      posts = posts.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.content?.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q)
      );
    }

    return posts;
  }, [allPosts, selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 lg:px-24">
      {/* Hero */}
      <div className="max-w-4xl mb-24">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 lowercase leading-tight">
          latest. <br />
          <span className="text-gradient">insights.</span>
        </h1>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <p className="text-xl md:text-2xl text-muted-foreground font-medium lowercase max-w-2xl">
            expert advice on learning, technology, and career growth from the
            world's leading mentors.
          </p>
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 text-sm font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Categories — instant client-side filter */}
      <div className="flex flex-wrap gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${
              selectedCategory === cat
                ? "bg-primary text-white border-primary"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            {cat}
            {!loading && cat !== "all" && (
              <span className="ml-1.5 opacity-50">
                (
                {
                  allPosts.filter(
                    (p) => p.category?.toLowerCase() === cat.toLowerCase()
                  ).length
                }
                )
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-24 border border-red-500/20 bg-red-500/5 rounded-[4rem]">
          <Zap className="size-16 text-red-500/40 mx-auto mb-6" />
          <h3 className="text-2xl font-black tracking-tighter lowercase mb-2 text-red-400">
            {error}
          </h3>
          <button
            onClick={() => window.location.reload()}
            className="btn-premium px-8 py-3 mt-4"
          >
            retry connection.
          </button>
        </div>
      ) : displayedPosts.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-white/10 rounded-[4rem]">
          <Search className="size-16 text-muted-foreground/30 mx-auto mb-6" />
          <h3 className="text-2xl font-black tracking-tighter lowercase mb-2">
            no insights found.
          </h3>
          <p className="text-muted-foreground font-medium lowercase">
            try adjusting your search or category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedPosts.map((post) => (
            <BlogCard key={post.id || post._id} post={post} />
          ))}
        </div>
      )}

      {/* Newsletter */}
      <div className="mt-32 p-12 md:p-24 rounded-[4rem] glass relative overflow-hidden text-center border border-white/10">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Zap className="size-64 text-primary" />
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter lowercase mb-8">
          get exclusive{" "}
          <span className="text-gradient">learning guides.</span>
        </h2>
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="your email address"
            className="flex-1 bg-white/5 border border-white/10 rounded-full py-4 px-8 text-sm font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <button className="btn-premium px-10 py-4 uppercase font-black tracking-widest">
            subscribe.
          </button>
        </div>
      </div>
    </div>
  );
}
