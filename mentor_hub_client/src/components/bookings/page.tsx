"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, DollarSign, Brain, Sparkles, Rocket, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

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
  discountPercentage?: number;
}

const parseTimeTo24h = (timeStr: string) => {
  try {
    const startPart = timeStr.split("-")[0].trim().toLowerCase();
    const modifier = startPart.match(/[ap]m/)?.[0];
    let time = startPart.replace(/[ap]m/, "").trim();
    let [hours, minutes] = time.includes(":") ? time.split(":") : [time, "00"];

    let h = parseInt(hours, 10);
    if (modifier === "pm" && h < 12) h += 12;
    if (modifier === "am" && h === 12) h = 0;

    return `${String(h).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  } catch (e) {
    return "12:00"; 
  }
};

const getDayName = (dateString: string) => {
  const date = new Date(dateString);
  const fullDays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const shortDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dayIndex = date.getDay();
  return { full: fullDays[dayIndex].toUpperCase(), short: shortDays[dayIndex].toUpperCase() };
};

export default function BookingForm({
  tutorId,
  tutorName,
  hourlyRate,
  subjects,
  userRole,
  userId,
  categories,
  availability = {},
  discountPercentage = 0,
}: BookingFormProps & { availability?: Record<string, string[]> }) {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [localCategories, setLocalCategories] = useState(categories);
  const [useAiApproval, setUseAiApproval] = useState(true);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    subject: subjects[0] || "",
    categoryId: categories[0]?.id || "",
    scheduledAt: "",
    time: "",
    duration: 1,
  });

  const rawTotal = Math.round(formData.duration * hourlyRate);
  const discountAmount = Math.round(rawTotal * (discountPercentage / 100));
  const totalPrice = rawTotal - discountAmount;
  const isStudent = userRole === "STUDENT";

  useEffect(() => {
    if (formData.scheduledAt) {
      const fetchBookedSlots = async () => {
        try {
          const res = await fetch(`/api/booking/booked-slots?tutorId=${tutorId}&date=${formData.scheduledAt}`);
          const result = await res.json();
          if (result.success) setBookedSlots(result.data || []);
        } catch (err) {
          console.error(err);
        }
      };
      fetchBookedSlots();
    }
  }, [formData.scheduledAt, tutorId]);

  const handleSubjectChange = async (subject: string) => {
    setFormData(prev => ({ ...prev, subject }));
    
    if (!subject || subject.length < 3) return;
    
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/suggest-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject }),
      });
      const result = await res.json();
      if (result.success && result.data) {
        const { id, name } = result.data;
        
        setLocalCategories(prev => {
           if (!prev.find(c => c.id === id)) {
              return [...prev, { id, name }];
           }
           return prev;
        });

        setFormData(prev => ({ ...prev, categoryId: id }));
        toast.success(`AI suggested: ${name}`, { icon: "🤖" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const getAvailableSlots = () => {
    if (!formData.scheduledAt) return [];
    const names = getDayName(formData.scheduledAt);
    
    // Check various key formats (Full, Short, with/without Case Sensitivity)
    const availabilityKeys = Object.keys(availability);
    const targetKey = availabilityKeys.find(key => 
       key.toUpperCase() === names.full || 
       key.toUpperCase() === names.short
    );

    const slots = targetKey ? (availability as any)[targetKey] : [];
    
    return slots.map((s: string) => ({
      label: s,
      value: s,
      isBooked: bookedSlots.includes(s)
    }));
  };

  const timeSlots = getAvailableSlots();

  const handleFinalRedirect = async (bookingId: string) => {
    try {
       const res = await fetch(`/api/booking/pay/${bookingId}`);
       const result = await res.json();
       if (result.success && result.data.url) {
          window.location.href = result.data.url;
       } else {
          window.location.href = "/dashboard/bookings";
       }
    } catch (err) {
       window.location.href = "/dashboard/bookings";
    }
  };

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
      const time24 = parseTimeTo24h(formData.time);
      const scheduledDateTime = `${formData.scheduledAt}T${time24}:00`;

      const bookingData = {
        tutorId,
        studentId: userId,
        categoryId: formData.categoryId,
        subject: formData.subject,
        scheduledAt: new Date(scheduledDateTime).toISOString(),
        time: formData.time,
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
        setLoading(false);
      } else {
        const bookingId = result.data.id || result.data._id;
        
        // Save flag for AI popup
        if (useAiApproval) {
          localStorage.setItem("showAiPopupAfterPayment", bookingId);
        }

        handleFinalRedirect(bookingId);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create booking. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-sky-100">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-2xl font-bold text-gray-900 border-none p-0 m-0">
          Book a Session with <span className="text-sky-600">{tutorName}</span>
        </h3>
        <div 
          onClick={() => setUseAiApproval(!useAiApproval)}
          className="flex flex-col items-center gap-1 cursor-pointer group"
          title="AI Speed Pass: Immediate analysis after payment"
        >
          <div className={`w-10 h-5 rounded-full p-1 transition-colors relative ${useAiApproval ? 'bg-sky-500' : 'bg-gray-200'}`}>
            <motion.div 
               animate={{ x: useAiApproval ? 20 : 0 }}
               className="size-3 bg-white rounded-full shadow-sm"
            />
          </div>
          <span className="text-[7px] font-black uppercase text-sky-600 tracking-tighter">AI Speed Pass</span>
        </div>
      </div>

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
            Subject {aiLoading && <Loader2 className="inline-block size-3 animate-spin text-sky-500 ml-1" />}
          </label>
          <select
            value={formData.subject}
            onChange={(e) => handleSubjectChange(e.target.value)}
            required
            disabled={!isStudent}
            className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select a subject</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">Category</span>
            {formData.categoryId && (
              <motion.span 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[9px] font-black uppercase tracking-widest text-sky-500 bg-sky-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-sky-100"
              >
                <Sparkles size={8} className="animate-pulse" /> AI Optimized
              </motion.span>
            )}
          </label>
          {localCategories.length > 0 ? (
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
              {localCategories.map((cat) => (
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
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600" /> Select Time Slot
            </span>
          </label>
          
          {!formData.scheduledAt ? (
             <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Please select a date first</p>
             </div>
          ) : timeSlots.length === 0 ? (
             <div className="p-4 bg-rose-50 border border-dashed border-rose-200 rounded-xl text-center">
                <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">No slots available for this day</p>
             </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {timeSlots.map((slot: any) => (
                <button
                  key={slot.value}
                  type="button"
                  disabled={slot.isBooked || !isStudent}
                  onClick={() => setFormData({ ...formData, time: slot.value })}
                  className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tight border transition-all ${
                    formData.time === slot.value
                      ? "bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-500/20 scale-[0.98]"
                      : "bg-white text-slate-600 border-slate-100 hover:border-sky-300 hover:bg-sky-50/50"
                  } ${slot.isBooked ? "opacity-20 grayscale cursor-not-allowed" : ""}`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          )}
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
            <span className="text-gray-600">Standard Hourly Rate:</span>
            <span className="font-semibold text-gray-500 line-through">
              ৳{hourlyRate}
            </span>
          </div>
          {discountPercentage > 0 && (
            <div className="flex flex-col gap-1 mb-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-1 opacity-20">
                <Brain className="w-12 h-12 text-emerald-300 -mr-4 -mt-4 rotate-12" />
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span className="text-emerald-700 font-black text-[10px] uppercase tracking-widest">AI Verified Membership</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-emerald-600 font-bold text-sm">AI Savings:</span>
                <span className="text-emerald-700 font-black text-lg">-৳{discountAmount.toFixed(0)}</span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 font-medium">Your Exclusive Rate:</span>
            <span className="font-bold text-sky-600 bg-sky-100/50 px-2 py-0.5 rounded-lg border border-sky-200">
              ৳{(hourlyRate * (1 - discountPercentage / 100)).toFixed(0)}
            </span>
          </div>
          <div className="h-px bg-sky-200 my-4"></div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-sky-600" /> Final Total:
            </span>
            <div className="text-right">
              <span className="text-3xl font-black text-sky-600 tracking-tighter">
                ৳{totalPrice.toFixed(0)}
              </span>
            </div>
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
              ? useAiApproval ? "Book with AI Auto-Confirm" : "Confirm Booking"
              : "Student Login Required"}
        </button>
      </form>
    </div>
  );
}
