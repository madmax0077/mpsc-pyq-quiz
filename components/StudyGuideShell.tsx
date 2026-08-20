import Link from "next/link";
import type { ReactNode } from "react";

type FaqItem = { q: string; a: string };

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  faq?: FaqItem[];
  faqSchema?: Record<string, unknown>;
};

/**
 * Standard layout shell for study-guide blogs.
 * Use this for every new bilingual / long-form guide so spacing stays consistent.
 */
export default function StudyGuideShell({
  title,
  subtitle,
  children,
  faq,
  faqSchema,
}: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}

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
          <div className="min-w-0 flex-1">
            <h1 className="break-words text-lg font-bold leading-snug text-slate-800 dark:text-slate-100">{title}</h1>
            <p className="break-words text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <article className="overflow-x-clip rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-9">
          {children}

          {faq && faq.length > 0 ? (
            <section className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-600">
              <h3 className="mb-5 text-lg font-bold text-slate-800 dark:text-slate-100">
                FAQ / नेहमीचे प्रश्न
              </h3>
              <div className="space-y-4">
                {faq.map((item) => (
                  <div
                    key={item.q}
                    className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-4 dark:border-slate-600 dark:bg-slate-900/40"
                  >
                    <h4 className="text-[0.95rem] font-semibold leading-snug text-slate-800 dark:text-slate-100">
                      {item.q}
                    </h4>
                    <p className="mt-2.5 text-sm leading-[1.75] text-slate-600 dark:text-slate-300">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </article>
      </main>

      <footer className="border-t border-slate-200/80 py-6 dark:border-slate-700/80">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 sm:px-6">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            MPSC PYQ QUIZ &middot; Don&apos;t know Academy
          </p>
          <a
            href="https://globalitinerary.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-col items-center gap-0.5 rounded-xl bg-teal-600 px-5 py-2.5 text-center shadow-sm transition-colors hover:bg-teal-700"
          >
            <span className="text-sm font-semibold text-white">Plan your world tour →</span>
            <span className="text-[10px] font-medium text-teal-100">
              After you get selected, explore the world with our sister site Global Itinerary
            </span>
          </a>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
            <Link href="/" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">
              Home
            </Link>
            <span>|</span>
            <Link
              href="/study-guides"
              className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400"
            >
              Study guides
            </Link>
            <span>|</span>
            <Link href="/exams" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">
              Exams
            </Link>
            <span>|</span>
            <Link href="/donate" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">
              Donate
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
