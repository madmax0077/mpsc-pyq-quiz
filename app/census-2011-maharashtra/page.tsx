import type { Metadata } from "next";
import Link from "next/link";
import CensusGameClient from "./CensusGameClient";

export const metadata: Metadata = {
  title: "Maharashtra Census 2011 — Memorize-it Game (Rank, Quiz, Flashcards)",
  description:
    "Master Maharashtra Census 2011 the fun way. All 35 districts — population, sex ratio, child sex ratio (0–6), literacy, decadal growth, density. Top-10 & bottom-10 leaderboards, rank-race, MCQ quiz and flashcards built for MPSC/UPSC aspirants.",
  keywords: [
    "Maharashtra Census 2011",
    "Maharashtra district population 2011",
    "Maharashtra census memorization",
    "MPSC census 2011 questions",
    "Maharashtra sex ratio district wise",
    "Maharashtra child sex ratio district wise",
    "Maharashtra literacy rate district wise",
    "Maharashtra population density",
    "Beed lowest child sex ratio",
    "MPSC general studies Census 2011",
  ],
  alternates: { canonical: "/census-2011-maharashtra" },
  openGraph: {
    type: "article",
    title: "Maharashtra Census 2011 — Memorize-it Game",
    description:
      "All 35 Maharashtra districts in one fun memory game: top-10 & bottom-10 lists, rank-race, MCQ quiz, flashcards.",
    url: "https://www.mpscs.in/census-2011-maharashtra",
    images: ["/og-image.png"],
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
              All 35 districts · Population · Sex Ratio · Child Sex Ratio · Literacy · Density · Decadal Growth
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
            <li><strong>Reveal mode</strong> — top 10 / bottom 10 by population, sex ratio, <strong>child sex ratio (0–6)</strong>, literacy, density, decadal growth.</li>
            <li><strong>Rank Race</strong> — drag-sort 5 random districts in the right order for a metric. Beat your best score.</li>
            <li><strong>Quiz</strong> — 10 MCQs per round across all metrics (which district has highest literacy? lowest sex ratio? etc.).</li>
            <li><strong>Flashcards</strong> — 20 high-yield one-liner facts (highest, lowest, state totals).</li>
          </ul>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>State headline numbers (Census 2011):</strong> total population 11.24 crore (2nd in India after UP),
            decadal growth 15.99%, density 365/km², sex ratio 929, child sex ratio 894, literacy 82.34% (M 88.38%, F 75.87%),
            urban share 45.22%.
          </p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Child sex ratio (0–6) extremes:</strong> Gadchiroli has the <em>highest</em> CSR (961) — typical of
            tribal Vidarbha districts — while <strong>Beed</strong> records the <em>lowest</em> CSR in the state at just{" "}
            <strong>807</strong>, followed by Jalgaon (842), Ahmadnagar (852), Buldhana (855) and Aurangabad (858). The
            Marathwada sugar belt&apos;s skewed CSR is a frequently asked MPSC GS question.
          </p>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Data source: Census of India 2011 / census2011.co.in.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Why Census 2011 still matters for MPSC (2026 papers)</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Census 2011 remains the <strong>official reference dataset</strong> for every
            MPSC preliminary and mains paper conducted after it. The 2021 Census cycle was
            postponed because of COVID-19 and, as of 2026, is still in the field-work phase;
            the Registrar General&apos;s office has not released final tables. MPSC therefore
            continues to draw all population, sex-ratio, literacy, decadal-growth and
            urbanisation questions from Census 2011. Aspirants who ignore this dataset lose
            three to five easy marks per paper — Census questions are almost purely factual,
            they never involve reasoning, and the answers are compact numeric facts that
            reward pure memorisation.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            MPSC frames Census questions in five recurring patterns: (1) top-and-bottom
            rankings — highest / lowest district for a metric; (2) state-versus-India
            comparisons — Maharashtra&apos;s rank on a given metric; (3) intra-district
            comparisons — sex ratio vs. child sex ratio for the same district; (4) decadal
            change — which district grew fastest or slowest between 2001 and 2011; and (5)
            derived indicators — urbanisation share, tribal population share, literacy gender
            gap. This game covers all five patterns across its four modes.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">High-yield extremes to memorise</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Population.</strong> Highest: Thane (1.11 crore, effectively still
            includes Palghar); Pune (0.94 crore); Mumbai Suburban (0.94 crore); Mumbai City
            (0.31 crore). Lowest: Sindhudurg (8.5 lakh); Gadchiroli (10.7 lakh); Ratnagiri
            (16.2 lakh); Hingoli (11.8 lakh).
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Sex ratio (females per 1,000 males).</strong> Highest: Ratnagiri (1,122),
            Sindhudurg (1,036) — the two Konkan districts with historic out-migration of
            working-age males to Mumbai. Lowest: Mumbai City (838), Mumbai Suburban (860),
            Thane (886) — the migration-magnet districts that pull in male-heavy workforce.
            The Konkan-vs-Mumbai contrast is a favourite MPSC framing.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Child sex ratio (females per 1,000 males, 0–6).</strong> Highest:
            Gadchiroli (961), Chandrapur (953) — tribal-belt districts. Lowest: Beed (807),
            Jalgaon (842), Ahmadnagar (852), Buldhana (855), Aurangabad (858) — the
            Marathwada sugar-belt cluster. The state CSR of 894 is well below the national
            average of 919, which is why MPSC repeatedly frames CSR items on Maharashtra.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Literacy.</strong> Highest: Mumbai Suburban (89.9%), Mumbai City
            (89.2%), Nagpur (89.5%), Pune (86.2%). Lowest: Nandurbar (64.4%), Beed (76.5%),
            Jalna (73.6%), Hingoli (77.0%). The state figure of 82.34 % puts Maharashtra
            comfortably above the national average of 74 %, with an urban-rural gap of
            about 11 percentage points.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Population density (persons per sq. km).</strong> Highest: Mumbai City
            (20,634), Mumbai Suburban (20,925), Thane (1,157). Lowest: Gadchiroli (74),
            Sindhudurg (163), Ratnagiri (196). The state density of 365 is close to the
            national average of 382.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Decadal growth 2001-11 (%).</strong> Highest: Thane (35.9%), Pune
            (30.4%), Aurangabad (27.3%). Lowest: Sindhudurg (-2.3% — one of the very few
            districts in India that recorded negative growth), Ratnagiri (0.8%), Hingoli
            (17.4%). The state figure was 15.99 % against a national 17.7 %.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Understanding the Census methodology</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            The Census of India is conducted every ten years under the Census Act, 1948, by
            the Office of the Registrar General and Census Commissioner of India (ORGI),
            functioning under the Ministry of Home Affairs. Census 2011 was the 15th
            national census (7th since independence) and was carried out in two phases: the
            House-listing operation from April to September 2010, and the Population
            Enumeration from 9 to 28 February 2011 (with a revisional round from 1 to 5
            March 2011).
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            The Census de facto counts every individual — resident, migrant, homeless —
            physically present in the country on Census night. The reference date for all
            demographic attributes is <strong>1 March 2011, 00:00 hrs</strong>. Data is
            released in successive tabulation series: the Provisional Population Totals
            (March 2011), the Primary Census Abstract (2013), the language tables (2018)
            and religion, migration and household-amenities series. MPSC has asked about all
            of these — memorise Census 2011&apos;s <strong>reference date</strong>, its
            <strong> Commissioner</strong> (C. Chandramouli), and the two headline national
            numbers (population 121.09 crore, decadal growth 17.7%).
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            One frequently confused point: Palghar district was carved out of Thane on
            <strong> 1 August 2014</strong>, which is <strong>after</strong> Census 2011.
            Palghar therefore does not have its own Census 2011 numbers — its population
            is embedded inside Thane&apos;s figure. Similarly Osmanabad was renamed to
            Dharashiv and Aurangabad to Chhatrapati Sambhajinagar; but the Census data
            still uses the pre-rename district names, and MPSC follows the Census
            nomenclature in its official answer keys.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Six-district Konkan &amp; six-region Maharashtra breakdown</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Maharashtra is administratively organised into six revenue divisions —
            <strong> Konkan</strong> (Mumbai City, Mumbai Suburban, Thane, Palghar, Raigad,
            Ratnagiri, Sindhudurg), <strong>Nashik</strong> (Nashik, Dhule, Jalgaon,
            Nandurbar, Ahmadnagar), <strong>Pune</strong> (Pune, Satara, Sangli, Solapur,
            Kolhapur), <strong>Aurangabad / Marathwada</strong> (Aurangabad, Beed, Jalna,
            Osmanabad, Nanded, Parbhani, Latur, Hingoli), <strong>Amravati / West Vidarbha</strong>
            (Amravati, Akola, Buldhana, Yavatmal, Washim), and <strong>Nagpur / East Vidarbha</strong>
            (Nagpur, Wardha, Bhandara, Gondia, Chandrapur, Gadchiroli). MPSC frequently asks
            regional questions along these six-division lines — which region has the
            highest tribal population share (East Vidarbha and Nashik divisions), which has
            the largest sugarcane belt (Pune division), which has the fastest urbanisation
            (Konkan).
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-800 dark:bg-indigo-900/30">
          <h2 className="text-lg font-bold text-indigo-800 dark:text-indigo-200">Study-cycle suggestion</h2>
          <p className="mt-2 text-sm text-indigo-900/80 dark:text-indigo-200/90 leading-relaxed">
            A ten-minute session with the Quiz mode above, followed by a five-minute
            Rank-Race round on the same day, is enough to cover three metrics thoroughly.
            Repeat across five sessions and you cover the entire dataset. Pair the game
            with the {""}
            <Link href="/study-guides/maharashtra-geography" className="underline underline-offset-2 hover:text-indigo-900 dark:hover:text-indigo-100">
              Maharashtra Geography study guide
            </Link>{" "}
            for the geographic context of each extreme, and revisit the {""}
            <Link href="/map" className="underline underline-offset-2 hover:text-indigo-900 dark:hover:text-indigo-100">
              interactive Maharashtra map
            </Link>{" "}
            to visualise the divisions. Once the game feels easy, attempt a five-question
            Topic Wise set from the home page under Geography &rarr; Maharashtra Census — you
            should be at 4/5 or better before you move on.
          </p>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 py-6 dark:border-slate-700/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-slate-400 dark:text-slate-500">MPSC PYQ QUIZ &middot; Don&apos;t know Academy</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
              <Link href="/" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Home</Link>
              <span>|</span>
              <Link href="/map" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Map</Link>
              <span>|</span>
              <Link href="/rivers-maharashtra" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Rivers</Link>
              <span>|</span>
              <Link href="/exams" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Exams</Link>
              <span>|</span>
              <Link href="/study-guides" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Study guides</Link>
              <span>|</span>
              <Link href="/about" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">About</Link>
              <span>|</span>
              <Link href="/contact" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Contact</Link>
              <span>|</span>
              <Link href="/privacy" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Privacy</Link>
              <span>|</span>
              <Link href="/terms" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Terms</Link>
              <span>|</span>
              <Link href="/disclaimer" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Disclaimer</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
