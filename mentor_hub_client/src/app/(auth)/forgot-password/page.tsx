"use client";

import Image from "next/image";
import authHero from "../../../../public/image/auth_hero.png";
import { ForgotPasswordForm } from "@/components/modules/auth/forgot-password-form";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
      {/* Left side: Form */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative z-10"
      >
        <div className="absolute top-8 left-12 flex items-center gap-2">
            <div className="size-10 bg-sky-500 rounded-2xl rotate-12 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <span className="text-white font-black text-xl -rotate-12">M</span>
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white uppercase">Mentor<span className="text-sky-500">Hub.</span></span>
        </div>

        <ForgotPasswordForm />

        <div className="absolute bottom-8 left-12">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                © 2026 MentorHub Global. Secure Recovery.
            </p>
        </div>
      </motion.div>

      {/* Right side: Hero Image */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="hidden lg:block lg:w-[45%] xl:w-[55%] relative p-6"
      >
        <div className="relative h-full w-full rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-900">
            <Image
                src={authHero}
                alt="Recovery background"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sky-900/60 via-sky-900/10 to-transparent" />
            
            <div className="absolute bottom-16 left-16 right-16">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="p-10 backdrop-blur-2xl bg-sky-950/20 rounded-[3rem] border border-white/20 shadow-2xl"
                >
                    <h2 className="text-5xl font-black text-white tracking-tighter mb-4 leading-none">
                        Secure Your <br /> <span className="text-sky-400">Account Access.</span>
                    </h2>
                    <p className="text-sky-50 font-medium text-lg max-w-lg leading-relaxed">
                        We use military-grade encryption and multi-factor authentication to keep your data safe and private.
                    </p>
                </motion.div>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
