"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Loader2, Package, Trash2, Tag, DollarSign, Image as ImageIcon, X, Sparkles, CheckCircle, LayoutGrid, List, Pencil, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function VendorProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: ""
  });

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        imageUrl: product.imageUrl || ""
      });
      setImagePreview(product.imageUrl || null);
    } else {
      setEditingProduct(null);
      setFormData({ title: "", description: "", price: "", imageUrl: "" });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleGenerateDescription = async () => {
    if (!formData.title.trim()) {
      toast.error("Enter a title first to generate description");
      return;
    }
    
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: formData.title })
      }).then(r => r.json());

      if (res?.success && res.data) {
        setFormData(prev => ({ ...prev, description: res.data }));
        toast.success("AI generated a description!");
      } else {
        toast.error("AI is busy right now. Try again!");
      }
    } catch (err) {
      toast.error("AI connection failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    toast.loading("Uploading image...", { id: "upload" });
    
    setTimeout(() => {
       setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
       toast.success("Image processed!", { id: "upload" });
    }, 1000);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/dashboard/vendor/products").then(r => r.json());
      if (res?.success) setProducts(res.data);
    } catch (err) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      toast.error("Please upload a product thumbnail");
      return;
    }
    setActionLoading("save");
    try {
      const method = editingProduct ? "PATCH" : "POST";
      const url = editingProduct ? `/api/dashboard/vendor/products/${editingProduct.id}` : "/api/dashboard/vendor/products";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      }).then(r => r.json());

      if (res?.success) {
        toast.success(editingProduct ? "Product updated!" : "Product added to inventory!");
        if (editingProduct) {
          setProducts(products.map(p => p.id === editingProduct.id ? res.data : p));
        } else {
          setProducts([res.data, ...products]);
        }
        setIsModalOpen(false);
        setFormData({ title: "", description: "", price: "", imageUrl: "" });
        setEditingProduct(null);
        setImagePreview(null);
      } else {
        toast.error(res?.message || "Failed to save product");
      }
    } catch (err) {
      toast.error("Error saving product");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to remove this product?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/dashboard/vendor/products/${id}`, {
        method: "DELETE"
      }).then(r => r.json());

      if (res?.success) {
        toast.success("Product removed");
        setProducts(products.filter(p => p.id !== id));
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      toast.error("Error deleting product");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Syncing Inventory...</p>
    </div>
  );

  const filtered = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20 relative">
      {/* Header Segment */}
      <div className="p-8 rounded-[2rem] bg-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 blur-3xl rounded-full -mt-40 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tighter mb-2 italic">Product <span className="text-primary">Studio.</span></h1>
          <p className="text-muted-foreground text-sm font-medium">Create, edit and manage your digital inventory with ease.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20"
        >
          <Plus className="size-4" /> Add New Item
        </button>
      </div>

      {/* Control Area */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/50 p-4 rounded-2xl border border-border shadow-sm">
         <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
               <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter inventory..."
                  className="w-full h-11 pl-11 pr-4 rounded-xl bg-background border border-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
               />
            </div>
            <div className="flex bg-background border border-border rounded-xl p-1 gap-1 w-full md:w-auto">
               <button 
                  onClick={() => setViewMode("grid")}
                  className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted")}
               >
                  <LayoutGrid className="size-4" />
               </button>
               <button 
                  onClick={() => setViewMode("table")}
                  className={cn("p-2 rounded-lg transition-all", viewMode === "table" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted")}
               >
                  <List className="size-4" />
               </button>
            </div>
         </div>
         <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl">
            <Package className="size-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest">{products.length} Items Listed</span>
         </div>
      </div>

      {/* Display Segment */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="group bg-card border border-border rounded-[2rem] overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 flex flex-col">
              <div className="h-48 bg-muted relative overflow-hidden">
                 {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                       <ImageIcon className="size-12" />
                    </div>
                 )}
                 <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-background/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-border shadow-sm">
                       ${p.price}
                    </span>
                 </div>
              </div>
              
              <div className="p-6 space-y-3 flex-1">
                 <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black tracking-tight text-lg line-clamp-1 truncate">{p.title}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <button 
                        onClick={() => handleOpenModal(p)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(p.id)}
                        disabled={actionLoading === p.id}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        {actionLoading === p.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                      </button>
                    </div>
                 </div>
                 <p className="text-sm text-muted-foreground line-clamp-2 font-medium leading-relaxed">
                    {p.description}
                 </p>
              </div>
              
              <div className="px-6 pb-6 mt-auto">
                 <div className="pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1.5">
                       <Tag className="size-3" /> {p.status}
                    </span>
                    <p className="text-[9px] font-black uppercase text-muted-foreground">
                      ID: {p.id.slice(0, 8)}
                    </p>
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-muted/40 border-b border-border">
                       <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Item</th>
                       <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description</th>
                       <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Price</th>
                       <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                       <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Settings</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border">
                    {filtered.map((p) => (
                       <tr key={p.id} className="hover:bg-muted/20 transition-colors group">
                          <td className="py-4 px-6">
                             <div className="flex items-center gap-3">
                                <div className="size-10 rounded-lg bg-muted overflow-hidden">
                                   {p.imageUrl ? <img src={p.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon className="size-4 m-auto mt-3" />}
                                </div>
                                <span className="text-sm font-bold text-foreground">{p.title}</span>
                             </div>
                          </td>
                          <td className="py-4 px-6">
                             <p className="text-xs text-muted-foreground font-medium line-clamp-1 max-w-[200px]">{p.description}</p>
                          </td>
                          <td className="py-4 px-6">
                             <span className="text-sm font-black text-primary">${p.price}</span>
                          </td>
                          <td className="py-4 px-6">
                             <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase border border-emerald-500/20">
                                {p.status}
                             </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button onClick={() => handleOpenModal(p)} className="p-2 rounded-lg bg-background border border-border hover:bg-primary hover:text-white transition-all">
                                   <Pencil className="size-3.5" />
                                </button>
                                <button onClick={() => handleDeleteProduct(p.id)} disabled={actionLoading === p.id} className="p-2 rounded-lg bg-background border border-border hover:bg-destructive hover:text-white transition-all">
                                   {actionLoading === p.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-[3rem] bg-muted/10">
            <Package className="size-12 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold">No products found</h3>
            <p className="text-sm text-muted-foreground mt-1">Start by adding your first digital product</p>
          </div>
      )}

      {/* Persistence Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden relative">
            <div className="p-8 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tighter italic">{editingProduct ? "Update" : "New"} <span className="text-primary">Inventory.</span></h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-3 hover:bg-muted rounded-2xl transition-all"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Title</label>
                <input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. English Grammar Pro" className="w-full h-14 bg-background border border-border rounded-2xl px-5 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Price (USD)</label>
                   <div className="relative">
                      <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input required type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full h-14 bg-background border border-border rounded-2xl pl-12 pr-5 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Image</label>
                   <div className="relative group/file h-14">
                      <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="w-full h-full bg-background border border-dashed border-border rounded-2xl flex items-center justify-center gap-2 group-hover/file:border-primary transition-colors">
                         {imagePreview ? <img src={imagePreview} className="size-8 rounded-lg object-cover" /> : <ImageIcon className="size-4 text-muted-foreground" />}
                         <span className="text-[10px] font-black uppercase">{imagePreview ? "Change" : "Upload"}</span>
                      </div>
                   </div>
                 </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                   <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Description</label>
                   <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="flex items-center gap-1.5 text-[10px] font-black uppercase text-primary disabled:opacity-50">
                      {isGenerating ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />} AI Generate
                   </button>
                </div>
                <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Write something compelling..." className="w-full bg-background border border-border rounded-2xl p-5 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none shadow-sm" />
              </div>

              <button type="submit" disabled={actionLoading === "save"} className="w-full h-14 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 mt-4">
                {actionLoading === "save" ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4" />}
                {editingProduct ? "Update Item" : "List Item Ready"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
