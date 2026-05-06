import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact MPSC PYQ QUIZ — Report Errors, Send Feedback or Reach Don't know Academy",
  description:
    "Contact the MPSC PYQ QUIZ team at Don't know Academy. Report wrong answer keys, request a missing exam paper, send product feedback, ask for collaboration, or get privacy / DPDP support. Email and full support information.",
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
            aria-label="Back to home"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Contact Us</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-9">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/40">
              <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Get in touch</h2>
            <p className="mt-2 max-w-lg text-sm text-slate-500 dark:text-slate-400">
              MPSC PYQ QUIZ is built and maintained by a single developer at Don&apos;t know Academy
              in Pune. Every email is read personally — usually within a working day. Use the
              buckets below to help us route your message and reply faster.
            </p>
          </div>

          <div className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 p-5 text-center dark:border-indigo-800 dark:from-indigo-900/30 dark:to-violet-900/30">
            <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Primary contact</p>
            <a
              href="mailto:dontknowacademy@gmail.com"
              className="mt-1 block text-2xl font-bold text-indigo-700 hover:underline dark:text-indigo-300"
            >
              dontknowacademy@gmail.com
            </a>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Typical response time: <strong>24–48 hours, Monday–Friday</strong>. Weekends and Indian public holidays add 1–2 days.
            </p>
          </div>

          <section className="mt-8">
            <h3 className="mb-3 text-base font-bold text-slate-800 dark:text-slate-100">What can you contact us about?</h3>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-700/40">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">1. Report a wrong answer key</h4>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  This is by far the most useful kind of email we get. To help us fix it fast, please include:
                </p>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
                  <li>The exam paper title (e.g. &quot;MPSC Group B Combine Pre 2024&quot;).</li>
                  <li>The question number as shown on the quiz screen.</li>
                  <li>The current marked answer and what you believe the correct answer is.</li>
                  <li>If possible, a citation: the official MPSC revised key, an NCERT page, the Constitution article, etc.</li>
                </ul>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Tip: every quiz has an inline <strong>Report</strong> button after submission that pre-fills these details for you.
                </p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">SLA: acknowledged in 24 hours, fixed within 48 hours of acknowledgement.</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-700/40">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">2. Request a missing exam paper</h4>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  We&apos;re continuously adding more papers. If a recent MPSC paper is not on the {""}
                  <Link href="/exams" className="text-indigo-600 underline dark:text-indigo-400">/exams</Link> page, send us:
                </p>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
                  <li>Exam name and year (e.g. PSI Pre 2025).</li>
                  <li>A link to the official PDF on mpsc.gov.in if you have one.</li>
                  <li>A link to the official answer key (Set A).</li>
                </ul>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">SLA: typically added within 5–7 working days.</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-700/40">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">3. Suggest a feature or correction to a study guide</h4>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Have an idea for a feature, a new study guide topic, an additional layer for the {""}
                  <Link href="/map" className="text-indigo-600 underline dark:text-indigo-400">interactive map</Link>, or a correction to one of our {""}
                  <Link href="/study-guides" className="text-indigo-600 underline dark:text-indigo-400">study guides</Link>?
                  We read every suggestion. Please include the page URL when reporting a study-guide correction.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-700/40">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">4. Bug reports and technical issues</h4>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Something broken? Help us reproduce it:
                </p>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
                  <li>Page URL where the issue occurred.</li>
                  <li>Browser and device (e.g. Chrome 132 on Android 14, Samsung S22).</li>
                  <li>What you tried, what you expected, what actually happened.</li>
                  <li>Screenshot or screen-recording if possible.</li>
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-700/40">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">5. Privacy, DPDP and data-deletion requests</h4>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Email us from the address you used to sign in, with the subject line
                  <strong> &quot;Privacy request&quot;</strong> or <strong>&quot;Delete my account&quot;</strong>.
                  See our <Link href="/privacy" className="text-indigo-600 underline dark:text-indigo-400">Privacy Policy</Link> for the full list of rights you can exercise.
                </p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">SLA: acknowledged within 7 days, completed within 30 days, as required under the Indian DPDP Act 2023.</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-700/40">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">6. Partnerships, collaboration and content contribution</h4>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  If you are a coaching institute, a YouTube educator, or an MPSC expert who would
                  like to contribute additional study guides, video walk-throughs of solved papers,
                  or topic-wise explanation notes, write to us with a brief about yourself and what
                  you&apos;d like to do. We don&apos;t pay for content (the platform is free) but we
                  attribute openly and link generously.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-900/30">
            <h3 className="text-sm font-bold text-amber-800 dark:text-amber-200">What we cannot help with</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-amber-900/90 dark:text-amber-200/90">
              <li>Official MPSC application forms, fee payment, hall tickets, results — please use <a className="underline" href="https://mpsc.gov.in" target="_blank" rel="noopener">mpsc.gov.in</a>.</li>
              <li>Personal coaching, doubt-resolution sessions or one-on-one mentorship.</li>
              <li>Job placement after the exam.</li>
            </ul>
          </section>

          <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5 text-center dark:border-slate-700 dark:bg-slate-700/40">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Don&apos;t know Academy</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Pune, Maharashtra, India<br />
              <a className="text-indigo-600 underline dark:text-indigo-400" href="mailto:dontknowacademy@gmail.com">dontknowacademy@gmail.com</a>
            </p>
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              Don&apos;t know Academy is a one-developer education project. We are not affiliated with MPSC, the Government of Maharashtra or any government agency.
            </p>
          </section>
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
              <Link href="/exams" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Exam papers</Link>
              <span>|</span>
              <Link href="/study-guides" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Study guides</Link>
              <span>|</span>
              <Link href="/map" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Map</Link>
              <span>|</span>
              <Link href="/privacy" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
