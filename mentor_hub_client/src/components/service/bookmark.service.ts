export const bookmarkService = {
  toggleBookmark: async (tutorId: string) => {
    try {
      const baseUrl = typeof window === "undefined" ? (process.env.BACKEND_URL || "https://mentor-hub-1.onrender.com") : (process.env.NEXT_PUBLIC_BACKEND_URL || "https://mentor-hub-1.onrender.com");
      const res = await fetch(`${baseUrl}/api/bookmark/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorId }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to toggle bookmark");
      return await res.json();
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  },

  getMyBookmarks: async (): Promise<{ success: boolean; data: string[] }> => {
    try {
      const baseUrl = typeof window === "undefined" ? (process.env.BACKEND_URL || "https://mentor-hub-1.onrender.com") : (process.env.NEXT_PUBLIC_BACKEND_URL || "https://mentor-hub-1.onrender.com");
      const res = await fetch(`${baseUrl}/api/bookmark/my-bookmarks`, {
        credentials: "include",
      });
      if (!res.ok) return { success: false, data: [] };
      return await res.json();
    } catch (e) {
      return { success: false, data: [] };
    }
  },
};
