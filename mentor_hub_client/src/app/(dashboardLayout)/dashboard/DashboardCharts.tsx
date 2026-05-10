"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { TrendingUp, Activity } from "lucide-react";

const PIE_COLORS = ["#0ea5e9", "#22d3ee", "#64748b", "#f59e0b", "#10b981"];

interface DashboardChartsProps {
  barData: any[];
  pieData: any[];
  barLabel: string;
  barKey: string;
}

export default function DashboardCharts({ barData, pieData, barLabel, barKey }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Bar Chart */}
      <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-black tracking-tighter text-foreground">{barLabel} Trend</h2>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">Monthly overview</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="size-4 text-primary" />
          </div>
        </div>
        {barData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={24}>
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
                    fontSize: 12, fontWeight: 700
                  }}
                />
                <Bar dataKey={barKey} name={barLabel} fill="hsl(var(--primary))" radius={[8, 8, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">No chart data available.</div>
        )}
      </div>

      {/* Pie Chart */}
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
                  contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))", fontSize: 12, fontWeight: 700 }}
                />
                <Legend 
                  iconType="circle" iconSize={8}
                  formatter={(v) => <span style={{ fontSize: 11, fontWeight: 700, textTransform: "capitalize", color: "hsl(var(--foreground))" }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
           <div className="h-64 flex items-center justify-center text-muted-foreground">No data yet</div>
        )}
      </div>
    </div>
  );
}
