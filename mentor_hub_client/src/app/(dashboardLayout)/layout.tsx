import { getSession } from "@/components/service/auth.service";
import { redirect } from "next/navigation";
import DashboardShell from "./DashboardShell";

type Role = "admin" | "student" | "tutor";

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

  const roleSlot = {
    admin,
    student,
    tutor,
  }[role];

  return (
    <DashboardShell role={rawRole} user={user}>
      {roleSlot ?? children}
    </DashboardShell>
  );
}
