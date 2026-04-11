"use client";

import { Mail, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubscribing(true);
    // Simulate network request
    setTimeout(() => {
      toast.success("Thanks for subscribing! We'll keep you updated.");
      setEmail("");
      setIsSubscribing(false);
    }, 1500);
  };

  return (
    <section className="relative overflow-hidden py-12">
      <div className="rounded-[3rem] glass p-8 md:p-16 text-center border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="w-20 h-20 rounded-[2rem] bg-background border border-border text-primary flex items-center justify-center mx-auto mb-8 shadow-xl">
          <Mail className="size-10" />
        </div>
        
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 lowercase leading-none">
          ready to <span className="text-gradient">start?</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto font-medium lowercase">
          subscribe for the latest educational tips, mentor success stories, and platform updates delivered straight to your inbox.
        </p>
        
        <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={handleSubscribe}>
          <div className="flex-1 relative">
             <input 
               type="email" 
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               disabled={isSubscribing}
               required
               placeholder="enter your email address" 
               className="w-full px-8 py-5 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner lowercase font-bold disabled:opacity-70"
             />
          </div>
          <button 
            type="submit"
            disabled={isSubscribing}
            className="px-10 py-5 btn-premium text-white rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubscribing ? "subscribing..." : "subscribe"}
            {isSubscribing ? (
                <Loader2 className="size-5 animate-spin" />
            ) : (
                <Send className="size-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            )}
          </button>
        </form>
        
        <p className="mt-8 text-neutral-500 text-xs font-bold uppercase tracking-widest">
          we value your privacy. unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
