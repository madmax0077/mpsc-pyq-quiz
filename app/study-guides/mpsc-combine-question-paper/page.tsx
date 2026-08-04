import Link from "next/link";
import type { Metadata } from "next";
import DisplayAd from "@/components/DisplayAd";
import { IN_CONTENT_AD_SLOT } from "@/lib/adsConfig";

export const metadata: Metadata = {
  title: "MPSC Combine Question Paper & PYQ — Group B / Group C Combined Pre Practice",
  description:
    "MPSC Combine question paper hub: what Combined Pre means, Group B vs Group C Combined PYQs, free online practice with answers, mock tests in English and Marathi, and syllabus/pattern links for 2026.",
  keywords: [
    "mpsc combine",
    "mpsc combine question paper",
    "mpsc combine pyq",
    "mpsc combine question papers with answers pdf free download",
    "mpsc combine pre question paper pdf free download",
    "mpsc combine group c previous year question papers",
    "mpsc gat c question paper",
    "mpsc gat k question paper",
  ],
  alternates: { canonical: "/study-guides/mpsc-combine-question-paper" },
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "What does MPSC Combine mean?",
    a: "In student search language, “MPSC Combine” usually means a Combined preliminary examination — commonly Group C Combined Pre or Group B Combined Pre — where one objective paper screens candidates for multiple posts. Always match the exact notification title on mpsc.gov.in for your vacancy year.",
  },
  {
    q: "Where can I get MPSC Combine question papers with answers?",
    a: "Practise them online on this site’s exam library with answer-key scoring and explanations. That replaces most “PDF free download” hunting for daily revision, while still using official-key answers.",
  },
  {
    q: "Are GAT C / GAT K the same as Group C?",
    a: "Yes in practice for many Marathi/English searchers — “GAT C” / “गट C” is how Group C is spoken and typed. Use Group C Combined papers and the Group C pattern guides when you see those spellings.",
  },
  {
    q: "Should I solve Group B and Group C Combine papers together?",
    a: "Use both for aptitude and GK stamina, but keep separate score logs. Cut-offs and some topic weightings differ, so final mocks should match the exact Combined exam you will sit.",
  },
];

export default function MpscCombineQuestionPaperHub() {
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
              MPSC Combine Question Paper
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">MPSC Study Guide · ~8 min read</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <article className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:prose-invert dark:border-slate-700 dark:bg-slate-800 sm:p-9">
          <h2>MPSC Combine Question Paper &amp; PYQ Hub</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: August 2026 · Reading time: ~8 minutes
          </p>

          <p>
            Students type <strong>mpsc combine</strong>, <strong>mpsc combine question paper</strong>,{" "}
            <strong>combine pyq</strong>, and even <strong>gat c / gat k question paper</strong> when
            they mean the Combined preliminary papers for Group C or Group B. This hub translates
            those search phrases into the right practice path on MPSC PYQ QUIZ — free, with answers,
            without making you collect ten low-quality PDFs.
          </p>

          <h3>1. Pick your Combine path</h3>
          <table>
            <thead>
              <tr>
                <th>You searched…</th>
                <th>Practise this</th>
                <th>Read this</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Group C Combine / GAT C / गट C</td>
                <td>
                  <Link href="/exams">Group C PYQ papers</Link>
                </td>
                <td>
                  <Link href="/study-guides/mpsc-group-c-exam-pattern-2026">
                    Group C exam pattern 2026
                  </Link>
                </td>
              </tr>
              <tr>
                <td>Group B Combine / PSI-STI-ASO Pre</td>
                <td>
                  <Link href="/exams">Group B PYQ papers</Link>
                </td>
                <td>
                  <Link href="/study-guides/mpsc-group-b-previous-year-question-paper">
                    Group B previous year hub
                  </Link>
                </td>
              </tr>
              <tr>
                <td>Combine mock / test series</td>
                <td>
                  <Link href="/?mode=mock">Free mock test</Link>
                </td>
                <td>
                  <Link href="/study-guides/mpsc-negative-marking">Negative marking rules</Link>
                </td>
              </tr>
            </tbody>
          </table>

          <DisplayAd adsenseSlot={IN_CONTENT_AD_SLOT} ezoicKey="contentInline" className="my-8 not-prose" />

          <h3>2. What a Combine prelims paper looks like</h3>
          <ul>
            <li>Single common objective paper for multiple posts in that Combined notification.</li>
            <li>Usually 100 questions / 100 marks with <strong>1/4th negative marking</strong>.</li>
            <li>Bilingual — Marathi and English.</li>
            <li>Screens you into mains / further stages; it is not the final merit paper alone.</li>
          </ul>
          <p>
            For Group C subject spread, use{" "}
            <Link href="/study-guides/mpsc-group-c-subject-wise-weightage">
              subject wise weightage
            </Link>
            . For syllabus depth, use{" "}
            <Link href="/study-guides/mpsc-group-c-syllabus">Group C Syllabus</Link>.
          </p>

          <h3>3. Free Combine practice workflow</h3>
          <ol>
            <li>
              Attempt one recent Combine / Group C or Group B paper from{" "}
              <Link href="/exams">/exams</Link>.
            </li>
            <li>Review every wrong answer the same day — explanations are built for revision speed.</li>
            <li>
              Take a{" "}
              <Link href="/?mode=mock">mock test free in Marathi or English</Link> to lock timing.
            </li>
            <li>
              Keep a one-page error log by subject (language, aptitude, polity, MH geography, CA).
            </li>
          </ol>

          <h3>4. PDF downloads vs online PYQ</h3>
          <p>
            Search demand for “combine question papers with answers pdf free download” is real. PDFs
            are fine for offline reading, but most aspirants lose marks to speed and negative marking,
            not to missing a file. Online PYQ with instant scoring fixes that loop. Use downloads as a
            backup; use this site as the daily drill.
          </p>

          <h3>5. Marathi search tip</h3>
          <p>
            Queries like <strong>एमपीएससी परीक्षा प्रश्नपत्रिका</strong> and spoken forms{" "}
            <strong>GAT C / GAT K</strong> map to the same Group C / Combine practice sets. Share this
            hub with batchmates who search in Marathi spellings so they land on the correct papers.
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
              Start with{" "}
              <Link href="/study-guides/mpsc-group-c-exam-pattern-2026">
                Group C exam pattern 2026
              </Link>{" "}
              if your form is Group C Combined.
            </li>
            <li>
              Or open the{" "}
              <Link href="/study-guides/mpsc-group-b-previous-year-question-paper">
                Group B previous year question paper
              </Link>{" "}
              hub for PSI/STI/ASO-style Combined Pre.
            </li>
            <li>
              Compare all MPSC exams in{" "}
              <Link href="/study-guides/mpsc-exam-pattern">MPSC Exam Pattern</Link>.
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
