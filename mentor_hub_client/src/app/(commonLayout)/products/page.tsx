"use client";

import { useEffect, useMemo, useState } from "react";
import { 
  Search, Loader2, Package, Heart, 
  ArrowRight, Star, Zap, ChevronLeft, ChevronRight,
  SlidersHorizontal, ArrowUpDown
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden animate-pulse p-3">
      <div className="h-56 rounded-[2rem] bg-muted" />
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-16 rounded-lg bg-muted" />
          <div className="h-5 w-20 rounded-lg bg-muted" />
        </div>
        <div className="h-6 w-3/4 rounded-xl bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded-lg bg-muted" />
          <div className="h-4 w-5/6 rounded-lg bg-muted" />
        </div>
        <div className="pt-4 border-t border-border">
          <div className="h-12 w-full rounded-2xl bg-muted" />
        </div>
      </div>
    </div>
  );
}

export default function PublicProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"default" | "price_asc" | "price_desc" | "newest">("default");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
          successUrl: `${window.location.origin}/dashboard/browse-products?success=true&productId=${productId}`,
          cancelUrl: `${window.location.origin}/products?cancel=true`
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

  // Filtered + Sorted results
  const filtered = useMemo(() => {
    let result = products.filter(p => 
      (p.title.toLowerCase().includes(search.toLowerCase()) || 
      p.description.toLowerCase().includes(search.toLowerCase())) &&
      (category === "all" || p.status === category)
    );

    if (sortBy === "price_asc") result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sortBy === "price_desc") result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (sortBy === "newest") result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return result;
  }, [products, search, category, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  // Reset page on filter change
  useEffect(() => { setCurrentPage(1); }, [search, category, sortBy]);

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
      <main className="max-w-[1400px] mx-auto py-16 px-6 space-y-10">
        {/* Advanced Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between sticky top-24 z-40 p-4 bg-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-xl shadow-primary/5">
           {/* Search */}
           <div className="relative w-full lg:w-[350px] group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Search assets..."
                 className="w-full h-12 pl-12 pr-4 rounded-2xl bg-background border-none text-sm font-bold focus:ring-4 focus:ring-primary/5 transition-all outline-none"
              />
           </div>
           
           {/* Category Filters */}
           <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
              {['all', 'digital', 'exclusive'].map((c) => (
                 <button 
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "px-5 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap",
                    category === c ? "bg-primary text-white border-primary" : "bg-background text-muted-foreground border-border hover:border-primary/30"
                  )}
                 >
                   {c}
                 </button>
              ))}
           </div>

           {/* Sorting */}
           <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-10 px-4 rounded-xl bg-background border border-border text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="default">Default</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="newest">Newest First</option>
              </select>
           </div>

           {/* Results Count */}
           <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">
             {filtered.length} items
           </div>
        </div>

        {/* ── Product Grid — 4 cols on xl ────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((p) => (
                <div key={p.id} className="group flex flex-col bg-card border border-border rounded-[2.5rem] overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 relative p-3 h-full">
                  
                  {/* Media Section */}
                  <Link href={`/products/${p.id}`} className="block h-56 rounded-[2rem] bg-muted relative overflow-hidden group/media shrink-0">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover/media:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/10 bg-gradient-to-br from-muted to-muted/80">
                        <Package className="size-16" />
                      </div>
                    )}
                    
                    {/* Visual Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest border border-black/5 flex items-center gap-1 shadow-lg">
                         <Star className="size-2.5 fill-amber-500 text-amber-500" /> 5.0
                      </span>

                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleBookmark(p.id);
                        }}
                        disabled={actionLoading === `bookmark-${p.id}`}
                        className={cn(
                          "p-2.5 rounded-xl shadow-lg transition-all transform hover:scale-110 active:scale-90 group/heart border border-black/5",
                          p.isBookmarked 
                            ? "bg-rose-500 text-white" 
                            : "bg-white/95 backdrop-blur-md text-muted-foreground hover:bg-rose-500 hover:text-white"
                        )}
                      >
                         <Heart className={cn("size-4", p.isBookmarked ? "fill-current" : "group-hover/heart:fill-current")} />
                      </button>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-4 right-4 px-4 py-2 bg-primary text-white rounded-xl shadow-2xl font-black text-sm border border-white/20 z-20">
                      ${p.price}
                    </div>

                    {/* Vendor Badge */}
                    <div className="absolute bottom-4 left-4 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-md p-0.5 shadow-xl border border-black/5 z-20">
                       <div className="w-full h-full rounded-md bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-black text-[8px] italic">
                          {p.vendor?.name?.charAt(0) || "M"}
                       </div>
                    </div>
                  </Link>

                  {/* Detail Section */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col relative">
                    <div className="space-y-1.5">
                       <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">Elite Asset</span>
                       </div>
                       <Link href={`/products/${p.id}`}>
                          <h3 className="text-base font-black tracking-tight leading-tight line-clamp-1 hover:text-primary transition-colors cursor-pointer">{p.title}</h3>
                       </Link>
                    </div>

                    <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2 opacity-70">
                      {p.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-[9px] font-bold text-muted-foreground mt-auto">
                      <span className="flex items-center gap-1">
                        <Star className="size-3 fill-amber-400 text-amber-400" /> 5.0 Rating
                      </span>
                      <span className="size-1 rounded-full bg-border" />
                      <span>{p.vendor?.name || "MentorHub"}</span>
                    </div>

                    <div className="pt-4 border-t border-border">
                       <button 
                          onClick={() => handleBuy(p.id)}
                          disabled={actionLoading === `buy-${p.id}`}
                          className="relative overflow-hidden w-full h-11 bg-primary/10 backdrop-blur-md border border-primary/20 text-primary rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] transform transition-all active:scale-95 group/btn"
                       >
                         {/* Shine Effect */}
                         <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-[45deg] -translate-x-[150%] group-hover/btn:translate-x-[250%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                         
                         {actionLoading === `buy-${p.id}` ? (
                            <Loader2 className="size-4 animate-spin" />
                         ) : (
                            <div className="flex items-center gap-2 relative z-10 transition-transform group-hover/btn:scale-105">
                               GET IT NOW <ArrowRight className="size-3 group-hover/btn:translate-x-1 transition-transform" />
                            </div>
                         )}
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Pagination ────────────────────────────────────────────── */}
            {totalPages >= 1 && (
              <div className="flex items-center justify-center gap-6 pt-10">
                 <button 
                   disabled={currentPage === 1}
                   onClick={() => handlePageChange(currentPage - 1)}
                   className="h-12 px-8 rounded-2xl bg-card border border-border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95"
                 >
                   <ChevronLeft className="size-4" /> Prev
                 </button>
                 
                 <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={cn(
                          "size-10 rounded-xl text-xs font-black transition-all active:scale-90",
                          currentPage === i + 1 
                            ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" 
                            : "bg-card border border-border text-muted-foreground hover:border-primary hover:text-primary"
                        )}
                      >
                        {i + 1}
                      </button>
                    ))}
                 </div>

                 <button 
                   disabled={currentPage === totalPages}
                   onClick={() => handlePageChange(currentPage + 1)}
                   className="h-12 px-8 rounded-2xl bg-card border border-border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95"
                 >
                   Next <ChevronRight className="size-4" />
                 </button>
              </div>
            )}

            <div className="text-center pt-4">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40 italic">
                 Showing {paginatedProducts.length} of {filtered.length} products in marketplace.
               </p>
            </div>
          </>
        ) : (
          <div className="py-32 text-center border-2 border-dashed border-border rounded-[4rem] bg-card/50">
             <div className="size-24 bg-background rounded-[2.5rem] border border-border flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Package className="size-10 text-muted-foreground/20" />
             </div>
             <h2 className="text-3xl font-black tracking-tighter italic mb-3">No Assets Found.</h2>
             <p className="text-muted-foreground text-base font-medium max-w-sm mx-auto opacity-60">
                Try adjusting your filters or use different keywords.
             </p>
          </div>
        )}
      </main>

      {/* Footer CTA */}
      <section className="max-w-7xl mx-auto px-6 py-32">
         <div className="p-16 rounded-[4rem] bg-card text-foreground relative overflow-hidden group border border-border">
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[200px] rounded-full -mr-72 -mb-72 transition-all group-hover:bg-primary/10" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-center lg:text-left">
               <div className="space-y-6">
                  <div className="inline-flex px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">Become a Vendor</div>
                  <h2 className="text-5xl font-black tracking-tighter leading-[0.9] italic">Monetize your <br/><span className="text-primary underline decoration-primary/20">Expertise.</span></h2>
                  <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                     Join our global ecosystem and start selling your intellectual property to the next generation of leaders.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                     <Link href="/signup?role=vendor" className="h-16 px-10 bg-primary text-white rounded-2xl flex items-center justify-center text-xs font-black uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-95">
                        Launch Store
                     </Link>
                     <Link href="/dashboard" className="h-16 px-10 bg-background text-foreground rounded-2xl flex items-center justify-center text-xs font-black uppercase tracking-[0.2em] border border-border hover:bg-muted transition-all">
                        Learn More
                     </Link>
                  </div>
               </div>
               <div className="hidden lg:flex justify-end">
                  <div className="size-40 rounded-[3rem] bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-[0_40px_80px_-20px_rgba(var(--primary),0.3)]">
                     <Zap className="size-16 text-white fill-white" />
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
