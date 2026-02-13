"use client";

import { useState } from "react";
import { Calendar, Clock, DollarSign } from "lucide-react";
import { toast } from "react-hot-toast";

interface Category {
  id: string;
  name: string;
}

interface BookingFormProps {
  tutorId: string;
  tutorName: string;
  hourlyRate: number;
  subjects: string[];
  userRole: string;
  userId: string;
  categories: Category[];
}

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 20; hour++) {
    const startTime = hour;
    const endTime = hour + 1;

    const startPeriod = startTime >= 12 ? "PM" : "AM";
    const endPeriod = endTime >= 12 ? "PM" : "AM";

    const startHour =
      startTime > 12 ? startTime - 12 : startTime === 0 ? 12 : startTime;
    const endHour = endTime > 12 ? endTime - 12 : endTime === 0 ? 12 : endTime;

    const label = `${startHour}:00 ${startPeriod} - ${endHour}:00 ${endPeriod}`;
    const value = `${String(startTime).padStart(2, "0")}:00`;

    slots.push({ label, value });
  }
  return slots;
};

export default function BookingForm({
  tutorId,
  tutorName,
  hourlyRate,
  subjects,
  userRole,
  userId,
  categories,
}: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: subjects[0] || "",
    categoryId: categories[0]?.id || "",
    scheduledAt: "",
    time: "",
    duration: 1,
  });

  const totalPrice = formData.duration * hourlyRate;
  const isStudent = userRole === "STUDENT";
  const timeSlots = generateTimeSlots();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isStudent) {
      toast.error("Only students can book sessions!");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Please select a category!");
      return;
    }

    if (!formData.time) {
      toast.error("Please select a time slot!");
      return;
    }

    setLoading(true);

    try {
      const scheduledDateTime = `${formData.scheduledAt}T${formData.time}:00`;

      const bookingData = {
        tutorId,
        studentId: userId,
        categoryId: formData.categoryId,
        subject: formData.subject,
        scheduledAt: new Date(scheduledDateTime).toISOString(),
        duration: formData.duration,
        totalPrice,
      };

      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const result = await res.json();

      if (!res.ok || result.success === false) {
        const errorMessage =
          typeof result.error === "string"
            ? result.error
            : result.message || "Booking failed. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.success("Booking created successfully!");
        setFormData({
          subject: subjects[0] || "",
          categoryId: categories[0]?.id || "",
          scheduledAt: "",
          time: "",
          duration: 1,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-sky-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Book a Session with <span className="text-sky-600">{tutorName}</span>
      </h3>

      {!isStudent && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm font-medium text-center">
            Only students can make bookings. Please login as a student.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Subject
          </label>
          <select
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            required
            disabled={!isStudent}
            className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          {categories.length > 0 ? (
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              required
              disabled={!isStudent}
              className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
              No categories available
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" /> Date
            </span>
          </label>
          <input
            type="date"
            value={formData.scheduledAt}
            onChange={(e) =>
              setFormData({ ...formData, scheduledAt: e.target.value })
            }
            min={new Date().toISOString().split("T")[0]}
            required
            disabled={!isStudent}
            className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600" /> Time Slot
            </span>
          </label>
          <select
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
            disabled={!isStudent}
            className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select a time slot</option>
            {timeSlots.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Duration (hours)
          </label>
          <select
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: parseInt(e.target.value) })
            }
            required
            disabled={!isStudent}
            className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {[1, 2, 3, 4, 5].map((hour) => (
              <option key={hour} value={hour}>
                {hour} {hour === 1 ? "hour" : "hours"}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gradient-to-br from-sky-50 to-cyan-50/50 rounded-xl p-5 border border-sky-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Hourly Rate:</span>
            <span className="font-semibold text-gray-900">৳{hourlyRate}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Duration:</span>
            <span className="font-semibold text-gray-900">
              {formData.duration} {formData.duration === 1 ? "hour" : "hours"}
            </span>
          </div>
          <div className="h-px bg-sky-200 my-3"></div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-sky-600" /> Total:
            </span>
            <span className="text-2xl font-bold text-sky-600">
              ৳{totalPrice}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={
            !isStudent || loading || !formData.categoryId || !formData.time
          }
          className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
        >
          {loading
            ? "Booking..."
            : isStudent
              ? "Confirm Booking"
              : "Student Login Required"}
        </button>
      </form>
    </div>
  );
}
