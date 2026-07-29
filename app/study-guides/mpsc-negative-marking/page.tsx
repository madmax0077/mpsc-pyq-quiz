import Link from "next/link";
import type { Metadata } from "next";
import DisplayAd from "@/components/DisplayAd";
import { IN_CONTENT_AD_SLOT } from "@/lib/adsConfig";

const SITE_URL = "https://www.mpscs.in";

export const metadata: Metadata = {
  title: "MPSC Negative Marking 2026 — Group B, Group C, CSAT & Rajyaseva Rules Explained",
  description:
    "How MPSC negative marking works in 2026: 1/4th mark deducted per wrong answer in Group B, Group C, PSI, Combine and Gazetted Civil Services (Rajyaseva) prelims, with worked examples, CSAT rules and a smart guessing strategy.",
  keywords: [
    "MPSC negative marking",
    "MPSC combine negative marking",
    "MPSC group c negative marking",
    "MPSC group b negative marking",
    "MPSC CSAT negative marking",
    "negative marking in MPSC prelims",
    "MPSC prelims negative marking",
    "MPSC group b prelims negative marking",
  ],
  alternates: { canonical: "/study-guides/mpsc-negative-marking" },
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "How much is the negative marking in MPSC exams?",
    a: "MPSC deducts 1/4th (0.25) of the marks allotted to a question for every wrong answer. This applies to all objective papers — Group B (PSI/STI/ASO), Group C, Sub Inspector State Excise and both papers of the Gazetted Civil Services (Rajyaseva) and Technical Services prelims.",
  },
  {
    q: "Is there negative marking in MPSC Group C?",
    a: "Yes. In the MPSC Group C Combined prelims each question carries 1 mark and a wrong answer costs 0.25 marks. Unanswered questions carry no penalty.",
  },
  {
    q: "Is there negative marking in the MPSC CSAT paper?",
    a: "Yes. The Gazetted Civil Services Paper II (CSAT) has 1/4th negative marking, but the paper is only qualifying — you need 33% to qualify and CSAT marks are not added to the merit list. So a wrong CSAT answer does not hurt your rank, only your qualifying score.",
  },
  {
    q: "Does MPSC deduct marks for unanswered questions?",
    a: "No. There is no penalty for leaving a question blank. Negative marking only applies to questions you attempt and answer incorrectly, so blank answers are always safe.",
  },
  {
    q: "Is guessing worth it with MPSC negative marking?",
    a: "If you can eliminate two of the four options, guessing has a positive expected value (a 50% chance of +1 versus a 50% chance of -0.25 gives an expected +0.375 per guess). If you can eliminate only one option the edge is small, and blind guessing with no elimination is a net loss over the paper.",
  },
];

export default function MpscNegativeMarkingGuide() {
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
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">MPSC Negative Marking</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">MPSC Study Guide · ~8 min read</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <article className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:prose-invert dark:border-slate-700 dark:bg-slate-800 sm:p-9">
          <h2>MPSC Negative Marking — The Complete 2026 Guide</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: July 2026 · Reading time: ~8 minutes
          </p>

          <p>
            Every objective paper conducted by the Maharashtra Public Service Commission carries
            negative marking. Understanding exactly how it works — and how to attempt a paper
            around it — is worth several marks in the final tally, which in a competitive exam is
            often the difference between clearing the cut-off and missing it. This guide explains
            the negative-marking rule for every MPSC prelims (Group B, Group C, PSI, Sub Inspector
            State Excise, Gazetted Civil Services and Technical Services), with worked examples and
            a mathematically sound guessing strategy. Pair it with the {""}
            <Link href="/study-guides/mpsc-exam-pattern">full MPSC Exam Pattern</Link> guide for the
            complete marks distribution.
          </p>

          <h3>1. The core rule — 1/4th mark per wrong answer</h3>
          <p>
            MPSC deducts <strong>one-fourth (1/4 = 0.25) of the marks allotted to a question</strong>{" "}
            for each wrong answer. This is uniform across all objective (OMR-based) MPSC papers.
            There is <strong>no penalty for an unanswered (blank) question</strong>, and no penalty
            for a question that MPSC later cancels through its objection process.
          </p>
          <ul>
            <li>Question worth <strong>1 mark</strong> (Group B / Group C) → wrong answer = <strong>−0.25</strong>.</li>
            <li>Question worth <strong>2 marks</strong> (Gazetted CS Paper I — GS) → wrong answer = <strong>−0.50</strong>.</li>
            <li>Question worth <strong>2.5 marks</strong> (Gazetted CS Paper II — CSAT) → wrong answer = <strong>−0.625</strong>.</li>
          </ul>

          <h3>2. Negative marking by exam</h3>
          <table>
            <thead>
              <tr>
                <th>Exam (Prelims)</th>
                <th>Questions</th>
                <th>Total marks</th>
                <th>Marks / question</th>
                <th>Deduction per wrong</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Group B Combined (PSI / STI / ASO)</td><td>100</td><td>100</td><td>1</td><td>0.25</td></tr>
              <tr><td>Group C Combined (Tax Asst / Clerk-Typist / Industry Inspector)</td><td>100</td><td>100</td><td>1</td><td>0.25</td></tr>
              <tr><td>Sub Inspector State Excise</td><td>100</td><td>100</td><td>1</td><td>0.25</td></tr>
              <tr><td>Gazetted CS (Rajyaseva) Paper I — GS</td><td>100</td><td>200</td><td>2</td><td>0.50</td></tr>
              <tr><td>Gazetted CS (Rajyaseva) Paper II — CSAT</td><td>80</td><td>200</td><td>2.5</td><td>0.625</td></tr>
              <tr><td>Gazetted Technical Services</td><td>100</td><td>200</td><td>2</td><td>0.50</td></tr>
            </tbody>
          </table>
          <p>
            The CSAT paper (Paper II of the Gazetted Civil Services prelims) is{" "}
            <strong>qualifying only</strong> — you must score 33% to qualify, but the marks are not
            counted in the merit list. Negative marking still applies within the paper, so a stream
            of wrong CSAT answers can drag you below the 33% qualifying line.
          </p>

          <h3>3. Worked examples</h3>
          <p>Seeing the arithmetic makes the strategy obvious.</p>
          <ul>
            <li>
              <strong>Group C (1 mark/question).</strong> You attempt all 100, get 70 right and 30
              wrong: <code>70 − (30 × 0.25) = 70 − 7.5 = 62.5</code>. Those 30 blind guesses cost
              you 7.5 marks — enough to fall below a 55–65 cut-off.
            </li>
            <li>
              <strong>Group C, disciplined.</strong> You answer only the 80 you are reasonably sure
              of, get 72 right and 8 wrong, leave 20 blank:{" "}
              <code>72 − (8 × 0.25) = 72 − 2 = 70</code>. Fewer attempts, higher score.
            </li>
            <li>
              <strong>Gazetted CS Paper I (2 marks/question).</strong> 60 right, 20 wrong, 20 blank:{" "}
              <code>(60 × 2) − (20 × 0.5) = 120 − 10 = 110</code> out of 200.
            </li>
          </ul>

          {/* Mid-article ad — high viewability as the reader scrolls. */}
          <DisplayAd adsenseSlot={IN_CONTENT_AD_SLOT} ezoicKey="contentInline" className="my-8 not-prose" />

          <h3>4. The expected-value guessing strategy</h3>
          <p>
            Negative marking is designed to punish blind guessing, not intelligent elimination. The
            expected value (EV) of a guess on a 1-mark question tells you exactly when to guess:
          </p>
          <ul>
            <li>
              <strong>Eliminate 2 of 4</strong> (guess between the remaining 2): EV ={" "}
              <code>0.5 × (+1) + 0.5 × (−0.25) = +0.375</code>. <strong>Always guess.</strong>
            </li>
            <li>
              <strong>Eliminate 1 of 4</strong> (guess among 3): EV ={" "}
              <code>0.33 × (+1) + 0.67 × (−0.25) ≈ +0.083</code>. Marginally positive — guess only
              in your strong subjects where your instinct beats random.
            </li>
            <li>
              <strong>Eliminate none</strong> (blind 1-in-4): EV ={" "}
              <code>0.25 × (+1) + 0.75 × (−0.25) = +0.0625</code> in theory, but real blind guesses
              underperform random, so treat this as <strong>break-even at best — leave it blank.</strong>
            </li>
          </ul>
          <p>
            Practical rule: <strong>attempt every question where you can rule out at least two
            options</strong>, be selective when you can rule out one, and skip the rest.
          </p>

          <h3>5. OMR discipline that protects your score</h3>
          <ul>
            <li>Fill the bubble fully and darkly; a faint or double mark is read as wrong and attracts the penalty.</li>
            <li>Re-check the question number against the OMR row every fifth question — a single mis-shift can turn a strong paper into a disaster.</li>
            <li>Do a two-pass attempt: first the questions you know cold, then the eliminate-and-guess set.</li>
            <li>Never change an answer at the last second without a concrete reason — first instinct is right more often than not.</li>
          </ul>

          <h3>6. Practise negative marking on real papers</h3>
          <p>
            The only way to internalise this is to attempt full previous-year papers under timed,
            negative-marked conditions. Every MPSC paper on our {""}
            <Link href="/exams">previous-year papers</Link> page is graded with the exact 1/4th
            rule, and our {""}
            <Link href="/?mode=mock">mock tests</Link> reproduce the real pattern so you can see how
            your attempt-vs-accuracy balance translates into a final score. Track two numbers after
            every mock: your <em>strike rate</em> (right ÷ attempted) and your net loss to negative
            marking. Bring the second number down and your rank climbs.
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
            <li>Read the full <Link href="/study-guides/mpsc-exam-pattern">MPSC Exam Pattern</Link> guide for marks and syllabus by exam.</li>
            <li>See the <Link href="/study-guides/mpsc-group-c-syllabus">MPSC Group C Syllabus &amp; weightage</Link> if Group C is your target.</li>
            <li>Attempt a timed paper from <Link href="/exams">/exams</Link> and note your net negative-marking loss.</li>
          </ul>
        </article>
      </main>

      <footer className="border-t border-slate-200/80 py-6 dark:border-slate-700/80">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-slate-400 dark:text-slate-500">MPSC PYQ QUIZ &middot; Don&apos;t know Academy</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
              <Link href="/" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Home</Link>
              <span>|</span>
              <Link href="/study-guides" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">All study guides</Link>
              <span>|</span>
              <Link href="/exams" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Exam papers</Link>
              <span>|</span>
              <Link href="/map" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Map</Link>
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
