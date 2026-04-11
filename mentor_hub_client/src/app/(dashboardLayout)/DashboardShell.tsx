"use client";

import {
  BarChart3,
  BookOpen,
  ClipboardList,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  Star,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

type Role = "admin" | "student" | "tutor";

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
      title: "Overview",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { label: "All Users", icon: Users, href: "/dashboard/user" },
        {
          label: "All Bookings",
          icon: ClipboardList,
          href: "/dashboard/booking",
        },
        {
          label: "Manage Category",
          icon: Star,
          href: "/dashboard/category",
        },
      ],
    },
  ],
  student: [
    {
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          href: "/dashboard",
        },
        {
          label: "My Bookings",
          icon: ClipboardList,
          href: "/dashboard/bookings",
        },
        { label: "My Reviews", icon: Star, href: "/dashboard/bookings/review" },
        {
          label: "Manage Profile",
          icon: User,
          href: "/dashboard/profile",
        },
      ],
    },
  ],
  tutor: [
    {
      title: "Overview",
      items: [
        {
          label: "Create Profile",
          icon: LayoutDashboard,
          href: "/dashboard",
        },
        {
          label: "Tutor Profile",
          icon: UserCheck,
          href: "/dashboard/tutor",
        },
        {
          label: "My Bookings",
          icon: BookOpen,
          href: "/dashboard/tutor/bookings",
        },
      ],
    },
  ],
};

const roleBadge: Record<Role, string> = {
  admin: "bg-red-100 text-red-700",
  student: "bg-blue-100 text-blue-700",
  tutor: "bg-green-100 text-green-700",
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
  const role = rawRole.toLowerCase() as Role;
  const navGroups = navDataByRole[role] || [];
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

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
    <SidebarProvider className="dark">
      <div className="flex min-h-screen w-full bg-[#050505] text-neutral-200">
        <Sidebar className="border-r border-white/5 bg-black/60 backdrop-blur-3xl">
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
                      const isActive = pathname === item.href;
                      return (
                        <SidebarMenuItem key={item.label}>
                          <SidebarMenuButton 
                            asChild 
                            isActive={isActive}
                            className={cn(
                              "h-12 px-4 rounded-2xl transition-all duration-300 border border-transparent",
                              isActive 
                                ? "bg-primary/10 border-primary/20 text-white shadow-lg" 
                                : "hover:bg-white/5 hover:border-white/10 text-neutral-400 hover:text-white"
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
            <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                 <Avatar className="size-10 border border-white/20">
                    <AvatarImage src={user.image} />
                    <AvatarFallback className="bg-primary text-white font-black uppercase text-xs">
                      {user.name?.[0]}
                    </AvatarFallback>
                 </Avatar>
                 <div className="overflow-hidden">
                    <p className="text-xs font-black uppercase tracking-tight truncate lowercase">{user.name}</p>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{role}</p>
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

        <SidebarInset className="bg-[#050505] flex-1">
          <header className="flex h-20 items-center justify-between px-8 border-b border-white/5 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-10">
            <div className="flex items-center gap-6">
               <SidebarTrigger className="hover:bg-white/5 p-2 rounded-xl transition-colors" />
               <div className="h-6 w-px bg-white/10 hidden md:block" />
               <Breadcrumb>
                 <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/dashboard" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">workspace</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block opacity-20" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-xs font-black uppercase tracking-[0.2em] text-white underline decoration-primary decoration-2 underline-offset-8">
                        {formattedPage}.
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                 </BreadcrumbList>
               </Breadcrumb>
            </div>
            
            <div className="flex items-center gap-4">
               <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Search className="size-4" />
               </button>
               <button className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <Settings className="size-4 text-primary" />
               </button>
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
