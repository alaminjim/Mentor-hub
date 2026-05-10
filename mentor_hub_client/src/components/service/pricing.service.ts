export const pricingService = {
  getTiers: async () => {
    const baseUrl = typeof window === "undefined" ? (process.env.BACKEND_URL || "https://mentor-hub-server-tov4.onrender.com") : (process.env.NEXT_PUBLIC_BACKEND_URL || "https://mentor-hub-server-tov4.onrender.com");
    const res = await fetch(`${baseUrl}/api/pricing`, {
      cache: "no-store",
      credentials: "include",
    });
    return res.json();
  },
  createCheckoutSession: async (tierId: string) => {
    const baseUrl = typeof window === "undefined" ? (process.env.BACKEND_URL || "https://mentor-hub-server-tov4.onrender.com") : (process.env.NEXT_PUBLIC_BACKEND_URL || "https://mentor-hub-server-tov4.onrender.com");
    const res = await fetch(`${baseUrl}/api/pricing/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        tierId,
        successUrl: `${window.location.origin}/pricing?success=true&tierId=${tierId}`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`,
      }),
    });
    return res.json();
  },
};
