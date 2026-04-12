"use client";

import { BarChart3, TrendingUp, Users, DollarSign, FileText, Download } from "lucide-react";

export default function ReportsPage() {
  const reports = [
    { title: "Monthly Revenue", description: "Total earnings breakdown by month", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { title: "User Growth", description: "New registrations over time", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
    { title: "Booking Analytics", description: "Sessions booked and completed", icon: BarChart3, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
    { title: "Performance Report", description: "Platform health and metrics", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-2xl bg-muted/40 border border-border">
        <div>
          <h1 className="text-3xl font-black tracking-tighter mb-2">reports. <span className="text-primary">analytics.</span></h1>
          <p className="text-muted-foreground text-sm font-medium">platform performance and growth metrics.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all">
          <Download className="size-4" /> export all
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, i) => (
          <div key={i} className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group cursor-pointer">
            <div className={`w-12 h-12 rounded-xl ${report.bg} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <report.icon className={`size-5 ${report.color}`} />
            </div>
            <h3 className="text-lg font-black tracking-tighter mb-2">{report.title}</h3>
            <p className="text-sm text-muted-foreground font-medium mb-6">{report.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">last updated: today</span>
              <FileText className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
