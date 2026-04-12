"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { tutorService } from "@/components/service/tutor.service";
import { Loader2, Plus, Trash2, Sparkles, Zap, Shield, Globe, Star, Quote, Camera, UploadCloud } from "lucide-react";
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

import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2, "name is too short"),
  email: z.string().email("invalid email perspective"),
  phone: z.string().min(10, "phone number required"),
  bio: z.string().min(10, "bio needs more substance"),
  subjects: z.string().min(1, "define your expertise"),
  experience: z.number().min(0, "experience must be positive"),
  hourlyRate: z.string().min(1, "define your value"),
  image: z.string(),
});

type AvailabilitySlot = {
  day: string;
  timeSlot: string;
};

export default function CreateTutorProfileForm() {
  const router = useRouter();
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([{ day: "", timeSlot: "" }]);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useState<HTMLInputElement | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      bio: "",
      subjects: "",
      experience: 0,
      hourlyRate: "",
      image: "",
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

        const response = profileId 
          ? await tutorService.updateOwnProfile(profileId, profilePayload)
          : await tutorService.createTutorProfile(profilePayload);

        if (response.success) {
          toast.success(profileId ? "Profile updated." : "Profile established.", { id: toastId });
          router.push("/dashboard");
          router.refresh();
        } else {
          toast.error(response.error || "failed to save profile", { id: toastId });
        }
      } catch (error: any) {
        toast.error("an error occurred in the workspace.", { id: toastId });
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      // In a real app, we would upload to ImgBB here and set the resulting URL.
      // For now, we use the local blob URL for preview and form data consistency.
      form.setFieldValue('image', preview); 
    }
  };

  const addSlot = () => setAvailabilitySlots([...availabilitySlots, { day: "", timeSlot: "" }]);
  const removeSlot = (i: number) => availabilitySlots.length > 1 && setAvailabilitySlots(availabilitySlots.filter((_, idx) => idx !== i));
  const updateSlot = (i: number, f: "day" | "timeSlot", v: string) => {
    const updated = [...availabilitySlots];
    updated[i][f] = v;
    setAvailabilitySlots(updated);
  };

  useEffect(() => {
    const init = async () => {
      // 1. Get Session for defaults
      const session = await authClient.getSession();
      if (session?.data?.user) {
        const u = session.data.user;
        form.setFieldValue('name', u.name);
        form.setFieldValue('email', u.email);
        form.setFieldValue('image', u.image || "");
        if (u.image) setImagePreview(u.image);
      }

      // 2. Get existing profile if any
      const existing = await tutorService.getOwnProfile();
      if (existing?.data) {
        const p = existing.data;
        setProfileId(p.id);
        form.setFieldValue('name', p.name);
        form.setFieldValue('email', p.email || "");
        form.setFieldValue('phone', p.phone || "");
        form.setFieldValue('bio', p.bio || "");
        form.setFieldValue('subjects', p.subjects.join(", "));
        form.setFieldValue('experience', p.experience);
        form.setFieldValue('hourlyRate', (p.hourlyRate || p.price || 0).toString());
        form.setFieldValue('image', p.user?.image || p.email || "");
        if (p.user?.image) setImagePreview(p.user.image);

        if (p.availability) {
          const slots: AvailabilitySlot[] = [];
          Object.entries(p.availability).forEach(([day, times]) => {
            (times as string[]).forEach(t => slots.push({ day, timeSlot: t }));
          });
          if (slots.length > 0) setAvailabilitySlots(slots);
        }
      }
    };
    init();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-tight uppercase mb-4 text-slate-900 dark:text-white leading-none">
          {profileId ? "Sync Profile" : "Create Profile"} <br />
          <span className="text-primary italic">Workspace</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest">
           {profileId ? "Maintain your presence within the global network." : "Launch your career as a professional mentor."}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="relative z-10">
          <FieldGroup className="space-y-12">
            
            {/* ── Identity Section ────────────────────────────────────── */}
            <div className="space-y-8">
               <div className="flex items-center gap-3">
                  <div className="h-1.5 w-6 bg-primary rounded-full" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Identity Details</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <form.Field name="name" children={(field) => (
                    <Field>
                      <FieldLabel className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3 block">Full Legal Name</FieldLabel>
                      <Input 
                        value={field.state.value} 
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g. S. M. Rahat"
                        className="bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 h-14 px-6 rounded-2xl focus:ring-4 focus:ring-primary/10 text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-300 transition-all"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )} />

                  <form.Field name="email" children={(field) => (
                    <Field>
                      <FieldLabel className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3 block">Professional Email</FieldLabel>
                      <Input 
                        type="email"
                        value={field.state.value} 
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="rahat@work.com"
                        className="bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 h-14 px-6 rounded-2xl focus:ring-4 focus:ring-primary/10 text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-300 transition-all opacity-70"
                        readOnly
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )} />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <form.Field name="phone" children={(field) => (
                    <Field>
                      <FieldLabel className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3 block">Primary Phone</FieldLabel>
                      <Input 
                        value={field.state.value} 
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g. +880 1712 345678"
                        className="bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 h-14 px-6 rounded-2xl focus:ring-4 focus:ring-primary/10 text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-300 transition-all"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )} />

                  <form.Field name="image" children={(field) => (
                    <Field>
                      <FieldLabel className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3 block">Profile Media (Portrait)</FieldLabel>
                      <div className="flex items-center gap-6">
                         <div className="relative group">
                            <div className="size-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-inner">
                               {imagePreview ? (
                                  <img src={imagePreview} alt="Preview" className="size-full object-cover" />
                               ) : (
                                  <Camera className="size-8 text-slate-300" />
                               )}
                            </div>
                            <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                               <UploadCloud className="size-6 text-white" />
                               <input 
                                 type="file" 
                                 accept="image/*" 
                                 onChange={handleFileChange}
                                 className="hidden" 
                               />
                            </label>
                         </div>
                         <div className="flex-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Upload a professional portrait shot.</p>
                            <p className="text-[9px] font-medium text-slate-500">Supports JPG, PNG (Max 5MB)</p>
                         </div>
                      </div>
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )} />
               </div>
            </div>

            {/* ── Expertise Section ───────────────────────────────────── */}
            <div className="space-y-8">
               <div className="flex items-center gap-3">
                  <div className="h-1.5 w-6 bg-primary rounded-full" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Professional Value</h3>
               </div>

               <form.Field name="bio" children={(field) => (
                  <Field>
                    <FieldLabel className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3 block">Tutor Biography</FieldLabel>
                    <textarea 
                      value={field.state.value} 
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="I am a Senior Software Engineer with 5+ years of experience in React & Node.js. I love mentoring..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 min-h-[140px] p-6 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-primary/10 text-base font-medium transition-all text-slate-900 dark:text-white placeholder:text-slate-300 leading-relaxed"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
               )} />

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <form.Field name="subjects" children={(field) => (
                    <Field>
                      <FieldLabel className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3 block">Expertise Areas</FieldLabel>
                      <Input 
                        value={field.state.value} 
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g. Next.js, Prisma, SQL"
                        className="bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 h-14 px-6 rounded-2xl focus:ring-4 focus:ring-primary/10 text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-300 transition-all"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )} />

                  <form.Field name="hourlyRate" children={(field) => (
                    <Field>
                      <FieldLabel className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3 block">Hourly Rate ($)</FieldLabel>
                      <div className="relative">
                         <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-xl text-primary">$</span>
                         <Input 
                           value={field.state.value} 
                           onChange={(e) => field.handleChange(e.target.value)}
                           placeholder="120"
                           className="bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 h-14 pl-12 pr-6 rounded-2xl focus:ring-4 focus:ring-primary/10 text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-300 transition-all"
                         />
                      </div>
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )} />
               </div>
            </div>

            {/* ── Availability Management ─────────────────────────────── */}
            <div className="space-y-8 pt-12 border-t-2 border-slate-50 dark:border-slate-800">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="h-1.5 w-6 bg-emerald-500 rounded-full" />
                     <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Available Slots</h3>
                  </div>
                  <Button type="button" onClick={addSlot} className="bg-primary text-white h-10 px-6 rounded-full font-black uppercase tracking-widest text-[9px] hover:scale-105 transition-all shadow-lg shadow-primary/20">
                    <Plus className="size-4 mr-2" /> Add Slot
                  </Button>
               </div>

               <div className="space-y-6">
                  {availabilitySlots.map((slot, i) => (
                    <div key={i} className="flex flex-col gap-5 p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-4">
                       <div className="flex flex-col sm:flex-row gap-4 items-center">
                          <select 
                            value={slot.day} 
                            onChange={(e) => updateSlot(i, "day", e.target.value)}
                            className="w-full sm:w-1/3 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 h-12 px-5 rounded-xl text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-primary/10 text-slate-900 dark:text-white"
                          >
                            <option value="">Day</option>
                            {["sat", "sun", "mon", "tue", "wed", "thu", "fri"].map(d => (
                              <option key={d} value={d}>{d.toUpperCase()}</option>
                            ))}
                          </select>
                          <Input 
                            value={slot.timeSlot} 
                            onChange={(e) => updateSlot(i, "timeSlot", e.target.value)}
                            placeholder="e.g. 10am-12pm"
                            className="flex-1 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 h-12 px-6 rounded-xl text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-300"
                          />
                          <button 
                            type="button" 
                            onClick={() => removeSlot(i)}
                            className="size-12 rounded-xl bg-rose-500/10 border-2 border-rose-500/20 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-20"
                            disabled={availabilitySlots.length === 1}
                          >
                            <Trash2 className="size-5" />
                          </button>
                       </div>
                       
                       <div className="flex flex-wrap gap-2">
                          {[
                             "8am-10am", "10am-12pm", "12pm-2pm", "2pm-4pm", "4pm-6pm", "6pm-8pm", "8pm-10pm", "10pm-11pm"
                          ].map((suggestion) => (
                             <button
                                key={suggestion}
                                type="button"
                                onClick={() => updateSlot(i, "timeSlot", suggestion)}
                                className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-2 border-slate-100 dark:border-slate-800 hover:border-primary hover:text-primary transition-all active:scale-90"
                             >
                                {suggestion}
                             </button>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="pt-12 flex flex-col sm:flex-row items-center gap-4">
               <form.Subscribe selector={(s) => ({ isSubmitting: s.isSubmitting })}>
                 {({ isSubmitting }) => (
                    <>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full sm:flex-1 h-14 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : (
                           <>
                             {profileId ? "Sync Profile" : "Launch Profile"} 
                             <Sparkles className="size-5" />
                           </>
                        )}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => router.back()}
                        className="w-full sm:w-auto px-10 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-xs font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-slate-900 dark:text-white"
                      >
                        Abort
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
