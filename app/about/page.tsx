import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-slate-800">About</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <Link href="/" className="mb-8 flex flex-col items-center text-center no-underline">
            <img
              src="/logo.png"
              alt="MPSC PYQ QUIZ Logo"
              className="mb-4 h-24 w-24 rounded-full object-cover shadow-lg ring-4 ring-white"
            />
            <h2 className="text-2xl font-bold text-slate-800">MPSC PYQ QUIZ</h2>
            <p className="mt-1 text-sm font-medium text-indigo-600">
              by Don&apos;t know Academy
            </p>
          </Link>

          <div className="prose prose-slate max-w-none">
            <h3>What is MPSC PYQ QUIZ?</h3>
            <p>
              MPSC PYQ QUIZ is a free online platform designed to help MPSC (Maharashtra
              Public Service Commission) aspirants practice with Previous Year Questions
              (PYQs). Our goal is to make quality exam preparation accessible to everyone.
            </p>

            <h3>Features</h3>
            <ul>
              <li>
                <strong>PDF Upload &amp; Parsing</strong> — Upload MPSC question paper PDFs
                and automatically extract questions with options
              </li>
              <li>
                <strong>Category-wise Practice</strong> — Practice questions sorted by
                subject: Indian Polity, History, Geography, Science, Environment, Economics
              </li>
              <li>
                <strong>Instant Results</strong> — Get your score immediately with detailed
                explanations
              </li>
              <li>
                <strong>Bilingual Support</strong> — Handles both English and Marathi content
                from PDFs
              </li>
              <li>
                <strong>Offline-First</strong> — All data is stored in your browser. No
                internet needed after loading
              </li>
            </ul>

            <h3>About Don&apos;t know Academy</h3>
            <p>
              Don&apos;t know Academy is dedicated to helping MPSC aspirants prepare
              effectively through technology-driven solutions. We believe every aspirant
              deserves access to quality practice material regardless of their background.
            </p>

            <h3>Contact</h3>
            <p>
              Have questions, feedback, or suggestions? We&apos;d love to hear from you!
            </p>
            <p>
              Email:{" "}
              <a href="mailto:dontknowacademy@gmail.com">dontknowacademy@gmail.com</a>
            </p>

            <h3>Disclaimer</h3>
            <p>
              This platform is an independent educational tool. It is not affiliated with,
              endorsed by, or connected to MPSC or any government body. All questions are
              sourced from publicly available previous year papers.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/80 py-6 text-center text-xs text-slate-400">
        MPSC PYQ QUIZ &middot; Don&apos;t know Academy
      </footer>
    </div>
  );
}
