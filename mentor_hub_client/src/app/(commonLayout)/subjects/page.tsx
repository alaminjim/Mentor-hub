"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Calculator, 
  Beaker, 
  Code, 
  Globe, 
  Music, 
  Palette, 
  TrendingUp, 
  BrainCircuit,
  ArrowRight
} from "lucide-react";
import { ScrollReveal, RevealItem } from "@/components/animations/ScrollReveal";
import { getCategories, Category } from "@/components/service/category.service";

const iconMap: Record<string, React.ReactNode> = {
  mathematics: <Calculator className="size-8 text-blue-500" />,
  science: <Beaker className="size-8 text-emerald-500" />,
  coding: <Code className="size-8 text-sky-500" />,
  languages: <Globe className="size-8 text-amber-500" />,
  music: <Music className="size-8 text-rose-500" />,
  arts: <Palette className="size-8 text-purple-500" />,
  business: <TrendingUp className="size-8 text-cyan-500" />,
  ai: <BrainCircuit className="size-8 text-indigo-500" />,
};

export default function SubjectsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <ScrollReveal>
        <div className="max-w-4xl mb-24">
          <RevealItem>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 lowercase leading-tight">
              explore. <br />
              <span className="text-gradient">knowledge.</span>
            </h1>
          </RevealItem>
          <RevealItem>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium lowercase max-w-2xl">
              discover world-class mentors across a vast spectrum of subjects, from fundamental sciences to cutting-edge technologies.
            </p>
          </RevealItem>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bento-item h-[300px] animate-pulse bg-white/5 border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, i) => (
              <RevealItem key={category.id}>
                <Link 
                  href={`/subjects/${category.id}`}
                  className="group bento-item bg-transparent min-h-[300px] flex flex-col justify-between hover:bg-white/5 transition-all duration-500 border border-white/5 hover:border-primary/30"
                >
                  <div className="space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                      {iconMap[category.name.toLowerCase()] || <BrainCircuit className="size-8 text-primary" />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tighter lowercase group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground text-sm font-medium lowercase mt-2 line-clamp-2">
                        {category.description || `master ${category.name} with expert-led personalized mentorship and practical excellence.`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground transition-all">
                        explore category
                     </span>
                     <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                        <ArrowRight className="size-4 text-white" />
                     </div>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </div>
        )}

        {/* Categories Stats */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 p-12 md:p-24 glass rounded-[4rem] border border-white/10">
           <div className="text-center md:text-left">
              <span className="text-gradient text-6xl md:text-8xl font-black tracking-tighter">50+</span>
              <p className="text-lg font-black uppercase tracking-widest text-muted-foreground mt-2">specialized subjects.</p>
           </div>
           <div className="text-center md:text-left">
              <span className="text-gradient text-6xl md:text-8xl font-black tracking-tighter">10k+</span>
              <p className="text-lg font-black uppercase tracking-widest text-muted-foreground mt-2">expert mentors.</p>
           </div>
           <div className="text-center md:text-left">
              <span className="text-gradient text-6xl md:text-8xl font-black tracking-tighter">1M+</span>
              <p className="text-lg font-black uppercase tracking-widest text-muted-foreground mt-2">successful sessions.</p>
           </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
