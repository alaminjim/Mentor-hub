"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import gsap from "gsap";
import { ArrowRight, Sparkles, Play, MousePointer2, Globe, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, PerspectiveCamera } from "@react-three/drei";

import img_1 from "../../../../public/image/img-1.jpg";

function InteractiveSphere() {
  const meshRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });

  return (
    <Sphere
      ref={meshRef}
      args={[1, 100, 100]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 2.2 : 2}
    >
      <MeshDistortMaterial
        color={hovered ? "#22d3ee" : "#0ea5e9"}
        speed={4}
        distort={0.4}
        radius={1}
        roughness={0}
        metalness={1}
      />
    </Sphere>
  );
}

const MagneticButton = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x, y });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  const { x, y } = position;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function Hero() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  useEffect(() => {
    if (!titleRef.current) return;
    
    // GSAP text reveal
    const text = (titleRef.current as HTMLElement).innerText;
    (titleRef.current as HTMLElement).innerHTML = text
      .split(" ")
      .map(word => `<span class='inline-block word'>${word}</span>`)
      .join(" ");

    gsap.from(".word", {
      y: 100,
      opacity: 0,
      rotateX: -90,
      stagger: 0.1,
      duration: 1.2,
      ease: "expo.out",
    });
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* 3D background visual */}
      <div className="absolute right-[-10vw] top-[10vh] w-[60vw] h-[80vh] pointer-events-none z-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#06b6d4" />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#3b82f6" />
          <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
            <InteractiveSphere />
          </Float>
        </Canvas>
      </div>

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 relative z-10">
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="px-4 py-1.5 rounded-full glass border border-primary/20 flex items-center gap-2">
              <Sparkles className="size-4 text-primary animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-primary">next-gen learning.</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
              <Globe className="size-3" /> global access
            </div>
          </motion.div>

          <h1 
            ref={titleRef}
            className="text-6xl md:text-8xl lg:text-[110px] font-black leading-[0.9] tracking-tighter mb-8 perspective-1000"
          >
            master. <br />
            your. <br />
            future.
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-lg mb-12 leading-relaxed font-medium"
          >
            connecting ambitious students with world-class mentors. experience the new standard of online education through personalized guidance.
          </motion.p>

          <div className="flex flex-wrap gap-6 items-center">
            <MagneticButton>
              <Link href="/tutors">
                <Button className="btn-premium px-10 py-8 text-xl text-white group">
                  find a mentor
                  <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </MagneticButton>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-4 group"
            >
              <div className="w-16 h-16 rounded-full glass border border-white/20 flex items-center justify-center group-hover:bg-primary transition-all">
                <Play className="size-6 fill-foreground group-hover:fill-white transition-colors" />
              </div>
              <span className="text-sm font-black uppercase tracking-widest">watch intro.</span>
            </motion.button>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-16 flex items-center gap-8 border-t border-white/10 pt-8"
          >
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-muted overflow-hidden relative grayscale hover:grayscale-0 transition-all cursor-pointer">
                  <Image src={`/image/img-${i}.jpg`} alt="User" fill className="object-cover" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-background bg-primary flex items-center justify-center text-white text-xs font-bold">
                +2k
              </div>
            </div>
            <div>
              <div className="text-xl font-black tracking-tighter lowercase">top-rated tutors.</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">trusted by 50,000+ students</div>
            </div>
          </motion.div>
        </div>

        <div className="hidden lg:flex items-center justify-center relative">
          <motion.div
            style={{ y: y1 }}
            className="relative w-full max-w-lg aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10"
          >
            <Image 
              src={img_1} 
              alt="Mentor" 
              fill 
              className="object-cover scale-110"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            <div className="absolute bottom-8 left-8 right-8 glass p-6 rounded-3xl border border-white/20">
               <div className="flex items-center gap-4 mb-4">
                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> online
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                    ★ 5.0 (492 reviews)
                  </div>
               </div>
               <div className="text-2xl font-black text-white tracking-tighter leading-none mb-1">
                  dr. sarah mitchell.
               </div>
               <div className="text-sm font-bold text-white/60 lowercase">expert in mathematics & physics</div>
            </div>
          </motion.div>

          {/* Floating Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute -left-20 top-1/4 glass p-6 rounded-3xl shadow-2xl border border-white/20 max-w-[200px]"
          >
             <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <ShieldCheck className="size-6 text-primary" />
             </div>
             <div className="text-sm font-black tracking-tight lowercase mb-1">vetted mentors.</div>
             <p className="text-[10px] font-medium text-muted-foreground">all tutors undergo rigorous background checks.</p>
          </motion.div>
        </div>
      </div>

      {/* Hero Accent */}
      <div className="absolute bottom-[-10vw] left-[-10vw] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
