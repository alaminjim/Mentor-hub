"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Sparkles, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "ai";
  content: string;
}

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "hello! i'm mentor_bot. how can i help you find the perfect mentor today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!isMounted) return null;

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    
    setIsTyping(true);

    try {
      const { aiService: aiS } = await import("@/components/service/ai.service");
      
      // Pass history (excluding current message)
      const res = await aiS.chat(userMsg, messages.map(m => ({ 
        role: m.role === "ai" ? "bot" : "user", 
        content: m.content 
      })));
      
      setMessages((prev) => [...prev, { role: "ai", content: res.data }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", content: "connection error: i couldn't reach the mentor_bot server." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div suppressHydrationWarning className="fixed bottom-8 right-8 z-[100] pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(10px)" }}
            className="pointer-events-auto absolute bottom-24 right-0 w-[400px] h-[600px] glass rounded-[2.5rem] border border-white/20 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                  <Bot className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">mentor_bot</h3>
                  <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-tighter">always online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="size-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="size-5 text-white/50" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none"
            >
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse text-right" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "size-8 rounded-full flex items-center justify-center shrink-0 border",
                    msg.role === "user" ? "bg-white/10 border-white/20" : "bg-primary/20 border-primary/30"
                  )}>
                    {msg.role === "user" ? <User className="size-4" /> : <Sparkles className="size-4 text-primary" />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-3xl text-sm leading-relaxed",
                    msg.role === "user" 
                      ? "bg-primary text-white" 
                      : "glass border border-white/10 text-slate-900 dark:text-slate-200"
                  )}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex gap-3 mr-auto max-w-[85%]">
                  <div className="size-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                    <Loader2 className="size-4 text-primary animate-spin" />
                  </div>
                  <div className="glass border border-white/10 p-4 rounded-3xl">
                     <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0.4s]" />
                     </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-white/10 bg-white/5">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="ask something..."
                  className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="size-14 rounded-2xl bg-primary flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                  <Send className="size-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="pointer-events-auto size-16 rounded-full bg-primary shadow-2xl shadow-primary/40 flex items-center justify-center relative group"
      >
        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20 pointer-events-none" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="size-7 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageSquare className="size-7 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
