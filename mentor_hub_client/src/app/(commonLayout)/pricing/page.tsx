"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/tutors");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
       <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">redirecting to tutors...</p>
       </div>
    </div>
  );
}
