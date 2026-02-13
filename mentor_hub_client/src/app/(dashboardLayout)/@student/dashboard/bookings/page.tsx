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
} from "lucide-react";
import toast from "react-hot-toast";
import { getAllBookings } from "@/components/service/booking.service";
import { BookingDataType, BookingStatus } from "@/type/bookingType";
import { useRouter } from "next/navigation";
import { CreateReview } from "@/components/service/reviews.service";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorId: string;
  onSuccess: () => void;
}

function ReviewModal({
  isOpen,
  onClose,
  tutorId,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          <X size={24} />
        </button>

        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="text-yellow-600 fill-yellow-600" size={32} />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Leave a Review
        </h3>
        <p className="text-gray-600 text-center mb-6">
          Share your experience with this session
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Rating *
            </label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoverRating || rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-gray-600 mt-2">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Comment (Optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Share your thoughts about the session..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Star size={20} />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StudentBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingDataType[]>([]);
  const [loading, setLoading] = useState(true);

  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    tutorId: string | null;
  }>({
    isOpen: false,
    tutorId: null,
  });

  useEffect(() => {
    loadBookings();
  }, []);

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

  const openReviewModal = (tutorId: string) => {
    setReviewModal({
      isOpen: true,
      tutorId,
    });
  };

  const closeReviewModal = () => {
    setReviewModal({
      isOpen: false,
      tutorId: null,
    });
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="size-12 animate-spin text-sky-500 mx-auto mb-4" />
          <p className="text-sky-600 font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Calendar className="size-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Bookings Yet
            </h2>
            <p className="text-gray-600">
              You haven't made any bookings yet. Browse tutors to get started!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={closeReviewModal}
        tutorId={reviewModal.tutorId || ""}
        onSuccess={loadBookings}
      />

      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <Calendar className="text-sky-500" size={32} />
              My Bookings
            </h1>
            <p className="text-gray-600">Total Bookings: {bookings.length}</p>
          </div>

          <div className="grid gap-4">
            {bookings.map((booking) => {
              const bookingId = booking._id || booking.id || "";

              if (!bookingId) {
                console.error("Booking missing ID:", booking);
                return null;
              }

              const tutorId =
                typeof booking.tutorId === "object"
                  ? (booking.tutorId as any)._id ||
                    (booking.tutorId as any).id ||
                    ""
                  : booking.tutorId || "";

              const isConfirmed = booking.status === "CONFIRMED";
              const isCompleted = booking.status === "COMPLETED";
              const isCancelled = booking.status === "CANCELLED";

              return (
                <div
                  key={bookingId}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <BookOpen className="text-purple-600" size={22} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            Subject
                          </p>
                          <p className="font-bold text-gray-900 text-xl">
                            {booking.subject}
                          </p>
                        </div>
                      </div>

                      {booking.categoryId &&
                        typeof booking.categoryId === "object" && (
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Tag className="text-indigo-600" size={22} />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                Category
                              </p>
                              <p className="font-semibold text-gray-900">
                                {booking.categoryId.name || "N/A"}
                              </p>
                            </div>
                          </div>
                        )}

                      {booking.tutorId &&
                        typeof booking.tutorId === "object" && (
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="text-sky-600" size={22} />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                Tutor
                              </p>
                              <p className="font-semibold text-gray-900">
                                {booking.tutorId.name || "N/A"}
                              </p>
                              {booking.tutorId.email && (
                                <p className="text-sm text-gray-600">
                                  {booking.tutorId.email}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Calendar className="text-green-600" size={22} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                              Scheduled Date
                            </p>
                            <p className="font-semibold text-gray-900">
                              {formatDateTime(booking.scheduledAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Clock className="text-orange-600" size={22} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                              Duration
                            </p>
                            <p className="font-semibold text-gray-900">
                              {booking.duration} hour
                              {booking.duration > 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <DollarSign className="text-emerald-600" size={22} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            Total Amount
                          </p>
                          <p className="font-bold text-gray-900 text-2xl">
                            ৳{booking.totalPrice}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:w-72">
                      <div
                        className={`px-5 py-3 rounded-xl border-2 text-center font-bold text-lg ${getStatusColor(
                          booking.status,
                        )}`}
                      >
                        {booking.status}
                      </div>

                      {isConfirmed && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                          <p className="text-sm text-blue-800 font-semibold mb-1">
                            ✓ Booking Confirmed
                          </p>
                          <p className="text-xs text-blue-600">
                            Your session is scheduled and ready
                          </p>
                        </div>
                      )}

                      {isCompleted && (
                        <button
                          onClick={() => openReviewModal(tutorId)}
                          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                        >
                          <Star size={20} className="fill-white" />
                          Leave Review
                        </button>
                      )}

                      {isCancelled && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                          <p className="text-sm text-red-800 font-semibold mb-1">
                            Booking Cancelled
                          </p>
                          <p className="text-xs text-red-600">
                            This session has been cancelled
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
