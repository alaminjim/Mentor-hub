"use client";

import { useEffect, useState } from "react";
import { Shield, ShieldAlert, ShieldCheck, Users, Search, Ban, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

export default function SecurityAuditsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/dashboard/manager/users");
      const data = await res.json();
      if (data?.success) {
        setUsers(data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBan = async (id: string, currentStatus: string) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/dashboard/manager/users/ban", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, currentStatus })
      });
      const data = await res.json();
      if (data?.success) {
        toast.success(data.message || "Status updated successfully.");
        // locally update UI
        setUsers(users.map(u => u.id === id ? { ...u, status: data.data.status } : u));
      } else {
        toast.error("Failed to update user status.");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Initializing Security Audit Console...</p>
    </div>
  );

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const bannedUsersCount = users.filter(u => u.status === "BANNED").length;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="p-8 rounded-[2rem] bg-card border border-border relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
             <Shield className="size-5 text-primary" />
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">moderator toolkit</p>
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">Platform Security & <span className="text-primary">Audit.</span></h1>
          <p className="text-muted-foreground text-sm font-medium">Oversee user accounts, enforce policies, and monitor platform integrity.</p>
        </div>
        <div className="relative z-10 flex gap-4">
           <div className="p-4 rounded-2xl bg-muted/50 border border-border text-center min-w-[120px]">
              <p className="text-3xl font-black text-foreground mb-1">{users.length}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Total Users</p>
           </div>
           <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-center min-w-[120px]">
              <p className="text-3xl font-black text-destructive mb-1">{bannedUsersCount}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-destructive/80">Restricted</p>
           </div>
        </div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 blur-3xl rounded-full -mt-40 pointer-events-none" />
      </div>

      {/* Main Table Container */}
      <div className="bg-card border border-border rounded-[2rem] overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30">
           <div>
              <h2 className="text-lg font-black tracking-tighter">User Directory</h2>
              <p className="text-xs font-semibold text-muted-foreground mt-1">Manage all platform identities</p>
           </div>
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Search by name, email..."
                 className="w-full sm:w-72 h-12 pl-11 pr-4 rounded-xl bg-background border border-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Identity</th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Role</th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="text-right py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Enforcement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((u) => {
                const isBanned = u.status === "BANNED";
                return (
                  <tr key={u.id} className={cn("transition-colors hover:bg-muted/30", isBanned && "bg-destructive/5 hover:bg-destructive/10")}>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0", 
                           isBanned ? "bg-destructive/20 text-destructive border border-destructive/20" : "bg-primary/10 text-primary border border-primary/20"
                        )}>
                          {u.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground truncate max-w-[200px]">{u.name}</p>
                          <p className="text-xs font-semibold text-muted-foreground truncate max-w-[200px]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border bg-muted text-muted-foreground border-border">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      {isBanned ? (
                        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-destructive">
                           <ShieldAlert className="size-3.5" /> Banned
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-emerald-500">
                           <ShieldCheck className="size-3.5" /> Active
                        </div>
                      )}
                    </td>
                    <td className="py-5 px-6 text-right">
                      {/* Don't let managers ban Admins, themselves, Vendors, or Organizers to prevent soft-locks */}
                      {(u.role === "ADMIN" || u.role === "MANAGER" || u.role === "VENDOR" || u.role === "ORGANIZER") ? (
                         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Protected Profile</span>
                      ) : (
                        <button 
                          onClick={() => handleToggleBan(u.id, u.status)}
                          disabled={actionLoading === u.id}
                          className={cn(
                             "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                             isBanned 
                               ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/20" 
                               : "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
                          )}
                        >
                           {actionLoading === u.id ? <Loader2 className="size-3 animate-spin" /> : (
                              isBanned ? <CheckCircle2 className="size-3" /> : <Ban className="size-3" />
                           )}
                           {isBanned ? "Unban User" : "Suspend Account"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              
              {filteredUsers.length === 0 && (
                 <tr>
                    <td colSpan={4} className="py-16 text-center">
                       <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mx-auto mb-4">
                          <Users className="size-8 text-muted-foreground opacity-40" />
                       </div>
                       <p className="text-sm font-bold">No users found</p>
                       <p className="text-xs font-semibold text-muted-foreground">Try adjusting your search filters.</p>
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
