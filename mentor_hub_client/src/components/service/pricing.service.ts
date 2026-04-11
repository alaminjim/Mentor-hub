export const pricingService = {
  getTiers: async () => {
    const res = await fetch(`/api/pricing`, {
      cache: "no-store",
    });
    return res.json();
  },
  createCheckoutSession: async (tierId: string) => {
    const res = await fetch(`/api/pricing/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        tierId,
        successUrl: `${window.location.origin}/dashboard?success=true`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`,
      }),
    });
    return res.json();
  },
};
