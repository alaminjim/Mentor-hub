export const dashboardService = {
  getStats: async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/dashboard/stats`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // @ts-ignore
        credentials: "include",
      });
      return await res.json();
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return { success: false, data: null };
    }
  },

  updateProfile: async (payload: any) => {
    try {
      const res = await fetch(`http://localhost:5000/api/dashboard/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // @ts-ignore
        credentials: "include",
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, message: "failed to update profile" };
    }
  }
};
