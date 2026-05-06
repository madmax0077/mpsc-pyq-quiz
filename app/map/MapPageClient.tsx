"use client";

/**
 * Client wrapper for the Maharashtra map.
 *
 * MapLibre GL JS only runs in the browser (it touches `window` and uses
 * WebGL), so we dynamically import the heavy component with ssr:false to
 * keep it out of the server bundle and out of the home-page JS payload.
 */
import dynamic from "next/dynamic";

const MaharashtraMap = dynamic(() => import("@/components/MaharashtraMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[70vh] w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Preparing the map…</p>
      </div>
    </div>
  ),
});

export default function MapPageClient() {
  return (
    <div className="h-[70vh] sm:h-[78vh] w-full">
      <MaharashtraMap />
    </div>
  );
}
