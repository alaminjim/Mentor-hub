const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || (process.env.BACKEND_URL || "https://mentor-hub-server-tov4.onrender.com");

export const dashboardService = {
  getStats: async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/dashboard/stats`, {
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
      const res = await fetch(`${BACKEND_URL}/api/dashboard/profile`, {
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
