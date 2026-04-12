"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Clock,
  Share2,
  Bookmark,
  ChevronRight,
  Zap,
  BookOpen,
} from "lucide-react";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://mentor-hub-server.vercel.app";

// ── Skeleton ─────────────────────────────────────────────────────────────────
function BlogDetailSkeleton() {
  return (
    <div className="min-h-screen pt-32 pb-24 animate-pulse">
      <div className="container mx-auto px-6">
        {/* back link */}
        <div className="h-4 w-32 rounded-full bg-white/10 mb-12" />

        <div className="max-w-4xl mx-auto mb-16 space-y-6">
          <div className="h-6 w-28 rounded-full bg-white/10" />
          <div className="h-16 w-3/4 rounded-2xl bg-white/10" />
          <div className="h-16 w-1/2 rounded-2xl bg-white/10" />
          <div className="flex justify-between py-8 border-y border-white/5">
            <div className="flex gap-4">
              <div className="size-12 rounded-2xl bg-white/10" />
              <div className="space-y-2">
                <div className="h-4 w-32 rounded-full bg-white/10" />
                <div className="h-3 w-24 rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        </div>

        {/* image */}
        <div className="aspect-[21/9] rounded-[3rem] bg-white/10 mb-24" />

        {/* content */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-6 w-full rounded-full bg-white/10" />
          <div className="h-6 w-5/6 rounded-full bg-white/10" />
          <div className="h-6 w-4/5 rounded-full bg-white/10" />
          <div className="h-6 w-full rounded-full bg-white/10" />
          <div className="h-6 w-3/4 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function BlogDetailsPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        // Direct call to backend — bypasses Next.js rewrite proxy
        const res = await fetch(`${BACKEND_URL}/api/blog/${id}`, {
          cache: "no-store",
        });

        const json = await res.json();

        if (!res.ok) {
          setError(json?.message || "insight not found.");
          return;
        }

        const data = json?.data ?? json;
        if (!cancelled) {
          if (data && (data.id || data._id)) {
            setPost(data);
          } else {
            setError("insight not found.");
          }
        }
      } catch (err) {
        if (!cancelled) setError("failed to connect to the server.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPost();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <BlogDetailSkeleton />;

  if (error || !post) {
    return (
      <div className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center text-center">
        <div className="p-8 rounded-[3rem] glass border border-red-500/20 bg-red-500/5 max-w-md">
          <Zap className="size-16 text-red-500/40 mx-auto mb-6" />
          <h1 className="text-3xl font-black tracking-tighter lowercase mb-3">
            {error || "insight unavailable."}
          </h1>
          <p className="text-muted-foreground font-medium lowercase mb-8">
            the article you're looking for may have been moved or deleted.
          </p>
          <Link href="/blog" className="btn-premium px-8 py-3 inline-block">
            ← back to library.
          </Link>
        </div>
      </div>
    );
  }

  const authorName =
    typeof post.author === "object"
      ? post.author?.name
      : post.author || "anonymous";

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
        dateStyle: "long",
      })
    : "—";

  return (
    <div className="min-h-screen pt-32 pb-24">
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/5 z-50">
        <div className="h-full bg-gradient-to-r from-primary to-cyan-500 w-1/3 transition-all duration-300" />
      </div>

      <div className="container mx-auto px-6">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 group mb-12 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          back to insights
        </Link>

        {/* Hero Header */}
        <div className="max-w-4xl mx-auto mb-16">
          {/* Category + read time */}
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
              {post.category}
            </span>
            <span className="h-px w-8 bg-white/10" />
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <Clock className="size-3" /> {post.readTime || "5 min read"}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <BookOpen className="size-3" />{" "}
              {post.content
                ? `${Math.ceil(post.content.split(" ").length / 200)} min read`
                : "5 min read"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 lowercase leading-[1.1]">
            {post.title}
          </h1>

          {/* Author + actions */}
          <div className="flex items-center justify-between py-8 border-y border-white/5">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <User className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-tight">
                  {authorName}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium lowercase">
                  <Calendar className="size-3" />
                  {formattedDate}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  navigator.clipboard?.writeText(window.location.href)
                }
                className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all"
                title="Copy link"
              >
                <Share2 className="size-4" />
              </button>
              <button className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all">
                <Bookmark className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.image && (
          <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden mb-24 glass border border-white/10">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          {/* Excerpt / lead */}
          {post.excerpt && (
            <p className="text-xl md:text-2xl text-muted-foreground font-medium lowercase leading-relaxed mb-12 italic border-l-4 border-primary pl-8">
              {post.excerpt}
            </p>
          )}

          {/* Body paragraphs */}
          <div className="text-lg text-neutral-300 leading-relaxed space-y-6 font-medium">
            {post.content ? (
              post.content
                .split("\n")
                .filter((p: string) => p.trim())
                .map((para: string, i: number) => <p key={i}>{para}</p>)
            ) : (
              <p className="text-muted-foreground lowercase">
                no content available.
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="mt-20 pt-12 border-t border-white/5 flex flex-wrap gap-3">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-2">
              <Tag className="size-3" /> related tags:
            </span>
            {["mentoring", "growth", post.category]
              .filter(Boolean)
              .map((tag: string) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest hover:text-primary cursor-pointer transition-colors border border-white/5 hover:border-primary/30"
                >
                  #{tag}
                </span>
              ))}
          </div>

          {/* Author card */}
          <div className="mt-24 p-12 rounded-[3rem] glass border border-white/10 flex flex-col md:flex-row gap-10 items-center">
            <div className="size-24 rounded-[2rem] bg-gradient-to-br from-primary to-cyan-500 p-0.5 shrink-0">
              <div className="w-full h-full rounded-[1.8rem] bg-background flex items-center justify-center">
                <User className="size-12 text-primary" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-2xl font-black tracking-tighter lowercase mb-2">
                written by {authorName}
              </h4>
              <p className="text-muted-foreground font-medium lowercase mb-6">
                passionate expert sharing knowledge to empower the next
                generation of professional leaders.
              </p>
              <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-4 transition-all mx-auto md:mx-0">
                follow insights <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Back CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
              explore more insights
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
