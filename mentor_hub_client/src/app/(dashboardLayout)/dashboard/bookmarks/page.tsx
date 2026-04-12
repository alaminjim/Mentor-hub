"use client";

import { useEffect, useState } from "react";
import { 
  Bookmark, Loader2, User, Package, Calendar, 
  Search, ArrowRight, Star, Heart, Trash2,
  Users, ShoppingBag, Globe, Zap
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

import { useSearchParams } from "next/navigation";

export default function BookmarksPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "tutors" | "products") || "tutors";
  
  const [data, setData] = useState<{ tutors: any[], products: any[] }>({ tutors: [], products: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"tutors" | "products">(initialTab);
  const [search, setSearch] = useState("");

  const fetchBookmarks = async () => {
    try {
      const res = await fetch("/api/dashboard/student/bookmarks").then(r => r.json());
      if (res?.success) setData(res.data);
    } catch (err) {
      toast.error("Failed to sync library");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const removeBookmark = async (id: string, type: "tutor" | "product") => {
    const toastId = toast.loading("Removing...");
    try {
      // Logic for removal based on type
      const endpoint = type === "product" ? "/api/dashboard/products/bookmark" : "/api/bookmark/toggle";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(type === "product" ? { productId: id } : { tutorId: id })
      }).then(r => r.json());

      if (res.success) {
        toast.success("Interest withdrawn", { id: toastId });
        fetchBookmarks();
      }
    } catch (err) {
      toast.error("Bridge error", { id: toastId });
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="size-16 rounded-[2rem] bg-primary/10 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 animate-pulse" />
        <Loader2 className="size-8 animate-spin text-primary relative z-10" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Syncing Library...</p>
    </div>
  );

  const filteredTutors = data.tutors.filter(b => 
    b.tutor.user.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProducts = data.products.filter(b => 
    b.product.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Dynamic Header */}
      <div className="p-10 rounded-[3rem] bg-card border border-border relative overflow-hidden group shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-3xl rounded-full -mr-40 -mt-40 transition-all group-hover:bg-primary/10" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Heart className="size-4 fill-current" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Personal Interests</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic">My <span className="text-primary underline decoration-primary/20">Saved.</span></h1>
              <p className="text-muted-foreground text-sm font-medium max-w-lg leading-relaxed">
                A curated vault containing your preferred experts and digital toolsets.
              </p>
           </div>

           <div className="flex bg-muted p-1.5 rounded-2.5xl border border-border">
              <button 
                onClick={() => setActiveTab("tutors")}
                className={cn(
                  "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === "tutors" ? "bg-white text-primary shadow-xl" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Tutors ({data.tutors.length})
              </button>
              <button 
                onClick={() => setActiveTab("products")}
                className={cn(
                  "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === "products" ? "bg-white text-primary shadow-xl" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Products ({data.products.length})
              </button>
           </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-4">
         <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full h-14 pl-14 pr-4 rounded-3xl bg-card border border-border text-sm font-bold focus:ring-4 focus:ring-primary/5 transition-all outline-none"
            />
         </div>
      </div>

      {activeTab === "tutors" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
           {filteredTutors.map((b) => (
             <div key={b.id} className="group bg-card border border-border rounded-[3rem] p-8 space-y-8 relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Users className="size-32" />
                </div>
                
                <div className="flex items-center gap-6">
                   <div className="size-20 rounded-[2rem] bg-muted border border-border overflow-hidden p-1 shadow-inner relative active:scale-95 transition-transform">
                      {b.tutor.user.image ? (
                        <img src={b.tutor.user.image} className="w-full h-full object-cover rounded-[1.6rem]" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/20"><User className="size-8" /></div>
                      )}
                      <div className="absolute inset-0 border-[3px] border-white dark:border-slate-900 rounded-[1.6rem] pointer-events-none" />
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-2xl font-black tracking-tight leading-tight italic">{b.tutor.user.name}</h3>
                      <p className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                         <Zap className="size-3 fill-current" /> Expert Mentor
                      </p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                      <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">Rating</p>
                      <div className="flex items-center gap-2">
                         <Star className="size-3 fill-amber-500 text-amber-500" />
                         <span className="text-xs font-black tracking-widest">{b.tutor.rating || "5.0"}</span>
                      </div>
                   </div>
                   <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                      <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">Hourly</p>
                      <p className="text-lg font-black tracking-tighter">${b.tutor.hourlyRate}</p>
                   </div>
                </div>

                <div className="flex gap-3">
                   <button onClick={() => window.location.href = `/tutors/${b.tutor.id}`} className="flex-1 h-12 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2">
                      Profile <ArrowRight className="size-3" />
                   </button>
                   <button onClick={() => removeBookmark(b.tutor.id, "tutor")} className="h-12 w-12 bg-muted border border-border flex items-center justify-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
                      <Trash2 className="size-4" />
                   </button>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
           {filteredProducts.map((b) => (
             <div key={b.id} className="group bg-card border border-border rounded-[3rem] overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 relative">
                <div className="h-48 bg-muted relative overflow-hidden group-hover:h-52 transition-all p-3">
                   {b.product.imageUrl ? (
                     <img src={b.product.imageUrl} className="w-full h-full object-cover rounded-[2rem]" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-primary/20"><Package className="size-16" /></div>
                   )}
                   <button onClick={() => removeBookmark(b.product.id, "product")} className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-2xl text-rose-500 shadow-xl border border-black/5 hover:bg-rose-500 hover:text-white transition-all transform scale-0 group-hover:scale-100 italic">
                      Remove
                   </button>
                </div>
                <div className="p-8 space-y-6">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase text-primary tracking-[0.2em]">{b.product.vendor?.name || "Premium"} Toolset</p>
                      <h3 className="text-2xl font-black tracking-tighter italic line-clamp-1">{b.product.title}</h3>
                   </div>
                   <div className="flex items-center justify-between border-t border-border pt-6">
                      <p className="text-2xl font-black tracking-tighter">${b.product.price}</p>
                      <button onClick={() => window.location.href = `/products`} className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                        <ArrowRight className="size-4" />
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}

      {(activeTab === "tutors" ? filteredTutors.length : filteredProducts.length) === 0 && (
         <div className="py-40 text-center space-y-6 px-4">
            <div className="size-20 bg-muted rounded-[2rem] flex items-center justify-center mx-auto opacity-20 border border-border">
               <Bookmark className="size-8" />
            </div>
            <div className="max-w-sm mx-auto space-y-2">
               <h2 className="text-2xl font-black lowercase tracking-tighter italic">archive empty.</h2>
               <p className="text-muted-foreground text-sm font-medium lowercase">You haven't saved any {activeTab} to your collection yet.</p>
            </div>
            <button onClick={() => window.location.href = activeTab === "tutors" ? "/tutors" : "/products"} className="h-12 px-8 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl hover:shadow-primary/20 transition-all">Explore {activeTab}</button>
         </div>
      )}
    </div>
  );
}
