import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — MPSC PYQ QUIZ",
  description:
    "Get in touch with the MPSC PYQ QUIZ team at Don't know Academy. Report issues, share feedback, or ask questions about MPSC previous year question practice.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Contact Us</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/40">
              <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Get in Touch</h2>
            <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              We&apos;d love to hear from you. Whether you have a question, found an error in a quiz, or just want to share feedback — reach out anytime.
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-600 dark:bg-slate-700/50">
              <h3 className="mb-1 text-sm font-semibold text-slate-700 dark:text-slate-200">Email</h3>
              <a
                href="mailto:dontknowacademy@gmail.com"
                className="text-base font-medium text-indigo-600 hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                dontknowacademy@gmail.com
              </a>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                We typically respond within 24–48 hours.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-600 dark:bg-slate-700/50">
              <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">What can you contact us about?</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Wrong answers</strong> — Report incorrect answer keys or options in any quiz</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Bug reports</strong> — Something not working? Let us know</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Feature requests</strong> — Suggest new exams, subjects, or features</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>General feedback</strong> — Tell us how we can improve</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Collaboration</strong> — Interested in partnering or contributing content</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5 text-center dark:border-indigo-800 dark:bg-indigo-900/30">
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                You can also report individual questions directly from the quiz using the <strong>Report</strong> button shown after submitting answers.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/80 py-6 dark:border-slate-700/80">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-slate-400 dark:text-slate-500">MPSC PYQ QUIZ &middot; Don&apos;t know Academy</p>
            <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
              <Link href="/" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Home</Link>
              <span>|</span>
              <Link href="/about" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">About</Link>
              <span>|</span>
              <Link href="/exams" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Exams</Link>
              <span>|</span>
              <Link href="/privacy" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
