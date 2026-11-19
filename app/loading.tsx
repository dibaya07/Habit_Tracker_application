export default function Loading() {
  return (
    <div className="flex-1 bg-[#fafcf9] dark:bg-[#071912] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded-xl bg-slate-200/80 dark:bg-emerald-900/40" />
        <div className="h-4 w-72 rounded-lg bg-slate-200/60 dark:bg-emerald-900/30" />
        <div className="h-56 w-full rounded-3xl bg-white/80 dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/40" />
      </div>
    </div>
  );
}
