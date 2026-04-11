"use client";

import { ShieldCheck, Zap, HeartHandshake, Laptop, ArrowRight, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ScrollReveal, RevealItem } from "../animations/ScrollReveal";

const benefits = [
  {
    title: "vetted professionals",
    description: "every tutor undergoes rigorous background checks and high-level skills assessment.",
    icon: <ShieldCheck className="size-6 text-sky-500" />,
  },
  {
    title: "personalized roadmap",
    description: "get a customized learning path tailored precisely to your career goals.",
    icon: <Zap className="size-6 text-emerald-500" />,
  },
  {
    title: "1-on-1 mentorship",
    description: "focused learning with dedicated experts who prioritize your unique success.",
    icon: <HeartHandshake className="size-6 text-rose-500" />,
  },
  {
    title: "interactive platform",
    description: "engage with advanced whiteboards and real-time collaboration tools.",
    icon: <Laptop className="size-6 text-indigo-500" />,
  },
  {
    title: "24/7 premium support",
    description: "our support team is always here to help you with any platform queries.",
    icon: <ShieldCheck className="size-6 text-amber-500" />,
  },
  {
    title: "career coaching",
    description: "exclusive access to resume reviews and interview prep from HR experts.",
    icon: <Award className="size-6 text-cyan-500" />,
  },
];

export default function Benefits() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section ref={containerRef} className="section-padding overflow-hidden">
      <ScrollReveal>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          <div className="relative">
            <div className="relative z-10 grid grid-cols-2 gap-6">
              <motion.div style={{ y: y1 }} className="space-y-6">
                <div className="h-[300px] md:h-[400px] rounded-[2.5rem] overflow-hidden relative shadow-2xl border border-white/10 group">
                   <Image src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80" unoptimized={true} alt="Learning" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div className="h-[200px] md:h-[250px] rounded-[2.5rem] overflow-hidden relative shadow-2xl border border-white/10 group">
                   <Image src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80" unoptimized={true} alt="Mentorship" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
              </motion.div>
              <motion.div style={{ y: y2 }} className="space-y-6 pt-12">
                <div className="h-[200px] md:h-[250px] rounded-[2.5rem] overflow-hidden relative shadow-2xl border border-white/10 group">
                   <Image src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80" unoptimized={true} alt="Success" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="h-[300px] md:h-[400px] rounded-[2.5rem] overflow-hidden relative shadow-2xl border border-white/10 group">
                   <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" unoptimized={true} alt="Growth" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </motion.div>
            </div>
          </div>

          <div>
            <RevealItem>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-12 leading-[0.9] lowercase">
                why choose. <br /> <span className="text-gradient">mentorhub?</span>
              </h2>
            </RevealItem>
            
            <div className="grid sm:grid-cols-2 gap-8 lg:gap-10">
              {benefits.map((benefit, i) => (
                <RevealItem key={i}>
                  <div className="flex gap-6 group">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-primary/5 group-hover:shadow-xl">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tighter lowercase group-hover:text-primary transition-colors mb-1">{benefit.title}.</h3>
                      <p className="text-muted-foreground leading-relaxed max-w-sm font-medium">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </div>

            <RevealItem>
              <div className="mt-16">
                 <Link href="/about" className="inline-flex w-fit btn-premium px-10 py-5 text-lg text-white group items-center gap-3 rounded-full hover:shadow-cyan-500/30 transition-all">
                   learn more about us
                   <ArrowRight className="size-5 group-hover:translate-x-2 transition-transform" />
                 </Link>
              </div>
            </RevealItem>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
