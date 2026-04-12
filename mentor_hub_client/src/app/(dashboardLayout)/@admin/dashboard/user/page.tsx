"use client";

import { useEffect, useState } from "react";
import { 
    Search, 
    Shield, 
    User, 
    MoreHorizontal, 
    Trash2, 
    ChevronLeft, 
    ChevronRight,
    Loader2,
    ArrowUpDown
} from "lucide-react";
import DeleteUserButton from "./userDelete";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const AllUsersClient = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/getAll?search=${search}&page=${page}&limit=${limit}`, {
        headers: { "Content-Type": "application/json" },
        // @ts-ignore
        credentials: "include",
      });
      const result = await res.json();
      if (result.success) {
        setUsers(result.data.users);
        setTotal(result.data.total);
      }
    } catch (error) {
      toast.error("failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">user. <span className="text-primary">management.</span></h1>
          <p className="text-muted-foreground text-sm font-medium">orchestrate platform identities and permissions.</p>
        </div>
        <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 mt-0.5 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
                placeholder="search by name or email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="glass border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold outline-none focus:border-primary/50 transition-all w-80 shadow-2xl"
            />
        </div>
      </div>

      <div className="glass rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="text-left py-6 px-10 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <div className="flex items-center gap-2">Member <ArrowUpDown className="size-3" /></div>
                </th>
                <th className="text-left py-6 px-10 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Level</th>
                <th className="text-left py-6 px-10 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Created</th>
                <th className="text-right py-6 px-10 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {loading ? (
                  <tr>
                      <td colSpan={4} className="py-20 text-center">
                          <Loader2 className="size-8 animate-spin text-primary mx-auto mb-4" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">synchronizing data...</p>
                      </td>
                  </tr>
              ) : users.length > 0 ? (
                users.map((user: any) => (
                  <tr key={user.id} className="group hover:bg-white/5 transition-all duration-300">
                    <td className="py-6 px-10">
                        <div className="flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center font-black text-xs text-primary group-hover:rotate-12 transition-transform">
                                {user.name?.[0] || 'U'}
                            </div>
                            <div>
                                <p className="text-sm font-black tracking-tight text-white mb-0.5">{user.name}</p>
                                <p className="text-[10px] font-bold text-muted-foreground lowercase">{user.email}</p>
                            </div>
                        </div>
                    </td>

                    <td className="py-6 px-10 border-none">
                      <span className={cn(
                          "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border inline-flex items-center gap-2",
                          user.role === "ADMIN" ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      )}>
                        {user.role === "ADMIN" && <Shield size={10} />}
                        {user.role}
                      </span>
                    </td>

                    <td className="py-6 px-10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                    </td>

                    <td className="py-6 px-10 text-right">
                       <DeleteUserButton
                         userId={user.id}
                         userName={user.name}
                         userRole={user.role}
                       />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={4} className="py-32 text-center">
                        <div className="size-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 opacity-40">
                            <User className="size-8" />
                        </div>
                        <p className="text-xl font-black tracking-tighter text-white lowercase">no matching members found.</p>
                        <p className="text-xs text-muted-foreground mt-2 font-medium lowercase">try adjusting your search parameters.</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
            <div className="px-10 py-8 border-t border-white/5 flex items-center justify-between bg-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    page <span className="text-white">{page}</span> of <span className="text-white">{totalPages}</span> — total {total} entries.
                </p>
                <div className="flex items-center gap-2">
                    <button 
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                        <ChevronLeft className="size-4" />
                    </button>
                    <button 
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AllUsersClient;
