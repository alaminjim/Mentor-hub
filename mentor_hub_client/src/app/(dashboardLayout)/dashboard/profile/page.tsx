"use client";

import { useEffect, useState } from "react";
import {
  User, Mail, Phone, Shield, Calendar, Edit3, Save, Camera, FileText, Loader2, X, CheckCircle, Activity, Globe
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { dashboardService } from "@/components/service/dashboard.service";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", bio: "", phone: "", image: "" });

  useEffect(() => {
    authClient.getSession().then((res) => {
      if (res?.data?.user) {
        const u = res.data.user;
        setUser(u);
        setFormData({ name: u.name || "", bio: (u as any).bio || "", phone: (u as any).phone || "", image: u.image || "" });
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await dashboardService.updateProfile(formData);
    if (res?.success) {
      toast.success("Profile updated successfully!");
      setUser({ ...user, ...formData });
      setIsEditing(false);
    } else {
      toast.error(res?.message || "Update failed.");
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setFormData({ name: user?.name || "", bio: user?.bio || "", phone: user?.phone || "", image: user?.image || "" });
    setIsEditing(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Loading Profile...</p>
    </div>
  );

  if (!user) return null;

  const roleBadgeColor: Record<string, string> = {
    ADMIN: "bg-red-500/10 text-red-600 border-red-500/20",
    STUDENT: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    TUTOR: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    MANAGER: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    VENDOR: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    ORGANIZER: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 relative">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-[2rem] bg-card border border-border relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 blur-3xl rounded-full -mt-40 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tighter mb-2">My <span className="text-primary">Profile.</span></h1>
          <p className="text-muted-foreground text-sm font-medium">Manage your personal information and platform identity.</p>
        </div>
        {!isEditing && (
           <button onClick={() => setIsEditing(true)} className="relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20">
             <Edit3 className="size-4" /> Edit Details
           </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar: Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card rounded-[2rem] border border-border overflow-hidden relative">
             {/* Cover Background */}
             <div className="h-32 bg-gradient-to-br from-primary/30 to-primary/5 w-full relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mixt-blend-overlay" />
             </div>
             
             {/* Avatar Profile */}
             <div className="px-8 pb-8 relative flex flex-col items-center text-center">
                <div className="relative -mt-16 mb-4 group">
                   <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-card shadow-2xl bg-muted shrink-0 mx-auto">
                     {formData.image ? (
                       <img src={formData.image} alt="avatar" className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full bg-primary flex items-center justify-center text-5xl font-black text-primary-foreground uppercase">
                         {user.name?.[0] || "U"}
                       </div>
                     )}
                   </div>
                   {isEditing && (
                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl backdrop-blur-sm cursor-pointer">
                       <Camera className="size-8 text-white" />
                     </div>
                   )}
                </div>
                
                <h2 className="text-2xl font-black tracking-tighter leading-tight">{user.name}</h2>
                <p className="text-sm text-primary font-bold mt-1">{user.email}</p>
                
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                   <span className={cn("text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border", roleBadgeColor[user.role] || "bg-muted text-muted-foreground border-border")}>
                     {user.role}
                   </span>
                   <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1.5">
                     <CheckCircle className="size-3" /> {user.status || "Active"}
                   </span>
                </div>
             </div>
          </div>

          {/* Quick Stats / Info Widget */}
          <div className="bg-card rounded-[2rem] border border-border p-8 space-y-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />
             <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Account Status</h3>
             
             <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                         <Calendar className="size-5" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Joined At</p>
                         <p className="text-sm font-bold text-foreground">
                            {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" })}
                         </p>
                      </div>
                   </div>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                         <Globe className="size-5" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</p>
                         <p className="text-sm font-bold text-foreground">Global Identity</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Area: Form & Details */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-card rounded-[2rem] border border-border p-8 relative overflow-hidden">
               <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 blur-3xl rounded-full -mt-40 pointer-events-none" />
               <div className="flex items-center gap-4 mb-8 relative z-10 border-b border-border pb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                     <User className="size-6" />
                  </div>
                  <div>
                     <h2 className="text-xl font-black tracking-tighter">Personal Information</h2>
                     <p className="text-xs font-semibold text-muted-foreground">Update your details to keep your profile fresh.</p>
                  </div>
               </div>

               <div className="space-y-6 relative z-10">
                  <div className="grid md:grid-cols-2 gap-6">
                     {/* Full Name */}
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground flex items-center gap-2">
                           First & Last Name <span className="text-destructive">*</span>
                        </label>
                        {isEditing ? (
                           <input
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full h-12 bg-background border border-border rounded-xl px-4 text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                           />
                        ) : (
                           <div className="w-full h-12 bg-muted/40 border border-border rounded-xl px-4 flex items-center text-sm font-semibold text-foreground">
                              {user.name || "—"}
                           </div>
                        )}
                     </div>

                     {/* Email */}
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground flex items-center gap-2">
                           Email Address
                        </label>
                        <div className="relative">
                           <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                           <div className="w-full h-12 bg-muted/40 border border-border rounded-xl pl-11 pr-4 flex items-center justify-between text-sm font-semibold text-muted-foreground shadow-sm cursor-not-allowed">
                              {user.email}
                              <span title="Email cannot be changed">
                                <Shield className="size-3 text-muted-foreground/50" />
                              </span>
                           </div>
                        </div>
                     </div>

                     {/* Phone */}
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground flex items-center gap-2">
                           Phone Number
                        </label>
                        {isEditing ? (
                           <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10" />
                              <input
                                 value={formData.phone}
                                 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                 placeholder="+1 (555) 000-0000"
                                 className="w-full h-12 bg-background border border-border rounded-xl pl-11 pr-4 text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                              />
                           </div>
                        ) : (
                           <div className="w-full h-12 bg-muted/40 border border-border rounded-xl px-4 flex items-center gap-3 text-sm font-semibold text-foreground">
                              <Phone className="size-4 text-muted-foreground" /> {user.phone || "Not provided"}
                           </div>
                        )}
                     </div>

                     {/* Image URL */}
                     {isEditing && (
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-foreground flex items-center gap-2">
                              Avatar URL
                           </label>
                           <input
                              value={formData.image}
                              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                              placeholder="https://..."
                              className="w-full h-12 bg-background border border-border rounded-xl px-4 text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                           />
                        </div>
                     )}
                  </div>

                  {/* Bio */}
                  <div className="space-y-2 pt-4">
                     <label className="text-xs font-bold text-foreground flex items-center gap-2">
                        Biography <span className="text-muted-foreground font-normal ml-1">(Optional)</span>
                     </label>
                     {isEditing ? (
                        <textarea
                           rows={5}
                           value={formData.bio}
                           onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                           placeholder="Write something about your background, skills, and interests..."
                           className="w-full bg-background border border-border rounded-xl p-4 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-sm leading-relaxed"
                        />
                     ) : (
                        <div className="w-full min-h-[120px] bg-muted/40 border border-border rounded-xl p-6 text-sm font-medium text-muted-foreground leading-relaxed">
                           {user.bio || "No biography provided. Click Edit Profile to add one."}
                        </div>
                     )}
                  </div>
               </div>

               {/* Action Buttons */}
               {isEditing && (
                  <div className="mt-8 pt-6 border-t border-border flex items-center justify-end gap-3 relative z-10">
                     <button onClick={handleCancel} className="px-6 py-3 rounded-xl border border-border text-xs font-black uppercase tracking-widest hover:bg-muted transition-colors">
                        Cancel Sync
                     </button>
                     <button onClick={handleSave} disabled={saving} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 shadow-xl shadow-primary/20">
                        {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                        Save Changes
                     </button>
                  </div>
               )}
           </div>
        </div>
      </div>
    </div>
  );
}
