import Link from "next/link";
import type { Metadata } from "next";
import DisplayAd from "@/components/DisplayAd";
import { IN_CONTENT_AD_SLOT } from "@/lib/adsConfig";

export const metadata: Metadata = {
  title: "MPSC Group B Previous Year Question Paper with Answers — Free PYQ Practice",
  description:
    "Practise MPSC Group B previous year question papers with answers online — Combined Pre (PSI / STI / ASO), prelims PYQs, answer-key based scoring, explanations, and free mock tests. No fake PDF spam.",
  keywords: [
    "mpsc group b previous year question paper",
    "mpsc group b question papers with answers pdf",
    "mpsc group b prelims question paper",
    "mpsc group b and c previous year question paper",
    "mpsc group b mains question papers with answers pdf",
    "mpsc group b pyq",
    "mpsc group b answer key",
  ],
  alternates: { canonical: "/study-guides/mpsc-group-b-previous-year-question-paper" },
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Where can I practise MPSC Group B previous year question papers with answers?",
    a: "On this site’s /exams library and student quiz flow. Papers are loaded with Set A style answer keys, instant scoring and coach-style explanations — faster for revision than hunting scattered PDFs.",
  },
  {
    q: "What posts come under MPSC Group B Combined Pre?",
    a: "The Group B Combined preliminary exam is commonly associated with PSI, STI and ASO recruitment paths (plus related Group B cadres as notified). Prelims is the common screening paper; later stages differ by post (mains, physical, skill or interview).",
  },
  {
    q: "Is Group B prelims pattern the same as Group C?",
    a: "Both are typically 100-mark objective prelims with 1/4th negative marking, but syllabus emphasis and difficulty differ. Compare them in the MPSC Exam Pattern guide, then practise each stream’s own PYQs separately.",
  },
  {
    q: "Do you provide Group B mains papers with answers PDF?",
    a: "We prioritise interactive prelims PYQ practice with answer keys online. Where a mains PDF exists in your download folder, use it for descriptive practice; for prelims speed and negative-marking drills, the online quiz is the better daily tool.",
  },
];

export default function MpscGroupBPyqHub() {
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
              MPSC Group B Previous Year Question Paper
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">MPSC Study Guide · ~7 min read</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <article className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:prose-invert dark:border-slate-700 dark:bg-slate-800 sm:p-9">
          <h2>MPSC Group B Previous Year Question Paper with Answers</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: August 2026 · Reading time: ~7 minutes
          </p>

          <p>
            If you searched for <strong>MPSC Group B previous year question paper</strong>,{" "}
            <strong>Group B question papers with answers PDF</strong>, or{" "}
            <strong>Group B prelims PYQ</strong>, this hub points you to free online practice with
            answer-key based scoring — the same papers students usually download, but in a timed quiz
            format that trains negative marking.
          </p>

          <h3>1. Start practising Group B PYQs</h3>
          <ul>
            <li>
              Open the full paper library on{" "}
              <Link href="/exams">/exams</Link> and pick Group B / Combined Pre sets.
            </li>
            <li>
              Or jump into the student quiz from{" "}
              <Link href="/">Home</Link> and filter the exam type you need.
            </li>
            <li>
              Add pressure with a{" "}
              <Link href="/?mode=mock">free MPSC mock test</Link> once you finish 1–2 full PYQs.
            </li>
          </ul>
          <p>
            Every scored set uses the official-style answer key (Set A where applicable) and shows
            explanations so you revise the concept, not only the letter.
          </p>

          <DisplayAd adsenseSlot={IN_CONTENT_AD_SLOT} ezoicKey="contentInline" className="my-8 not-prose" />

          <h3>2. What “Group B Combined” usually means</h3>
          <p>
            In everyday student language, <strong>MPSC Group B</strong> points to the Combined
            preliminary exam used for cadres such as <strong>PSI / STI / ASO</strong> (exact post
            list follows that year’s notification). The prelims is a common objective screen; mains,
            physical tests and interviews diverge by post.
          </p>
          <div className="prose-table-wrap my-4 -mx-1 overflow-x-auto rounded-xl">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Typical prelims snapshot</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Questions / marks</td>
                <td>100 / 100</td>
              </tr>
              <tr>
                <td>Duration</td>
                <td>As notified (often aligned with other Combined prelims)</td>
              </tr>
              <tr>
                <td>Negative marking</td>
                <td>1/4th (0.25) per wrong answer</td>
              </tr>
              <tr>
                <td>Medium</td>
                <td>Marathi &amp; English</td>
              </tr>
            </tbody>
          </table>
          </div>
          <p>
            For the cross-exam comparison table, read{" "}
            <Link href="/study-guides/mpsc-exam-pattern">MPSC Exam Pattern</Link>. For the penalty
            maths, read{" "}
            <Link href="/study-guides/mpsc-negative-marking">MPSC Negative Marking</Link>.
          </p>

          <h3>3. Group B vs Group C — how to practise both</h3>
          <p>
            Many aspirants search <strong>mpsc group b and c previous year question paper</strong>{" "}
            together. That is smart for pattern familiarity, but keep scorecards separate: question
            flavour and cut-off behaviour are not identical. After Group B sets, switch to the{" "}
            <Link href="/study-guides/mpsc-group-c-exam-pattern-2026">Group C pattern 2026</Link> page
            and its PYQs so you do not mix attempt strategies.
          </p>

          <h3>4. A 7-day Group B PYQ plan</h3>
          <ol>
            <li>Day 1–2: one full recent prelims paper, untimed review of every wrong answer.</li>
            <li>Day 3–4: second paper under a strict clock; note weak subjects.</li>
            <li>Day 5: topic drills from study guides (Polity / Maharashtra Geography / History).</li>
            <li>Day 6: mock test mode.</li>
            <li>Day 7: re-attempt only the questions you missed — same week, same mistakes cost ranks.</li>
          </ol>

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
              Go to <Link href="/exams">Exam papers</Link> and start a Group B set now.
            </li>
            <li>
              If you arrived via the word “Combine”, open the{" "}
              <Link href="/study-guides/mpsc-combine-question-paper">MPSC Combine question paper</Link>{" "}
              hub.
            </li>
            <li>
              Build a longer calendar with{" "}
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
