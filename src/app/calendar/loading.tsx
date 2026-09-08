export default function Loading() {
  return (
    <main className="flex flex-col items-center px-4 pt-4 md:pt-14">
      <div className="w-full max-w-7xl rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 px-4 py-6 shadow-2xl shadow-black/20 md:px-6 md:py-8">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="h-3 w-40 rounded-full bg-white/10" />
            <div className="mt-4 h-10 w-72 max-w-full rounded-2xl bg-white/10" />
          </div>
          <div className="h-4 w-72 max-w-full rounded-full bg-white/10" />
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-10 w-24 rounded-full bg-white/10" />
          ))}
        </div>

        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(16.5rem,1fr))]">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div key={idx} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="h-12 bg-white/10" />
              <div className="space-y-3 p-4">
                <div className="h-3 w-28 rounded-full bg-white/10" />
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }).map((__, dayIdx) => (
                    <div key={dayIdx} className="h-7 rounded-full bg-white/5" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3 text-sm text-zinc-400">
          <div className="h-2 w-2 animate-pulse rounded-full bg-pink-400" />
          Loading the latest calendar data...
        </div>
      </div>
    </main>
  );
}