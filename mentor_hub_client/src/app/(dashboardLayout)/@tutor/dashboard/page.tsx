"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { tutorService } from "@/components/service/tutor.service";
import { Loader2, Plus, Trash2, Sparkles, Zap, Shield, Globe, Star } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(2, "name is too short"),
  email: z.string().email("invalid email perspective"),
  phone: z.string().min(10, "phone number required"),
  bio: z.string().min(10, "bio needs more substance"),
  subjects: z.string().min(1, "define your expertise"),
  experience: z.number().min(0, "experience must be positive"),
  hourlyRate: z.string().min(1, "define your value"),
});

type AvailabilitySlot = {
  day: string;
  timeSlot: string;
};

export default function CreateTutorProfileForm() {
  const router = useRouter();
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([{ day: "", timeSlot: "" }]);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      bio: "",
      subjects: "",
      experience: 0,
      hourlyRate: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("crystallizing your profile...");
      try {
        const validSlots = availabilitySlots.filter(s => s.day && s.timeSlot);
        if (validSlots.length === 0) {
          toast.error("at least one availability slot is required", { id: toastId });
          return;
        }

        const subjectsArray = value.subjects.split(",").map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
        const availability: Record<string, string[]> = {};
        validSlots.forEach(slot => {
          const dayKey = slot.day.toLowerCase();
          if (!availability[dayKey]) availability[dayKey] = [];
          availability[dayKey].push(slot.timeSlot);
        });

        const rate = parseFloat(value.hourlyRate);
        const profilePayload = {
          ...value,
          subjects: subjectsArray,
          price: rate,
          hourlyRate: rate,
          availability,
        };

        const response = await tutorService.createTutorProfile(profilePayload);

        if (response.success) {
          toast.success("profile established successfully.", { id: toastId });
          router.push("/dashboard/tutor");
          router.refresh();
        } else {
          toast.error(response.error || "failed to establish profile", { id: toastId });
        }
      } catch (error: any) {
        toast.error("an error occurred in the workspace.", { id: toastId });
      }
    },
  });

  const addSlot = () => setAvailabilitySlots([...availabilitySlots, { day: "", timeSlot: "" }]);
  const removeSlot = (i: number) => availabilitySlots.length > 1 && setAvailabilitySlots(availabilitySlots.filter((_, idx) => idx !== i));
  const updateSlot = (i: number, f: "day" | "timeSlot", v: string) => {
    const updated = [...availabilitySlots];
    updated[i][f] = v;
    setAvailabilitySlots(updated);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-16">
        <h1 className="text-6xl font-black tracking-tighter lowercase mb-4">
          establish. <br />
          <span className="text-gradient">expertise.</span>
        </h1>
        <p className="text-xl text-neutral-400 font-medium lowercase">define your presence within the global mentorship network.</p>
      </div>

      <div className="glass border border-white/5 rounded-[3rem] p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
           <Globe className="size-32" />
        </div>

        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="relative z-10">
          <FieldGroup className="space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <form.Field name="name" children={(field) => (
                 <Field>
                   <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">full name.</FieldLabel>
                   <Input 
                    value={field.state.value} 
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. marcus vance"
                    className="bg-white/5 border-white/10 h-14 px-6 rounded-2xl focus:ring-primary/20"
                   />
                   <FieldError errors={field.state.meta.errors} />
                 </Field>
               )} />

               <form.Field name="email" children={(field) => (
                 <Field>
                   <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">professional email.</FieldLabel>
                   <Input 
                    type="email"
                    value={field.state.value} 
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="name@workspace.com"
                    className="bg-white/5 border-white/10 h-14 px-6 rounded-2xl focus:ring-primary/20"
                   />
                   <FieldError errors={field.state.meta.errors} />
                 </Field>
               )} />
            </div>

            <form.Field name="bio" children={(field) => (
               <Field>
                 <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">professional philosophy (bio).</FieldLabel>
                 <textarea 
                  value={field.state.value} 
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="describe your impact and mentorship style..."
                  className="w-full bg-white/5 border border-white/10 min-h-[150px] p-6 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
                 />
                 <FieldError errors={field.state.meta.errors} />
               </Field>
            )} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <form.Field name="subjects" children={(field) => (
                 <Field>
                   <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">expertise domains (comma separated).</FieldLabel>
                   <Input 
                    value={field.state.value} 
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. algorithms, architecture, rust"
                    className="bg-white/5 border-white/10 h-14 px-6 rounded-2xl focus:ring-primary/20"
                   />
                   <FieldError errors={field.state.meta.errors} />
                 </Field>
               )} />

               <form.Field name="hourlyRate" children={(field) => (
                 <Field>
                   <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">hourly rate (valution).</FieldLabel>
                   <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-primary">$</span>
                      <Input 
                        value={field.state.value} 
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="95"
                        className="bg-white/5 border-white/10 h-14 pl-12 pr-6 rounded-2xl focus:ring-primary/20"
                      />
                   </div>
                   <FieldError errors={field.state.meta.errors} />
                 </Field>
               )} />
            </div>

            {/* Availability Management */}
            <div className="pt-8 border-t border-white/5">
               <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black tracking-tighter lowercase">availability windows.</h3>
                    <p className="text-xs text-neutral-500 lowercase mt-1">define when you are accessible for sessions.</p>
                  </div>
                  <Button type="button" onClick={addSlot} className="bg-primary/10 text-primary border border-primary/20 rounded-full hover:bg-primary hover:text-white transition-all">
                    <Plus className="size-4 mr-2" /> add slot
                  </Button>
               </div>

               <div className="space-y-4">
                  {availabilitySlots.map((slot, i) => (
                    <div key={i} className="flex gap-4 items-center animate-in fade-in slide-in-from-top-2">
                       <select 
                        value={slot.day} 
                        onChange={(e) => updateSlot(i, "day", e.target.value)}
                        className="flex-1 bg-white/5 border-white/10 h-14 px-6 rounded-2xl text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20"
                       >
                         <option value="">day</option>
                         {["sat", "sun", "mon", "tue", "wed", "thu", "fri"].map(d => (
                           <option key={d} value={d}>{d}</option>
                         ))}
                       </select>
                       <Input 
                         value={slot.timeSlot} 
                        onChange={(e) => updateSlot(i, "timeSlot", e.target.value)}
                        placeholder="e.g. 09:00 - 12:00"
                        className="flex-1 bg-white/5 border-white/10 h-14 px-6 rounded-2xl"
                       />
                       <button 
                        type="button" 
                        onClick={() => removeSlot(i)}
                        className="size-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-20"
                        disabled={availabilitySlots.length === 1}
                       >
                         <Trash2 className="size-5" />
                       </button>
                    </div>
                  ))}
               </div>
            </div>

            <div className="pt-12 flex items-center gap-6">
               <form.Subscribe selector={(s) => ({ isSubmitting: s.isSubmitting })}>
                 {({ isSubmitting }) => (
                    <>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="btn-premium flex-1 h-14 rounded-2xl text-xs font-black uppercase tracking-[0.2em]"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "crystallize profile"}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => router.back()}
                        className="px-12 h-14 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                      >
                        cancel
                      </button>
                    </>
                 )}
               </form.Subscribe>
            </div>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
