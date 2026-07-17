import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found (404) — MPSC PYQ QUIZ",
  description:
    "The page you were looking for could not be found on MPSC PYQ QUIZ. Try the home page, browse previous-year question papers, open the interactive Maharashtra map or read a study guide.",
  robots: { index: false, follow: true },
};

const QUICK_LINKS = [
  { href: "/", label: "Home page", desc: "Interactive quizzes + daily leaderboard" },
  { href: "/exams", label: "Exam papers", desc: "Browse every MPSC previous-year paper" },
  { href: "/study-guides", label: "Study guides", desc: "Geography, history, polity, strategy" },
  { href: "/map", label: "Maharashtra map", desc: "Rivers, forts, power plants, UNESCO sites" },
  { href: "/rivers-maharashtra", label: "Rivers of Maharashtra", desc: "50+ rivers with district-wise map" },
  { href: "/about", label: "About", desc: "Who we are and how the content is made" },
  { href: "/contact", label: "Contact", desc: "Report a wrong answer key or ask a question" },
];

export default function NotFound() {
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
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Page not found</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-12">
          <p className="text-center text-6xl font-black text-indigo-600 dark:text-indigo-400">404</p>
          <h2 className="mt-4 text-center text-2xl font-bold text-slate-900 dark:text-slate-100">
            The page you&apos;re looking for isn&apos;t here.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-6 text-slate-600 dark:text-slate-300">
            The link may be broken, the page may have been renamed, or you may have typed the URL
            incorrectly. Here are the popular sections of the site to help you get back on track.
          </p>

          <nav className="mt-8 grid gap-3 sm:grid-cols-2">
            {QUICK_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-700/40 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/20"
              >
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.label}</p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
              </Link>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-800 dark:bg-amber-900/20">
            <p className="font-semibold text-amber-900 dark:text-amber-200">Think this is a bug?</p>
            <p className="mt-1 text-amber-900/90 dark:text-amber-200/90">
              If you followed a link on our site and reached this page, please email us at{" "}
              <a className="underline" href="mailto:dontknowacademy@gmail.com">
                dontknowacademy@gmail.com
              </a>{" "}
              with the URL of the page that linked here — we&apos;ll fix the broken link.
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              Go to the home page
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/80 py-6 dark:border-slate-700/80">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-slate-400 dark:text-slate-500">MPSC PYQ QUIZ &middot; Don&apos;t know Academy</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
              <Link href="/" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Home</Link>
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
