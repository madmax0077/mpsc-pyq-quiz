import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MPSC Study Guides — Free Long-Form Notes for Geography, History, Polity & Strategy",
  description:
    "Free MPSC study guides covering Maharashtra geography, Maharashtra history, Indian polity, MPSC exam pattern and a full preparation strategy. Long-form, exam-focused notes for Group B, Group C, PSI and Gazetted prelims.",
  keywords: [
    "MPSC study guides",
    "MPSC notes free",
    "MPSC geography notes",
    "MPSC history notes",
    "MPSC polity notes",
    "MPSC preparation strategy",
    "MPSC exam pattern",
    "Maharashtra geography for MPSC",
    "Maharashtra history for MPSC",
  ],
  alternates: { canonical: "/study-guides" },
};

const GUIDES = [
  {
    href: "/study-guides/maharashtra-geography",
    emoji: "🗺️",
    title: "Maharashtra Geography",
    blurb:
      "Physical divisions, river systems, climate, soils, agriculture, minerals and natural landmarks of Maharashtra — everything tested in MPSC prelims.",
    minutes: 14,
  },
  {
    href: "/study-guides/maharashtra-history",
    emoji: "🏛️",
    title: "Maharashtra History",
    blurb:
      "Ancient Satavahanas to the Maratha Empire under Chhatrapati Shivaji Maharaj, the Peshwas, the British era and modern Maharashtra after the 1960 reorganisation.",
    minutes: 16,
  },
  {
    href: "/study-guides/indian-polity-for-mpsc",
    emoji: "⚖️",
    title: "Indian Polity for MPSC",
    blurb:
      "Constitution basics, Fundamental Rights, DPSPs, Parliament, the Maharashtra state government, Panchayati Raj, and the high-yield articles you must memorise.",
    minutes: 15,
  },
  {
    href: "/study-guides/mpsc-exam-pattern",
    emoji: "📋",
    title: "MPSC Exam Pattern",
    blurb:
      "Detailed pattern for Group B, Group C, PSI Pre, Gazetted Civil Services and Gazetted Technical Services prelims — marks, sections, syllabus, negative marking, cut-offs.",
    minutes: 12,
  },
  {
    href: "/study-guides/mpsc-preparation-strategy",
    emoji: "🎯",
    title: "MPSC Preparation Strategy",
    blurb:
      "A practical 6-month plan: book list, daily routine, how to use PYQs, subject-wise weightage, mock-test strategy and last-month revision blueprint.",
    minutes: 15,
  },
];

export default function StudyGuidesHub() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Back to home"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">MPSC Study Guides</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Free long-form notes for MPSC aspirants</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <section>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Free MPSC Study Guides
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Long-form, exam-focused notes written specifically for the Maharashtra Public Service
            Commission prelims (Group B, Group C, PSI, Gazetted Civil Services and Gazetted Technical
            Services). Each guide is a self-contained reference that you can read in one sitting and
            return to during revision. Pair them with the {""}
            <Link href="/exams" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
              previous-year question practice
            </Link>{" "}
            and the {""}
            <Link href="/map" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
              interactive map of Maharashtra
            </Link>{" "}
            for the most efficient prep cycle.
          </p>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          {GUIDES.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-600"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl" aria-hidden>{g.emoji}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800 group-hover:text-indigo-700 dark:text-slate-100 dark:group-hover:text-indigo-400">
                    {g.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{g.blurb}</p>
                  <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">~{g.minutes} min read</p>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Topic packs</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Condensed reference + built-in MCQs. Perfect for last-week revision.
          </p>
          <Link
            href="/newspapers"
            className="group mt-4 block rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-md dark:border-orange-800 dark:bg-orange-900/20 dark:hover:border-orange-600"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl" aria-hidden>🗞️</span>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-800 group-hover:text-orange-700 dark:text-slate-100 dark:group-hover:text-orange-300">
                  वृत्तपत्र — संस्थापक, संपादक व 100 MCQ
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Indian newspapers — 70+ titles and 50+ founders/editors organised into 6 historical groups,
                  paired with 100 MCQs and answers. Built for MPSC, Rajyaseva, RTO AMVI &amp; UPSC prelims.
                </p>
                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">~10 min revision · Marathi + English</p>
              </div>
            </div>
          </Link>
        </section>

        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            How to use these guides
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            We deliberately wrote these as compact reference articles rather than as a full textbook.
            Use them in three passes:
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
            <li>
              <strong>First read</strong> — go through the entire guide once at normal speed. Highlight
              or note the names, dates, articles and statistics that you don&apos;t already know.
            </li>
            <li>
              <strong>Apply</strong> — open the matching paper on the {""}
              <Link href="/exams" className="text-indigo-600 hover:underline">/exams</Link> page and
              attempt 10–15 PYQs on the same topic. Score yourself with the instant grader.
            </li>
            <li>
              <strong>Revise</strong> — re-read only the bullet points and tables. The guides are
              structured so the second pass takes a quarter of the time of the first.
            </li>
          </ol>
        </section>

        <section className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-6 dark:border-indigo-800 dark:bg-indigo-900/30">
          <h2 className="text-lg font-bold text-indigo-800 dark:text-indigo-200">
            About the source material
          </h2>
          <p className="mt-2 text-sm text-indigo-900/80 dark:text-indigo-200/80">
            Every guide is written using the official MPSC syllabus, NCERT textbooks (Classes 6–12
            for History, Geography and Polity), the Constitution of India bare act, and the
            Government of Maharashtra&apos;s public statistical handbooks and Economic Surveys. Where
            we quote a fact (population figures, capacity numbers, dates), we use the most recent
            publicly available figure at the time of writing. Spotted something out of date? Email
            us at <a className="underline" href="mailto:dontknowacademy@gmail.com">dontknowacademy@gmail.com</a>
            {" "}and we&apos;ll fix it within 48 hours.
          </p>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 py-6 dark:border-slate-700/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-slate-400 dark:text-slate-500">MPSC PYQ QUIZ &middot; Don&apos;t know Academy</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
              <Link href="/" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Home</Link>
              <span>|</span>
              <Link href="/exams" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Exam Papers</Link>
              <span>|</span>
              <Link href="/map" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Maharashtra Map</Link>
              <span>|</span>
              <Link href="/about" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">About</Link>
              <span>|</span>
              <Link href="/contact" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Contact</Link>
              <span>|</span>
              <Link href="/privacy" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
