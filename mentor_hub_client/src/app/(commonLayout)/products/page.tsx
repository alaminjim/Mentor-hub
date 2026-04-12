"use client";

import { useEffect, useState } from "react";
import { 
  Search, Loader2, Package, Tag, Heart, ShoppingBag, 
  ArrowRight, Sparkles, Filter, Star,
  ShieldCheck, Globe, Zap, Bookmark as BookmarkIcon
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function PublicProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/dashboard/products").then(r => r.json());
      if (res?.success) setProducts(res.data);
    } catch (err) {
      toast.error("Failed to load marketplace data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleBuy = async (productId: string) => {
    setActionLoading(`buy-${productId}`);
    try {
      const res = await fetch("/api/dashboard/products/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          successUrl: window.location.origin + "/dashboard?success=true",
          cancelUrl: window.location.origin + "/products?cancel=true"
        })
      }).then(r => r.json());

      if (res?.success && res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Checkout initiated failed. Check login status.");
      }
    } catch (err) {
      toast.error("Payment bridge error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBookmark = async (productId: string) => {
    setActionLoading(`bookmark-${productId}`);
    try {
      const res = await fetch("/api/dashboard/products/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId })
      }).then(r => r.json());

      if (res?.success) {
        setProducts(prev => prev.map(p => 
          p.id === productId ? { ...p, isBookmarked: res.bookmarked } : p
        ));
        toast.success(res.bookmarked ? "Saved to your library!" : "Removed from library");
      } else {
        toast.error("Please login to bookmark items");
      }
    } catch (err) {
      toast.error("Action error");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
      <div className="w-20 h-20 rounded-[2.5rem] bg-primary/5 border border-primary/10 flex items-center justify-center relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-primary/5 animate-pulse" />
        <Loader2 className="size-8 animate-spin text-primary relative z-10" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Synchronizing Marketplace...</p>
    </div>
  );

  const filtered = products.filter(p => 
    (p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.description.toLowerCase().includes(search.toLowerCase())) &&
    (category === "all" || p.status === category)
  );

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Dynamic Hero Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden border-b border-border">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-primary/10 blur-[130px] rounded-full animate-pulse" />
          <div className="absolute bottom-5 right-10 w-[300px] h-[300px] bg-sky-500/5 blur-[100px] rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
             <Zap className="size-3.5 fill-current" /> Global Marketplace
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[1.1] max-w-4xl mx-auto italic">
            Elite <span className="text-primary italic">Resources</span> for Modern Learners.
          </h1>
          <p className="text-muted-foreground text-lg font-medium max-w-xl mx-auto leading-relaxed opacity-80">
            Professional assets and tools curated by top-tier MentorHub vendors.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-16 px-6 space-y-12">
        {/* Advanced Filters */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between sticky top-24 z-40 p-4 bg-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-xl shadow-primary/5">
           <div className="relative w-full lg:w-[400px] group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Search assets..."
                 className="w-full h-14 pl-12 pr-4 rounded-2xl bg-background border-none text-sm font-bold focus:ring-4 focus:ring-primary/5 transition-all outline-none"
              />
           </div>
           
           <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
              {['all', 'digital', 'exclusive'].map((c) => (
                 <button 
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "px-6 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                    category === c ? "bg-primary text-white border-primary" : "bg-background text-muted-foreground border-border"
                  )}
                 >
                   {c}
                 </button>
              ))}
           </div>
        </div>

        {/* Product Grid - Optimized Width */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map((p) => (
            <div key={p.id} className="group flex flex-col bg-card border border-border rounded-[3rem] overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 relative p-3">
              
              {/* Media Section */}
              <div className="h-72 rounded-[2.5rem] bg-muted relative overflow-hidden">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/10 bg-gradient-to-br from-muted to-muted/80">
                    <Package className="size-20" />
                  </div>
                )}
                
                {/* Visual Badges */}
                <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest border border-black/5 flex items-center gap-1.5 shadow-xl">
                     <Star className="size-3 fill-amber-500 text-amber-500" /> 5.0
                  </span>
                  
                  <button 
                    onClick={() => handleBookmark(p.id)}
                    disabled={actionLoading === `bookmark-${p.id}`}
                    className={cn(
                      "p-3 rounded-2xl shadow-xl transition-all transform hover:scale-110 active:scale-90 group/heart border border-black/5",
                      p.isBookmarked 
                        ? "bg-rose-500 text-white" 
                        : "bg-white/95 backdrop-blur-md text-muted-foreground hover:bg-rose-500 hover:text-white"
                    )}
                  >
                     <Heart className={cn("size-5", p.isBookmarked ? "fill-current" : "group-hover/heart:fill-current")} />
                  </button>
                </div>

                <div className="absolute bottom-5 right-5 px-5 py-2.5 bg-primary text-white rounded-2xl shadow-2xl font-black text-lg border border-white/20">
                  ${p.price}
                </div>
              </div>

              {/* Detail Section */}
              <div className="p-6 space-y-5 flex-1 flex flex-col">
                <div className="space-y-2">
                   <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">Elite Asset</span>
                      <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest opacity-40">#{p.id.slice(0, 8)}</span>
                   </div>
                   <h3 className="text-2xl font-black tracking-tight leading-tight line-clamp-1 italic">{p.title}</h3>
                </div>

                <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2 opacity-70">
                  {p.description}
                </p>

                <div className="pt-6 border-t border-border mt-auto">
                   <button 
                      onClick={() => handleBuy(p.id)}
                      disabled={actionLoading === `buy-${p.id}`}
                      className="relative overflow-hidden w-full h-15 bg-primary/10 backdrop-blur-md border border-primary/20 text-primary rounded-[1.5rem] flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] transform transition-all active:scale-95 group/btn"
                   >
                     {/* Shine Effect Animation */}
                     <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-[45deg] -translate-x-[150%] group-hover/btn:translate-x-[250%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                     
                     {actionLoading === `buy-${p.id}` ? (
                        <Loader2 className="size-4 animate-spin" />
                     ) : (
                        <div className="flex items-center gap-2 relative z-10 transition-transform group-hover/btn:scale-105">
                           GET IT NOW <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                        </div>
                     )}
                   </button>
                </div>
              </div>

              {/* Author Badge */}
              <div className="absolute top-[280px] right-10 w-14 h-14 rounded-[1.5rem] bg-white p-1 shadow-2xl border border-border group-hover:-translate-y-2 transition-transform duration-700">
                 <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-black text-lg">
                    {p.vendor?.name?.charAt(0) || "M"}
                 </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
             <div className="col-span-full py-40 text-center border-3 border-dashed border-border rounded-[5rem] bg-card/50">
                <div className="size-32 bg-background rounded-[3rem] border border-border flex items-center justify-center mx-auto mb-10 shadow-2xl">
                   <Package className="size-12 text-muted-foreground/20" />
                </div>
                <h2 className="text-4xl font-black tracking-tighter italic">No Assets Found.</h2>
                <p className="text-muted-foreground text-lg font-medium mt-3 max-w-sm mx-auto opacity-60">
                   Try adjusting your filters or use different keywords to find elite mentor resources.
                </p>
             </div>
          )}
        </div>
      </main>

      {/* Modern Footer CTA */}
      <section className="max-w-7xl mx-auto px-6 py-32">
         <div className="p-20 rounded-[5rem] bg-card text-foreground relative overflow-hidden group border border-border">
            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[200px] rounded-full -mr-96 -mb-96 transition-all group-hover:bg-primary/10" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center text-center lg:text-left">
               <div className="space-y-8">
                  <div className="inline-flex px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">Become a Vendor</div>
                  <h2 className="text-6xl font-black tracking-tighter leading-[0.9] italic">Monetize your <br/><span className="text-primary underline decoration-primary/20">Expertise.</span></h2>
                  <p className="text-muted-foreground text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                     Join our global ecosystem and start selling your intellectual property to the next generation of leaders.
                  </p>
                  <div className="pt-6 flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                     <Link href="/register?role=vendor" className="h-20 px-12 bg-primary text-white rounded-[2rem] flex items-center justify-center text-xs font-black uppercase tracking-[0.25em] hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-95">
                        Launch Store
                     </Link>
                     <Link href="/dashboard" className="h-20 px-12 bg-background text-foreground rounded-[2rem] flex items-center justify-center text-xs font-black uppercase tracking-[0.25em] border border-border hover:bg-muted transition-all">
                        Learn Systems
                     </Link>
                  </div>
               </div>
               <div className="hidden lg:flex justify-end perspective-1000">
                  <div className="relative transform rotate-y-12 rotate-x-12 hover:rotate-0 transition-transform duration-1000">
                     <div className="size-48 rounded-[3.5rem] bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-[0_50px_100px_-20px_rgba(var(--primary),0.3)]">
                        <Zap className="size-20 text-white fill-white" />
                     </div>
                     <div className="absolute -top-10 -left-10 size-24 rounded-[2rem] bg-rose-500/90 backdrop-blur-md flex items-center justify-center shadow-2xl animate-bounce">
                        <Heart className="size-10 text-white fill-white" />
                     </div>
                     <div className="absolute -bottom-6 -right-6 px-8 py-4 rounded-2xl bg-white shadow-2xl border border-border">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">New Sale Incoming</p>
                        <p className="text-lg font-black tracking-tighter">+$499.00</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
