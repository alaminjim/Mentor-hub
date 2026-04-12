export const blogService = {
  getBlogs: async () => {
    try {
      const baseUrl = typeof window === "undefined" ? "https://mentor-hub-server.vercel.app" : "";
      const res = await fetch(`${baseUrl}/api/blog`, {
        cache: "no-store",
      });
      if (!res.ok) return { data: [] };
      return res.json();
    } catch (e) {
      return { data: [] };
    }
  },
  getBlogsByCategory: async (category: string) => {
    try {
      const baseUrl = typeof window === "undefined" ? "https://mentor-hub-server.vercel.app" : "";
      const res = await fetch(`${baseUrl}/api/blog/category/${category}`, {
        cache: "no-store",
      });
      if (!res.ok) return { data: [] };
      return res.json();
    } catch (e) {
      return { data: [] };
    }
  },
  searchBlogs: async (searchTerm: string) => {
    try {
      const baseUrl = typeof window === "undefined" ? "https://mentor-hub-server.vercel.app" : "";
      const res = await fetch(`${baseUrl}/api/blog/search/posts?searchTerm=${searchTerm}`, {
        cache: "no-store",
      });
      if (!res.ok) return { data: [] };
      return res.json();
    } catch (e) {
      return { data: [] };
    }
  },
  getBlogById: async (id: string) => {
    try {
      const baseUrl = typeof window === "undefined" ? "https://mentor-hub-server.vercel.app" : "";
      const res = await fetch(`${baseUrl}/api/blog/${id}`, {
        cache: "no-store",
      });
      if (!res.ok) return { data: null };
      return res.json();
    } catch (e) {
      return { data: null };
    }
  },
};
