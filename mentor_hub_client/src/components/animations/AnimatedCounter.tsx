"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: string; // e.g., "50,000+"
  className?: string;
}

export const AnimatedCounter = ({ value, className }: AnimatedCounterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView || !ref.current) return;

    // Extract numeric parts
    const numericValue = parseInt(value.replace(/[^0-9]/g, ""));
    const suffix = value.replace(/[0-9]/g, "");
    
    const obj = { val: 0 };
    
    gsap.to(obj, {
      val: numericValue,
      duration: 2.5,
      ease: "power3.out",
      onUpdate: () => {
        if (ref.current) {
          ref.current.innerText = Math.floor(obj.val).toLocaleString() + suffix;
        }
      },
    });
  }, [isInView, value]);

  return (
    <div ref={ref} className={className}>
      0{value.replace(/[0-9]/g, "")}
    </div>
  );
};
