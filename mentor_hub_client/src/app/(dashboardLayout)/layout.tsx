import { getSession } from "@/components/service/auth.service";
import { redirect } from "next/navigation";
import DashboardShell from "./DashboardShell";

export const dynamic = "force-dynamic";

type Role = "admin" | "student" | "tutor" | "manager" | "vendor" | "organizer";

interface DashboardLayoutProps {
  admin: React.ReactNode;
  student: React.ReactNode;
  tutor: React.ReactNode;
  children: React.ReactNode;
}

export default async function DashboardLayout({
  admin,
  student,
  tutor,
  children,
}: DashboardLayoutProps) {
  const response = await getSession();
  const session = response?.data;

  if (!session?.user) {
    redirect("/signin");
  }

  const rawRole = session.user.role;
  const role = rawRole.toLowerCase() as Role;
  const user = session.user;

  if (!role) {
    redirect("/signin");
  }

  // Handle Banned Users dynamically
  if (user.status === "BANNED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-card border border-destructive/20 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-destructive/10 blur-3xl rounded-full" />
          <div className="w-20 h-20 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-10 text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-2">Account <span className="text-destructive">Suspended.</span></h1>
          <p className="text-sm text-muted-foreground font-medium mb-8">
            Your access to the MentorHub workspace has been revoked due to a violation of our terms of service or security policies.
          </p>
          <div className="pt-6 border-t border-border">
             <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Contact our support team for an appeal.</p>
             <form action="/api/auth/signout" method="POST">
                <button type="submit" className="w-full py-4 rounded-xl bg-destructive/10 text-destructive font-black uppercase tracking-widest text-[10px] hover:bg-destructive/20 transition-all border border-destructive/20 shadow-inner">
                   Sign Out to Continue
                </button>
             </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell role={rawRole} user={user}>
      {children}
    </DashboardShell>
  );
}
