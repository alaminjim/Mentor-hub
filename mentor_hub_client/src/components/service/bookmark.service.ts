export const bookmarkService = {
  toggleBookmark: async (tutorId: string) => {
    try {
      const res = await fetch(`/api/bookmark/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorId }),
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
      const res = await fetch(`/api/bookmark/my-bookmarks`);
      if (!res.ok) return { success: false, data: [] };
      return await res.json();
    } catch (e) {
      return { success: false, data: [] };
    }
  },
};
