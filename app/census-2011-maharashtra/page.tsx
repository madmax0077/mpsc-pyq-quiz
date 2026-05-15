import type { Metadata } from "next";
import Link from "next/link";
import CensusGameClient from "./CensusGameClient";

export const metadata: Metadata = {
  title: "Maharashtra Census 2011 — Memorize-it Game (Rank, Quiz, Flashcards)",
  description:
    "Master Maharashtra Census 2011 the fun way. All 35 districts — population, sex ratio, literacy, decadal growth, density. Top-10 & bottom-10 leaderboards, rank-race, MCQ quiz and flashcards built for MPSC/UPSC aspirants.",
  keywords: [
    "Maharashtra Census 2011",
    "Maharashtra district population 2011",
    "Maharashtra census memorization",
    "MPSC census 2011 questions",
    "Maharashtra sex ratio district wise",
    "Maharashtra literacy rate district wise",
    "Maharashtra population density",
    "MPSC general studies Census 2011",
  ],
  alternates: { canonical: "/census-2011-maharashtra" },
  openGraph: {
    type: "article",
    title: "Maharashtra Census 2011 — Memorize-it Game",
    description:
      "All 35 Maharashtra districts in one fun memory game: top-10 & bottom-10 lists, rank-race, MCQ quiz, flashcards.",
    url: "https://www.mpscs.in/census-2011-maharashtra",
    images: ["/og-image.svg"],
  },
};

const SITE_URL = "https://www.mpscs.in";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/census-2011-maharashtra#webpage`,
      url: `${SITE_URL}/census-2011-maharashtra`,
      name: "Maharashtra Census 2011 — Memorize-it Game",
      description:
        "Interactive game to memorize Maharashtra Census 2011 district-wise data (population, sex ratio, literacy, density, decadal growth) for MPSC/UPSC.",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      breadcrumb: { "@id": `${SITE_URL}/census-2011-maharashtra#breadcrumb` },
      inLanguage: "en-IN",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/census-2011-maharashtra#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Maharashtra Census 2011", item: `${SITE_URL}/census-2011-maharashtra` },
      ],
    },
    {
      "@type": "Game",
      name: "Maharashtra Census 2011 — Memorize-it Game",
      genre: "Educational",
      gameItem: [
        { "@type": "Thing", name: "Top 10 / Bottom 10 reveal" },
        { "@type": "Thing", name: "Rank Race — order districts by a metric" },
        { "@type": "Thing", name: "MCQ Quiz — district vs metric" },
        { "@type": "Thing", name: "Flashcards of memorable Census 2011 facts" },
      ],
    },
  ],
};

export default function CensusGamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
              <span aria-hidden>📊</span> Maharashtra Census 2011 — Memorize-it Game
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              All 35 districts · Population · Sex Ratio · Literacy · Density · Decadal Growth
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-6">
        <CensusGameClient />

        {/* SEO context block */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">About this game</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            A focused, four-mode game to help MPSC / UPSC / state-PSC aspirants <strong>memorize</strong>{" "}
            Maharashtra Census 2011 data — the single most-asked General Studies topic on Maharashtra geography & society.
            The dataset covers all <strong>35 districts</strong> as they existed in Census 2011 (Palghar was carved out of
            Thane only on 1 August 2014, so its population is included inside Thane&apos;s figure).
          </p>
          <ul className="mt-3 list-disc pl-6 text-sm text-slate-600 dark:text-slate-300 space-y-1">
            <li><strong>Reveal mode</strong> — top 10 / bottom 10 by population, sex ratio, literacy, density, decadal growth.</li>
            <li><strong>Rank Race</strong> — drag-sort 5 random districts in the right order for a metric. Beat your best score.</li>
            <li><strong>Quiz</strong> — 10 MCQs per round across all metrics (which district has highest literacy? lowest sex ratio? etc.).</li>
            <li><strong>Flashcards</strong> — 20 high-yield one-liner facts (highest, lowest, state totals).</li>
          </ul>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>State headline numbers (Census 2011):</strong> total population 11.24 crore (2nd in India after UP),
            decadal growth 15.99%, density 365/km², sex ratio 929, child sex ratio 894, literacy 82.34% (M 88.38%, F 75.87%),
            urban share 45.22%.
          </p>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Data source: Census of India 2011 / census2011.co.in.
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
              <Link href="/map" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Map</Link>
              <span>|</span>
              <Link href="/exams" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Exams</Link>
              <span>|</span>
              <Link href="/about" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">About</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
