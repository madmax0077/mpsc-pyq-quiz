"use client";

/**
 * Client wrapper for the Maharashtra rivers map + tributary quiz.
 *
 * The map is pure SVG (no Leaflet/OSM clutter) but still has to run in
 * the browser because it computes a viewport-aware projection, so we
 * dynamically import it with ssr:false. The quiz is also client-side.
 */
import dynamic from "next/dynamic";

const MaharashtraRiversMap2D = dynamic(() => import("@/components/MaharashtraRiversMap2D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[65vh] w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-teal-500 dark:border-slate-700 dark:border-t-teal-400" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Preparing the rivers map…</p>
      </div>
    </div>
  ),
});

const RiverTributaryQuiz = dynamic(() => import("@/components/RiverTributaryQuiz"), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
      Preparing the MPSC PYQ quiz…
    </div>
  ),
});

export default function RiversPageClient() {
  return (
    <>
      <div className="w-full">
        <MaharashtraRiversMap2D />
      </div>

      {/* MPSC PYQ quiz on Maharashtra rivers */}
      <section className="mt-8 sm:mt-10">
        <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-50 sm:text-2xl">
              <span aria-hidden>🎯</span> MPSC Rivers PYQ — Previous Year Questions
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Every question below is a <strong>real Previous-Year Question</strong>{" "}
              from an MPSC paper (Civil Services, Group B, Group C, PSI, STI,
              Sub-Ord. Group B, Asst., Excise · 2010 – 2025). Each one is tagged
              with the exact exam &amp; year it came from.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
            📜 MPSC PYQs
          </span>
        </div>
        <RiverTributaryQuiz />
      </section>
    </>
  );
}
