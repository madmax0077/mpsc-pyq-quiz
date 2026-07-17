"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof console !== "undefined") {
      console.error("MPSC PYQ QUIZ client error:", error);
    }
  }, [error]);

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
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Something went wrong</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-12">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/30">
            <svg
              className="h-8 w-8 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.6}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-slate-100">
            Something went wrong on our end.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-6 text-slate-600 dark:text-slate-300">
            An unexpected error interrupted your visit to MPSC PYQ QUIZ. This has been logged; you
            can try again below or head back to the home page. Your quiz progress is saved in your
            browser and will still be there when you return.
          </p>

          {error?.digest && (
            <p className="mx-auto mt-4 max-w-xl rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-700/40 dark:text-slate-400">
              Error reference: <code className="font-mono">{error.digest}</code>
            </p>
          )}

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={reset}
              className="w-full rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 sm:w-auto"
            >
              Try again
            </button>
            <Link
              href="/"
              className="w-full rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-center text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-600 dark:hover:bg-slate-700 sm:w-auto"
            >
              Go to the home page
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-800 dark:bg-amber-900/20">
            <p className="font-semibold text-amber-900 dark:text-amber-200">Persistent problem?</p>
            <p className="mt-1 text-amber-900/90 dark:text-amber-200/90">
              Please email us at{" "}
              <a className="underline" href="mailto:dontknowacademy@gmail.com">
                dontknowacademy@gmail.com
              </a>{" "}
              with the URL you were on and, if possible, the error reference above. We usually
              reply within 24 hours.
            </p>
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
