import Link from "next/link";
import type { Metadata } from "next";
import DisplayAd from "@/components/DisplayAd";
import { IN_CONTENT_AD_SLOT } from "@/lib/adsConfig";

export const metadata: Metadata = {
  title: "MPSC Talathi Exam 2026 — Syllabus, Pattern, Talathi Bharti & Preparation",
  description:
    "Complete MPSC Talathi (तलाठी) exam guide for 2026: syllabus, exam pattern, Group C link, Maharashtra Land Revenue Code focus, eligibility overview, preparation plan and free PYQ practice. Also covers the common search spelling Talithi exam.",
  keywords: [
    "Talathi exam",
    "Talithi exam",
    "MPSC Talathi",
    "MPSC Talathi exam 2026",
    "Talathi Bharti 2026",
    "Talathi syllabus",
    "Maharashtra Talathi syllabus",
    "तलाठी परीक्षा",
    "तलाठी भरती 2026",
    "MPSC Group C Talathi",
    "Talathi exam pattern",
    "Maharashtra Land Revenue Code",
    "mahabhumi Talathi",
  ],
  alternates: { canonical: "/study-guides/mpsc-talathi-exam" },
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "What is the Talathi exam in Maharashtra?",
    a: "Talathi (तलाठी) is a Class-III / Group C revenue post in Maharashtra. Recruitment is conducted through MPSC notifications; candidates typically face an objective written test covering Marathi, English, General Knowledge and an intelligence / aptitude section, followed by document verification.",
  },
  {
    q: "Is Talithi exam the same as Talathi exam?",
    a: "Yes. Talithi is a common misspelling of Talathi. Official documents and notifications use Talathi (तलाठी). Search engines show both spellings, so candidates looking for “Talithi exam” are looking for the same Maharashtra Talathi Bharti.",
  },
  {
    q: "What subjects are in the Talathi syllabus?",
    a: "The core written-test subjects are Marathi, English, General Knowledge (with Maharashtra history, geography, polity, science, current affairs and often land-revenue concepts) and an Intelligence Test covering reasoning and arithmetic. Always confirm the latest official PDF on mpsc.gov.in or mahabhumi.gov.in before you finalise your plan.",
  },
  {
    q: "Is Talathi part of MPSC Group C?",
    a: "Talathi recruitment sits in the broader Group C / revenue cadre space. Some cycles use a combined Group C style prelims framework; others publish a post-specific Talathi pattern. Treat the latest MPSC / mahabhumi notification as the source of truth for that year’s paper.",
  },
  {
    q: "How should I prepare for Talathi Bharti 2026?",
    a: "Build Marathi and English grammar first, then Maharashtra-focused GK, then daily aptitude. Give extra time to land-record / Maharashtra Land Revenue Code basics if the syllabus lists them. Finish with timed Group C and aptitude practice on this site under negative-marking conditions.",
  },
];

export default function MpscTalathiExamGuide() {
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
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">MPSC Talathi Exam</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">MPSC Study Guide · ~11 min read</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <article className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:prose-invert dark:border-slate-700 dark:bg-slate-800 sm:p-9">
          <h2>MPSC Talathi Exam 2026 — Syllabus, Pattern &amp; Preparation</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: August 2026 · Reading time: ~11 minutes
          </p>

          <p>
            The <strong>MPSC Talathi exam</strong> (तलाठी परीक्षा) is one of the most searched
            Maharashtra government recruitments every year. Candidates also search for{" "}
            <strong>Talithi exam</strong> — the same post, just a common English spelling variant.
            This guide explains the role, the typical written-test structure, the syllabus blocks that
            actually decide the cut-off, how Talathi preparation overlaps with{" "}
            <Link href="/study-guides/mpsc-group-c-syllabus">MPSC Group C</Link>, and a practical
            study plan you can start today. Always cross-check marks, duration and negative marking
            against the latest official notification on{" "}
            <a href="https://mpsc.gov.in" rel="noopener noreferrer" target="_blank">
              mpsc.gov.in
            </a>{" "}
            /{" "}
            <a href="https://mahabhumi.gov.in" rel="noopener noreferrer" target="_blank">
              mahabhumi.gov.in
            </a>
            .
          </p>

          <h3>1. What does a Talathi do?</h3>
          <p>
            A Talathi is a village-level revenue officer. Day-to-day work centres on land records,
            mutation entries, crop and occupancy details, and supporting the Tahsildar&apos;s office.
            That is why strong Marathi reading, basic English, Maharashtra GK and comfort with
            arithmetic / reasoning matter more than memorising obscure one-liners from national
            current affairs alone.
          </p>

          <h3>2. Talathi exam pattern — what to expect</h3>
          <p>
            Recent Talathi / Group C–style written papers are objective MCQs. A typical structure
            candidates prepare for looks like this (exact marks and duration follow the year&apos;s
            notification):
          </p>
          <table>
            <thead>
              <tr>
                <th>Section</th>
                <th>What it tests</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Marathi</td>
                <td>Grammar, vocabulary, idioms / proverbs, usage, books &amp; authors, comprehension</td>
              </tr>
              <tr>
                <td>English</td>
                <td>Tense, voice, narration, articles, synonyms / antonyms, idioms, error spotting, sentence structure</td>
              </tr>
              <tr>
                <td>General Knowledge</td>
                <td>Maharashtra &amp; India history / geography, Constitution, science, current affairs, IT basics, land-revenue concepts</td>
              </tr>
              <tr>
                <td>Intelligence Test</td>
                <td>Number / letter series, Venn diagrams, coding, ranking, profit &amp; loss, percentage, time &amp; work, interest, mensuration</td>
              </tr>
            </tbody>
          </table>
          <p>
            If the notification uses a combined Group C prelims paper, also read our{" "}
            <Link href="/study-guides/mpsc-group-c-syllabus">Group C Syllabus</Link> and{" "}
            <Link href="/study-guides/mpsc-negative-marking">Negative Marking</Link> guides — the
            1/4th penalty changes how aggressively you should guess.
          </p>

          <DisplayAd adsenseSlot={IN_CONTENT_AD_SLOT} ezoicKey="contentInline" className="my-8 not-prose" />

          <h3>3. Subject-wise syllabus focus for Talathi Bharti 2026</h3>

          <h4>3.1 Marathi</h4>
          <p>
            Treat Marathi as a scoring paper, not a soft one. Prioritise व्याकरण (वाक्यरचना, समास,
            समानार्थी / विरुद्धार्थी), म्हणी–वाक्प्रचार, शब्दसंग्रह and passage-based questions.
            Practise in Marathi medium if that is how you will sit the paper.
          </p>

          <h4>3.2 English</h4>
          <p>
            High-yield topics: tense, voice, narration, articles, question tags, synonyms / antonyms,
            idioms and phrases, spot the error, and short comprehension. Keep a one-page error log of
            the mistakes you repeat in mocks.
          </p>

          <h4>3.3 General Knowledge</h4>
          <ul>
            <li>
              <strong>Maharashtra history &amp; geography</strong> — use our{" "}
              <Link href="/study-guides/maharashtra-history">History</Link> and{" "}
              <Link href="/study-guides/maharashtra-geography">Geography</Link> guides plus the{" "}
              <Link href="/map">interactive map</Link>.
            </li>
            <li>
              <strong>Polity</strong> — Constitution basics, Panchayati Raj and state administration
              from the <Link href="/study-guides/indian-polity-for-mpsc">Indian Polity</Link> guide.
            </li>
            <li>
              <strong>Science &amp; current affairs</strong> — Class 8–10 science plus Maharashtra
              schemes and last 6–8 months of state / national news.
            </li>
            <li>
              <strong>Land revenue edge</strong> — if the syllabus lists the Maharashtra Land Revenue
              Code or basic land-record concepts, give them dedicated revision. This is the block
              that separates generic Group C aspirants from serious Talathi candidates.
            </li>
          </ul>

          <h4>3.4 Intelligence Test / aptitude</h4>
          <p>
            Arithmetic (percentage, ratio, average, profit &amp; loss, SI / CI, time &amp; work,
            speed) plus reasoning (series, coding-decoding, direction, ranking, Venn). Our{" "}
            <Link href="/?mode=csat">CSAT &amp; Aptitude</Link> practice is useful for speed even when
            the Talathi paper is shorter than Rajyaseva Paper II.
          </p>

          <h3>4. Talathi vs Group C — how to use this site</h3>
          <p>
            Talathi preparation overlaps heavily with Group C Combined prelims: Marathi, English,
            Maharashtra-heavy GS and aptitude. Use:
          </p>
          <ul>
            <li>
              <Link href="/exams">Previous-year Group C / related papers</Link> for real question
              style
            </li>
            <li>
              <Link href="/?mode=mock">Mock tests</Link> for timed practice with negative marking
            </li>
            <li>
              <Link href="/?mode=topic">Topic-wise PYQs</Link> for History, Geography, Polity and
              Science gaps
            </li>
          </ul>

          <h3>5. Four-week starter plan</h3>
          <ol>
            <li>
              <strong>Week 1:</strong> Marathi + English grammar rules and 50 mixed questions a day.
            </li>
            <li>
              <strong>Week 2:</strong> Maharashtra history / geography + polity fundamentals; keep
              aptitude warm with 20 questions daily.
            </li>
            <li>
              <strong>Week 3:</strong> Science + current affairs notebook + land-revenue basics if
              listed in the syllabus PDF.
            </li>
            <li>
              <strong>Week 4:</strong> Full timed mocks, revise error log, re-solve wrong PYQs only.
            </li>
          </ol>
          <p>
            For a longer calendar that also covers Group B / PSI, see the{" "}
            <Link href="/study-guides/mpsc-preparation-strategy">MPSC Preparation Strategy</Link>{" "}
            guide.
          </p>

          <h3>6. Frequently asked questions</h3>
          {FAQ.map((item) => (
            <div key={item.q}>
              <h4>{item.q}</h4>
              <p>{item.a}</p>
            </div>
          ))}

          <h3>Next steps</h3>
          <ul>
            <li>
              Read the <Link href="/study-guides/mpsc-group-c-syllabus">MPSC Group C Syllabus</Link>{" "}
              if your cycle uses a combined prelims paper.
            </li>
            <li>
              Practise aptitude speed in <Link href="/?mode=csat">CSAT &amp; Aptitude</Link>.
            </li>
            <li>
              Attempt a timed <Link href="/?mode=mock">mock test</Link> this week and note weak
              sections.
            </li>
            <li>
              Browse <Link href="/exams">exam papers</Link> for Maharashtra-focused PYQs.
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
              <Link
                href="/exams"
                className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400"
              >
                Exam papers
              </Link>
              <span>|</span>
              <Link
                href="/privacy"
                className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
