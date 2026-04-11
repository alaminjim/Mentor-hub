"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, User, Sparkles } from "lucide-react";
import { ScrollReveal, RevealItem } from "../animations/ScrollReveal";
import { blogService } from "../service/blog.service";

function BlogCard({ post }: { post: any }) {
  const [imgSrc, setImgSrc] = useState(post.image || "");
  const fallbackImg = "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000";

  return (
    <article className="group bento-item bg-transparent min-h-[500px] !p-0 overflow-hidden cursor-pointer">
      <div className="relative h-64 overflow-hidden border-b border-white/5">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImgSrc(fallbackImg)}
          />
        ) : (
          <div className="h-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="size-12 text-primary/40" />
          </div>
        )}
        <div className="absolute top-6 left-6">
          <span className="px-5 py-2 glass rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em]">
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-10 space-y-6">
        <div className="flex items-center gap-6 text-neutral-500 text-[10px] font-black uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <Calendar className="size-3 text-primary" />
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-2">
            <User className="size-3 text-primary" />
            {post.author?.name || "anonymous"}
          </span>
        </div>

        <h3 className="text-3xl font-black tracking-tighter lowercase leading-tight group-hover:text-primary transition-colors">
          {post.title}.
        </h3>

        <p className="text-muted-foreground line-clamp-2 font-medium lowercase">
          {post.excerpt || (post.content && post.content.substring(0, 100) + "...")}
        </p>

        <div className="pt-4">
          <Link
            href={`/blog/${post.id || post._id}`}
            className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] group-hover:text-primary transition-colors"
          >
            read more
            <ArrowRight className="size-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function BlogPreview() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await blogService.getBlogs();
        setBlogs(data?.slice(0, 3) || []);
      } catch (error) {
        console.error("Failed to fetch featured blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading || blogs.length === 0) return null;

  return (
    <section className="section-padding py-12 relative overflow-hidden">
      <ScrollReveal>
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-3xl">
            <RevealItem>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 lowercase">
                latest. <span className="text-gradient">insights.</span>
              </h2>
            </RevealItem>
            <RevealItem>
              <p className="text-xl text-muted-foreground font-medium lowercase">
                stay updated with the latest trends in education, learn new study techniques, and get expert advice from our best.
              </p>
            </RevealItem>
          </div>
          <RevealItem>
            <Link href="/blog" className="group flex items-center gap-3 text-lg font-black uppercase tracking-widest hover:text-primary transition-colors">
              view all <ArrowRight className="size-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </RevealItem>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((post, i) => (
            <RevealItem key={post.id || i}>
              <BlogCard post={post} />
            </RevealItem>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
