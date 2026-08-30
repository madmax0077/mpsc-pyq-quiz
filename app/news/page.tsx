import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MPSC News — Paper Leaks, Exam Updates & Reality Checks for Aspirants",
  description:
    "MPSC News from Don't know Academy: paper-leak updates, recruitment cancellations, exam alerts and honest reality checks for Maharashtra competitive exam aspirants.",
  keywords: [
    "MPSC news",
    "MPSC paper leak",
    "MPSC Drug Inspector",
    "MPSC exam cancelled",
    "Maharashtra PSC news",
    "MPSC latest update",
  ],
  alternates: { canonical: "/news" },
};

const STORIES = [
  {
    href: "/news/mpsc-drug-inspector-paper-leak-2026",
    badge: "Breaking",
    title: "MPSC Drug Inspector Paper Leak: When Trust Collapses Overnight",
    blurb:
      "A goosebumps timeline of the March 2026 screening exam leak, cancelled recruitment, and the hard reality check every honest aspirant must face.",
    date: "30 Aug 2026",
    minutes: 8,
  },
];

export default function NewsIndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
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
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">MPSC News</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Updates, paper-leak alerts &amp; reality checks · Don&apos;t know Academy
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="mb-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Straight talk for aspirants — not rumours, not panic. We cover major MPSC developments
          that affect your preparation, with sources from public reports and a clear message:
          honest hard work still wins.
        </p>

        <div className="space-y-4">
          {STORIES.map((story) => (
            <Link
              key={story.href}
              href={story.href}
              className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-rose-300 hover:bg-rose-50/40 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-rose-800 dark:hover:bg-rose-950/20"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-rose-100 px-2.5 py-0.5 font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                  {story.badge}
                </span>
                <span className="text-slate-400 dark:text-slate-500">
                  {story.date} · ~{story.minutes} min read
                </span>
              </div>
              <h2 className="mt-2 text-lg font-bold leading-snug text-slate-800 dark:text-slate-100">
                {story.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {story.blurb}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
