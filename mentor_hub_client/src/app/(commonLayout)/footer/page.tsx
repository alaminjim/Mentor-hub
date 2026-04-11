"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import { ScrollReveal, RevealItem } from "@/components/animations/ScrollReveal";
import toast from "react-hot-toast";
import { useState } from "react";

const Footer = ({ className }: { className?: string }) => {
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
  
  const sections = [
    {
      title: "Resources",
      links: [
        { text: "Find a Tutor", url: "/tutors" },
        { text: "Become a Tutor", url: "/signup" },
        { text: "How it Works", url: "/features" },
        { text: "Success Stories", url: "/blog" },
        { text: "Blog", url: "/blog" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About Us", url: "/about" },
        { text: "Careers", url: "/careers" },
        { text: "Partners", url: "/partners" },
        { text: "Contact Us", url: "/contact" },
      ],
    },
    {
      title: "Social",
      links: [
        {
          text: "LinkedIn",
          url: "https://www.linkedin.com/in/al-amin-islam-668a30377/",
        },
        { text: "Twitter", url: "https://x.com/md_alamin_jim" },
        { text: "Facebook", url: "https://www.facebook.com/md.alamin.jim" },
        { text: "Instagram", url: "https://www.instagram.com/alamin_zig/" },
      ],
    },
  ];

  return (
    <footer
      className={cn(
        "w-full bg-[#f4faff] border-t border-cyan-100/50 pt-24 pb-8",
        className,
      )}
    >
      <ScrollReveal>
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 mb-20">
            {/* Left Box: Logo and Intro Text */}
            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10">
              <RevealItem>
                <Link href="/" className="inline-flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <GraduationCap className="size-6 text-white" />
                  </div>
                  <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                    MENTORHUB.
                  </span>
                </Link>
              </RevealItem>
              <RevealItem>
                <p className="text-slate-500 text-xs md:text-sm max-w-[250px] leading-relaxed pt-1 font-medium">
                  Because if your education platform can't connect you with true
                  experts, neither will your career.
                </p>
              </RevealItem>
            </div>

            {/* Right Box: Call to Action */}
            <div className="lg:pl-20 border-t border-cyan-100 pt-10 lg:pt-0 lg:border-t-0 lg:border-l">
              <RevealItem>
                <span className="text-cyan-600 font-bold text-[10px] uppercase tracking-widest mb-4 block">
                  Newsletter
                </span>
                <h2 className="text-4xl md:text-5xl font-black mb-8 text-slate-800 tracking-tight">
                  Stay updated <br /> with us
                </h2>

                {/* Input Field Form */}
                <form
                  onSubmit={handleSubscribe}
                  className="flex w-full max-w-sm bg-white rounded-full p-1.5 focus-within:ring-2 ring-cyan-400 transition-all shadow-md shadow-cyan-100"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubscribing}
                    placeholder="Enter your email..."
                    className="flex-1 bg-transparent border-none outline-none px-6 text-slate-900 placeholder:text-slate-400 text-sm font-medium"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="size-10 md:size-12 rounded-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-70 shadow-md flex items-center justify-center text-white transition-all shrink-0"
                  >
                    {isSubscribing ? (
                      <Loader2 className="size-4 md:size-5 animate-spin" />
                    ) : (
                      <ArrowRight className="size-4 md:size-5" />
                    )}
                  </button>
                </form>
              </RevealItem>
            </div>
          </div>

          {/* Middle Section: Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-28 border-t border-cyan-100 pt-16">
            {sections.map((section, i) => (
              <div key={i}>
                <RevealItem>
                  <h3 className="font-extrabold text-slate-800 mb-6 text-lg">
                    {section.title}
                  </h3>
                  <ul className="space-y-4">
                    {section.links.map((link, j) => (
                      <li key={j}>
                        <Link
                          href={link.url}
                          className="text-slate-500 hover:text-cyan-600 transition-colors text-sm font-medium"
                        >
                          {link.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </RevealItem>
              </div>
            ))}

            {/* Visual spacer / Graphic area */}
            <div className="hidden md:flex items-end justify-end opacity-20 hover:opacity-40 transition-opacity">
              <GraduationCap className="size-48 text-cyan-500 block" />
            </div>
          </div>

          {/* Bottom Legal / Copyright Section */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-cyan-100 gap-6">
            <RevealItem>
              <span className="text-xs text-slate-500 font-bold tracking-wider uppercase">
                &copy; {new Date().getFullYear()} MentorHub Inc.
              </span>
            </RevealItem>

            <RevealItem>
              <div className="flex flex-wrap justify-center items-center gap-8 text-xs text-slate-500 font-semibold tracking-wide">
                <Link
                  href="/contact"
                  className="hover:text-cyan-600 transition-colors"
                >
                  Support
                </Link>
                <Link
                  href="/privacy"
                  className="hover:text-cyan-600 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-cyan-600 transition-colors"
                >
                  Terms of Use
                </Link>
                <Link
                  href="/cookies"
                  className="hover:text-cyan-600 transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>
            </RevealItem>
          </div>
        </div>
      </ScrollReveal>
    </footer>
  );
};

export default Footer;
