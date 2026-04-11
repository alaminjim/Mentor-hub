"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  width?: "fit-content" | "100%";
  staggerChildren?: number;
}

export const ScrollReveal = ({ 
  children, 
  width = "100%", 
  staggerChildren = 0.1 
}: ScrollRevealProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerChildren,
          },
        },
      }}
      style={{ width }}
    >
      {children}
    </motion.div>
  );
};

export const RevealItem = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1] 
          }
        },
      }}
    >
      {children}
    </motion.div>
  );
};
