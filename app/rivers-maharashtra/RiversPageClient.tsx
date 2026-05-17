"use client";

/**
 * Client wrapper for the Maharashtra rivers map.
 *
 * Leaflet only runs in the browser, so we dynamically import the heavy
 * component with ssr:false to keep it out of the server bundle.
 */
import dynamic from "next/dynamic";

const MaharashtraRiversMap = dynamic(() => import("@/components/MaharashtraRiversMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[65vh] w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500 dark:border-slate-700 dark:border-t-sky-400" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Preparing the rivers map…</p>
      </div>
    </div>
  ),
});

export default function RiversPageClient() {
  return (
    <div className="h-[78vh] min-h-[560px] w-full">
      <MaharashtraRiversMap />
    </div>
  );
}
