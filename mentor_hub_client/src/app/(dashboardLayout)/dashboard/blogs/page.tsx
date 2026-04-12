"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Loader2,
  FileText,
  Trash2,
  Pencil,
  X,
  Image as ImageIcon,
  Tag,
  Eye,
  Calendar,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";

const CATEGORIES = ["General", "Technology", "Career", "Academics", "Productivity"];

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
    image: "",
  });

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (data?.success || data?.data) {
        setBlogs(data.data || []);
      }
    } catch (err) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenModal = (blog: any = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        content: blog.content,
        category: blog.category || "General",
        image: blog.image || "",
      });
    } else {
      setEditingBlog(null);
      setFormData({ title: "", content: "", category: "General", image: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
    setFormData({ title: "", content: "", category: "General", image: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.title.length < 5) {
      toast.error("Title must be at least 5 characters");
      return;
    }
    if (formData.content.length < 20) {
      toast.error("Content must be at least 20 characters");
      return;
    }

    setActionLoading("submit");
    try {
      const url = editingBlog ? `/api/blog/${editingBlog.id}` : "/api/blog";
      const method = editingBlog ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          image: formData.image || null,
        }),
      });

      const data = await res.json();

      if (data?.success) {
        toast.success(editingBlog ? "Blog updated successfully!" : "Blog published successfully!");
        handleCloseModal();
        fetchBlogs();
      } else {
        toast.error(data?.message || "Failed to save blog");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    setActionLoading(`delete-${id}`);
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data?.success) {
        toast.success("Blog deleted successfully");
        setBlogs(blogs.filter((b) => b.id !== id));
      } else {
        toast.error(data?.message || "Failed to delete blog");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Loading Blog Engine...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="p-8 rounded-[2rem] bg-card border border-border relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="size-5 text-primary" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              content studio
            </p>
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">
            Blog <span className="text-primary">Engine.</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Create, edit, and manage blog posts for the platform.
          </p>
        </div>
        <div className="relative z-10 flex gap-4 items-center">
          <div className="p-4 rounded-2xl bg-muted/50 border border-border text-center min-w-[120px]">
            <p className="text-3xl font-black text-foreground mb-1">{blogs.length}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
              Total Posts
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20"
          >
            <Plus className="size-4" /> New Post
          </button>
        </div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 blur-3xl rounded-full -mt-40 pointer-events-none" />
      </div>

      {/* Search Bar */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or category..."
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-background border border-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Blog Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-border rounded-[3rem] bg-card/50">
          <div className="size-20 bg-background rounded-[2rem] border border-border flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <FileText className="size-10 text-muted-foreground/20" />
          </div>
          <h2 className="text-2xl font-black tracking-tighter mb-2">No Blog Posts Yet.</h2>
          <p className="text-muted-foreground text-sm font-medium mb-8 max-w-sm mx-auto">
            Start sharing your expertise with the community.
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all"
          >
            Write Your First Post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="group bg-card border border-border rounded-[2rem] overflow-hidden hover:border-primary/30 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              {/* Image */}
              <div className="h-48 bg-muted relative overflow-hidden">
                {blog.image ? (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-cyan-500/10">
                    <FileText className="size-16 text-primary/20" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest border border-black/5 shadow-lg">
                    {blog.category || "General"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {blog.author && (
                    <>
                      <span className="size-1 rounded-full bg-border" />
                      <span>{blog.author.name || "Unknown"}</span>
                    </>
                  )}
                </div>

                <h3 className="text-lg font-black tracking-tight leading-tight line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-sm text-muted-foreground font-medium line-clamp-2 opacity-70">
                  {blog.excerpt || blog.content?.substring(0, 100) + "..."}
                </p>

                {/* Actions */}
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <Link
                    href={`/blog/${blog.id}`}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4"
                  >
                    <Eye className="size-3" /> View
                  </Link>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(blog)}
                      className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all border border-primary/20"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      disabled={actionLoading === `delete-${blog.id}`}
                      className="p-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all border border-destructive/20"
                    >
                      {actionLoading === `delete-${blog.id}` ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-card border border-border rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-card border-b border-border rounded-t-[2.5rem] px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Sparkles className="size-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tighter">
                    {editingBlog ? "Edit Post" : "New Blog Post"}
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    content studio
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition-all"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Title *
                </label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter a compelling title..."
                  className="w-full h-14 px-5 rounded-2xl bg-background border border-border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                        formData.category === cat
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:border-primary/30 text-muted-foreground"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <ImageIcon className="size-3" /> Cover Image URL
                </label>
                <input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full h-14 px-5 rounded-2xl bg-background border border-border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                {formData.image && (
                  <div className="h-32 rounded-xl overflow-hidden border border-border mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Content * <span className="opacity-50">(min 20 characters)</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your blog content here..."
                  rows={10}
                  className="w-full px-5 py-4 rounded-2xl bg-background border border-border text-sm font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  required
                />
                <p className="text-[9px] font-bold text-muted-foreground text-right">
                  {formData.content.length} characters
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={actionLoading === "submit"}
                className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
              >
                {actionLoading === "submit" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : editingBlog ? (
                  "Update Post"
                ) : (
                  "Publish Post"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
