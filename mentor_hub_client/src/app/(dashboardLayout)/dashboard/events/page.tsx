"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Users, Plus, Video, Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

// Use native fetch to hit backend endpoints cleanly
export default function ManageEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", location: "", date: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/dashboard/organizer/events").then(r => r.json());
      if (res?.success) setEvents(res.data);
    } catch (err) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location || "Online",
        date: new Date(formData.date).toISOString()
      };
      const res = await fetch("/api/dashboard/organizer/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (res?.success) {
        toast.success("Event created successfully!");
        setIsModalOpen(false);
        setFormData({ title: "", description: "", location: "", date: "" });
        fetchEvents();
      } else toast.error(res.message || "Action failed");
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/dashboard/organizer/events/${id}`, { method: "DELETE" }).then(r => r.json());
      if (res?.success) {
        toast.success("Event deleted");
        setEvents(events.filter(e => e.id !== id));
      } else toast.error("Could not delete");
    } catch (err) {
      toast.error("Error deleting event");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Loading Events...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-12 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-[2rem] bg-card border border-border relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 blur-3xl rounded-full -mt-40 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tighter mb-2">organizer. <span className="text-primary">events.</span></h1>
          <p className="text-muted-foreground text-sm font-medium">manage workshops, meetings and learning events dynamically.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20"
        >
          <Plus className="size-4" /> create event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="p-6 rounded-3xl bg-card border border-border hover:border-primary/40 transition-all group flex flex-col">
            <div className="flex items-start justify-between mb-6">
               <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                 <Video className="size-6 text-primary" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border bg-muted text-muted-foreground border-border">
                 {event.status}
               </span>
            </div>
            
            <h3 className="text-xl font-black tracking-tight mb-2 line-clamp-2 leading-tight">{event.title}</h3>
            <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{event.description}</p>
            
            <div className="mt-auto space-y-3 pt-6 border-t border-border">
               <div className="flex items-center gap-3 text-xs text-foreground font-semibold">
                  <Calendar className="size-4 text-primary" />
                  {new Date(event.date).toLocaleDateString()}
               </div>
               <div className="flex items-center gap-3 text-xs text-foreground font-semibold">
                  <MapPin className="size-4 text-primary" />
                  {event.location}
               </div>
               
               <div className="flex justify-end pt-4">
                  <button 
                     onClick={() => handleDelete(event.id)}
                     disabled={deletingId === event.id}
                     className="p-2 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
                  >
                     {deletingId === event.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                  </button>
               </div>
            </div>
          </div>
        ))}
        {events.length === 0 && (
           <div className="col-span-full py-20 text-center flex flex-col items-center border border-dashed border-border rounded-3xl">
              <Calendar className="size-12 text-muted-foreground mb-4 opacity-20" />
              <p className="text-lg font-black tracking-tighter">No events scheduled.</p>
              <p className="text-sm text-muted-foreground">Click the "Create Event" button to add a new workshop or seminar.</p>
           </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black tracking-tighter mb-6">Create <span className="text-primary">Event.</span></h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Event Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full h-24 bg-background border border-border rounded-xl p-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Location / Link</label>
                <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Zoom link or Physical Location" className="w-full h-12 bg-background border border-border rounded-xl px-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Date & Time</label>
                <input required type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-12 rounded-xl border border-border text-xs font-black uppercase tracking-widest hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Publish Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
