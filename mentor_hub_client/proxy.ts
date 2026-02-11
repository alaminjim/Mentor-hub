import { NextRequest, NextResponse } from "next/server";

export const Role = {
  admin: "admin",
  student: "student",
  tutor: "tutor",
} as const;

export type UserRole = (typeof Role)[keyof typeof Role];

const roleDashboardMap: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  student: "/dashboard/student",
  tutor: "/dashboard/tutor",
};

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const cookieHeader = request.headers.get("cookie") ?? "";

  let isAuthenticated = false;
  let role: UserRole | null = null;

  try {
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;

    const res = await fetch(`${authUrl}/get-session`, {
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();

      if (data?.user) {
        isAuthenticated = true;

        role = data.user.role.toLowerCase() as UserRole;
      }
    }
  } catch (error) {
    console.log("[proxy] Session fetch error:", error);
  }

  if (!isAuthenticated || !role) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const userDashboard = roleDashboardMap[role];

  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL(userDashboard, request.url));
  }

  if (pathname.startsWith("/dashboard/admin") && role !== Role.admin) {
    return NextResponse.redirect(new URL(userDashboard, request.url));
  }

  if (pathname.startsWith("/dashboard/student") && role !== Role.student) {
    return NextResponse.redirect(new URL(userDashboard, request.url));
  }

  if (pathname.startsWith("/dashboard/tutor") && role !== Role.tutor) {
    return NextResponse.redirect(new URL(userDashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
