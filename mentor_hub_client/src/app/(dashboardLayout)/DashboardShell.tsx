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

  if (!role || !navGroups || navGroups.length === 0) {
    console.error("Invalid role or no navigation groups:", {
      rawRole,
      role,
      user,
    });
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Dashboard
          </h1>
          <p className="text-gray-600">Invalid role: {rawRole}</p>
          <Link
            href="/signin"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  const segments = pathname.split("/").filter(Boolean);
  const currentPage = segments[segments.length - 1] ?? "dashboard";
  const formattedPage =
    currentPage.charAt(0).toUpperCase() +
    currentPage.slice(1).replace(/-/g, " ");

  const [userData, setUserData] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await authClient.getSession();
        if (res?.data?.user) {
          setUserData(res.data.user);
        } else {
          setUserData(null);
        }
      } catch {
        setUserData(null);
      }
    };
    fetchSession();
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    setUserData(null);
    router.push("/signin");
    router.refresh();
    toast.success("Sign Out Successful");
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href={`/`}>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-md shrink-0">
                    <span className="text-white font-bold text-base">M</span>
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Mentor_Hub</span>
                    <span className="text-xs text-muted-foreground">
                      Learning Platform
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {navGroups.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.href}>
                            <item.icon className="size-4" />
                            <span>{item.label}</span>
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

        <SidebarFooter>
          <SidebarGroup>
            <SidebarGroupLabel>Support</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings className="size-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <HelpCircle className="size-4" />
                      <span>Help Center</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleSignOut}>
                    <LogOut className="size-4" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <div className="flex items-center gap-3 px-2 py-3 border-t">
            <Avatar className="size-9">
              <AvatarImage src={user.image ?? ""} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-sky-400 to-cyan-500 text-white font-semibold">
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1 overflow-hidden">
              <span className="text-sm font-medium truncate">{user.name}</span>
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full w-fit font-medium",
                  roleBadge[role],
                )}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            </div>
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={`/dashboard/${role}`}>
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{formattedPage}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
