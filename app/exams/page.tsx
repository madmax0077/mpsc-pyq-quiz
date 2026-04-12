import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MPSC Previous Year Question Papers (2020–2025) — Free Online Practice",
  description:
    "Practice MPSC previous year question papers online for free. 3350+ questions from Group B, Group C, PSI, Gazetted Civil Services & Technical Services prelims (2020–2025). English & Marathi. Official answer keys included.",
  keywords: [
    "MPSC previous year papers", "MPSC question papers", "MPSC PYQ",
    "MPSC Group B question paper", "MPSC Group C question paper",
    "MPSC PSI question paper", "MPSC prelims papers",
    "MPSC 2025 question paper", "MPSC 2024 question paper",
    "MPSC Gazetted Services paper", "MPSC answer key",
    "MPSC online test", "MPSC mock test free",
  ],
  alternates: { canonical: "/exams" },
};

const EXAMS = [
  {
    title: "MPSC Group C Combined Pre 2025",
    year: 2025,
    type: "Group C",
    questions: 100,
    description: "MPSC Subordinate Services Group C Combined Preliminary Exam 2025 — 100 questions covering Indian Polity, History, Geography, Science, Economics, Current Affairs, and Environment.",
  },
  {
    title: "MPSC Group B Combined Pre 2025",
    year: 2025,
    type: "Group B",
    questions: 100,
    description: "MPSC Subordinate Services Group B Combined Preliminary Exam 2025 — 100 questions testing General Studies including Polity, History, Geography, Science, and Current Affairs.",
  },
  {
    title: "MPSC CS Gazetted Combined Pre 2025",
    year: 2025,
    type: "Gazetted CS",
    questions: 100,
    description: "MPSC Gazetted Civil Services Combined Preliminary Exam 2025 — 100 questions for Maharashtra Civil Services covering all General Studies topics.",
  },
  {
    title: "MPSC Group C Combined Pre 2024",
    year: 2024,
    type: "Group C",
    questions: 100,
    description: "MPSC Subordinate Services Group C Combined Preliminary Exam 2024 — 100 MCQs from the official question paper with Set A answer key.",
  },
  {
    title: "MPSC Group B Combined Pre 2024",
    year: 2024,
    type: "Group B",
    questions: 100,
    description: "MPSC Subordinate Services Group B Combined Preliminary Exam 2024 — complete 100-question paper with verified answers.",
  },
  {
    title: "MPSC Gazetted Civil Services Combined Pre 2024",
    year: 2024,
    type: "Gazetted CS",
    questions: 100,
    description: "MPSC Gazetted Civil Services Combined Preliminary Exam 2024 — 100 General Studies questions for Maharashtra state services.",
  },
  {
    title: "MPSC Gazetted CS Combined Pre 2023",
    year: 2023,
    type: "Gazetted CS",
    questions: 100,
    description: "MPSC Gazetted Civil Services Combined Preliminary Exam 2023 — full paper with official answer key.",
  },
  {
    title: "MPSC Gazetted Group B & C Combined Pre 2023",
    year: 2023,
    type: "Group B & C",
    questions: 100,
    description: "MPSC Gazetted Group B and C Combined Preliminary Exam 2023 — 100 questions covering the full General Studies syllabus.",
  },
  {
    title: "PSI 2023 — English & General Studies",
    year: 2023,
    type: "PSI",
    questions: 75,
    description: "MPSC Police Sub-Inspector Preliminary Exam 2023 — 75 questions on English Language and General Studies.",
  },
  {
    title: "MPSC Gazetted TS Combined Pre 2022",
    year: 2022,
    type: "Gazetted TS",
    questions: 100,
    description: "MPSC Gazetted Technical Services Combined Preliminary Exam 2022 — 100 General Studies questions with verified answers.",
  },
  {
    title: "MPSC Group C Combined Pre 2022",
    year: 2022,
    type: "Group C",
    questions: 100,
    description: "MPSC Subordinate Services Group C Combined Preliminary Exam 2022 — 100 MCQs covering Polity, History, Geography, Science, and more.",
  },
  {
    title: "MPSC Sub-Ordinate Group B Combined Pre 2022",
    year: 2022,
    type: "Group B",
    questions: 100,
    description: "MPSC Subordinate Services Group B Combined Preliminary Exam 2022 — full question paper with Set A answers.",
  },
  {
    title: "MPSC Gazetted TS Combined Pre 2021",
    year: 2021,
    type: "Gazetted TS",
    questions: 100,
    description: "MPSC Gazetted Technical Services Combined Preliminary Exam 2021 — complete General Studies paper.",
  },
  {
    title: "MPSC PSI Pre 2021",
    year: 2021,
    type: "PSI",
    questions: 100,
    description: "MPSC Police Sub-Inspector Preliminary Exam 2021 — 100 questions on General Studies with official answer key.",
  },
  {
    title: "MPSC Group-C Combined Pre 2021",
    year: 2021,
    type: "Group C",
    questions: 100,
    description: "MPSC Subordinate Services Group C Combined Preliminary Exam 2021 — 100 General Studies MCQs.",
  },
  {
    title: "MPSC Subordinate Services Group B Pre 2021",
    year: 2021,
    type: "Group B",
    questions: 100,
    description: "MPSC Subordinate Services Group B Preliminary Exam 2021 — complete paper with verified Set A answers.",
  },
  {
    title: "MPSC SS Group B Combined Pre 2020",
    year: 2020,
    type: "Group B",
    questions: 100,
    description: "MPSC Subordinate Services Group B Combined Preliminary Exam 2020 — 100 questions covering the entire General Studies syllabus.",
  },
];

const YEARS = [2025, 2024, 2023, 2022, 2021, 2020];

export default function ExamsPage() {
  const totalQuestions = EXAMS.reduce((sum, e) => sum + e.questions, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-800">MPSC Previous Year Question Papers</h1>
            <p className="text-xs text-slate-500">Free online practice — {totalQuestions}+ questions</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            MPSC Previous Year Question Papers — Free Online Practice
          </h2>
          <p className="mt-3 text-slate-600">
            Practice with {totalQuestions}+ questions from {EXAMS.length} MPSC exam papers spanning {YEARS[YEARS.length - 1]} to {YEARS[0]}.
            Every paper includes the official Set A answer key. Available in both <strong>English</strong> and <strong>Marathi</strong>.
            Sign in on the <Link href="/" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700">home page</Link> to start practicing instantly.
          </p>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-center">
            <p className="text-2xl font-bold text-indigo-700">{EXAMS.length}</p>
            <p className="text-sm text-indigo-600">Exam Papers</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
            <p className="text-2xl font-bold text-emerald-700">{totalQuestions}+</p>
            <p className="text-sm text-emerald-600">Questions</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
            <p className="text-2xl font-bold text-amber-700">{YEARS.length}</p>
            <p className="text-sm text-amber-600">Years Covered</p>
          </div>
        </div>

        {YEARS.map((year) => {
          const yearExams = EXAMS.filter((e) => e.year === year);
          if (yearExams.length === 0) return null;
          return (
            <section key={year} className="mb-10">
              <h3 className="mb-4 text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">
                MPSC {year} Question Papers
              </h3>
              <div className="space-y-4">
                {yearExams.map((exam) => (
                  <article key={exam.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-slate-800">{exam.title}</h4>
                        <p className="mt-1 text-sm text-slate-600">{exam.description}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                        {exam.questions} Qs
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                      <span className="rounded bg-slate-100 px-2 py-0.5 font-medium">{exam.type}</span>
                      <span>English + Marathi</span>
                      <span>Official Answer Key (Set A)</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        <div className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 p-6 text-center">
          <h3 className="text-lg font-bold text-indigo-700">Ready to Practice?</h3>
          <p className="mt-2 text-sm text-slate-600">
            Sign in on the home page to start solving MPSC previous year questions with instant scoring and detailed answers.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            Start Practicing — It&apos;s Free
          </Link>
        </div>

        <div className="mt-10">
          <h3 className="mb-4 text-lg font-bold text-slate-800">About MPSC Exams</h3>
          <div className="prose prose-slate max-w-none text-sm">
            <p>
              The Maharashtra Public Service Commission (MPSC) conducts competitive examinations for recruitment to various government posts in Maharashtra. The major exams include:
            </p>
            <ul>
              <li><strong>MPSC Group B (Subordinate Services)</strong> — For posts like Deputy Collector (Dy. Collector), Deputy Superintendent of Police (Dy. SP), and other Group B officers.</li>
              <li><strong>MPSC Group C (Subordinate Services)</strong> — For posts like Tax Assistant, Clerk, and other Group C positions.</li>
              <li><strong>MPSC PSI (Police Sub-Inspector)</strong> — For recruitment to the Police Sub-Inspector cadre in Maharashtra.</li>
              <li><strong>MPSC Gazetted Civil Services</strong> — For higher administrative posts in Maharashtra state government.</li>
              <li><strong>MPSC Gazetted Technical Services</strong> — For technical posts requiring specialized qualifications.</li>
            </ul>
            <p>
              All preliminary exams consist of objective-type (MCQ) questions on General Studies covering subjects like Indian Polity, History of India and Maharashtra, Geography, General Science, Current Affairs, Economics, and Environment.
            </p>
            <p>
              Practicing with previous year question papers is one of the most effective strategies for MPSC preparation. It helps you understand the exam pattern, frequently asked topics, difficulty level, and time management.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/80 py-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-slate-400">MPSC PYQ QUIZ &middot; Don&apos;t know Academy</p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <Link href="/" className="hover:text-indigo-600 hover:underline">Home</Link>
              <span>|</span>
              <Link href="/about" className="hover:text-indigo-600 hover:underline">About</Link>
              <span>|</span>
              <Link href="/privacy" className="hover:text-indigo-600 hover:underline">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
