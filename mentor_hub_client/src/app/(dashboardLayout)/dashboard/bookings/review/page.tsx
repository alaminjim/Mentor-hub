"use client";

import { useState, useEffect } from "react";
import {
  Star,
  Loader2,
  MessageSquare,
  User,
  Calendar,
  StarOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { GetOwnReviews } from "@/components/service/reviews.service";
import { ReviewDataType } from "@/type/reviewType";
import { cn } from "@/lib/utils";

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<ReviewDataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const result = await GetOwnReviews();

      if (result.success && result.data) {
        setReviews(result.data);
      } else {
        toast.error(result.error || "Failed to load reviews");
        setReviews([]);
      }
    } catch (error) {
      toast.error("An error occurred while loading reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-amber-500 fill-amber-500"
                : "text-muted border-border"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Synchronizing Reviews...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="p-10 rounded-[2.5rem] bg-card border border-border relative overflow-hidden group shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <h1 className="text-4xl font-black tracking-tighter mb-2 italic">My <span className="text-primary">Reviews.</span></h1>
              <p className="text-muted-foreground text-sm font-medium">Historical feedback from your expert mentoring sessions.</p>
           </div>
           <div className="px-6 py-3 bg-muted rounded-2xl border border-border">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Feedback</p>
              <p className="text-2xl font-black tracking-tighter">{reviews.length}</p>
           </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="py-32 bg-card rounded-[3rem] border border-border text-center space-y-6">
          <div className="size-20 bg-muted rounded-[2rem] flex items-center justify-center mx-auto opacity-20 border border-border">
            <StarOff className="size-8" />
          </div>
          <div className="max-w-sm mx-auto space-y-2">
            <h2 className="text-2xl font-black lowercase tracking-tighter italic">no reviews yet.</h2>
            <p className="text-muted-foreground text-sm font-medium lowercase">You haven't submitted any reviews yet. Complete a session to leave your first review!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card group rounded-[2.5rem] p-8 border border-border hover:border-primary/20 transition-all shadow-sm relative overflow-hidden"
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between">
                   <div className="space-y-4">
                      {renderStars(review.rating)}
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Expert Mentor</p>
                          <p className="text-sm font-black tracking-tight">{(review.tutorId as any)?.name || "MentorHub Elite"}</p>
                        </div>
                      </div>
                   </div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">
                      {formatDate(review.createdAt)}
                   </div>
                </div>

                <div className="p-6 rounded-2xl bg-muted/30 border border-border relative">
                   <MessageSquare className="absolute -top-2 -right-2 size-8 text-primary/5 rotate-12" />
                   <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-2">Patient Feedback</p>
                   <p className="text-sm font-medium leading-relaxed italic text-muted-foreground">
                      "{review.comment || "No written feedback provided for this session."}"
                   </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
