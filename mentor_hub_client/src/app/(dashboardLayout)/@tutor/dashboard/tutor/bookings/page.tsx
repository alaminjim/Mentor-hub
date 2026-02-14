// src/app/dashboard/student/bookings/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  User,
  CheckCircle,
  XCircle,
  Loader2,
  DollarSign,
  Tag,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getAllBookings,
  updateBookingStatus,
} from "@/components/service/booking.service";
import { BookingDataType, BookingStatus } from "@/type/bookingType";

export const dynamic = "force-dynamic";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmColor: "green" | "red";
  loading: boolean;
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmColor,
  loading,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const colorClasses =
    confirmColor === "green"
      ? "bg-green-500 hover:bg-green-600"
      : "bg-red-500 hover:bg-red-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          <X size={24} />
        </button>

        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            confirmColor === "green" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {confirmColor === "green" ? (
            <CheckCircle className="text-green-600" size={32} />
          ) : (
            <XCircle className="text-red-600" size={32} />
          )}
        </div>

        <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {title}
        </h3>

        <p className="text-gray-600 text-center mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-6 py-3 ${colorClasses} text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState<BookingDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    bookingId: string | null;
    newStatus: BookingStatus | null;
  }>({
    isOpen: false,
    bookingId: null,
    newStatus: null,
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

  const openModal = (
    bookingId: string | undefined,
    newStatus: BookingStatus,
  ) => {
    if (
      !bookingId ||
      bookingId === "undefined" ||
      typeof bookingId !== "string"
    ) {
      toast.error("Invalid booking ID");
      return;
    }

    setModalState({
      isOpen: true,
      bookingId,
      newStatus,
    });
  };

  const closeModal = () => {
    if (updatingId) return;
    setModalState({
      isOpen: false,
      bookingId: null,
      newStatus: null,
    });
  };

  const confirmStatusChange = async () => {
    const { bookingId, newStatus } = modalState;

    if (!bookingId || !newStatus) return;

    setUpdatingId(bookingId);
    const toastId = toast.loading("Updating status...");

    try {
      const result = await updateBookingStatus(bookingId, newStatus);

      if (result.success) {
        toast.success("Status updated successfully!", { id: toastId });

        setBookings((prev) =>
          prev.map((booking) => {
            const id = booking._id || booking.id;
            if (id === bookingId) {
              return { ...booking, status: newStatus };
            }
            return booking;
          }),
        );

        closeModal();
      } else {
        toast.error(result.error || "Failed to update status", { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred", { id: toastId });
    } finally {
      setUpdatingId(null);
    }
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

  const getModalConfig = () => {
    if (modalState.newStatus === "COMPLETED") {
      return {
        title: "Mark as Completed?",
        message:
          "Are you sure you want to mark this booking as completed? This action cannot be undone.",
        confirmText: "Mark Complete",
        confirmColor: "green" as const,
      };
    } else {
      return {
        title: "Cancel Booking?",
        message:
          "Are you sure you want to cancel this booking? This action cannot be undone.",
        confirmText: "Cancel Booking",
        confirmColor: "red" as const,
      };
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

  const modalConfig = getModalConfig();

  return (
    <>
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={confirmStatusChange}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        confirmColor={modalConfig.confirmColor}
        loading={!!updatingId}
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

              const canChangeStatus = booking.status === "CONFIRMED";

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

                      {canChangeStatus && (
                        <div className="space-y-2">
                          <button
                            onClick={() => openModal(bookingId, "COMPLETED")}
                            disabled={!!updatingId}
                            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CheckCircle size={20} />
                            Mark Complete
                          </button>

                          <button
                            onClick={() => openModal(bookingId, "CANCELLED")}
                            disabled={!!updatingId}
                            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <XCircle size={20} />
                            Cancel Booking
                          </button>
                        </div>
                      )}

                      {(booking.status === "COMPLETED" ||
                        booking.status === "CANCELLED") && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                          <p className="text-sm text-gray-600 font-medium">
                            {booking.status === "COMPLETED"
                              ? "Booking completed"
                              : "Booking cancelled"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            No further actions available
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
