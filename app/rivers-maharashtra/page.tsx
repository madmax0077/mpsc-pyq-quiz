import type { Metadata } from "next";
import Link from "next/link";
import RiversPageClient from "./RiversPageClient";

export const metadata: Metadata = {
  title: "Rivers of Maharashtra — District-wise 2D Map + MPSC PYQ Quiz",
  description:
    "Every major river of Maharashtra plotted on a district-wise 2D map with names visible on the path — Godavari, Krishna, Tapi and Konkan basins. Below the map is a curated MPSC Previous-Year Question (PYQ) quiz on rivers, drawn from Civil Services, Group B, Group C, PSI, STI, Sub-Ord. Group B, Asst. and Excise papers (2010 – 2025). Each question is tagged with the exact exam and year it appeared in.",
  keywords: [
    "Maharashtra rivers map",
    "rivers of Maharashtra district wise",
    "MPSC rivers PYQ",
    "MPSC Previous Year Questions rivers",
    "MPSC geography rivers",
    "Godavari basin Maharashtra",
    "Krishna basin Maharashtra",
    "Tapi basin Maharashtra",
    "Konkan west flowing rivers",
    "Bhima tributaries",
    "Wainganga Wardha Pranhita",
    "Panchganga Kolhapur",
    "UPSC Maharashtra rivers",
    "Maharashtra drainage system",
  ],
  alternates: { canonical: "/rivers-maharashtra" },
  openGraph: {
    type: "article",
    title: "Rivers of Maharashtra — District-wise Map + MPSC PYQ Quiz",
    description:
      "Every major river of Maharashtra plotted with names on a district-aware 2D map, plus an MPSC Previous-Year Questions quiz on rivers drawn from real exam papers (2010 – 2025).",
    url: "https://www.mpscs.in/rivers-maharashtra",
    images: ["/og-image.svg"],
  },
};

const SITE_URL = "https://www.mpscs.in";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/rivers-maharashtra#webpage`,
      url: `${SITE_URL}/rivers-maharashtra`,
      name: "Rivers of Maharashtra — Interactive District-wise 2D Map",
      description:
        "Interactive map of every major river of Maharashtra — Godavari, Krishna, Tapi and Konkan basins — with names visible on the path, basin-wise colour coding and district context.",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      breadcrumb: { "@id": `${SITE_URL}/rivers-maharashtra#breadcrumb` },
      inLanguage: "en-IN",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/rivers-maharashtra#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Rivers of Maharashtra", item: `${SITE_URL}/rivers-maharashtra` },
      ],
    },
    {
      "@type": "ItemList",
      name: "Maharashtra rivers by basin",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Godavari basin — Godavari, Pravara, Mula, Darna, Kadwa, Manjira, Purna, Sindphana, Wardha (Yashoda, Wenna), Wainganga (Kanhan, Pench, Bagh, Bavanthadi), Painganga (Adan, Pus, Arunavati)" },
        { "@type": "ListItem", position: 2, name: "Krishna basin — Krishna, Koyna (Solshi, Kandati, Morna), Venna, Panchganga, Warna, Yerla, Dudhganga, Hiranyakeshi, Agrani, Bhima (Mula-Mutha, Indrayani, Nira, Pavna, Bhama, Ghod, Sina)" },
        { "@type": "ListItem", position: 3, name: "Tapi basin — Tapi, Purna (Tapi), Girna, Panzhra, Bori, Aner" },
        { "@type": "ListItem", position: 4, name: "Konkan west-flowing — Damanganga, Vaitarna (Pinjal, Surya, Tansa), Ulhas (Bhatsa), Patalganga, Amba, Kundalika, Savitri, Vashishti, Shastri, Kajli, Muchkundi, Gad, Karli, Terekhol" },
      ],
    },
  ],
};

export default function RiversMaharashtraPage() {
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
              <span aria-hidden>🏞️</span> Rivers of Maharashtra
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              District-wise 2D map · 50+ rivers · MPSC PYQ quiz (2010–2025)
            </p>
          </div>
          <Link
            href="/map"
            className="hidden rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:inline-flex dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Full map →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-6">
        <RiversPageClient />

        {/* Quick legend */}
        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-3 dark:border-purple-700 dark:bg-purple-900/30">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: "#7c3aed" }} />
              <p className="text-sm font-bold text-purple-800 dark:text-purple-200">Godavari basin</p>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-purple-700 dark:text-purple-300">
              Godavari + Wardha/Wainganga/Painganga &amp; their tributaries. ~50% of MH drains here.
            </p>
          </div>
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 dark:border-teal-700 dark:bg-teal-900/30">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: "#0d9488" }} />
              <p className="text-sm font-bold text-teal-800 dark:text-teal-200">Krishna basin</p>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-teal-700 dark:text-teal-300">
              Krishna + Bhima + Koyna + Panchganga. Western Maharashtra heartland.
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-900/30">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: "#d97706" }} />
              <p className="text-sm font-bold text-amber-800 dark:text-amber-200">Tapi basin</p>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-amber-700 dark:text-amber-300">
              Tapi + Purna + Girna. The only peninsular rift-valley west-flowing system in north MH.
            </p>
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 dark:border-sky-700 dark:bg-sky-900/30">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: "#0284c7" }} />
              <p className="text-sm font-bold text-sky-800 dark:text-sky-200">Konkan rivers</p>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-sky-700 dark:text-sky-300">
              ~14 short, fast-flowing rivers from Sahyadri to the Arabian Sea.
            </p>
          </div>
        </section>

        {/* About / SEO context */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">About this map &amp; the PYQ quiz</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            A district-aware 2D map of Maharashtra showing every major river and its
            tributaries with <strong>names visible directly on the path</strong>. Rivers are
            colour-coded by drainage <em>basin</em>: purple for the Godavari system, teal for
            the Krishna system, amber for the Tapi system, and sky-blue for the west-flowing
            Konkan rivers. Drag the map to pan, scroll the wheel (or use the +/− buttons)
            to zoom. Below the map is the <strong>MPSC PYQ Rivers Quiz</strong> — every
            question is taken from a real MPSC paper between 2010 and 2025, with the exam
            and year tagged on every question.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Godavari basin (purple).</strong> The Godavari rises at Brahmagiri,
            Trimbakeshwar (Nashik) and flows ~668&nbsp;km through the state before crossing
            into Telangana. Its main tributaries inside Maharashtra are Pravara, Mula, Darna,
            Kadwa, Manjira (Beed → Telangana), Purna (Ajanta → Nanded) and Sindphana. In
            east Vidarbha, the Wardha and Wainganga join at Sironcha to form the Pranhita,
            which then meets the Godavari. The Painganga, with Adan, Pus and Arunavati,
            joins the Wardha at Wadhona.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Krishna basin (teal).</strong> The Krishna rises at Mahabaleshwar
            (Satara) and exits to Karnataka after ~282&nbsp;km in the state. Its biggest
            tributary, the <strong>Bhima</strong> (Bhimashankar &rarr; Solapur), itself
            carries the Mula-Mutha, Indrayani, Pavna, Bhama, Ghod, Nira and Sina. The
            Koyna joins the Krishna at Karad&apos;s <em>Preeti Sangam</em>. Down south, the
            Panchganga (5-river confluence at Kolhapur), Warna, Dudhganga, Yerla and
            Hiranyakeshi keep adding water to the Krishna.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Tapi basin (amber).</strong> The Tapi is one of only three major
            peninsular rivers that flow <em>west</em>. It enters from MP (Multai) and runs
            through Jalgaon, Dhule and Nandurbar before exiting to Gujarat. Its main
            Maharashtra tributaries are Purna (Akola–Buldhana cotton belt), Girna,
            Panzhra, Bori and Aner.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Konkan west-flowing rivers (sky-blue).</strong> Fourteen short rivers
            rise in the Sahyadri and tumble down to the Arabian Sea — Damanganga,
            Vaitarna (with Pinjal, Surya, Tansa), Ulhas (with Bhatsa), Patalganga, Amba,
            Kundalika, Savitri (born at Mahabaleshwar but flowing west), Vashishti,
            Shastri, Kajli, Muchkundi, Gad, Karli, and Terekhol on the Goa border. These
            rivers are short and steep — perfect for hydroelectric projects (Bhira,
            Bhivpuri, Khopoli, Tillari) — but their estuaries and creeks dominate the
            Konkan coastal economy.
          </p>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Base map tiles &copy; OpenStreetMap contributors. River polylines are coarse
            (suitable for MPSC-level conceptual revision) and not survey-grade. River
            facts compiled from Central Water Commission, NIH Roorkee and standard
            Maharashtra geography references.
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
              <Link href="/map" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Full map</Link>
              <span>|</span>
              <Link href="/census-2011-maharashtra" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Census 2011</Link>
              <span>|</span>
              <Link href="/about" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">About</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
