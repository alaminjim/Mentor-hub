"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  User,
  Loader2,
  DollarSign,
  Tag,
  X,
  Star,
  Sparkles,
  Brain,
  ShieldCheck,
  Rocket,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { getAllBookings } from "@/components/service/booking.service";
import { BookingDataType, BookingStatus } from "@/type/bookingType";
import { useRouter, useSearchParams } from "next/navigation";
import { CreateReview } from "@/components/service/reviews.service";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorId: string;
  tutorName?: string;
  subject?: string;
  onSuccess: () => void;
}

function ReviewModal({
  isOpen,
  onClose,
  tutorId,
  tutorName,
  subject,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  const router = useRouter();

  if (!isOpen) return null;

  const handleAiReview = async () => {
    setAiGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, tutorName }),
      });
      const result = await res.json();
      if (result.success) {
        setComment(result.data);
        if (rating === 0) setRating(5);
        toast.success("AI generated a review for you!");
      }
    } catch (err) {
      toast.error("AI review generation failed");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Submitting review...");

    try {
      const result = await CreateReview({
        tutorId,
        rating,
        comment: comment.trim() || undefined,
      });

      if (result.success) {
        toast.success("Review submitted successfully!", { id: toastId });
        setRating(0);
        setComment("");
        onSuccess();
        onClose();
        router.push("/dashboard/bookings/review");
      } else {
        toast.error(result.error || "Failed to submit review", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-lg w-full p-10 relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-24 h-24 bg-yellow-500/10 rounded-full -ml-12 -mt-12 blur-2xl" />
        
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors disabled:opacity-50"
        >
          <X size={24} />
        </button>

        <div className="w-20 h-20 bg-yellow-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
          <Star className="text-yellow-500 fill-yellow-500" size={32} />
        </div>

        <h3 className="text-3xl font-black text-slate-900 dark:text-white text-center mb-2 lowercase tracking-tighter">
          leave a review.
        </h3>
        <p className="text-slate-500 text-center mb-8 font-medium lowercase">
          how was your mentorship session?
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-all hover:scale-125 focus:outline-none"
              >
                <Star
                  className={`w-12 h-12 transition-colors ${
                    star <= (hoverRating || rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-slate-200 dark:text-slate-800"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="comment"
              className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2"
            >
              Feedback (Optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="What did you learn today?"
              className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-500/10 text-slate-900 dark:text-white font-medium resize-none transition-all"
            />
            <button
              type="button"
              onClick={handleAiReview}
              disabled={aiGenerating}
              className="mt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-primary hover:text-primary/70 transition-colors"
            >
              {aiGenerating ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Sparkles size={12} />
              )}
              Generate With AI Magic
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || rating === 0}
            className="w-full btn-premium bg-yellow-500 hover:bg-yellow-600 text-white h-14 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_40px_rgba(234,179,8,0.3)] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Submit Verification Review"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function StudentBookingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<BookingDataType[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Verification State
  const [aiVerifying, setAiVerifying] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);

  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    tutorId: string | null;
    tutorName: string | null;
    subject: string | null;
  }>({
    isOpen: false,
    tutorId: null,
    tutorName: null,
    subject: null,
  });

  useEffect(() => {
    loadBookings();
    checkPaymentSuccess();
  }, []);

  const checkPaymentSuccess = async () => {
    const success = searchParams.get("success");
    const bookingId = searchParams.get("bookingId");
    
    // Check if we should show popup (from localStorage)
    const storedId = localStorage.getItem("showAiPopupAfterPayment");

    if (success === "true" && bookingId && storedId === bookingId) {
      setAiVerifying(true);
      setShowAiModal(true);
      
      // Immediately clear flags so it won't repeat on refresh
      localStorage.removeItem("showAiPopupAfterPayment");
      router.replace("/dashboard/bookings");
      
      try {
        const res = await fetch("/api/ai/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }),
        });
        const result = await res.json();
        
        if (result.success) {
          setAiAnalysis(result.analysis || "payment confirmed. session metadata has been synchronized.");
          setTimeout(() => {
            setAiVerifying(false);
            loadBookings();
          }, 3000);
        } else {
          setShowAiModal(false);
        }
      } catch (err) {
        setShowAiModal(false);
      }
    } else if (success === "true") {
      // If success is in URL but no flag in localStorage, just clean the URL
      router.replace("/dashboard/bookings");
    }
  };

  const loadBookings = async () => {
    setLoading(true);
    try {
      const result = await getAllBookings();

      if (result.success && result.data) {
        const bookingsArray = Array.isArray(result.data) ? result.data : [];
        setBookings(bookingsArray);
      } else {
        toast.error(result.error || "Failed to load bookings");
        setBookings([]);
      }
    } catch (error) {
      toast.error("An error occurred while loading bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (tutorId: string, tutorName: string, subject: string) => {
    setReviewModal({
      isOpen: true,
      tutorId,
      tutorName,
      subject,
    });
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-sky-500/10 text-sky-500 border-sky-500/20";
      case "COMPLETED":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "CANCELLED":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (loading && !aiVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ isOpen: false, tutorId: null, tutorName: null, subject: null })}
        tutorId={reviewModal.tutorId || ""}
        tutorName={reviewModal.tutorName || ""}
        subject={reviewModal.subject || ""}
        onSuccess={loadBookings}
      />

      {/* AI Success Verification Overlay */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="max-w-xl w-full glass border border-white/10 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-[0_0_100px_rgba(14,165,233,0.1)]"
            >
               <div className="absolute top-0 right-0 p-12 opacity-5">
                  <Brain className="size-48" />
               </div>

               {aiVerifying ? (
                 <div className="py-12 space-y-8">
                    <motion.div 
                       animate={{ rotate: 360 }}
                       transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                       className="size-24 rounded-full border-2 border-dashed border-primary mx-auto flex items-center justify-center"
                    >
                       <Sparkles className="size-8 text-primary animate-pulse" />
                    </motion.div>
                    <div className="space-y-4">
                       <h2 className="text-3xl font-black lowercase tracking-tighter">AI Verification Sync...</h2>
                       <p className="text-slate-400 font-medium lowercase italic animate-pulse">confirming transaction integrity with mentorhub network</p>
                    </div>
                 </div>
               ) : (
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10"
                 >
                    <div className="size-20 rounded-full bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center mx-auto">
                       <ShieldCheck className="size-10 text-emerald-400" />
                    </div>
                    <div className="space-y-4">
                       <h2 className="text-4xl font-black lowercase tracking-tighter">payment secured.</h2>
                       <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 text-left">
                          <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-3">AI Verification Analysis:</p>
                          <p className="text-sm font-medium leading-relaxed text-slate-300 lowercase italic">{aiAnalysis}</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setShowAiModal(false)}
                      className="w-full h-14 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all"
                    >
                      Enter My Workspace
                    </button>
                 </motion.div>
               )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter lowercase mb-4">
              my <span className="text-primary">bookings.</span>
            </h1>
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">
              active knowledge sessions: {bookings.length}
            </p>
          </div>
          <div className="flex gap-4">
             <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors">upcoming</button>
             <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors text-slate-500">archived</button>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="py-32 text-center glass rounded-[3rem] border-white/5">
             <Calendar className="size-16 text-slate-800 mx-auto mb-6" />
             <h3 className="text-2xl font-black lowercase tracking-tighter mb-2">no bookings found.</h3>
             <p className="text-slate-500 mb-8 lowercase">start your journey by visiting our experts.</p>
             <button onClick={() => router.push("/tutors")} className="btn-premium px-8 h-12 uppercase text-[10px] tracking-widest font-black">Browse Tutors</button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => {
              const bookingId = booking._id || booking.id || "";
              const tutor = typeof booking.tutorId === "object" ? (booking.tutorId as any) : null;
              const category = typeof booking.categoryId === "object" ? (booking.categoryId as any) : null;

              return (
                <motion.div
                  key={bookingId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass group rounded-[3rem] p-8 border border-white/5 hover:border-primary/20 transition-all shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 scale-50 group-hover:scale-100 transition-all">
                     <Rocket className="size-24 text-primary" />
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center gap-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-6">
                         <div className={cn("px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest", getStatusColor(booking.status))}>
                            {booking.status}
                         </div>
                         <div className="size-1 bg-slate-800 rounded-full" />
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">id: {bookingId.slice(-8)}</span>
                      </div>

                      <h2 className="text-3xl font-black text-white tracking-tighter lowercase mb-8">
                        {booking.subject}
                      </h2>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="space-y-2">
                           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                              <Calendar className="size-3" /> Date
                           </p>
                           <p className="text-xs font-black text-white">{formatDateTime(booking.scheduledAt)}</p>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                              <Clock className="size-3" /> Time
                           </p>
                           <p className="text-xs font-black text-white">{booking.time || "standard"}</p>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                              <User className="size-3" /> Mentor
                           </p>
                           <p className="text-xs font-black text-primary lowercase truncate">{tutor?.name || "assigned"}</p>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                              <Tag className="size-3" /> Value
                           </p>
                           <p className="text-xl font-black text-white tracking-tighter">${booking.totalPrice}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-4 min-w-[240px]">
                       {booking.status === "COMPLETED" ? (
                         <button
                           onClick={() => openReviewModal(tutor?._id || tutor?.id || "", tutor?.name || "mentor", booking.subject)}
                           className="w-full flex items-center justify-center gap-3 h-14 bg-yellow-500 hover:bg-yellow-600 text-black rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-yellow-500/10"
                         >
                           <Star size={16} className="fill-black" />
                           Leave Review
                         </button>
                       ) : booking.status === "CONFIRMED" ? (
                         <div className="space-y-3">
                            <button 
                              onClick={async () => {
                                try {
                                  const res = await fetch(`/api/booking/pay/${bookingId}`);
                                  const result = await res.json();
                                  if (result.success && result.data.url) {
                                    window.location.href = result.data.url;
                                  } else {
                                    toast.error("Failed to generate payment link");
                                  }
                                } catch (err) {
                                  toast.error("Payment system offline");
                                }
                              }}
                              className="w-full flex items-center justify-center gap-3 h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-primary/20"
                            >
                              Pay & Finalize <DollarSign size={14} />
                            </button>
                            <button
                              onClick={() => openReviewModal(tutor?._id || tutor?.id || "", tutor?.name || "mentor", booking.subject)}
                              className="w-full flex items-center justify-center gap-3 h-12 bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all"
                            >
                              Leave Review <Star size={12} />
                            </button>
                         </div>
                       ) : (
                         <button className="w-full flex items-center justify-center gap-3 h-14 bg-white/5 border border-white/10 hover:bg-primary hover:text-white hover:border-primary text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">
                           Wait for Approval <Clock size={14} />
                         </button>
                       )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
