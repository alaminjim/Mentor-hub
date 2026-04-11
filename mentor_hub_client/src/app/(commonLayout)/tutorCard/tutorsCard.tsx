"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { TutorDataType } from "@/type/tutorDataTyp";
import Link from "next/link";
import { Star, Share2, Bookmark } from "lucide-react";
import toast from "react-hot-toast";

export const dynamic = "force-dynamic";

interface TutorCardProps {
  tutor: TutorDataType;
  initialBookmarked?: boolean;
  className?: string;
}

export const TutorCard = ({ className, tutor, initialBookmarked = false }: TutorCardProps) => {
  const [mounted, setMounted] = useState(false);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isToggling, setIsToggling] = useState(false);

  // Sync state if prop changes (e.g. data re-fetches)
  useEffect(() => {
    setBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isToggling) return;
    
    setIsToggling(true);
    // Optimistic UI update
    setBookmarked((prev) => !prev);
    
    import("@/components/service/bookmark.service").then(({ bookmarkService }) => {
      bookmarkService.toggleBookmark(tutor.id || (tutor as any)._id).then((res) => {
        if (!res.success) {
           // Revert on failure
           setBookmarked((prev) => !prev);
           toast.error(res.message || "please signin to bookmark tutors");
        } else {
           if (res.data?.bookmarked) {
             toast.success(`${tutor.name} added to bookmarks!`, {
               icon: '🔖',
               style: { borderRadius: '10px', background: '#333', color: '#fff' }
             });
           } else {
             toast("removed from bookmarks", {
               icon: '🗑️',
               style: { borderRadius: '10px', background: '#333', color: '#fff' }
             });
           }
        }
        setIsToggling(false);
      });
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate initials for avatar
  const initials = tutor?.name
    ? tutor.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "TU";

  return (
    <div
      className={cn(
        "relative group p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/5 via-background to-transparent border border-primary/10 dark:border-white/10 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 overflow-hidden",
        className,
      )}
    >
      {/* Background glow effect on hover */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-700" />

      {/* Top row: Avatar + Share button */}
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="size-16 rounded-full bg-background border-2 border-primary/40 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(var(--primary),0.15)] group-hover:border-primary transition-colors">
          <span className="text-xl font-black text-primary">{initials}</span>
        </div>
        <button 
          className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
        >
          <Share2 className="size-5" />
        </button>
      </div>

      {/* Name & Bio */}
      <div className="mb-6 relative z-10">
        <h3 className="text-2xl font-black tracking-tighter text-neutral-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
          {tutor.name}
        </h3>
        <p className="text-sm font-medium text-muted-foreground line-clamp-1 lowercase">
          {tutor.bio || "expert mentor"}
        </p>
      </div>

      {/* Subjects */}
      <div className="flex flex-wrap gap-2 mb-8 relative z-10 h-[28px]">
        {tutor.subjects?.slice(0, 2).map((sub: string, i: number) => (
          <span
            key={i}
            className="px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary/90"
          >
            {sub}
          </span>
        ))}
        {tutor.subjects?.length > 2 && (
           <span className="px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-500">
             +{tutor.subjects.length - 2}
           </span>
        )}
      </div>

      {/* Stats Row: Rating, Exp, Rate */}
      <div className="grid grid-cols-3 gap-2 mb-8 relative z-10">
        <div className="text-left md:text-center">
          <div className="flex items-center md:justify-center gap-1 text-neutral-900 dark:text-white font-black mb-1.5">
            <Star className="size-3.5 fill-amber-500 text-amber-500" /> {Number(tutor.rating ?? 0).toFixed(1)}
          </div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Rating</div>
        </div>
        <div className="text-center">
          <div className="text-neutral-900 dark:text-white font-black mb-1.5">{tutor.experience} Yrs</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Experience</div>
        </div>
        <div className="text-right md:text-center">
          <div className="text-neutral-900 dark:text-white font-black mb-1.5">${tutor.hourlyRate ?? tutor.price}/hr</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Rate</div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="flex gap-3 relative z-10">
        <Link href={`/tutorCard/${tutor.id}`} className="flex-1">
          <button className="w-full h-12 rounded-full bg-primary/10 text-primary font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all border border-primary/20 hover:border-primary">
            get in touch
          </button>
        </Link>
        <button 
          onClick={handleBookmark}
          disabled={isToggling}
          className={cn(
            "size-12 rounded-full border flex items-center justify-center transition-all shrink-0",
            bookmarked 
              ? "bg-primary/20 border-primary text-primary" 
              : "bg-primary/5 border-primary/10 text-neutral-600 dark:text-white hover:bg-primary/10",
            isToggling && "opacity-50 cursor-not-allowed"
          )}
        >
          <Bookmark className={cn("size-5 transition-transform active:scale-75", bookmarked && "fill-primary")} />
        </button>
      </div>
    </div>
  );
};

export default TutorCard;
