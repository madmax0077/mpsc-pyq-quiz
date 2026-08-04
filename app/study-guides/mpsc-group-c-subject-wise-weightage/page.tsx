import Link from "next/link";
import type { Metadata } from "next";
import DisplayAd from "@/components/DisplayAd";
import { IN_CONTENT_AD_SLOT } from "@/lib/adsConfig";

export const metadata: Metadata = {
  title: "MPSC Group C Subject Wise Weightage 2026 — Prelims Marks Distribution",
  description:
    "MPSC Group C subject wise weightage for Combined prelims 2026: approximate marks for Marathi, English, GK, Maths & Reasoning, Polity, History, Geography, Economics and Science, with a practical scoring plan.",
  keywords: [
    "mpsc group c subject wise weightage",
    "MPSC Group C weightage",
    "MPSC Group C marks distribution",
    "MPSC Group C prelims subject wise",
    "MPSC combine group c weightage",
    "Group C pre syllabus weightage",
  ],
  alternates: { canonical: "/study-guides/mpsc-group-c-subject-wise-weightage" },
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "What is the subject wise weightage in MPSC Group C prelims?",
    a: "The 100-mark Group C Combined prelims is spread across nine areas — Marathi, English, General Knowledge / Current Affairs, Mathematics & Reasoning, Indian Polity, History (Maharashtra focus), Geography (Maharashtra focus), Economics and General Science. In recent papers each block has roughly 8–12 questions, so treat them as near-equal scoring zones rather than one dominant subject.",
  },
  {
    q: "Which subjects give the most reliable marks in Group C?",
    a: "Marathi, English, Mathematics & Reasoning and Indian Polity are usually the most stable scoring blocks because the syllabus is finite and question style repeats across years. Current Affairs and mixed GK swing more from paper to paper.",
  },
  {
    q: "Does MPSC publish exact subject-wise marks for Group C?",
    a: "The official notification lists the subject areas for the common prelims paper; it does not always freeze a rigid question count per subject. Weightage on this page is therefore based on recent Group C Combined prelims trends and should be used for preparation planning, not as a legal guarantee for the next paper.",
  },
  {
    q: "How should I use weightage while revising?",
    a: "Lock the four stable blocks first (language + aptitude + polity), keep a thin current-affairs notebook, then finish Maharashtra-heavy History and Geography. Solve previous-year papers under the real 1/4th negative-marking rule so your attempt strategy matches the weightage.",
  },
];

export default function MpscGroupCSubjectWiseWeightageGuide() {
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
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              MPSC Group C Subject Wise Weightage
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">MPSC Study Guide · ~8 min read</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <article className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:prose-invert dark:border-slate-700 dark:bg-slate-800 sm:p-9">
          <h2>MPSC Group C Subject Wise Weightage — 2026 Prelims</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: August 2026 · Reading time: ~8 minutes
          </p>

          <p>
            Searchers looking for <strong>MPSC Group C subject wise weightage</strong> usually want one
            clear answer: how the 100-mark Combined prelims paper is spread across subjects, and where
            to spend revision time. This page gives a practical marks map for the{" "}
            <strong>Maharashtra Group-C Services Combined Preliminary Examination</strong>, then links
            you straight into free PYQ and mock practice on this site.
          </p>

          <h3>1. Quick answer — approximate weightage out of 100</h3>
          <table>
            <thead>
              <tr>
                <th>Subject area</th>
                <th>Approx. questions / marks</th>
                <th>Prep note</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Marathi</td>
                <td>8–12</td>
                <td>Grammar + vocabulary repeats every year</td>
              </tr>
              <tr>
                <td>English</td>
                <td>8–12</td>
                <td>Comprehension, grammar, error spotting</td>
              </tr>
              <tr>
                <td>General Knowledge / Current Affairs</td>
                <td>8–12</td>
                <td>Maharashtra + national current events</td>
              </tr>
              <tr>
                <td>Mathematics &amp; Reasoning</td>
                <td>8–12</td>
                <td>High ROI if you drill speed daily</td>
              </tr>
              <tr>
                <td>Indian Polity</td>
                <td>8–12</td>
                <td>Constitution + state administration</td>
              </tr>
              <tr>
                <td>History (Maharashtra focus)</td>
                <td>8–12</td>
                <td>Modern Maharashtra + freedom struggle</td>
              </tr>
              <tr>
                <td>Geography (Maharashtra focus)</td>
                <td>8–12</td>
                <td>Rivers, districts, agriculture, resources</td>
              </tr>
              <tr>
                <td>Economics</td>
                <td>8–12</td>
                <td>Basic concepts + Maharashtra economy</td>
              </tr>
              <tr>
                <td>General Science</td>
                <td>8–12</td>
                <td>Everyday science, not deep theory</td>
              </tr>
            </tbody>
          </table>
          <p>
            Treat the ranges as a preparation compass. Exact counts move slightly by year, but the
            paper stays a balanced common prelims — not a single-subject exam. For the full topic list
            and mains overview, open the{" "}
            <Link href="/study-guides/mpsc-group-c-syllabus">MPSC Group C Syllabus</Link> guide.
          </p>

          <DisplayAd adsenseSlot={IN_CONTENT_AD_SLOT} ezoicKey="contentInline" className="my-8 not-prose" />

          <h3>2. Scoring plan based on weightage</h3>
          <ol>
            <li>
              <strong>Secure ~40 marks first</strong> — Marathi, English, Maths &amp; Reasoning and
              Polity. These four blocks are syllabus-bound and reward daily drills.
            </li>
            <li>
              <strong>Add Maharashtra edge (~20–25 marks)</strong> — History and Geography with a state
              focus. Use the{" "}
              <Link href="/map">interactive Maharashtra map</Link> and{" "}
              <Link href="/rivers-maharashtra">rivers guide</Link> for fast visual revision.
            </li>
            <li>
              <strong>Fill the swing zone</strong> — Current Affairs, Economics and Science. Keep notes
              thin and revise weekly instead of collecting PDFs you never reopen.
            </li>
            <li>
              <strong>Protect marks with negative marking discipline</strong> — every wrong answer
              costs 0.25. Read the{" "}
              <Link href="/study-guides/mpsc-negative-marking">MPSC Group C negative marking</Link>{" "}
              rules before your next mock.
            </li>
          </ol>

          <h3>3. How to convert weightage into practice</h3>
          <ul>
            <li>
              Attempt recent{" "}
              <Link href="/exams">MPSC Group C previous year question papers</Link> and tag every miss
              by subject — your personal weightage will appear in a week.
            </li>
            <li>
              Take a timed{" "}
              <Link href="/?mode=mock">MPSC Group C mock test free</Link> (English / Marathi) under
              exam pressure.
            </li>
            <li>
              For polity depth, use{" "}
              <Link href="/study-guides/indian-polity-for-mpsc">Indian Polity for MPSC</Link>; for
              geography, use{" "}
              <Link href="/study-guides/maharashtra-geography">Maharashtra Geography</Link>.
            </li>
          </ul>

          <h3>4. Weightage vs cut-off — what actually matters</h3>
          <p>
            Cut-offs move with vacancy and paper difficulty, but a safe working target for many Group C
            Combined cycles is a strong net score after negative marking — not attempting all 100 at
            any cost. If your weak subjects are Science or Economics, do not let them steal revision
            hours from Marathi / Aptitude / Polity where the same effort buys more marks.
          </p>

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
              Read the companion{" "}
              <Link href="/study-guides/mpsc-group-c-exam-pattern-2026">
                MPSC Group C exam pattern 2026
              </Link>{" "}
              page for marks, time and stages.
            </li>
            <li>
              Start a baseline attempt on the{" "}
              <Link href="/exams">Group C PYQ papers</Link>.
            </li>
            <li>
              Follow the week-by-week plan in{" "}
              <Link href="/study-guides/mpsc-preparation-strategy">MPSC Preparation Strategy</Link>.
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
