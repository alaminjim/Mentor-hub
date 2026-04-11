export default function BlogDetailLoading() {
  return (
    <div className="min-h-screen pt-32 pb-24 animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-4 w-32 rounded-full bg-white/10 mb-12" />

        <div className="max-w-4xl mx-auto mb-16 space-y-6">
          <div className="h-6 w-28 rounded-full bg-white/10" />
          <div className="h-16 w-3/4 rounded-2xl bg-white/10" />
          <div className="h-12 w-1/2 rounded-2xl bg-white/10" />
          <div className="flex justify-between items-center py-8 border-y border-white/5">
            <div className="flex gap-4 items-center">
              <div className="size-12 rounded-2xl bg-white/10" />
              <div className="space-y-2">
                <div className="h-4 w-28 rounded-full bg-white/10" />
                <div className="h-3 w-20 rounded-full bg-white/10" />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="size-10 rounded-xl bg-white/10" />
              <div className="size-10 rounded-xl bg-white/10" />
            </div>
          </div>
        </div>

        <div className="aspect-[21/9] rounded-[3rem] bg-white/10 mb-24" />

        <div className="max-w-3xl mx-auto space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-5 rounded-full bg-white/10"
              style={{ width: `${70 + Math.random() * 30}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
