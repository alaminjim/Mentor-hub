"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, Menu, Sunset, Trees } from "lucide-react";

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

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await authClient.getSession();
        if (res?.data?.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    fetchSession();
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    setUser(null);
  };

  const menu: MenuItem[] = [
    { title: "Home", url: "/" },
    {
      title: "Find Mentors",
      url: "/mentors",
      items: [
        {
          title: "Programming",
          description: "Web, Mobile & Backend mentors",
          icon: <Book className="size-5 text-indigo-600" />,
          url: "/mentors/programming",
        },
        {
          title: "Design",
          description: "UI/UX & Graphic design mentors",
          icon: <Sunset className="size-5 text-indigo-600" />,
          url: "/mentors/design",
        },
        {
          title: "Business",
          description: "Career & startup guidance",
          icon: <Trees className="size-5 text-indigo-600" />,
          url: "/mentors/business",
        },
      ],
    },
    { title: "Become a Mentor", url: "/become-mentor" },
    { title: "Pricing", url: "/pricing" },
    { title: "Blog", url: "/blog" },
  ];

  return (
    <section
      className={cn(
        "sticky top-0 z-50 border-b bg-white/80 backdrop-blur",
        className,
      )}
    >
      <div className="container mx-auto px-6 py-4 ">
        {/* Desktop */}
        <nav className="hidden items-center justify-between lg:flex">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-indigo-600">
              Mentor_<span className="text-gray-900">Hub</span>
            </span>
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              {menu.map((item) => renderMenuItem(item, pathname))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex gap-2">
            {!user ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/signin">Sign in</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="bg-red-500 hover:bg-red-600"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile */}
        <div className="flex items-center justify-between lg:hidden">
          <Link href="/" className="text-lg font-bold text-indigo-600">
            MentorHub
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>

            <SheetContent className="bg-white">
              <SheetHeader>
                <SheetTitle className="text-indigo-600 font-bold">
                  MentorHub
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-6">
                <Accordion type="single" collapsible>
                  {menu.map((item) => renderMobileMenuItem(item, pathname))}
                </Accordion>

                <div className="flex flex-col gap-3">
                  {!user ? (
                    <>
                      <Button asChild variant="outline">
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button
                        asChild
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Link href="/register">Get Started</Link>
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="bg-red-600 hover:bg-red-700"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem, pathname: string) => {
  const isActive = pathname === item.url;

  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger
          className={cn(isActive ? "text-indigo-600 font-semibold" : "")}
        >
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="bg-white">
          <div className="grid gap-1 p-2">
            {item.items.map((sub) => (
              <NavigationMenuLink asChild key={sub.title}>
                <SubMenuLink item={sub} />
              </NavigationMenuLink>
            ))}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink asChild>
        <Link
          href={item.url}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors",
            isActive
              ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
              : "hover:text-indigo-600",
          )}
        >
          {item.title}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem, pathname: string) => {
  const isActive = pathname === item.url;

  if (item.items) {
    return (
      <AccordionItem
        key={item.title}
        value={item.title}
        className="border-none"
      >
        <AccordionTrigger
          className={cn("font-semibold", isActive && "text-indigo-600")}
        >
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="space-y-2">
          {item.items.map((sub) => (
            <SubMenuLink key={sub.title} item={sub} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link
      key={item.title}
      href={item.url}
      className={cn("block font-semibold", isActive ? "text-indigo-600" : "")}
    >
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link href={item.url} className="flex gap-3 rounded-md p-3 hover:bg-muted">
      {item.icon}
      <div>
        <p className="font-medium">{item.title}</p>
        {item.description && (
          <p className="text-sm text-muted-foreground">{item.description}</p>
        )}
      </div>
    </Link>
  );
};

export default Navbar;
