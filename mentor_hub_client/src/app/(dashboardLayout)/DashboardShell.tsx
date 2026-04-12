"use client";

import {
  BarChart3,
  BookOpen,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Search,
  Star,
  User,
  UserCheck,
  Users,
  ChevronDown,
  ShieldAlert,
  ShoppingBag,
  Heart,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

type Role = "admin" | "student" | "tutor" | "manager" | "vendor" | "organizer";

type NavItem = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
};

const navDataByRole: Record<Role, NavGroup[]> = {
  admin: [
    {
      title: "Global Command",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { label: "Platform Audits", icon: ShieldAlert, href: "/dashboard/audits" },
        { label: "All Bookings", icon: ClipboardList, href: "/dashboard/bookings" },
        { label: "Manage Events", icon: Calendar, href: "/dashboard/events" },
        { label: "Manage Products", icon: ShoppingBag, href: "/dashboard/products" },
        { label: "Blog Engine", icon: FileText, href: "/dashboard/blogs" },
      ],
    },
  ],
  student: [
    {
      title: "Engagement Hub",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { label: "My Sessions", icon: ClipboardList, href: "/dashboard/bookings" },
        { label: "Joined Events", icon: UserCheck, href: "/dashboard/events/joined" },
        { label: "Saved Events", icon: Heart, href: "/dashboard/events/saved" },
        { label: "Product Library", icon: BookOpen, href: "/dashboard/browse-products" },
        { label: "Saved Tutors", icon: Star, href: "/dashboard/bookmarks?tab=tutors" },
        { label: "My Reviews", icon: Star, href: "/dashboard/bookings/review" },
        { label: "Edit Profile", icon: User, href: "/dashboard/profile" },
      ],
    },
  ],
  tutor: [
    {
      title: "Tutor Command",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { label: "Teaching Profile", icon: UserCheck, href: "/dashboard/tutor" },
        { label: "My Bookings", icon: ClipboardList, href: "/dashboard/bookings" },
        { label: "My Products", icon: ShoppingBag, href: "/dashboard/products" },
        { label: "My Events", icon: Calendar, href: "/dashboard/events" },
        { label: "Blog Engine", icon: FileText, href: "/dashboard/blogs" },
        { label: "Edit Profile", icon: User, href: "/dashboard/profile" },
      ],
    },
  ],
  manager: [
    {
      title: "Platform Ops",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { label: "User Audits", icon: ShieldAlert, href: "/dashboard/audits" },
        { label: "System Reports", icon: BarChart3, href: "/dashboard/reports" },
        { label: "All Bookings", icon: ClipboardList, href: "/dashboard/bookings" },
        { label: "Manage Events", icon: Calendar, href: "/dashboard/events" },
        { label: "Edit Profile", icon: User, href: "/dashboard/profile" },
      ],
    },
  ],
  vendor: [
    {
      title: "Commerce Hub",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { label: "Sell Products", icon: ShoppingBag, href: "/dashboard/products" },
        { label: "Host Events", icon: Calendar, href: "/dashboard/events" },
        { label: "Wishlists", icon: Heart, href: "/dashboard/bookmarks" },
        { label: "Edit Profile", icon: User, href: "/dashboard/profile" },
      ],
    },
  ],
  organizer: [
    {
      title: "Events & Trade",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { label: "Manage Events", icon: Calendar, href: "/dashboard/events" },
        { label: "Registrations", icon: Users, href: "/dashboard/bookings-manage" },
        { label: "Joined Events", icon: UserCheck, href: "/dashboard/events/joined" },
        { label: "Edit Profile", icon: User, href: "/dashboard/profile" },
      ],
    },
  ],
};

const roleBadge: Record<Role, string> = {
  admin: "bg-red-500/10 text-red-500 border-red-500/20",
  student: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  tutor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  manager: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  vendor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  organizer: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
};

interface DashboardShellProps {
  role: string;
  user: SessionUser;
  children: ReactNode;
}

export default function DashboardShell({
  role: rawRole,
  user,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = rawRole.toLowerCase() as Role;
  const navGroups = navDataByRole[role] || [];
  const [userData, setUserData] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await authClient.getSession();
        if (res?.data?.user) setUserData(res.data.user);
      } catch { setUserData(null); }
    };
    fetchSession();
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success("signed out successfully");
    router.push("/signin");
    router.refresh();
  };

  const segments = pathname.split("/").filter(Boolean);
  const currentPage = segments[segments.length - 1] ?? "dashboard";
  const formattedPage = currentPage.toLowerCase().replace(/-/g, " ");

  return (
    <SidebarProvider suppressHydrationWarning>
      <div suppressHydrationWarning className="flex min-h-screen w-full bg-background text-foreground">
        <Sidebar className="border-r border-border bg-card/80 backdrop-blur-xl">
          <SidebarHeader className="p-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <BarChart3 className="size-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter lowercase leading-tight">
                hub.<br />
                <span className="text-primary">workspace.</span>
              </span>
            </Link>
          </SidebarHeader>

          <SidebarContent className="px-4 py-8">
            {navGroups.map((group) => (
              <SidebarGroup key={group.title} className="mb-8">
                <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 px-4">
                  {group.title}.
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-2">
                    {group.items.map((item) => {
                      const currentFull = pathname + (searchParams.toString() ? "?" + searchParams.toString() : "");
                      const isActive = currentFull === item.href || (pathname === item.href && !item.href.includes("?"));
                      return (
                        <SidebarMenuItem key={item.label}>
                          <SidebarMenuButton 
                            asChild 
                            isActive={isActive}
                            className={cn(
                              "h-11 px-4 rounded-2xl transition-all duration-300 border border-transparent",
                              isActive 
                                ? "bg-primary/10 border-primary/30 text-primary" 
                                : "hover:bg-accent hover:border-border text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <Link href={item.href} className="flex items-center gap-3">
                              <item.icon className={cn("size-4 transition-transform group-hover:scale-110", isActive ? "text-primary" : "")} />
                              <span className="text-xs font-black uppercase tracking-widest leading-none mt-0.5">{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter className="p-6 space-y-6">
            <div className="p-4 rounded-3xl bg-accent border border-border">
              <div className="flex items-center gap-3 mb-4">
                 <Avatar className="size-10 border border-white/20">
                    <AvatarImage src={user.image} />
                    <AvatarFallback className="bg-primary text-white font-black uppercase text-xs">
                      {user.name?.[0]}
                    </AvatarFallback>
                 </Avatar>
                 <div className="overflow-hidden">
                    <p className="text-xs font-black uppercase tracking-tight truncate lowercase">{user.name}</p>
                    <p className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border w-fit mt-1", roleBadge[role])}>
                      {role}
                    </p>
                 </div>
              </div>
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-widest"
              >
                <LogOut className="size-3" /> sign out.
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="bg-background flex-1 min-w-0">
          <header className="flex h-16 items-center justify-between px-6 border-b border-border sticky top-0 bg-background backdrop-blur-md z-40">
            <div className="flex items-center gap-6">
               <SidebarTrigger className="hover:bg-white/5 p-2 rounded-xl transition-colors" />
               <div className="h-5 w-px bg-border hidden md:block" />
               <Breadcrumb>
                 <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/dashboard" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">workspace</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block opacity-20" />
                    <BreadcrumbItem>
                       <BreadcrumbPage className="text-xs font-black uppercase tracking-widest text-foreground">
                        {formattedPage}.
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                 </BreadcrumbList>
               </Breadcrumb>
            </div>
            
            <div className="flex items-center gap-4">
               <button className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center hover:bg-accent transition-colors hidden sm:flex">
                  <Search className="size-4 opacity-40" />
               </button>
               
               {/* Profile Dropdown — JS controlled for proper z-index */}
               <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(prev => !prev)}
                    className="flex items-center gap-2.5 bg-background pl-2 pr-3 py-1.5 rounded-full border border-border hover:border-primary/50 hover:bg-accent transition-all duration-300"
                  >
                    <Avatar className="size-8">
                        <AvatarImage src={user.image} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-black uppercase text-[10px]">
                            {user.name?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                        <p className="text-[10px] font-black uppercase tracking-tight leading-none text-foreground">{user.name}</p>
                        <p className="text-[8px] font-bold text-primary uppercase tracking-widest mt-1">{role}</p>
                    </div>
                    <ChevronDown className={cn("size-3 text-muted-foreground transition-transform duration-300", dropdownOpen && "rotate-180")} />
                  </button>

                  {dropdownOpen && (
                    <>
                      {/* Overlay to close on click outside */}
                      <div className="fixed inset-0" style={{ zIndex: 998 }} onClick={() => setDropdownOpen(false)} />
                      {/* Dropdown panel */}
                      <div className="absolute top-full right-0 mt-2 w-64" style={{ zIndex: 999 }}>
                        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                            <div className="px-5 py-4 border-b border-border bg-muted/60">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Signed in as</p>
                                <p className="text-sm font-bold text-foreground truncate">{user.email}</p>
                            </div>
                            <div className="p-2">
                                <Link href="/dashboard/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-accent transition-colors">
                                    <User className="size-4 text-primary" />
                                    <span className="text-xs font-black uppercase tracking-widest text-foreground">My Profile</span>
                                </Link>
                            </div>
                            <div className="p-2 border-t border-border">
                                <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-destructive/10 transition-colors text-destructive">
                                    <LogOut className="size-4" />
                                    <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
                                </button>
                            </div>
                        </div>
                      </div>
                    </>
                  )}
               </div>
            </div>
          </header>

          <main className="p-8">
            <ScrollReveal>
              {children}
            </ScrollReveal>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
