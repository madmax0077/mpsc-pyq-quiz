import Link from "next/link";
import type { Metadata } from "next";
import DisplayAd from "@/components/DisplayAd";
import { IN_CONTENT_AD_SLOT } from "@/lib/adsConfig";

export const metadata: Metadata = {
  title: "MPSC Group C Exam Pattern 2026 — Prelims, Mains, Marks & Negative Marking",
  description:
    "MPSC Group C exam pattern 2026 for Combined prelims and mains: 100 questions, 100 marks, 1 hour, 1/4th negative marking, subject areas, skill test and how to practise free PYQs online.",
  keywords: [
    "mpsc group c exam pattern",
    "mpsc group c exam pattern 2026",
    "mpsc group c paper pattern",
    "mpsc group c prelims pattern",
    "maharashtra group-c services combined preliminary examination-2026 syllabus",
    "mpsc group c negative marking",
    "mpsc combine group c pattern",
  ],
  alternates: { canonical: "/study-guides/mpsc-group-c-exam-pattern-2026" },
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "What is the MPSC Group C exam pattern 2026?",
    a: "The Group C Combined path is Prelims → Mains → Skill / typing test (post-specific). Prelims is a single 100-question, 100-mark objective paper in 60 minutes with 1/4th negative marking. Mains has two 100-mark papers; Clerk-Typist posts also require a typing skill test.",
  },
  {
    q: "How many questions are there in MPSC Group C prelims?",
    a: "100 objective questions for 100 marks, one hour duration, bilingual (Marathi and English).",
  },
  {
    q: "Is there negative marking in MPSC Group C 2026?",
    a: "Yes. 0.25 marks are deducted for every wrong answer. Unanswered questions have no penalty.",
  },
  {
    q: "What is the Maharashtra Group-C Services Combined Preliminary Examination syllabus?",
    a: "The common prelims covers Marathi, English, GK/Current Affairs, Mathematics & Reasoning, Polity, History, Geography, Economics and General Science, with a strong Maharashtra tilt in History and Geography. See our subject-wise weightage and full syllabus guides for the topic map.",
  },
];

export default function MpscGroupCExamPattern2026Guide() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
            <h1 className="break-words text-lg font-bold leading-snug text-slate-800 dark:text-slate-100">
              MPSC Group C Exam Pattern 2026
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">MPSC Study Guide · ~9 min read</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <article className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:prose-invert dark:border-slate-700 dark:bg-slate-800 sm:p-9">
          <h2>MPSC Group C Exam Pattern 2026 — Prelims, Mains &amp; Skill Test</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: August 2026 · Reading time: ~9 minutes
          </p>

          <p>
            This page is a focused <strong>MPSC Group C exam pattern 2026</strong> reference for the
            Combined recruitment (Tax Assistant, Clerk-Typist, Industry Inspector and allied Group C
            posts). Use it when you need marks, duration, negative marking and stage order in one
            place — then practise the matching{" "}
            <Link href="/exams">previous year question papers</Link> online with answers.
          </p>
          <p>
            Always cross-check the latest PDF on{" "}
            <a href="https://mpsc.gov.in" target="_blank" rel="noopener">
              mpsc.gov.in
            </a>{" "}
            for that year’s vacancy notification; MPSC can tweak post lists and skill-test details
            even when the prelims skeleton stays stable.
          </p>

          <h3>1. Selection stages at a glance</h3>
          <div className="prose-table-wrap my-4 -mx-1 overflow-x-auto rounded-xl">
          <table>
            <thead>
              <tr>
                <th>Stage</th>
                <th>What it is</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Prelims</td>
                <td>Common objective paper, 100 marks, 1 hour</td>
                <td>Screening for mains</td>
              </tr>
              <tr>
                <td>Mains</td>
                <td>Two papers of 100 marks each</td>
                <td>Merit for most posts</td>
              </tr>
              <tr>
                <td>Skill / typing</td>
                <td>Post-specific (e.g. Clerk-Typist)</td>
                <td>Qualifying / post requirement</td>
              </tr>
            </tbody>
          </table>
          </div>

          <h3>2. Group C Combined prelims pattern 2026</h3>
          <div className="prose-table-wrap my-4 -mx-1 overflow-x-auto rounded-xl">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Paper name</td>
                <td>Maharashtra Group-C Services Combined Preliminary Examination</td>
              </tr>
              <tr>
                <td>Questions</td>
                <td>100 MCQs</td>
              </tr>
              <tr>
                <td>Marks</td>
                <td>100 (1 mark each)</td>
              </tr>
              <tr>
                <td>Duration</td>
                <td>60 minutes</td>
              </tr>
              <tr>
                <td>Medium</td>
                <td>Marathi &amp; English</td>
              </tr>
              <tr>
                <td>Negative marking</td>
                <td>1/4th (0.25) per wrong answer</td>
              </tr>
              <tr>
                <td>Mode</td>
                <td>Offline OMR (as per recent cycles)</td>
              </tr>
            </tbody>
          </table>
          </div>
          <p>
            Subject areas and approximate{" "}
            <Link href="/study-guides/mpsc-group-c-subject-wise-weightage">
              subject wise weightage
            </Link>{" "}
            are covered on a dedicated page so this pattern guide stays short and scannable.
          </p>

          <DisplayAd adsenseSlot={IN_CONTENT_AD_SLOT} ezoicKey="contentInline" className="my-8 not-prose" />

          <h3>3. Mains pattern (summary)</h3>
          <ul>
            <li>
              <strong>Paper I</strong> — common paper (Marathi, English, General Knowledge focus as
              notified).
            </li>
            <li>
              <strong>Paper II</strong> — post-specific paper.
            </li>
            <li>
              <strong>Clerk-Typist skill test</strong> — typically Marathi ~30 wpm and English ~40 wpm
              (confirm in the year’s notice).
            </li>
          </ul>
          <p>
            For the longer topic breakdown, use the{" "}
            <Link href="/study-guides/mpsc-group-c-syllabus">MPSC Group C Syllabus</Link> guide. For
            how Group C compares with Group B / PSI / Gazetted services, see the{" "}
            <Link href="/study-guides/mpsc-exam-pattern">full MPSC Exam Pattern</Link> page.
          </p>

          <h3>4. Negative marking strategy in one minute</h3>
          <p>
            Wrong answer = −0.25. Blank = 0. If you can eliminate two options, a calculated guess is
            usually +EV; blind guessing across the paper is not. Full examples live in the{" "}
            <Link href="/study-guides/mpsc-negative-marking">MPSC negative marking</Link> guide.
          </p>

          <h3>5. Best way to practise this pattern for free</h3>
          <ul>
            <li>
              <Link href="/exams">Group C previous year question paper</Link> sets with official-key
              answers and explanations.
            </li>
            <li>
              <Link href="/?mode=mock">MPSC Group C mock test free</Link> — including Marathi UI for
              “mock test in Marathi” searchers.
            </li>
            <li>
              Daily aggregate practice via the home quiz flow if you want streak + leaderboard
              pressure.
            </li>
          </ul>

          <h3>Frequently asked questions</h3>
          {FAQ.map((item) => (
            <div key={item.q}>
              <h4>{item.q}</h4>
              <p>{item.a}</p>
            </div>
          ))}

          <h3>Next steps</h3>
          <ul>
            <li>
              Open{" "}
              <Link href="/study-guides/mpsc-group-c-subject-wise-weightage">
                subject wise weightage
              </Link>{" "}
              and build a one-week revision timetable.
            </li>
            <li>
              If your post path is Talathi-related, also read{" "}
              <Link href="/study-guides/mpsc-talathi-exam">MPSC Talathi Exam</Link>.
            </li>
            <li>
              Browse the{" "}
              <Link href="/study-guides/mpsc-combine-question-paper">MPSC Combine question paper</Link>{" "}
              hub if you searched under the “Combine” name.
            </li>
          </ul>
        </article>
      </main>

      <footer className="border-t border-slate-200/80 py-6 dark:border-slate-700/80">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              MPSC PYQ QUIZ &middot; Don&apos;t know Academy
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
              <Link href="/" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">
                Home
              </Link>
              <span>|</span>
              <Link
                href="/study-guides"
                className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400"
              >
                All study guides
              </Link>
              <span>|</span>
              <Link href="/exams" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">
                Exam papers
              </Link>
              <span>|</span>
              <Link href="/privacy" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
