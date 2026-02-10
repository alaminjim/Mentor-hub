"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

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
    toast.success("Sign Out Successful");
  };

  const menu: MenuItem[] = [
    { title: "Home", url: "/" },
    { title: "Browse Tutors", url: "/browse-tutors" },
    { title: "Pricing", url: "/pricing" },
    { title: "Blog", url: "/blog" },
  ];

  return (
    <section
      className={cn(
        "sticky top-0 z-50 border-b border-sky-100 bg-gradient-to-r from-white via-sky-50/30 to-cyan-50/30 backdrop-blur-md shadow-sm",
        className,
      )}
    >
      <div className="container mx-auto px-6 py-4">
        <nav className="hidden items-center justify-between lg:flex">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
              Mentor_Hub
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
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hover:bg-sky-50 hover:text-sky-600"
                >
                  <Link href="/signin">Sign in</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white shadow-md"
                >
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-md"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile */}
        <div className="flex items-center justify-between lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-md">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
              Mentor_Hub
            </span>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-sky-200 hover:bg-sky-50"
              >
                <Menu className="size-4 text-sky-600" />
              </Button>
            </SheetTrigger>

            <SheetContent className="bg-gradient-to-b from-white to-sky-50/30">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <span className="bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent font-bold">
                    Mentor_Hub
                  </span>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-6 ml-6 lg:ml-0 space-y-2">
                <Accordion type="single" collapsible>
                  {menu.map((item) => renderMobileMenuItem(item, pathname))}
                </Accordion>

                <div className="flex flex-col gap-3">
                  {!user ? (
                    <>
                      <Button
                        asChild
                        variant="outline"
                        className="border-sky-200 hover:bg-sky-50 hover:text-sky-600"
                      >
                        <Link href="/signin">Sign in</Link>
                      </Button>
                      <Button
                        asChild
                        className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white shadow-md"
                      >
                        <Link href="/signup">Get Started</Link>
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-md"
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
          className={cn(
            "hover:text-sky-600 data-[state=open]:text-sky-600",
            isActive ? "text-sky-600 font-semibold" : "",
          )}
        >
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="bg-white border-sky-100">
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
      <Link
        href={item.url}
        className={cn(
          "block px-4 py-2 text-sm font-medium transition-colors rounded-lg",
          isActive
            ? "text-sky-600 font-semibold bg-sky-100/80"
            : "text-gray-700 hover:text-sky-600 hover:bg-sky-50/50",
        )}
      >
        {item.title}
      </Link>
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
          className={cn(
            "font-semibold hover:text-sky-600 hover:no-underline",
            isActive && "text-sky-600",
          )}
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
      className={cn(
        "block font-semibold py-2 px-3 rounded-lg transition-colors",
        isActive
          ? "text-sky-600 bg-sky-100/80"
          : "text-gray-700 hover:text-sky-600 hover:bg-sky-50/50",
      )}
    >
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link
      href={item.url}
      className="flex gap-3 rounded-lg p-3 hover:bg-sky-50 transition-colors"
    >
      {item.icon}
      <div>
        <p className="font-medium text-gray-900 hover:text-sky-600">
          {item.title}
        </p>
        {item.description && (
          <p className="text-sm text-gray-500">{item.description}</p>
        )}
      </div>
    </Link>
  );
};

export default Navbar;
