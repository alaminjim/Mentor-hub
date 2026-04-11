"use client";

import { motion } from "framer-motion";
import { 
  Cpu, 
  Zap, 
  Shield, 
  Users, 
  Globe, 
  MessageSquare,
  Video,
  Layout,
  Star
} from "lucide-react";
import { ScrollReveal, RevealItem } from "@/components/animations/ScrollReveal";

const features = [
  {
    title: "ai-powered matching.",
    description: "our advanced algorithms connect you with the perfect mentor based on your specific learning style and goals.",
    icon: <Cpu className="size-8 text-primary" />,
    stats: "98% match accuracy"
  },
  {
    title: "interactive workspace.",
    description: "collaborate in real-time with integrated whiteboards, code editors, and document sharing tools.",
    icon: <Layout className="size-8 text-cyan-400" />,
    stats: "zero-latency tools"
  },
  {
    title: "global network.",
    description: "access world-class expertise from across the globe, transcending geographical boundaries.",
    icon: <Globe className="size-8 text-emerald-400" />,
    stats: "150+ countries"
  },
  {
    title: "encrypted security.",
    description: "your data and sessions are protected by enterprise-grade end-to-end encryption.",
    icon: <Shield className="size-8 text-sky-400" />,
    stats: "bank-level security"
  },
  {
    title: "24/7 support.",
    description: "our dedicated support team is always available to assist with any technical or academic needs.",
    icon: <MessageSquare className="size-8 text-amber-400" />,
    stats: "2min avg response"
  },
  {
    title: "session recordings.",
    description: "never miss a detail with automated cloud recordings of every session for future review.",
    icon: <Video className="size-8 text-rose-400" />,
    stats: "unlimited storage"
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <ScrollReveal>
        <div className="max-w-4xl mb-24">
          <RevealItem>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 lowercase leading-tight">
              advanced. <br />
              <span className="text-gradient">capabilities.</span>
            </h1>
          </RevealItem>
          <RevealItem>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium lowercase max-w-2xl">
              discover the technological foundation that makes mentorhub the world's leading personalized learning platform.
            </p>
          </RevealItem>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <RevealItem key={i}>
              <div className="group bento-item bg-transparent min-h-[400px] flex flex-col justify-between hover:bg-white/5 transition-all duration-500">
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter lowercase leading-tight group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-lg font-medium lowercase leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                <div className="pt-8 border-t border-white/5">
                   <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                      <Zap className="size-3 fill-primary" />
                      {feature.stats}.
                   </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-32 rounded-[4rem] glass p-12 md:p-24 text-center border border-white/10 relative overflow-hidden">
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
           <RevealItem>
             <h2 className="text-4xl md:text-6xl font-black tracking-tighter lowercase mb-8 leading-none">
               ready to experience the <br /> <span className="text-gradient">future of learning?</span>
             </h2>
           </RevealItem>
           <RevealItem>
              <button className="btn-premium px-12 py-5 text-lg uppercase tracking-widest">
                get started now.
              </button>
           </RevealItem>
        </div>
      </ScrollReveal>
    </div>
  );
}
