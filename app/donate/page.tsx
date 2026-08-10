import Link from "next/link";
import type { Metadata } from "next";
import DonateUpiCard from "@/components/DonateUpiCard";

export const metadata: Metadata = {
  title: "Buy us a coffee — Support MPSC PYQ QUIZ | Don't know Academy",
  description:
    "Buy Don't know Academy a coffee. Small UPI support helps keep mpscs.in free for MPSC aspirants — hosting, content and new practice tools.",
  alternates: { canonical: "/donate" },
  robots: { index: true, follow: true },
};

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Back to home"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold leading-snug text-slate-800 dark:text-slate-100">
              Buy us a coffee
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Support free MPSC practice</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-9">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-3xl dark:bg-slate-700">
              ☕
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                Optional · UPI
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                Support mpscs.in
              </h2>
              <p className="mt-2 text-[0.975rem] leading-[1.8] text-slate-600 dark:text-slate-300">
                If this site helped your prep, a small coffee helps with hosting, answer keys and new
                papers — still free for every aspirant. Completely optional.
              </p>
            </div>
          </div>

          <ul className="mt-6 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
            <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-600 dark:bg-slate-900/50">
              📚 More PYQs
            </li>
            <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-600 dark:bg-slate-900/50">
              🛠️ Better tools
            </li>
            <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-600 dark:bg-slate-900/50">
              🇮🇳 Always free
            </li>
          </ul>

          <div className="mt-7">
            <DonateUpiCard />
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm leading-relaxed text-slate-600 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
            <p>
              <strong className="text-slate-800 dark:text-slate-100">Note:</strong> This is a voluntary
              gift. It does not unlock paid features. Questions?{" "}
              <Link href="/contact" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                Contact us
              </Link>{" "}
              or leave a note on{" "}
              <Link href="/feedback" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                Feedback
              </Link>
              .
            </p>
          </div>

          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">— Don&apos;t know Academy</p>
        </article>
      </main>

      <footer className="border-t border-slate-200/80 py-6 dark:border-slate-700/80">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 text-xs text-slate-400 dark:text-slate-500 sm:px-6">
          <Link href="/" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">
            Home
          </Link>
          <span>|</span>
          <Link href="/feedback" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">
            Feedback
          </Link>
          <span>|</span>
          <Link href="/about" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">
            About
          </Link>
        </div>
      </footer>
    </div>
  );
}
