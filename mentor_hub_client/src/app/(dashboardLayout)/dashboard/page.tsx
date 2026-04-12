"use client";

import { useEffect, useState } from "react";
import {
  Users, BookOpen, DollarSign, TrendingUp, Star, Clock,
  CheckCircle, ArrowRight, Loader2, Activity, FileText, Calendar,
  ShoppingBag
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";
import { dashboardService } from "@/components/service/dashboard.service";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Project theme colors from CSS variables
const PIE_COLORS = ["#0ea5e9", "#22d3ee", "#64748b", "#f59e0b", "#10b981"];

const iconMap: Record<string, any> = {
  users: Users, book: BookOpen, dollar: DollarSign,
  check: CheckCircle, star: Star, clock: Clock,
  file: FileText, activity: Activity, calendar: Calendar,
};

const statAccents = [
  { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20", glow: "shadow-primary/5" },
  { bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-500/20", glow: "shadow-emerald-500/5" },
  { bg: "bg-violet-500/10", text: "text-violet-600", border: "border-violet-500/20", glow: "shadow-violet-500/5" },
  { bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-500/20", glow: "shadow-amber-500/5" },
  { bg: "bg-cyan-500/10", text: "text-cyan-600", border: "border-cyan-500/20", glow: "shadow-cyan-500/5" },
];

const roleConfig: Record<string, { greeting: string; subtitle: string; tableTitle: string; barKey: string; barLabel: string }> = {
  admin: { greeting: "Platform Overview", subtitle: "Full system analytics and user management.", tableTitle: "Recent Bookings", barKey: "amount", barLabel: "Revenue ($)" },
  student: { greeting: "My Learning Hub", subtitle: "Track your sessions, progress, and spending.", tableTitle: "My Recent Sessions", barKey: "bookings", barLabel: "Bookings" },
  tutor: { greeting: "Tutor Studio", subtitle: "Monitor your sessions, earnings, and ratings.", tableTitle: "Recent Student Sessions", barKey: "sessions", barLabel: "Sessions" },
  manager: { greeting: "Management Console", subtitle: "Platform operations, reporting and oversight.", tableTitle: "Recent Platform Users", barKey: "total", barLabel: "Bookings" },
  vendor: { greeting: "Vendor Storefront", subtitle: "Manage content, clients and transactions.", tableTitle: "Recent Blog Posts", barKey: "items", barLabel: "Items" },
  organizer: { greeting: "Event Control Room", subtitle: "Schedule and track platform events.", tableTitle: "Recent Events", barKey: "events", barLabel: "Events" },
};

export default function UniversalDashboard() {
  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [statsRes, sessionRes] = await Promise.all([
        dashboardService.getStats(),
        authClient.getSession(),
      ]);
      if (statsRes?.success) setData(statsRes.data);
      else if (statsRes?.message?.includes("Tutor profile not found") || statsRes?.error?.includes("not found")) {
        setData({ isMissingProfile: true });
      }
      if (sessionRes?.data?.user) setUser(sessionRes.data.user);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Loading your workspace...</p>
      </div>
    </div>
  );

  const role = (user?.role || "student").toLowerCase();
  const config = roleConfig[role] || roleConfig.student;
  const stats = data?.stats || [];
  const recentActivity = data?.recentActivity || [];
  const barData = data?.charts?.revenue || data?.charts?.trend || [];
  const pieData = data?.charts?.distribution || [];

  return (
    <div className="space-y-6 pb-16">

      {data?.isMissingProfile && role === "tutor" && (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-10 border border-amber-500/20 mb-8 shadow-2xl">
           <div className="absolute top-0 right-0 p-12 opacity-10">
              <Star className="size-32 text-amber-500" />
           </div>
           <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-black tracking-tighter mb-4 text-foreground">
                 Complete Your <span className="text-amber-500 italic">Teaching Profile.</span>
              </h2>
              <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
                 You are registered as a Tutor, but your public profile is not yet active. Establish your presence, define your pricing, and start accepting global mentorship sessions today.
              </p>
              <Link href="/dashboard/tutor" className="inline-flex items-center gap-3 px-8 h-12 rounded-full bg-amber-500 text-amber-950 font-black uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20">
                 Activate Profile <ArrowRight className="size-4" />
              </Link>
           </div>
        </div>
      )}

      {/* ── Welcome Banner ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent p-8">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1.5 w-6 rounded-full bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                {role} workspace
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 text-foreground">
              {config.greeting},&nbsp;
              <span className="text-primary">{user?.name?.split(" ")[0] || "User"}.</span>
            </h1>
            <p className="text-sm text-muted-foreground font-medium">{config.subtitle}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Today</p>
              <p className="text-sm font-black text-foreground">
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Activity className="size-5 text-primary" />
            </div>
          </div>
        </div>
        {/* decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 blur-3xl rounded-full -mr-36 -mt-36 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-40 h-40 bg-primary/3 blur-2xl rounded-full -mb-20 pointer-events-none" />
      </div>

      {/* ── Overview Cards ─────────────────────────────────────────────── */}
      <div className={cn(
        "grid gap-4",
        stats.length <= 3 ? "grid-cols-1 sm:grid-cols-3" :
          stats.length === 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-5"
      )}>
        {stats.map((stat: any, i: number) => {
          const accent = statAccents[i % statAccents.length];
          const Icon = iconMap[stat.icon] || Activity;
          return (
            <div
              key={i}
              className={cn(
                "group relative overflow-hidden rounded-2xl border bg-card p-6 hover:shadow-lg transition-all duration-300",
                accent.border
              )}
            >
              <div className={cn("w-11 h-11 rounded-xl border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300", accent.bg, accent.border)}>
                <Icon className={cn("size-5", accent.text)} />
              </div>
              <p className={cn("text-3xl font-black tracking-tighter mb-1", accent.text)}>{stat.value}</p>
              <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              {stat.growth && (
                <div className="flex items-center gap-1 mt-3">
                  <TrendingUp className="size-3 text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-600">{stat.growth}</span>
                </div>
              )}
              <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 -mr-8 -mt-8", accent.bg)} />
            </div>
          );
        })}
      </div>

      {/* ── Charts ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Bar / Line Chart — col-span 3 */}
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-black tracking-tighter text-foreground">
                {config.barLabel} Trend
              </h2>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">Monthly overview</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="size-4 text-primary" />
            </div>
          </div>
          {barData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barSize={24} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fontWeight: 700, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false} axisLine={false} dy={8}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fontWeight: 700, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false} axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--card))",
                      color: "hsl(var(--foreground))",
                      fontSize: 12, fontWeight: 700, boxShadow: "0 8px 32px rgba(0,0,0,0.08)"
                    }}
                    cursor={{ fill: "hsl(var(--primary)/0.04)" }}
                  />
                  <Bar
                    dataKey={config.barKey}
                    name={config.barLabel}
                    fill="hsl(var(--primary))"
                    radius={[8, 8, 4, 4]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <p className="text-sm font-medium">No chart data available yet.</p>
            </div>
          )}
        </div>

        {/* Pie / Donut Chart — col-span 2 */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-black tracking-tighter text-foreground">Distribution</h2>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">Status breakdown</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="size-4 text-primary" />
            </div>
          </div>
          {pieData.filter((d: any) => d.value > 0).length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData.filter((d: any) => d.value > 0)}
                    cx="50%" cy="45%"
                    innerRadius={55} outerRadius={85}
                    paddingAngle={5} dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--card))",
                      color: "hsl(var(--foreground))",
                      fontSize: 12, fontWeight: 700
                    }}
                  />
                  <Legend
                    iconType="circle" iconSize={8}
                    formatter={(v) => (
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: "capitalize", color: "hsl(var(--foreground))" }}>
                        {v}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
              <div className="w-20 h-20 rounded-full border-4 border-dashed border-border flex items-center justify-center">
                <Activity className="size-8 text-muted-foreground opacity-30" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Dynamic Table ──────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-base font-black tracking-tighter text-foreground">{config.tableTitle}</h2>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">Live data from backend</p>
          </div>
          <Link href={
            role === "admin" ? "/dashboard/bookings" :
              role === "vendor" ? "/dashboard/products" :
                role === "organizer" ? "/dashboard/bookings-manage" :
                  role === "tutor" ? "/dashboard/tutor/bookings" :
                    role === "student" ? "/dashboard/bookings" :
                      "/dashboard"
          }>
            <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:underline underline-offset-4 transition-all">
              View All <ArrowRight className="size-3" />
            </button>
          </Link>
        </div>

        {recentActivity.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th className="text-left py-3 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entity</th>
                  <th className="text-left py-3 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Detail</th>
                  <th className="text-left py-3 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Value</th>
                  <th className="text-left py-3 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentActivity.map((item: any, i: number) => {
                  const type = item.type || "BOOKING";
                  const name = type === "PURCHASE" ? item.title : (item.student?.name || item.name || "—");
                  const detail = type === "PURCHASE" ? "Digital Product" : (item.tutor?.name || item.subject || "—");
                  const value = item.totalPrice ? `$${item.totalPrice}` : (item.amount ? `$${item.amount}` : "—");
                  const status = item.status || "Active";
                  const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—";

                  const statusColor =
                    status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                      status === "PENDING" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                        status === "CANCELLED" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                          "bg-primary/10 text-primary border-primary/20";

                  return (
                    <tr key={i} className="hover:bg-muted/30 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-9 h-9 rounded-xl border flex items-center justify-center text-xs font-black shadow-sm group-hover:scale-110 transition-transform",
                            type === "PURCHASE" ? "bg-violet-500/10 text-violet-600 border-violet-500/20" : "bg-primary/10 text-primary border-primary/20"
                          )}>
                            {type === "PURCHASE" ? <ShoppingBag className="size-4" /> : (name[0]?.toUpperCase() || "?")}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-foreground truncate max-w-28 capitalize">{name}</span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">{type}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground font-medium truncate max-w-32">{detail}</td>
                      <td className="py-4 px-6 text-sm font-black text-primary">{value}</td>
                      <td className="py-4 px-6">
                        <span className={cn("text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border", statusColor)}>
                          {status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs font-bold text-muted-foreground">{date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted/60 border border-border flex items-center justify-center mx-auto mb-4 relative">
              <BookOpen className="size-7 text-muted-foreground opacity-40" />
              <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-sm font-black tracking-tight text-foreground mb-1 italic">Knowledge Abyss.</p>
            <p className="text-xs text-muted-foreground font-medium">Your recent sessions and product acquisitions will surface here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
