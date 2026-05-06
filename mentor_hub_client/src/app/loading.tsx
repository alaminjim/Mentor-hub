import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center w-full">
      <div className="relative">
        <div className="absolute inset-0 bg-sky-500/20 blur-xl rounded-full" />
        <div className="size-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center shadow-2xl relative z-10">
          <Loader2 className="size-8 animate-spin text-sky-500" />
        </div>
      </div>
      <p className="mt-6 text-sm font-black uppercase tracking-widest text-slate-400 animate-pulse">
        Loading MentorHub...
      </p>
    </div>
  );
}
