const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://mentor-hub-server.vercel.app";

export const aiService = {
  chat: async (message: string, history: any[] = []) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      if (!res.ok) throw new Error("Failed to connect to AI server");
      return await res.json();
    } catch (e) {
      console.error("Frontend AI Service Error:", e);
      return { success: false, data: "offline: could not connect to mentor_bot." };
    }
  }
};
