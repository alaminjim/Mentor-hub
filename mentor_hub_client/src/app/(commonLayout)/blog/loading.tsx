export default function BlogLoading() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 lg:px-24">
      {/* Hero skeleton */}
      <div className="max-w-4xl mb-24 space-y-6 animate-pulse">
        <div className="h-16 w-2/3 rounded-2xl bg-white/10" />
        <div className="h-16 w-1/2 rounded-2xl bg-white/10" />
        <div className="h-6 w-full max-w-xl rounded-full bg-white/10" />
      </div>

      {/* Category pills skeleton */}
      <div className="flex gap-3 mb-12 animate-pulse">
        {[90, 110, 100, 120, 130].map((w, i) => (
          <div
            key={i}
            className="h-9 rounded-full bg-white/10"
            style={{ width: w }}
          />
        ))}
      </div>

      {/* Cards skeleton grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[2.5rem] overflow-hidden border border-white/5 bg-white/[0.03] animate-pulse"
          >
            <div className="h-64 bg-white/10" />
            <div className="p-8 space-y-4">
              <div className="h-3 w-1/2 rounded-full bg-white/10" />
              <div className="h-6 w-3/4 rounded-full bg-white/10" />
              <div className="h-4 w-full rounded-full bg-white/10" />
              <div className="h-4 w-5/6 rounded-full bg-white/10" />
              <div className="pt-4 flex justify-between">
                <div className="h-8 w-28 rounded-full bg-white/10" />
                <div className="h-10 w-10 rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
