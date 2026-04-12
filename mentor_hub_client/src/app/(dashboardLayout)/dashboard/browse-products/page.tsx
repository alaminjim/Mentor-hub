"use client";

import { useEffect, useState } from "react";
import { 
  Search, Loader2, Package, Star, Heart, ArrowRight,
  ShoppingBag, Sparkles, Filter 
} from "lucide-react";
import toast from "react-hot-toast";

export default function BrowseProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/dashboard/products/purchased").then(r => r.json());
      if (res?.success) setProducts(res.data || []);
      else setProducts([]);
    } catch (err) {
      toast.error("Failed to sync library");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter(p => 
    (p.title?.toLowerCase() || "").includes(search.toLowerCase()) || 
    (p.description?.toLowerCase() || "").includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="size-16 rounded-[2rem] bg-primary/10 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 animate-pulse" />
        <Loader2 className="size-8 animate-spin text-primary relative z-10" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Initializing Library...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Header Segment */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-border relative overflow-hidden px-4">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -mr-32 -mt-32" />
         <div className="relative z-10">
            <h1 className="text-4xl font-black tracking-tighter mb-4 italic">Resource <span className="text-primary">Library.</span></h1>
            <p className="text-muted-foreground text-sm font-medium">Your personal collection of expert tools, assets, and knowledge modules.</p>
         </div>
         
         <div className="relative w-full md:w-[350px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Search my library..."
               className="w-full h-12 pl-11 pr-4 rounded-2xl bg-card border border-border text-sm font-bold focus:ring-4 focus:ring-primary/5 transition-all outline-none"
            />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {filtered.map((p) => (
          <div key={p.id} className="group flex flex-col bg-card border border-border rounded-[2.5rem] overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 relative">
            
            {/* Visual Header */}
            <div className="h-60 bg-muted relative overflow-hidden p-3">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover rounded-[1.8rem] transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full rounded-[1.8rem] bg-gradient-to-br from-primary/20 to-indigo-500/10 flex items-center justify-center text-primary/20">
                  <Package className="size-16" />
                </div>
              )}
              
              <div className="absolute top-6 left-6 flex items-center gap-2">
                 <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase text-primary border border-black/5 shadow-xl">
                   Purchased
                 </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-8 space-y-6 flex-1 flex flex-col">
              <div className="space-y-2">
                 <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest opacity-40">#{p.id.slice(0, 8)}</span>
                    <span className="size-1 bg-border rounded-full" />
                    <span className="text-[9px] font-black uppercase text-primary tracking-widest">Assets</span>
                 </div>
                 <h3 className="text-2xl font-black tracking-tight leading-tight line-clamp-1 italic">{p.title}</h3>
              </div>

              <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2 opacity-70">
                {p.description}
              </p>

              <div className="pt-6 border-t border-border mt-auto flex items-center justify-between gap-4">
                 <button className="flex-1 h-12 bg-primary/10 border border-primary/20 hover:bg-primary hover:text-white text-primary rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all group/btn">
                    Access Resource <ArrowRight className="size-3 group-hover/btn:translate-x-1 transition-transform" />
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
         <div className="py-40 text-center space-y-6 px-4">
            <div className="size-20 bg-muted rounded-[2rem] flex items-center justify-center mx-auto opacity-20 border border-border">
               <Package className="size-8" />
            </div>
            <div className="max-w-sm mx-auto space-y-2">
               <h2 className="text-2xl font-black lowercase tracking-tighter italic">library is empty.</h2>
               <p className="text-muted-foreground text-sm font-medium lowercase">Any digital assets you acquire from the marketplace will manifest here instantly.</p>
            </div>
            <button onClick={() => window.location.href = "/products"} className="h-12 px-8 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl hover:shadow-primary/20 transition-all">Go to Marketplace</button>
         </div>
      )}
    </div>
  );
}
