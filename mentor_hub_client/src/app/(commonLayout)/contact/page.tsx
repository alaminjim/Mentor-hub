"use client";
import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import toast from "react-hot-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim() || !formData.email.trim()) {
      toast.error("Please fill in your email and message properly.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success(
          "Message sent successfully! We will get back to you soon.",
        );
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
      } else {
        toast.error(data.message || "Failed to send message.");
      }
    } catch (error) {
      toast.error("A network error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50/50 to-cyan-50/30 pt-40 md:pt-48 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Contact Us
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Have questions about finding a tutor, becoming a mentor, or
            enterprise solutions? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-cyan-100/50 border border-cyan-100">
          {/* Contact Info */}
          <div className="space-y-10">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                Get in touch
              </h3>
              <p className="text-slate-500 mb-8">
                Fill out the form and our team will get back to you within 24
                hours.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-slate-600">
                <div className="size-12 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
                  <Mail className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Email</p>
                  <p className="text-sm font-medium">jimalamin7@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-600">
                <div className="size-12 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
                  <Phone className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Phone</p>
                  <p className="text-sm font-medium">01705026628</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-600">
                <div className="size-12 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Office</p>
                  <p className="text-sm font-medium">
                    123 Tech Campus, Rajshahi,Bogura
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-cyan-50/30 p-8 rounded-2xl border border-cyan-100/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                  First Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium text-slate-800"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                  Last Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium text-slate-800"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                Email Address
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium text-slate-800"
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                Message
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium text-slate-800 resize-none"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              {!isSubmitting && (
                <Send className="size-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
