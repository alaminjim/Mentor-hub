"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { TutorDataType } from "@/type/tutorDataTyp";
import Link from "next/link";
import { Star, Bookmark, Share2, BadgeCheck } from "lucide-react";
import toast from "react-hot-toast";

interface TutorCardProps {
  tutor: TutorDataType;
  initialBookmarked?: boolean;
  className?: string;
}

export const TutorCard = ({ className, tutor, initialBookmarked = false }: TutorCardProps) => {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    setBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isToggling) return;
    
    setIsToggling(true);
    setBookmarked((prev) => !prev);
    
    import("@/components/service/bookmark.service").then(({ bookmarkService }) => {
      bookmarkService.toggleBookmark(tutor.id).then((res) => {
        if (!res.success) {
           setBookmarked((prev) => !prev);
           toast.error(res.message || "please signin to bookmark tutors");
        } else {
           if (res.data?.bookmarked) {
             toast.success(`${tutor.name} added to bookmarks!`);
           } else {
             toast("removed from bookmarks");
           }
        }
        setIsToggling(false);
      });
    });
  };

  const initials = tutor?.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "TU";
  
  const portraitUrl = `https://api.dicebear.com/7.x/micah/svg?seed=${tutor.id || tutor.name}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  return (
    <div
      className={cn(
        "group w-full max-w-full min-h-[520px] p-12 rounded-[5rem] relative transition-all duration-1000 overflow-hidden flex flex-col justify-between",
        "bg-white/50 dark:bg-slate-900/40 backdrop-blur-[40px] border border-white/60 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.05)]",
        "hover:shadow-[0_40px_80px_rgba(var(--primary),0.15)] hover:-translate-y-2",
        className,
      )}
    >
      {/* Refraction Light Effect */}
      <div className="absolute top-0 right-0 size-48 bg-primary/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 size-48 bg-cyan-500/5 blur-[80px] pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
           {/* Gradient Avatar */}
           <div className="size-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 dark:from-cyan-500 dark:to-blue-700 p-0.5 shadow-xl">
             <div className="w-full h-full rounded-full overflow-hidden bg-white/10 flex items-center justify-center border border-white/20">
                {tutor.user?.image ? (
                  <img src={tutor.user.image} alt={tutor.name} className="w-full h-full object-cover" />
                ) : (
                  <img src={portraitUrl} alt={tutor.name} className="w-full h-full object-cover" />
                )}
             </div>
           </div>
           {/* Share Icon */}
           <Share2 className="size-5 text-slate-400 hover:text-primary transition-colors cursor-pointer" />
        </div>

        {/* Info Area */}
        <div className="mb-6">
           <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-1 line-clamp-1">
             {tutor.name}
           </h3>
           <p className="text-xs font-black uppercase text-slate-400 tracking-widest">{tutor.categories?.[0]?.name || "educational mentor"}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
           {tutor.subjects?.slice(0, 2).map((sub, i) => (
             <span key={i} className="px-5 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-bold text-slate-600 dark:text-slate-400 capitalize">
               {sub}
             </span>
           ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 py-6 border-t border-slate-900/5 dark:border-white/5 flex items-center justify-between mb-2">
         <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1 mb-1">
               <Star className="size-3 text-amber-500 fill-amber-500" />
               <span className="text-sm font-bold text-slate-900 dark:text-white">{Number(tutor.rating || 5.0).toFixed(1)}</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Rating</span>
         </div>
         <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />
         <div className="flex flex-col items-center flex-1">
            <span className="text-sm font-bold text-slate-900 dark:text-white mb-1">${(tutor.totalReviews || 0) * 2 || "2"}k+</span>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Earned</span>
         </div>
         <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />
         <div className="flex flex-col items-center flex-1">
            <span className="text-sm font-bold text-slate-900 dark:text-white mb-1">${tutor.hourlyRate || tutor.price}/hr</span>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Rate</span>
         </div>
      </div>

      {/* Bottom Actions */}
      <div className="relative z-10 flex gap-4 items-center">
         <Link href={`/tutors/${tutor.id}`} className="flex-grow">
            <button className="w-full h-16 rounded-full relative group/btn overflow-hidden transition-all duration-500 hover:scale-[1.02]">
              {/* Animated Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-cyan-500 to-primary bg-[length:200%_auto] animate-shimmer group-hover/btn:bg-[length:100%_auto] transition-all duration-700" />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 blur-[2px]" />
              <span className="relative z-10 text-white font-black uppercase text-[10px] tracking-[0.2em]">
                Get in touch
              </span>
            </button>
         </Link>
         <button 
           onClick={handleBookmark}
           disabled={isToggling}
           className={cn(
             "size-16 rounded-full flex items-center justify-center transition-all duration-500 bg-white dark:bg-slate-800 shadow-xl border border-white/60 dark:border-white/10 active:scale-90",
             bookmarked ? "text-primary border-primary" : "text-slate-400 hover:text-primary hover:border-primary/50"
           )}
         >
           <Bookmark className={cn("size-6", bookmarked && "fill-current")} />
         </button>
      </div>

      {/* Style for Shimmer Animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TutorCard;
