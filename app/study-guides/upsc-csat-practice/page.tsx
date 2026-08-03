import Link from "next/link";
import type { Metadata } from "next";
import DisplayAd from "@/components/DisplayAd";
import { IN_CONTENT_AD_SLOT } from "@/lib/adsConfig";

export const metadata: Metadata = {
  title: "UPSC CSAT Practice Free — Paper II Aptitude Questions for CSE Prelims",
  description:
    "Free UPSC CSAT practice online: topic lessons, 2,000+ aptitude and reasoning questions in English and Marathi, and timed speed tests for UPSC CSE Prelims Paper II. Built for MPSC CSAT, fully usable for UPSC CSAT qualifying practice.",
  keywords: [
    "UPSC CSAT",
    "UPSC CSAT practice",
    "UPSC CSAT Paper 2",
    "UPSC CSE CSAT",
    "UPSC CSAT free mock",
    "CSAT practice questions",
    "UPSC aptitude practice",
    "UPSC CSAT qualifying",
    "free CSAT online test",
    "यूपीएससी सीसॅट",
  ],
  alternates: { canonical: "/study-guides/upsc-csat-practice" },
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Can I practise UPSC CSAT on this website?",
    a: "Yes. Our CSAT & Aptitude section covers the same skill areas UPSC tests in Prelims Paper II — basic numeracy, logical reasoning, data interpretation and comprehension — with topic lessons, instant-feedback practice and timed speed tests in English and Marathi.",
  },
  {
    q: "Is this the official UPSC CSAT paper?",
    a: "No. This is free aptitude practice aimed at MPSC Rajyaseva Paper II and reusable for UPSC CSAT. Always follow the latest UPSC notification for official marks, duration, negative marking and qualifying rules.",
  },
  {
    q: "Is UPSC CSAT qualifying?",
    a: "Yes. In the UPSC Civil Services Prelims, Paper II (CSAT) is qualifying. You must clear the official cut-off to have your General Studies paper counted. Practice regularly so the aptitude paper never becomes the reason you are eliminated.",
  },
];

export default function UpscCsatPracticePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/study-guides"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Back to study guides"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">UPSC CSAT Practice</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Free aptitude practice · ~4 min read</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <article className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:prose-invert dark:border-slate-700 dark:bg-slate-800 sm:p-9">
          <h2>UPSC CSAT Practice — Free Paper II Aptitude Training</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: August 2026 · Reading time: ~4 minutes
          </p>

          <p>
            Looking for <strong>UPSC CSAT practice</strong> online? You can train the qualifying
            aptitude paper here. Our{" "}
            <Link href="/?mode=csat">CSAT &amp; Aptitude</Link> module was built for MPSC Rajyaseva
            Paper II, but the topics match what UPSC CSE Prelims Paper II expects: percentages,
            ratios, averages, time &amp; work, speed &amp; distance, series, syllogism, puzzles,
            data interpretation and reading practice — with bilingual support in English and Marathi.
          </p>

          <p>
            <Link
              href="/?mode=csat"
              className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-bold text-white no-underline shadow-sm hover:bg-sky-700"
            >
              Start free UPSC / MPSC CSAT practice →
            </Link>
          </p>

          <h3>What you get</h3>
          <ul>
            <li>Deep topic lessons with formulas, shortcuts and common traps</li>
            <li>2,000+ practice questions with explanations</li>
            <li>Topic-wise sets (5 to 50+ questions) with unseen-first practice</li>
            <li>Timed combined speed tests with negative marking</li>
          </ul>

          <DisplayAd adsenseSlot={IN_CONTENT_AD_SLOT} ezoicKey="contentInline" className="my-8 not-prose" />

          <h3>Honest note on UPSC vs MPSC CSAT</h3>
          <p>
            Use this site for <strong>skill practice</strong>. Official UPSC CSAT marks, duration,
            negative marking and the exact qualifying cut-off are decided only by the Union Public
            Service Commission — check{" "}
            <a href="https://upsc.gov.in" rel="noopener noreferrer" target="_blank">
              upsc.gov.in
            </a>{" "}
            for the current year. For a longer MPSC-focused walkthrough that also covers UPSC
            overlap, read the{" "}
            <Link href="/study-guides/mpsc-csat-preparation">MPSC &amp; UPSC CSAT preparation guide</Link>.
          </p>

          <h3>Frequently asked questions</h3>
          {FAQ.map((item) => (
            <div key={item.q}>
              <h4>{item.q}</h4>
              <p>{item.a}</p>
            </div>
          ))}

          <h3>Next steps</h3>
          <ul>
            <li>
              <Link href="/?mode=csat">Open CSAT &amp; Aptitude practice</Link>
            </li>
            <li>
              <Link href="/study-guides/mpsc-csat-preparation">Full CSAT syllabus &amp; 8-week plan</Link>
            </li>
            <li>
              <Link href="/study-guides/mpsc-negative-marking">Negative marking strategy</Link>
            </li>
          </ul>
        </article>
      </main>

      <footer className="border-t border-slate-200/80 py-6 dark:border-slate-700/80">
        <div className="mx-auto max-w-3xl px-4 text-center text-xs text-slate-400 sm:px-6 dark:text-slate-500">
          <Link href="/study-guides" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">
            All study guides
          </Link>
          {" · "}
          <Link href="/?mode=csat" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">
            CSAT practice
          </Link>
        </div>
      </footer>
    </div>
  );
}
