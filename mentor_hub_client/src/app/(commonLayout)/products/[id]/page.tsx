"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Loader2, Package, ShoppingBag, ArrowRight, Star,
  ShieldCheck, Globe, Zap, Heart, Bookmark as BookmarkIcon,
  ChevronLeft, ExternalLink, Download, FileText
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const session = await authClient.getSession();
      setUser(session?.data?.user);

      try {
        const res = await fetch(`/api/dashboard/products/${id}`).then(r => r.json());
        if (res.success) setProduct(res.data);
        else toast.error("Product not found");
      } catch (err) {
        toast.error("Failed to load details");
      } finally {
        setLoading(false);
      }
    };
    if (id) init();
  }, [id]);

  const handleBuy = async () => {
    if (!user) {
        toast.error("Please sign in to purchase assets");
        return router.push("/signin");
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/dashboard/products/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          successUrl: `${window.location.origin}/dashboard/browse-products?success=true&productId=${id}`,
          cancelUrl: `${window.location.origin}/products/${id}?cancel=true`
        })
      }).then(r => r.json());

      if (res?.success && res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Checkout failed. Try again later.");
      }
    } catch (err) {
      toast.error("Payment bridge error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12 animate-pulse">
        <div className="h-6 w-32 bg-muted rounded-full mb-8" />
        <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
                <div className="w-full max-h-[500px] aspect-[4/3] rounded-[3rem] bg-muted shadow-lg" />
                <div className="grid grid-cols-2 gap-6">
                    <div className="h-32 bg-muted rounded-[2.5rem]" />
                    <div className="h-32 bg-muted rounded-[2.5rem]" />
                </div>
            </div>
            <div className="space-y-12">
                <div className="space-y-6">
                    <div className="h-6 w-48 bg-muted rounded-full" />
                    <div className="h-20 w-3/4 bg-muted rounded-2xl" />
                    <div className="h-16 w-full bg-muted rounded-2xl" />
                </div>
                <div className="space-y-4">
                    <div className="h-6 w-full bg-muted rounded-xl" />
                    <div className="h-6 w-full bg-muted rounded-xl" />
                    <div className="h-6 w-3/4 bg-muted rounded-xl" />
                </div>
                <div className="h-32 bg-muted rounded-[3.5rem]" />
            </div>
        </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center pt-24">
       <div className="text-center space-y-4">
          <Package className="size-20 mx-auto text-muted-foreground/20" />
          <h2 className="text-2xl font-black italic">Asset vanished.</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12 selection:bg-primary/20">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between gap-4">
           <button 
             onClick={() => router.back()}
             className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
           >
              <ChevronLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">Back to marketplace</span>
           </button>
           
           <div className="hidden md:flex items-center gap-2">
              <div className="px-4 py-1.5 rounded-full border border-border bg-card flex items-center gap-2">
                 <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Verified Resource</span>
              </div>
           </div>
        </div>

        {/* Main Product Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Visual Showcase */}
          <div className="space-y-8 sticky top-32">
            <div className="w-full max-h-[500px] aspect-[4/3] rounded-[3rem] bg-muted border border-border overflow-hidden relative shadow-2xl group">
               {product.imageUrl ? (
                 <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-muted-foreground/10 bg-gradient-to-br from-muted to-muted/80">
                    <Package className="size-32" />
                 </div>
               )}
               
               <div className="absolute top-10 left-10 flex flex-col gap-4">
                  <div className="p-4 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-black/5 flex items-center gap-3">
                     <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Star className="size-5 fill-amber-500 text-amber-500" />
                     </div>
                     <div>
                        <div className="text-sm font-black tracking-tight">5.0 Rating</div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase leading-none">Global Standard</div>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
               <div className="p-8 rounded-[2.5rem] bg-card border border-border space-y-4">
                  <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                     <Download className="size-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-black tracking-tighter italic">Instant delivery.</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">Digital assets are manifested in your library immediately after purchase.</p>
               </div>
               <div className="p-8 rounded-[2.5rem] bg-card border border-border space-y-4">
                  <div className="size-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                     <ShieldCheck className="size-6 text-indigo-500" />
                  </div>
                  <h4 className="text-lg font-black tracking-tighter italic">Secured IP.</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">Verified by MentorHub. Legally licensed for personal professional usage.</p>
               </div>
            </div>
          </div>

          {/* Configuration / Info */}
          <div className="space-y-12">
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">Elite Digital Asset</span>
                  <span className="size-1.5 rounded-full bg-border" />
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-60 italic">#{product.id.split('-')[0]}</span>
               </div>
               
               <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] italic">
                  {product.title}
               </h1>
               
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                     <div className="size-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center text-white font-black text-xl italic shadow-xl">
                        {product.vendor?.name?.charAt(0) || "M"}
                     </div>
                     <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Verified Vendor</div>
                        <div className="text-sm font-bold lowercase tracking-tight">{product.vendor?.name}</div>
                     </div>
                  </div>
                  <div className="h-10 w-px bg-border" />
                  <div className="flex items-center gap-3">
                    <Globe className="size-5 text-muted-foreground" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global Access</span>
                  </div>
               </div>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none">
               <p className="text-xl text-muted-foreground font-medium leading-relaxed italic opacity-80">
                  {product.description}
               </p>
            </div>

            {/* Price Card */}
            <div className="p-10 rounded-[3.5rem] bg-slate-950 text-white relative overflow-hidden shadow-2xl shadow-primary/20 group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-125" />
               <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Standard Licensing</p>
                     <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-black tracking-tighter text-gradient-primary italic">${product.price}</span>
                        <span className="text-sm font-bold opacity-40 uppercase tracking-widest">USD (One-time)</span>
                     </div>
                  </div>
                  
                  <button 
                    onClick={handleBuy}
                    disabled={actionLoading}
                    className="h-20 px-12 bg-white text-slate-950 rounded-[2rem] flex items-center justify-center gap-4 text-sm font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all transform active:scale-95 group/buy shadow-2xl"
                  >
                     {actionLoading ? (
                        <Loader2 className="size-5 animate-spin" />
                     ) : (
                        <>
                           GET IT NOW <Zap className="size-5 fill-current group-hover:animate-pulse" />
                        </>
                     )}
                  </button>
               </div>
            </div>

            {/* Feature Tags */}
            <div className="flex flex-wrap gap-4">
               {[
                  { icon: FileText, label: "Detailed Doc" },
                  { icon: Globe, label: "Multi-device" },
                  { icon: Zap, label: "Low Latency" },
                  { icon: ShieldCheck, label: "Verified" }
               ].map((tag, i) => (
                  <div key={i} className="px-5 py-3 rounded-2xl bg-card border border-border flex items-center gap-3 group/tag hover:border-primary/30 transition-colors">
                     <tag.icon className="size-4 text-muted-foreground group-hover/tag:text-primary transition-colors" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover/tag:text-foreground">{tag.label}</span>
                  </div>
               ))}
            </div>
          </div>
        </div>

        {/* Related Items Section */}
        <div className="mt-32 pt-16 border-t border-border">
            <div className="flex items-center gap-2 mb-10">
               <div className="h-px w-8 bg-primary/30" />
               <h2 className="text-2xl font-black tracking-tighter italic m-0">Related digital assets.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
               {[1, 2, 3].map(i => (
                  <div key={i} className="group relative h-48 bg-muted rounded-3xl overflow-hidden border border-border flex items-end p-6">
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                     <div className="relative z-20">
                         <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[8px] font-black uppercase tracking-widest mb-2 inline-block">Recommended</span>
                         <h4 className="text-white font-black text-lg italic">Premium Asset {i}</h4>
                         <p className="text-white/60 text-xs font-bold uppercase">${product.price - 10}</p>
                     </div>
                  </div>
               ))}
            </div>
        </div>
      </div>
    </div>
  );
}

function Button({ children, onClick, className, variant = "primary" }: any) {
    return (
        <button 
            onClick={onClick}
            className={cn(
                "px-8 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                variant === "primary" ? "bg-primary text-white" : "bg-muted text-foreground",
                className
            )}
        >
            {children}
        </button>
    )
}
