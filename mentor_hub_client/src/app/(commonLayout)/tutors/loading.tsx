export default function TutorsLoading() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 lg:px-24">
      {/* Hero skeleton */}
      <div className="max-w-4xl mb-16 space-y-6 animate-pulse">
        <div className="h-16 w-2/3 rounded-2xl bg-white/10" />
        <div className="h-16 w-1/2 rounded-2xl bg-white/10" />
        <div className="h-6 w-full max-w-xl rounded-full bg-white/10" />
      </div>

      {/* Filter bar skeleton */}
      <div className="mb-12 flex gap-4 border-y border-white/5 py-8 animate-pulse">
        <div className="h-12 w-36 rounded-full bg-white/10" />
        <div className="h-12 w-44 rounded-full bg-white/10" />
        <div className="ml-auto h-12 w-64 rounded-full bg-white/10" />
      </div>

      {/* Cards skeleton grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[2rem] overflow-hidden border border-white/5 bg-white/[0.03] animate-pulse h-[420px]"
          >
            <div className="h-48 bg-white/10" />
            <div className="p-6 space-y-3">
              <div className="h-5 w-2/3 rounded-full bg-white/10" />
              <div className="h-4 w-1/2 rounded-full bg-white/10" />
              <div className="flex gap-2 pt-2">
                <div className="h-7 w-20 rounded-full bg-white/10" />
                <div className="h-7 w-20 rounded-full bg-white/10" />
              </div>
              <div className="h-10 w-full rounded-full bg-white/10 mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
