export const pricingService = {
  getTiers: async () => {
    const res = await fetch(`/api/pricing`, {
      cache: "no-store",
    });
    return res.json();
  },
  createCheckoutSession: async (priceId: string) => {
    const res = await fetch(`/api/pricing/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        priceId,
        successUrl: `${window.location.origin}/dashboard/billing?success=true`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`,
      }),
    });
    return res.json();
  },
};
