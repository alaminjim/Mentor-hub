"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Menu,
  BookOpen,
  Calculator,
  Beaker,
  Code,
  Globe,
  Music,
  ChevronRight,
  User,
  LogOut,
  Sparkles,
  LayoutDashboard,
  Settings,
  CreditCard,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import toast from "react-hot-toast";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

const Navbar = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);

    const fetchSession = async () => {
      try {
        const res = await authClient.getSession();
        if (res?.data?.user) {
          setUser(res.data.user);
        }
      } catch {
        setUser(null);
      }
    };
    fetchSession();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    setUser(null);
    toast.success("signed out successfully");
  };

  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/dashboard/events/public").then(r => r.json());
        if (res.success) setEvents(res.data);
      } catch (err) {
        console.error("Events sync failed");
      }
    };
    fetchEvents();
  }, []);

  const menu: MenuItem[] = [
    { title: "home", url: "/" },
    { title: "tutors", url: "/tutors" },
    { title: "products", url: "/products" },
    { 
      title: "events", 
      url: "/events",
      items: events.length > 0 ? [
        ...events.slice(0, 3).map(ev => ({
          title: ev.title,
          url: `/events/${ev.id}`,
          description: `${ev.location} • ${new Date(ev.date).toLocaleDateString()}`,
          icon: <Calendar className="size-5 text-primary" />
        })),
        { title: "View All Events", url: "/events", description: "Browse the complete academic calendar", icon: <Globe className="size-5 text-cyan-500" /> }
      ] : [
        { title: "Academic Workshops", url: "/events?cat=workshops", description: "Intensive 1-on-1 skill sessions", icon: <Sparkles className="size-5 text-primary" /> },
        { title: "Global Webinars", url: "/events?cat=webinars", description: "Live sessions from industry experts", icon: <Globe className="size-5 text-cyan-500" /> },
        { title: "Guest Lectures", url: "/events?cat=lectures", description: "Insights from top-tier mentors", icon: <GraduationCap className="size-5 text-emerald-500" /> },
        { title: "Browse Calendar", url: "/events", description: "See all upcoming platform activities", icon: <Calendar className="size-5 text-primary" /> }
      ]
    },
    { title: "blog", url: "/blog" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none p-6">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "pointer-events-auto flex items-center justify-between px-6 py-3 transition-all duration-500 rounded-full border border-white/20 glass w-full max-w-6xl mx-auto",
          isScrolled
            ? "py-2 bg-white/60 dark:bg-black/60 shadow-2xl scale-95"
            : "bg-white/20 dark:bg-black/20",
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group mr-4">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg"
          >
            <GraduationCap className="size-6 text-white" />
          </motion.div>
          <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
            mentorhub.
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {menu.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.items ? (
                    <>
                      <NavigationMenuTrigger className="bg-transparent hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest h-10 px-4 rounded-full border-none focus:bg-transparent">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[600px] gap-3 p-6 grid-cols-2 rounded-3xl glass shadow-2xl border border-white/10">
                          {item.items.map((subItem) => (
                            <li key={subItem.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={subItem.url}
                                  className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all"
                                >
                                  <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                                    {subItem.icon}
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold uppercase tracking-tight group-hover:text-primary">
                                      {subItem.title}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                      {subItem.description}
                                    </p>
                                  </div>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link
                      href={item.url}
                      className="relative px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                      onMouseEnter={() => setHoveredLink(item.title)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      {item.title}
                      {hoveredLink === item.title && (
                        <motion.div
                          layoutId="nav-hover"
                          className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                      {pathname === item.url && (
                        <motion.div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-primary rounded-full" />
                      )}
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4 ml-6 pl-6 border-l border-white/10">
            {!user ? (
              <div className="flex items-center gap-2">
                <Link href="/signin">
                  <Button
                    variant="ghost"
                    className="text-xs font-bold uppercase tracking-widest px-4 hover:bg-white/10"
                  >
                    sign in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="btn-premium flex items-center gap-2 group text-white border-none h-11">
                    get started
                    <Sparkles className="size-4 group-hover:rotate-12 transition-transform" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="relative group/dropdown">
                <button className="flex items-center gap-3 bg-white/5 pl-2 pr-4 py-1.5 rounded-full border border-white/10 hover:border-primary/50 transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white font-black text-xs uppercase shadow-lg">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      (user.name?.[0] || "u").toLowerCase()
                    )}
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-[10px] font-black uppercase tracking-tight leading-none text-slate-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-cyan-600 mt-0.5">
                      {user.role || "student"}
                    </p>
                  </div>
                  <ChevronDown className="size-3 text-muted-foreground group-hover/dropdown:rotate-180 transition-transform duration-300" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 pt-2 w-64 opacity-0 translate-y-4 pointer-events-none group-hover/dropdown:opacity-100 group-hover/dropdown:translate-y-0 group-hover/dropdown:pointer-events-auto transition-all duration-500 z-50">
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                        connected as.
                      </p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate lowercase">
                        {user.email}
                      </p>
                    </div>

                    <div className="p-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 w-full p-4 rounded-2xl hover:bg-cyan-50 dark:hover:bg-primary/10 transition-colors group/item"
                      >
                        <LayoutDashboard className="size-4 text-cyan-600 group-hover/item:scale-110 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-slate-300 group-hover:text-cyan-600 transition-colors">
                          dashboard.
                        </span>
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-3 w-full p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group/item"
                      >
                        <User className="size-4 text-slate-500 group-hover/item:scale-110 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-slate-300 group-hover:text-cyan-600 transition-colors">
                          my profile.
                        </span>
                      </Link>
                      <Link
                        href="/pricing"
                        className="flex items-center gap-3 w-full p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group/item"
                      >
                        <CreditCard className="size-4 text-slate-500 group-hover/item:scale-110 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-slate-300 group-hover:text-cyan-600 transition-colors">
                          subscription.
                        </span>
                      </Link>
                    </div>

                    <div className="p-2 border-t border-white/5">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full p-4 rounded-2xl hover:bg-rose-500/10 transition-colors group/logout"
                      >
                        <LogOut className="size-4 text-rose-500 group-hover/logout:translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest text-rose-500">
                          sign out.
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center gap-2">
          {!user && (
            <Link href="/signin">
              <Button
                variant="ghost"
                className="text-xs font-bold uppercase tracking-widest px-4"
              >
                sign in
              </Button>
            </Link>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-primary/10"
              >
                <Menu className="size-5 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full flex flex-col p-8 glass border-l border-white/10"
            >
              <SheetHeader className="pb-8">
                <SheetTitle className="flex items-center gap-2 text-3xl font-black tracking-tighter lowercase">
                  mentorhub.
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 space-y-2 mt-8">
                {menu.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {item.items ? (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem
                          value={item.title}
                          className="border-none"
                        >
                          <AccordionTrigger className="hover:no-underline text-4xl font-black tracking-tighter lowercase py-4">
                            {item.title}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid gap-4 pl-4 pt-4 border-l-2 border-primary/20 ml-2">
                              {item.items.map((subItem) => (
                                <Link
                                  key={subItem.title}
                                  href={subItem.url}
                                  className="text-xl font-bold text-muted-foreground hover:text-primary lowercase"
                                >
                                  {subItem.title}
                                </Link>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <Link
                        href={item.url}
                        className="block text-4xl font-black tracking-tighter lowercase py-4 hover:text-primary transition-colors"
                      >
                        {item.title}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/10">
                {!user ? (
                  <Link href="/signup">
                    <Button className="w-full btn-premium py-8 text-2xl lowercase tracking-tighter">
                      create account
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="destructive"
                    className="w-full py-8 text-2xl lowercase tracking-tighter"
                    onClick={handleSignOut}
                  >
                    sign out
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.header>
    </div>
  );
};

export default Navbar;
