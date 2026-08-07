import Link from "next/link";
import type { Metadata } from "next";
import DisplayAd from "@/components/DisplayAd";
import { IN_CONTENT_AD_SLOT } from "@/lib/adsConfig";

export const metadata: Metadata = {
  title: "MPSC & UPSC CSAT Preparation 2026 — Syllabus, Topics & Free Practice",
  description:
    "Free CSAT aptitude practice for MPSC Rajyaseva Paper II and UPSC CSE Prelims Paper II: syllabus overlap, topic checklist, 90-second time plan, 8-week schedule and 3,800+ bilingual practice questions with worked explanations in Marathi and English.",
  keywords: [
    "MPSC CSAT",
    "UPSC CSAT",
    "UPSC CSAT practice",
    "UPSC CSAT Paper 2",
    "UPSC CSE CSAT",
    "CSAT practice questions",
    "free CSAT mock test",
    "MPSC CSAT syllabus",
    "MPSC CSAT preparation",
    "CSAT paper 2 MPSC",
    "MPSC Rajyaseva paper 2",
    "MPSC CSAT qualifying marks",
    "CSAT practice questions Marathi",
    "MPSC aptitude questions",
    "UPSC aptitude practice",
    "एमपीएससी सीसॅट",
    "यूपीएससी सीसॅट",
  ],
  alternates: { canonical: "/study-guides/mpsc-csat-preparation" },
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Is CSAT qualifying in the MPSC Rajyaseva exam?",
    a: "Yes. Paper II (CSAT) of the MPSC Gazetted Civil Services Combined prelims is a qualifying paper. You must score at least 33% — that is 66 marks out of 200 — to stay in the race. The marks are not added to your prelims merit; the cut-off for mains is decided by your Paper I (General Studies) score alone.",
  },
  {
    q: "How many questions are there in the MPSC CSAT paper?",
    a: "The CSAT paper has 80 objective questions for 200 marks, to be attempted in 2 hours. That works out to 2.5 marks per question and roughly 90 seconds of thinking time per question.",
  },
  {
    q: "What happens if I fail to score 33% in CSAT?",
    a: "Your General Studies paper is not considered at all. This is the single biggest reason strong candidates are eliminated at the prelims stage — they prepare GS thoroughly, treat CSAT as an afterthought, and miss the 66-mark qualifying line. Two focused hours a week through the year is enough to remove that risk entirely.",
  },
  {
    q: "Is the MPSC CSAT paper available in Marathi?",
    a: "Yes. Both prelims papers are set in Marathi and English, and the comprehension section explicitly tests passages in both languages. Practise numerical and reasoning questions in the language you will actually attempt the paper in, so that reading the question does not cost you time in the hall.",
  },
  {
    q: "What is the syllabus of MPSC CSAT Paper II?",
    a: "Comprehension; interpersonal skills including communication skills; logical reasoning and analytical ability; decision-making and problem-solving; general mental ability; basic numeracy up to Class X level (numbers and their relations, orders of magnitude); and data interpretation up to Class X level (charts, graphs, tables and data sufficiency).",
  },
  {
    q: "How many months does CSAT preparation take?",
    a: "For a candidate comfortable with Class X mathematics, eight focused weeks of one hour a day is enough to move from scratch to a comfortable qualifying score. What matters is spacing it out — thirty questions a day for eight weeks beats a panicked month of cramming, because speed on aptitude comes from repetition, not from understanding a concept once.",
  },
  {
    q: "Which topics carry the most weight in CSAT?",
    a: "Comprehension is the largest single block in the paper, and basic numeracy plus data interpretation together form most of the remainder, with logical reasoning filling the rest. In practical terms, a candidate who reads accurately and is quick with percentages, ratios, averages, time-work, time-speed-distance and simple data tables has already secured a qualifying score without touching the harder reasoning sets.",
  },
  {
    q: "Can UPSC aspirants practise CSAT here?",
    a: "Yes for aptitude and reasoning. UPSC CSE Prelims Paper II (CSAT) and MPSC Rajyaseva Paper II share the same skill blocks — basic numeracy, logical reasoning, data interpretation and comprehension. Our free CSAT section is built for MPSC bilingually, but UPSC candidates can use the topic lessons, topic-wise practice and timed speed tests to clear the qualifying CSAT paper. Pattern details (marks, duration, cut-off) still differ, so always check the latest UPSC notification for the official Paper II rules.",
  },
];

const TOPIC_CHECKLIST: Array<{ group: string; items: string[] }> = [
  {
    group: "Quantitative aptitude (Class X level)",
    items: [
      "Number system, LCM and HCF, divisibility, unit digits and remainders",
      "Percentage, profit and loss, discount and successive change",
      "Ratio, proportion, averages, alligation and mixtures",
      "Algebra, linear and quadratic equations, progressions",
      "Mensuration and basic geometry — areas, volumes, surface areas",
      "Time and work, pipes and cisterns",
      "Time, speed and distance, trains, boats and streams",
      "Simple and compound interest",
      "Permutation, combination, probability and basic statistics",
    ],
  },
  {
    group: "Logical reasoning and mental ability",
    items: [
      "Number and letter series",
      "Coding and decoding",
      "Syllogism and logical deduction",
      "Analogy and classification",
      "Puzzles and seating arrangement",
      "Direction sense",
      "Blood relations",
      "Ranking and ordering",
      "Clocks and calendars",
    ],
  },
  {
    group: "Comprehension and data interpretation",
    items: [
      "Data interpretation — tables, bar charts, pie charts, line graphs, data sufficiency",
      "Reading comprehension in Marathi and English — main idea, inference, tone and assumption",
      "Decision-making and interpersonal-skills situations",
    ],
  },
];

export default function MpscCsatGuide() {
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
            <h1 className="break-words text-lg font-bold leading-snug text-slate-800 dark:text-slate-100">MPSC &amp; UPSC CSAT</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Study Guide · ~12 min read</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <article className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:prose-invert dark:border-slate-700 dark:bg-slate-800 sm:p-9">
          <h2>MPSC &amp; UPSC CSAT Preparation — Syllabus, Strategy and Free Practice (2026)</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: August 2026 · Reading time: ~12 minutes
          </p>

          <p>
            CSAT is the paper that eliminates candidates quietly. It carries no weight in the merit
            list, so it gets postponed month after month, and then a well-prepared General Studies
            paper is thrown away because the aptitude paper fell three marks short of the qualifying
            line. This guide covers what the MPSC CSAT paper contains, how it overlaps with{" "}
            <strong>UPSC CSE Prelims Paper II (CSAT)</strong>, how much practice you actually need,
            and a schedule that gets you safely past the qualifying mark without eating into your GS
            time. When you are ready to practise, our{" "}
            <Link href="/?mode=csat">free CSAT training and practice section</Link> has lessons and
            over 3,800 solved aptitude questions with step-by-step explanations in Marathi and English — useful for both MPSC and
            UPSC CSAT aspirants.
          </p>

          <h3>1. What CSAT is, and why it matters more than its marks suggest</h3>
          <p>
            CSAT — the Civil Services Aptitude Test — is Paper II of the MPSC Gazetted Civil
            Services Combined preliminary examination, the exam most aspirants still call Rajyaseva.
            It is written on the same day as the General Studies paper, in offline OMR format, and
            is set in both Marathi and English. The same skill set also powers{" "}
            <strong>UPSC CSE Prelims Paper II</strong>, which is likewise a qualifying aptitude paper
            for UPSC aspirants.
          </p>

          <h3>1A. MPSC CSAT vs UPSC CSAT — what overlaps</h3>
          <p>
            Pattern numbers differ (MPSC Paper II is typically 80 questions / 200 marks / 2 hours with
            a 33% qualifying line; UPSC Paper II has its own official pattern and cut-off in the UPSC
            notification). The <em>topics</em> largely do not: Class X numeracy, logical reasoning,
            data interpretation and comprehension. If you are preparing for UPSC CSAT, use this site
            for daily topic practice and timed speed tests, then confirm UPSC&apos;s official marks,
            duration and negative marking from upsc.gov.in before exam day.
          </p>
          <p>
            Start practising here:{" "}
            <Link href="/?mode=csat">Open free CSAT &amp; Aptitude practice</Link> · or read the
            short{" "}
            <Link href="/study-guides/upsc-csat-practice">UPSC CSAT practice landing page</Link>.
          </p>
          <div className="prose-table-wrap my-4 -mx-1 overflow-x-auto rounded-xl">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>MPSC CSAT (Paper II)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Questions</td><td>80 objective questions</td></tr>
              <tr><td>Total marks</td><td>200</td></tr>
              <tr><td>Marks per question</td><td>2.5</td></tr>
              <tr><td>Duration</td><td>2 hours (120 minutes)</td></tr>
              <tr><td>Medium</td><td>Marathi and English</td></tr>
              <tr><td>Nature</td><td>Qualifying only — 33% (66 of 200) required</td></tr>
              <tr><td>Counted in merit?</td><td>No — the mains cut-off uses Paper I marks alone</td></tr>
            </tbody>
          </table>
          </div>
          <p>
            Read that last row twice. Scoring 190 in CSAT earns you nothing over a candidate who
            scored 70. But scoring 64 wipes out your General Studies paper completely. CSAT is not a
            paper you compete in — it is a gate you clear, and then never think about again. The
            correct amount of effort is therefore &quot;enough to be safe by a comfortable
            margin&quot;, not &quot;as much as possible&quot;. Aim for 90–100 marks so that a bad
            day still leaves you above 66.
          </p>
          <p>
            Negative marking applies to the objective papers under MPSC&apos;s standard rule — see
            our <Link href="/study-guides/mpsc-negative-marking">negative marking guide</Link> for
            the arithmetic and a guessing strategy, and confirm the marking scheme in the official
            notification for your exam year, since the commission does revise it from time to time.
          </p>

          <h3>2. The official syllabus, in plain language</h3>
          <p>MPSC lists seven heads for Paper II. Here is what each one actually means in the hall:</p>
          <ol>
            <li>
              <strong>Comprehension.</strong> Passages in Marathi and English followed by questions
              on the main idea, an inference, the author&apos;s tone or an assumption. This is the
              largest single block in the paper and the cheapest to score in, because it needs no
              formula — only careful reading.
            </li>
            <li>
              <strong>Interpersonal skills including communication skills.</strong> Short situational
              questions about handling people. There is rarely a calculation; the answer is the
              measured, non-extreme option.
            </li>
            <li>
              <strong>Logical reasoning and analytical ability.</strong> Series, coding, syllogism,
              analogy, puzzles, direction, blood relations, ranking, clocks and calendars.
            </li>
            <li>
              <strong>Decision-making and problem-solving.</strong> An administrative scenario with
              four courses of action. Choose the response that is lawful, proportionate and
              consultative rather than dramatic.
            </li>
            <li>
              <strong>General mental ability.</strong> Overlaps heavily with reasoning and basic
              numeracy; treat it as extra practice rather than a separate subject.
            </li>
            <li>
              <strong>Basic numeracy (Class X level).</strong> Numbers and their relations, orders of
              magnitude — in practice this means percentages, ratios, averages, work, speed,
              interest and simple geometry.
            </li>
            <li>
              <strong>Data interpretation (Class X level).</strong> Tables, bar charts, pie charts,
              line graphs and data sufficiency. Mostly percentage and ratio work wrapped in a
              diagram.
            </li>
          </ol>
          <p>
            Nothing here goes beyond Class X mathematics. The difficulty of CSAT is never the
            concept — it is doing the concept quickly, under pressure, after two hours of a General
            Studies paper.
          </p>

          {/* Mid-article ad — high viewability as the reader scrolls. */}
          <DisplayAd adsenseSlot={IN_CONTENT_AD_SLOT} ezoicKey="contentInline" className="my-8 not-prose" />

          <h3>3. The 90-second rule and how to spend two hours</h3>
          <p>
            Eighty questions in 120 minutes is 90 seconds each, including the time spent reading
            passages. That average is the whole game, and it is why practice matters more than
            theory. A workable plan for the hall:
          </p>
          <ul>
            <li>
              <strong>First 20 minutes.</strong> Sweep the paper for reasoning and numeracy questions
              you can finish in under a minute. Bank those marks first.
            </li>
            <li>
              <strong>Next 55 minutes.</strong> Comprehension passages. Read the questions before the
              passage so you know what you are hunting for, and answer directly from the text — the
              options are written to punish inference beyond what is written.
            </li>
            <li>
              <strong>Next 35 minutes.</strong> Data interpretation sets and the medium-difficulty
              numeracy you skipped. One DI set is typically three to five questions off the same
              table, so the reading cost is paid once and spread across several marks — this is the
              best-value block in the paper.
            </li>
            <li>
              <strong>Last 10 minutes.</strong> OMR check. Confirm the question number against the
              row every five bubbles. A single shifted row has ended more attempts than any hard
              question ever has.
            </li>
          </ul>
          <p>
            Notice what is missing: the long seating-arrangement puzzle. A five-condition puzzle can
            swallow eight minutes for a single mark. In a qualifying paper, that trade is always
            wrong. Leave puzzles for the end, and only if time remains.
          </p>

          <h3>4. Topic checklist</h3>
          <p>
            Work through these in order. Each one has a lesson and a practice set in our{" "}
            <Link href="/?mode=csat">CSAT section</Link>, with worked explanations in both languages.
          </p>
          {TOPIC_CHECKLIST.map((block) => (
            <div key={block.group}>
              <h4>{block.group}</h4>
              <ul>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <h3>5. An eight-week plan that does not disturb your GS study</h3>
          <p>
            One hour a day, or ninety minutes on alternate days. The order below front-loads the
            topics that appear most often, so even an interrupted plan leaves you with the useful
            half.
          </p>
          <div className="prose-table-wrap my-4 -mx-1 overflow-x-auto rounded-xl">
          <table>
            <thead>
              <tr>
                <th>Week</th>
                <th>Focus</th>
                <th>Target</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Percentage, ratio, averages</td>
                <td>Calculation speed — fractions to percentages by memory</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Profit and loss, interest, mixtures</td>
                <td>Every question inside 90 seconds</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Time and work, time-speed-distance</td>
                <td>Master the unitary and LCM methods</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Data interpretation</td>
                <td>One full DI set inside 5 minutes</td>
              </tr>
              <tr>
                <td>5</td>
                <td>Comprehension, daily passages</td>
                <td>Two passages a day, alternating Marathi and English</td>
              </tr>
              <tr>
                <td>6</td>
                <td>Series, coding, analogy, blood relations, direction</td>
                <td>Accuracy above 85%</td>
              </tr>
              <tr>
                <td>7</td>
                <td>Syllogism, ranking, clocks and calendars, puzzles</td>
                <td>Recognise which puzzles to skip</td>
              </tr>
              <tr>
                <td>8</td>
                <td>Full-length timed papers</td>
                <td>Three 80-question runs, 120 minutes each</td>
              </tr>
            </tbody>
          </table>
          </div>

          <h3>6. Five mistakes that cost qualified candidates their year</h3>
          <ul>
            <li>
              <strong>Starting CSAT in the last month.</strong> Aptitude speed is built by
              repetition over weeks. A month of cramming produces understanding without speed, which
              is worth very little in a 90-second-per-question paper.
            </li>
            <li>
              <strong>Practising only in English when you will write in Marathi.</strong> Reading a
              numerical question in your second language costs ten to fifteen seconds each time,
              which is ten minutes across a paper. Practise in the medium you will actually use.
            </li>
            <li>
              <strong>Chasing hard questions.</strong> You need 66 marks, not 200. Time spent
              mastering the toughest puzzle sets would be better spent making your percentage
              calculations automatic.
            </li>
            <li>
              <strong>Skipping the comprehension practice because &quot;reading needs no
              preparation&quot;.</strong> Comprehension is the biggest block in the paper and the
              most improvable with practice, because most errors come from choosing an option that
              is true in general but not stated in the passage.
            </li>
            <li>
              <strong>Never taking a timed full-length paper.</strong> Sectional practice hides the
              fatigue problem. CSAT is written after the GS paper, when concentration is already
              spent, so at least three full 120-minute runs are essential.
            </li>
          </ul>

          <h3>7. Where to practise</h3>
          <p>
            Our <Link href="/?mode=csat">CSAT training and practice section</Link> is free and
            organised exactly like this guide: twenty topics, each with a lesson covering the
            concepts, formulas, exam shortcuts and common traps, followed by a practice set. Every
            question carries a full worked explanation in both Marathi and English, and each set
            gives you questions you have not attempted before, so you can work through a topic
            across many short sittings. There is also a combined timed speed test with negative
            marking for when you want exam conditions.
          </p>
          <p>
            Pair that with real papers. The aptitude questions in the{" "}
            <Link href="/exams">previous-year MPSC papers</Link> show you the commission&apos;s own
            style and difficulty, and the <Link href="/?mode=mock">mock tests</Link> reproduce the
            full prelims pattern with the same marking scheme.
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
            <li>Start with the <Link href="/?mode=csat">CSAT lessons and practice questions</Link> — begin at percentages.</li>
            <li>Read the <Link href="/study-guides/mpsc-exam-pattern">MPSC Exam Pattern</Link> guide for the full prelims and mains structure.</li>
            <li>Check the <Link href="/study-guides/mpsc-negative-marking">negative marking rules</Link> before you decide how many questions to attempt.</li>
            <li>Attempt a timed paper from <Link href="/exams">previous-year papers</Link> under exam conditions.</li>
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
