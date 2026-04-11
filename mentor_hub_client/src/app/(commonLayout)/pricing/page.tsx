"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Crown, Sparkles, Zap } from "lucide-react";
import { pricingService } from "@/components/service/pricing.service";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

import { motion } from "framer-motion";

export default function PricingPage() {
  const [tiers, setTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [userSubscription, setUserSubscription] = useState<any>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const success = searchParams.get("success");
    const tierId = searchParams.get("tierId");

    const fetchData = async () => {
      try {
        const [tiersRes, userRes] = await Promise.all([
          pricingService.getTiers(),
          fetch("/api/auth/authMe").then(res => res.json())
        ]);

        if (tiersRes.success) setTiers(tiersRes.data);
        if (userRes.success) setUserSubscription(userRes.data);

        // If returned from payment success
        if (success === "true" && tierId) {
          const loadingToast = toast.loading("Verifying your subscription...");
          try {
            const confirmRes = await fetch("/api/pricing/confirm-subscription", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ tierId })
            }).then(r => r.json());

            if (confirmRes.success) {
              toast.success("Welcome to the Premium Club!", { id: loadingToast });
              // Refresh user data to show active status immediately
              const updatedUser = await fetch("/api/auth/authMe").then(r => r.json());
              if (updatedUser.success) setUserSubscription(updatedUser.data);
            } else {
              toast.error("Verification failed. Please contact support.", { id: loadingToast });
            }
          } catch (e) {
            toast.error("Internal verification error", { id: loadingToast });
          } finally {
            // Clean URL parameters
            window.history.replaceState({}, "", "/pricing");
          }
        }

      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCheckout = async (tierId: string) => {
    if (!tierId) {
      toast.error("Invalid subscription plan");
      return;
    }
    setCheckoutLoading(tierId);
    try {
      const baseUrl = window.location.origin + "/pricing";
      const res = await pricingService.createCheckoutSession(
        tierId,
        `${baseUrl}?success=true&tierId=${tierId}`,
        `${baseUrl}?cancel=true`
      );
      if (res.success && res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Failed to initiate checkout");
        setCheckoutLoading(null);
      }
    } catch (error) {
      toast.error("Something went wrong");
      setCheckoutLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center relative overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <motion.div className="text-center mb-16 max-w-2xl">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary mb-6">
          <Sparkles className="size-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Pricing Plans</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          invest in your future
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Upgrade your account to unlock exclusive discounts on all mentor sessions and accelerate your learning journey.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full max-w-5xl relative z-10">
        {tiers.map((tier) => {
          const isActive = userSubscription?.subscriptionType?.toUpperCase() === tier.name.toUpperCase();
          
          return (
          <div
            key={tier.id}
            className={`relative flex flex-col p-8 rounded-[3rem] border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
              isActive 
                ? "bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/50 shadow-emerald-500/20 shadow-2xl" 
                : tier.isPopular
                  ? "bg-gradient-to-b from-slate-900 to-slate-800 border-slate-700 text-white shadow-xl shadow-primary/20 dark:from-primary/10 dark:to-slate-900 dark:border-primary/30"
                  : "bg-white/50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 glass"
            }`}
          >
            {isActive && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-2 bg-emerald-500 rounded-full flex items-center gap-2 shadow-lg z-20">
                <CheckCircle2 className="size-4 text-white" />
                <span className="text-[10px] font-black tracking-widest uppercase text-white">Current Plan</span>
              </div>
            )}

            {tier.isPopular && !isActive && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-primary to-cyan-500 rounded-full flex items-center gap-2 shadow-lg">
                <Crown className="size-4 text-white" />
                <span className="text-[10px] font-black tracking-widest uppercase text-white">Most Popular</span>
              </div>
            )}

            <div className="mb-8">
              <h3 className={`text-2xl font-black tracking-tighter lowercase mb-2 ${
                  isActive ? "text-emerald-700 dark:text-emerald-400" : tier.isPopular ? "text-white" : "text-slate-900 dark:text-white"
              }`}>
                {tier.name}
              </h3>
              <p className={tier.isPopular ? "text-slate-400 text-sm" : "text-muted-foreground text-sm"}>
                {tier.description}
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-black tracking-tighter ${
                    isActive ? "text-emerald-700 dark:text-emerald-400" : tier.isPopular ? "text-white" : "text-slate-900 dark:text-white"
                }`}>${tier.price}</span>
                <span className={`text-xs font-bold uppercase tracking-widest ${
                    tier.isPopular ? "text-slate-400" : "text-slate-500"
                }`}>/ month</span>
              </div>
              {tier.discountPercentage > 0 && (
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-2 shadow-inner">
                  <div className="size-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                     <Sparkles className="size-3 text-white animate-pulse" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter leading-none">
                    {tier.discountPercentage}% Instant Discount on all mentor sessions
                  </span>
                </div>
              )}
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {tier.features?.map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className={`size-5 mt-0.5 shrink-0 ${
                    isActive ? "text-emerald-500" : tier.isPopular ? "text-cyan-400" : "text-primary"
                  }`} />
                  <span className={`text-sm ${
                    tier.isPopular ? "text-slate-300" : "text-slate-600 dark:text-slate-300"
                  }`}>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                isActive
                  ? "bg-emerald-500 text-white cursor-default shadow-lg shadow-emerald-500/20"
                  : tier.isPopular
                    ? "bg-gradient-to-r from-primary to-cyan-500 text-white hover:opacity-90 shadow-[0_0_20px_rgba(14,165,233,0.3)] border-none"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
              disabled={checkoutLoading === tier.id || isActive}
              onClick={() => handleCheckout(tier.id)}
            >
              {checkoutLoading === tier.id ? (
                <div className="flex items-center gap-2">
                  <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : isActive ? (
                <div className="flex items-center gap-2 justify-center">
                  <CheckCircle2 className="size-4" /> PURCHASED
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center">
                  Get {tier.name} <Zap className="size-4" />
                </div>
              )}
            </Button>
          </div>
        )})}
      </div>
    </div>
  );
}
