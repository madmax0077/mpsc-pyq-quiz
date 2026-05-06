import type { Metadata } from "next";
import Link from "next/link";
import MapPageClient from "./MapPageClient";

export const metadata: Metadata = {
  title: "Interactive Map of Maharashtra — Rivers, Tributaries, Forts, UNESCO sites",
  description:
    "Explore a high-resolution OpenStreetMap-based map of Maharashtra. See major rivers (Godavari, Krishna, Bhima, Tapi, Wardha, Wainganga) and their tributaries with name labels, plus dams, waterfalls, ghats, power plants, mineral deposits, UNESCO World Heritage sites, and historic forts.",
  keywords: [
    "Maharashtra map",
    "Maharashtra districts map",
    "Maharashtra rivers map",
    "Maharashtra forts map",
    "Sahyadri Western Ghats map",
    "Maharashtra UNESCO sites",
    "MPSC geography map",
  ],
  alternates: { canonical: "/map" },
};

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Back to home"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100">
              <span aria-hidden>🗺️</span> Maharashtra — Interactive Map
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rivers &amp; tributaries · Dams · Waterfalls · Ghats · Forts · UNESCO · Minerals
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-6">
        <MapPageClient />

        {/* SEO context block (rendered as plain HTML for crawlers) */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">About this map</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            High-resolution OpenStreetMap-based interactive map of Maharashtra useful for
            MPSC geography preparation and casual exploration. The river layer shows the
            seven major drainage systems &mdash; Godavari, Krishna, Bhima, Tapi, Wardha,
            Wainganga, Savitri &mdash; plus their key tributaries (Koyna, Venna, Panchganga,
            Warna, Mula-Mutha, Indrayani, Nira, Pravara, Manjira, Purna, Girna, Kanhan), each
            with an inline name label. Other layers include large dams (Koyna, Jayakwadi,
            Bhandardara&hellip;), historic forts (Raigad, Sinhagad, Pratapgad&hellip;),
            waterfalls, ghats, the Tarapur nuclear station, key hydro projects, mineral
            belts, and UNESCO sites (Ajanta, Ellora, Elephanta, CSMT, Western Ghats). Use
            the layer panel on the left to toggle what you want to see.
          </p>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Map tiles &copy; OpenStreetMap contributors.
          </p>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 py-6 dark:border-slate-700/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-slate-400 dark:text-slate-500">MPSC PYQ QUIZ &middot; Don&apos;t know Academy</p>
            <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
              <Link href="/" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Home</Link>
              <span>|</span>
              <Link href="/exams" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Exams</Link>
              <span>|</span>
              <Link href="/about" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">About</Link>
              <span>|</span>
              <Link href="/contact" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
