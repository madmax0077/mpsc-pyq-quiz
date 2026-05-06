import type { Metadata } from "next";
import Link from "next/link";
import MapPageClient from "./MapPageClient";

export const metadata: Metadata = {
  title: "Interactive Map of Maharashtra — Rivers, Tributaries, Forts, UNESCO sites",
  description:
    "Explore a high-resolution OpenStreetMap-based map of Maharashtra. See every major river — the Deccan systems (Godavari, Krishna, Bhima, Tapi, Wardha, Wainganga, Painganga) and the Konkan coastal rivers (Damanganga, Vaitarna, Ulhas, Patalganga, Amba, Kundalika, Savitri, Vashishti, Shastri, Kajli, Muchkundi, Gad, Karli, Terekhol) plus 30+ tributaries with name labels. Toggle layers for dams, waterfalls, ghats, power plants, minerals, UNESCO sites and historic forts (saffron flag).",
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
            MPSC geography preparation and casual exploration. The map opens with only the
            <strong> Rivers</strong> layer enabled so you can read the drainage clearly;
            tap any other pill in the layer panel on the left (or the <em>All</em> button)
            to add dams, waterfalls, ghats, power plants, minerals, UNESCO sites and
            historic forts.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Deccan / east-flowing rivers</strong> &mdash; Godavari, Krishna, Bhima,
            Tapi, Wardha, Wainganga, Painganga &mdash; are drawn with a thicker dark-blue
            line, with their tributaries (Krishna: Koyna, Venna, Panchganga, Warna, Yerla,
            Dudhganga, Hiranyakeshi, Agrani; Koyna sub-tribs Solshi, Kandati, Morna;
            Godavari: Pravara, Manjira, Purna, Mula, Darna, Kadwa, Sindphana; Bhima:
            Mula-Mutha, Indrayani, Nira, Pavna, Bhama, Ghod, Sina; Tapi: Girna, Purna,
            Panzhra, Bori, Aner; Wardha: Yashoda, Wenna; Wainganga: Kanhan, Pench, Bagh,
            Bavanthadi; Painganga: Adan, Pus, Arunavati) drawn slightly thinner.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Konkan / west-flowing coastal rivers</strong> &mdash; Damanganga,
            Vaitarna, Ulhas, Patalganga, Amba, Kundalika, Savitri, Vashishti, Shastri,
            Kajli, Muchkundi, Gad, Karli, Terekhol &mdash; all rise in the Sahyadri and
            empty into the Arabian Sea, shown with their tributaries (Vaitarna: Pinjal,
            Surya, Tansa; Ulhas: Bhatsa). Historic forts use a saffron flag marker.
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
