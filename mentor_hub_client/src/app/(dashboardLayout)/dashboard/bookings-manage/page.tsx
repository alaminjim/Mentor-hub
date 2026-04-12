"use client";

import { useEffect, useState } from "react";
import { BookOpen, Search, Loader2, CheckCircle2, Clock, Ban } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function ManageBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/dashboard/organizer/bookings").then(r => r.json());
      if (res?.success) setBookings(res.data);
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/dashboard/organizer/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      }).then(r => r.json());

      if (res?.success) {
        toast.success(`Booking marked as ${status}`);
        setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
      } else toast.error("Failed to update status");
    } catch (err) {
      toast.error("Error updating booking");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Loading Booking Data...</p>
    </div>
  );

  const filtered = bookings.filter(b => 
    b.student?.name.toLowerCase().includes(search.toLowerCase()) || 
    b.tutor?.name.toLowerCase().includes(search.toLowerCase()) ||
    b.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="p-8 rounded-[2rem] bg-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 blur-3xl rounded-full -mt-40 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tighter mb-2">Platform <span className="text-primary">Bookings.</span></h1>
          <p className="text-muted-foreground text-sm font-medium">Oversee global student-tutor sessions and manage disputes.</p>
        </div>
        <div className="relative z-10 p-4 rounded-2xl bg-muted/50 border border-border text-center min-w-[120px]">
          <p className="text-3xl font-black text-foreground mb-1">{bookings.length}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Total Sessions</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-[2rem] overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30">
           <div>
              <h2 className="text-lg font-black tracking-tighter">Session Logs</h2>
           </div>
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Search student or tutor..."
                 className="w-full sm:w-72 h-12 pl-11 pr-4 rounded-xl bg-background border border-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Session Details</th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Student</th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tutor</th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="text-right py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((b) => (
                <tr key={b.id} className="transition-colors hover:bg-muted/30">
                  <td className="py-5 px-6">
                    <p className="font-black text-sm tracking-tight">{b.subject || "General Mentorship"}</p>
                    <p className="text-xs text-muted-foreground font-semibold mt-1">
                       {new Date(b.scheduledAt).toLocaleDateString()} at {b.time}
                    </p>
                  </td>
                  <td className="py-5 px-6">
                    <p className="font-bold text-sm">{b.student?.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{b.student?.email}</p>
                  </td>
                  <td className="py-5 px-6">
                    <p className="font-bold text-sm">{b.tutor?.name}</p>
                    <p className="text-[10px] text-primary uppercase">{b.tutor?.user?.email}</p>
                  </td>
                  <td className="py-5 px-6">
                    <span className={cn(
                       "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                       b.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                       b.status === "CANCELLED" ? "bg-destructive/10 text-destructive border-destructive/20" :
                       "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    )}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {b.status !== "COMPLETED" && (
                          <button 
                             onClick={() => handleUpdateStatus(b.id, "COMPLETED")}
                             disabled={actionLoading === b.id}
                             className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 rounded-xl transition-colors border border-emerald-500/20"
                             title="Mark Completed"
                          >
                             {actionLoading === b.id ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                          </button>
                       )}
                       {b.status !== "CANCELLED" && (
                          <button 
                             onClick={() => handleUpdateStatus(b.id, "CANCELLED")}
                             disabled={actionLoading === b.id}
                             className="p-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-xl transition-colors border border-destructive/20"
                             title="Cancel Booking"
                          >
                             {actionLoading === b.id ? <Loader2 className="size-4 animate-spin" /> : <Ban className="size-4" />}
                          </button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filtered.length === 0 && (
                 <tr>
                    <td colSpan={5} className="py-16 text-center">
                       <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mx-auto mb-4">
                          <BookOpen className="size-8 text-muted-foreground opacity-40" />
                       </div>
                       <p className="text-sm font-bold">No bookings found</p>
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
