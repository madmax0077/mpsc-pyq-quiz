import Link from "next/link";
import type { Metadata } from "next";
import { getQuizMeta } from "@/lib/quizMeta";

const meta = getQuizMeta();

export const metadata: Metadata = {
  title: "About MPSC PYQ QUIZ — Free MPSC Previous Year Question Practice Platform",
  description: `MPSC PYQ QUIZ by Don't know Academy — free MPSC platform with ${meta.totalQuestions}+ previous year questions from ${meta.totalPapers} exam papers (${meta.minYear}–${meta.maxYear}), a daily aggregate leaderboard, an interactive Maharashtra map and long-form study guides. Read about our mission, methodology and editorial standards.`,
  alternates: { canonical: "/about" },
};

export default function About() {
  const { totalQuestions, totalPapers, minYear, maxYear } = meta;

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
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">About MPSC PYQ QUIZ</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-9">
          <Link href="/" className="mb-8 flex flex-col items-center text-center no-underline">
            <img
              src="/logo.png"
              alt="MPSC PYQ QUIZ Logo"
              className="mb-4 h-24 w-24 rounded-full object-cover shadow-lg ring-4 ring-white dark:ring-slate-700"
            />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">MPSC PYQ QUIZ</h2>
            <p className="mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
              by Don&apos;t know Academy
            </p>
          </Link>

          <div className="prose prose-slate max-w-none dark:prose-invert">
            <h3>Our mission</h3>
            <p>
              MPSC PYQ QUIZ exists to remove cost as a barrier between a serious MPSC aspirant and
              quality practice material. The Maharashtra Public Service Commission tests recall,
              accuracy and time-management against a finite set of high-frequency topics. The single
              most reliable way to prepare is to drill the previous year question papers, identify
              your weak topics, and revise. We package all of that — the papers, the answer keys,
              the categorisation, the analytics — into one free, ad-supported platform that anyone
              with a phone can use, today, in English or Marathi.
            </p>

            <h3>What the platform offers</h3>
            <ul>
              <li>
                <strong>{totalQuestions.toLocaleString()}+ practice questions</strong> drawn from
                {" "}{totalPapers} official MPSC papers ({minYear}–{maxYear}). Browse them at {""}
                <Link href="/exams">/exams</Link>.
              </li>
              <li>
                <strong>Subject-wise practice mode</strong> — questions are pre-tagged with their
                subject (Indian Polity, History, Geography, Science, Economics, Current Affairs,
                Maharashtra Geography, etc.) so you can drill a single weak area in 5-question
                sets.
              </li>
              <li>
                <strong>Topic-wise quizzes</strong> in the same 5-question, instant-feedback format.
              </li>
              <li>
                <strong>Daily aggregate leaderboard</strong> ({""}
                <Link href="/?mode=leaderboard">open it</Link>) — every set you submit during the
                day counts towards your aggregate. The top three users are ranked by question-weighted
                average across all of their attempts that day. It resets at midnight IST.
              </li>
              <li>
                <strong>Interactive map of Maharashtra</strong> ({""}
                <Link href="/map">open the map</Link>) — high-resolution OpenStreetMap-based map
                with toggleable layers for rivers + tributaries (Deccan and Konkan), dams,
                waterfalls, Sahyadri ghats, three separate power-plant categories
                (nuclear / hydroelectric / thermal), mineral belts, UNESCO sites and historic
                forts.
              </li>
              <li>
                <strong>Long-form study guides</strong> at {""}
                <Link href="/study-guides">/study-guides</Link> — Maharashtra Geography, Maharashtra
                History, Indian Polity, MPSC Exam Pattern and a 6-month Preparation Strategy.
              </li>
              <li>
                <strong>Bilingual</strong> — every question is shipped in English and Marathi. You
                can switch language with one tap.
              </li>
              <li>
                <strong>Offline-friendly</strong> — once a quiz loads, you can finish it without an
                internet connection. Progress is saved in your browser.
              </li>
              <li>
                <strong>Report-a-question</strong> — every question has a Report button after
                submission so you can flag a wrong key or unclear option directly to us.
              </li>
            </ul>

            <h3>Editorial methodology</h3>
            <p>
              Where the questions come from and how we keep them accurate matters more than any
              feature. Our editorial process is:
            </p>
            <ol>
              <li>
                <strong>Sourcing</strong> — we ingest the original PDF question papers released by
                the Maharashtra Public Service Commission on <a href="https://mpsc.gov.in" target="_blank" rel="noopener">mpsc.gov.in</a>. We use the official Set A version of every paper.
              </li>
              <li>
                <strong>Answer keys</strong> — answers are taken from the official MPSC answer
                key (Set A) published after each exam. Where MPSC has issued a revised key after
                an objection round, we use the revised key.
              </li>
              <li>
                <strong>Categorisation</strong> — every question is tagged with a subject
                (Polity, History, Geography, Science, Economics, Environment, Current Affairs,
                English, Marathi, Aptitude). Tags are reviewed by humans, not generated by an
                automated classifier alone.
              </li>
              <li>
                <strong>Marathi translation</strong> — for papers originally bilingual on the PDF,
                we ship both languages verbatim. Where MPSC released only one language, we don&apos;t
                machine-translate; the question simply ships in the original language.
              </li>
              <li>
                <strong>Corrections cycle</strong> — every report submitted through the in-quiz
                Report button is reviewed within 48 hours. If the correction is valid, the answer
                key is updated and the change is logged in our internal change-log.
              </li>
            </ol>

            <h3>Accuracy commitment</h3>
            <p>
              Despite the process above, errors happen — typos in the original PDF, ambiguous
              language across translations, periodic answer-key revisions by MPSC. We commit to:
            </p>
            <ul>
              <li>Acknowledging every error report within 24 hours.</li>
              <li>Pushing a fix within 48 hours of acknowledgement.</li>
              <li>Never silently changing an answer — corrections are logged.</li>
              <li>Publishing the source of every answer key (Set A from the official PDF or revised key) so users can verify.</li>
            </ul>

            <h3>Who runs Don&apos;t know Academy</h3>
            <p>
              <strong>Don&apos;t know Academy</strong> is a one-developer education project run from
              Pune, Maharashtra. The platform is built by a software engineer who is also an MPSC
              aspirant; the study guides are written from inside the same preparation cycle the
              site is designed to support. We are not a coaching institute, we don&apos;t sell test
              series, and we don&apos;t offer paid courses. The website is funded entirely by
              non-intrusive advertising (we plan to enable Google AdSense once the editorial bar is
              high enough), and revenue is reinvested into adding more papers, more languages and
              more features.
            </p>

            <h3>Cost and accessibility</h3>
            <p>
              MPSC PYQ QUIZ is and will remain <strong>free</strong>. There is no subscription,
              no premium tier, no paywalled content. Sign-in (with Google or Apple) is required only
              so we can save your progress and your daily score across devices. You can use the
              public pages (the home page, /exams, /map, the study guides) without signing in at
              all. The site works offline once a quiz loads, has dark mode, and is mobile-first.
            </p>

            <h3>Contact</h3>
            <p>
              Have a question, a suggestion, an error report, or a partnership idea? Reach us at{" "}
              <a href="mailto:dontknowacademy@gmail.com">dontknowacademy@gmail.com</a> or via the
              detailed <Link href="/contact">Contact page</Link>. We typically respond within
              24–48 hours during weekdays.
            </p>

            <h3>Disclaimer</h3>
            <p>
              MPSC PYQ QUIZ is an independent educational platform. It is not affiliated with,
              endorsed by, or operated on behalf of the Maharashtra Public Service Commission, the
              Government of Maharashtra, or any government agency. All question papers and answer
              keys used on the site are sourced from publicly available material released by MPSC.
              All trademarks belong to their respective owners.
            </p>

            <h3>Version and updates</h3>
            <p>
              This About page was last revised in <strong>April 2026</strong>. Major recent product
              updates include the daily aggregate leaderboard, the interactive Maharashtra map with
              50+ rivers and three separate power-plant layers, the long-form study guides
              section, and the move to 5-question sets with free navigation between sets in topic
              and subject mode.
            </p>
          </div>
        </article>
      </main>

      <footer className="border-t border-slate-200/80 py-6 dark:border-slate-700/80">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-slate-400 dark:text-slate-500">MPSC PYQ QUIZ &middot; Don&apos;t know Academy</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
              <Link href="/" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Home</Link>
              <span>|</span>
              <Link href="/exams" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Exam papers</Link>
              <span>|</span>
              <Link href="/map" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Map</Link>
              <span>|</span>
              <Link href="/study-guides" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Study guides</Link>
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
