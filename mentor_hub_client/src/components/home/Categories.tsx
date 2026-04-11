"use client";

import { 
  Calculator, 
  Beaker, 
  Code, 
  Globe, 
  Music, 
  BookOpen, 
  ArrowRight,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ScrollReveal, RevealItem } from "../animations/ScrollReveal";
import { useEffect, useState } from "react";

const iconMap: Record<string, React.ReactNode> = {
  mathematics: <Calculator className="size-6" />,
  science: <Beaker className="size-6" />,
  coding: <Code className="size-6" />,
  languages: <Globe className="size-6" />,
  music: <Music className="size-6" />,
  humanities: <BookOpen className="size-6" />,
};

const defaultColor = "text-primary";
const defaultGrid = "md:col-span-2 lg:col-span-2";

const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      <div style={{ transform: "translateZ(50px)" }} className="h-full">
        {children}
      </div>
    </motion.div>
  );
};

export default function Categories() {
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/category`);
        const json = await res.json();
        if (json.success) {
          setCategoryData(json.data);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="section-padding">
      <ScrollReveal>
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-3xl">
            <RevealItem>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 lowercase">
                explore. <span className="text-gradient">categories.</span>
              </h2>
            </RevealItem>
            <RevealItem>
              <p className="text-xl text-muted-foreground font-medium lowercase">
                find the perfect mentor across a wide range of subjects. our experts are ready to help you master any skill.
              </p>
            </RevealItem>
          </div>
          <RevealItem>
            <Link href="/browse" className="group flex items-center gap-3 text-lg font-black uppercase tracking-widest hover:text-primary transition-colors">
              view all <ArrowRight className="size-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </RevealItem>
        </div>

        {loading ? (
             <div className="flex justify-center py-20">
                <Loader2 className="size-12 animate-spin text-primary opacity-20" />
             </div>
        ) : (
          <div className="bento-grid">
            {categoryData.slice(0, 6).map((cat, i) => (
              <RevealItem key={i}>
                <Link href={`/subjects/${cat.name.toLowerCase().replace(" ", "-")}`}>
                  <TiltCard className={`bento-item ${cat.grid || defaultGrid} min-h-[220px] group cursor-pointer`}>
                     <div className="space-y-4">
                        <div className={`w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center ${cat.color || defaultColor} group-hover:scale-110 group-hover:bg-primary/5 transition-all`}>
                          {iconMap[cat.name.toLowerCase()] || <BookOpen className="size-6" />}
                        </div>
                        <div>
                          <h3 className="text-2xl font-black tracking-tighter lowercase group-hover:text-primary transition-colors">{cat.name}.</h3>
                          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{cat.count || "0 mentors"}</p>
                        </div>
                     </div>
                     <div className="mt-8 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="size-6 text-primary" />
                     </div>
                  </TiltCard>
                </Link>
              </RevealItem>
            ))}
          </div>
        )}
      </ScrollReveal>
    </section>
  );
}
