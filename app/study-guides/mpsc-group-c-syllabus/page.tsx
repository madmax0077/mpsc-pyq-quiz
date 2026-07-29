import Link from "next/link";
import type { Metadata } from "next";
import DisplayAd from "@/components/DisplayAd";
import { IN_CONTENT_AD_SLOT } from "@/lib/adsConfig";

export const metadata: Metadata = {
  title: "MPSC Group C Syllabus 2026 — Prelims & Mains Pattern, Subject-wise Weightage",
  description:
    "Complete MPSC Group C Combined syllabus for 2026: prelims pattern (100 questions, 100 marks, 1 hour), subject-wise weightage, detailed topic list, mains pattern, skill test, negative marking and cut-off trends for Tax Assistant, Clerk-Typist and Industry Inspector.",
  keywords: [
    "MPSC group c syllabus",
    "MPSC group c prelims syllabus",
    "MPSC group c exam pattern",
    "MPSC combine group c syllabus",
    "MPSC group c subject wise weightage",
    "MPSC group c mains exam pattern",
    "MPSC group c pre syllabus",
    "MPSC group c paper pattern",
  ],
  alternates: { canonical: "/study-guides/mpsc-group-c-syllabus" },
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "What is the MPSC Group C prelims exam pattern?",
    a: "The MPSC Group C Combined preliminary exam has 100 objective questions for 100 marks, to be completed in 1 hour (60 minutes). There is 1/4th negative marking — 0.25 marks deducted for every wrong answer. It is a single common paper for all Group C posts.",
  },
  {
    q: "What is the subject-wise weightage in MPSC Group C prelims?",
    a: "The 100 questions are spread roughly evenly across nine areas: Marathi, English, General Knowledge / Current Affairs, Mathematics & Reasoning, Indian Polity, History (with emphasis on Maharashtra), Geography (with emphasis on Maharashtra), Economics and General Science — approximately 10 questions per subject, though the exact split varies slightly year to year.",
  },
  {
    q: "Is there negative marking in MPSC Group C?",
    a: "Yes, 1/4th (0.25) marks are deducted for each wrong answer. There is no penalty for unanswered questions. See our dedicated MPSC Negative Marking guide for the full strategy.",
  },
  {
    q: "What posts are recruited through MPSC Group C?",
    a: "MPSC Group C Combined recruits Tax Assistant, Clerk-Typist (Mantralaya and subordinate offices), Industry Inspector and similar Group C cadre posts. The prelims is common; the mains and skill/typing tests are post-specific.",
  },
  {
    q: "What is the MPSC Group C mains pattern?",
    a: "The Group C mains consists of two papers of 100 marks each. Paper I is common (Marathi, English and General Knowledge), and Paper II is post-specific. Clerk-Typist candidates additionally clear a typing skill test (Marathi 30 wpm, English 40 wpm).",
  },
];

export default function MpscGroupCSyllabusGuide() {
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
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">MPSC Group C Syllabus</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">MPSC Study Guide · ~10 min read</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <article className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:prose-invert dark:border-slate-700 dark:bg-slate-800 sm:p-9">
          <h2>MPSC Group C Syllabus &amp; Exam Pattern — 2026</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: July 2026 · Reading time: ~10 minutes
          </p>

          <p>
            The MPSC Group C Combined examination recruits <strong>Tax Assistant</strong>,{" "}
            <strong>Clerk-Typist</strong> (Mantralaya and subordinate offices) and{" "}
            <strong>Industry Inspector</strong> posts under the Government of Maharashtra. All posts
            share a single objective preliminary paper; the mains and skill tests are post-specific.
            This guide sets out the complete prelims and mains syllabus, the subject-wise weightage,
            negative marking and recent cut-off trends. For how Group C compares with Group B, PSI
            and the Gazetted services, see the {""}
            <Link href="/study-guides/mpsc-exam-pattern">full MPSC Exam Pattern</Link> guide.
          </p>

          <h3>1. MPSC Group C prelims pattern</h3>
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Number of questions</td><td>100</td></tr>
              <tr><td>Total marks</td><td>100 (1 mark each)</td></tr>
              <tr><td>Duration</td><td>1 hour (60 minutes)</td></tr>
              <tr><td>Mode</td><td>Offline OMR (objective, multiple choice)</td></tr>
              <tr><td>Medium</td><td>Marathi &amp; English</td></tr>
              <tr><td>Negative marking</td><td>1/4th (0.25 mark per wrong answer)</td></tr>
              <tr><td>Nature</td><td>Screening — decides who advances to Mains</td></tr>
            </tbody>
          </table>
          <p>
            Because every question is worth exactly one mark, disciplined attempting matters. See
            our <Link href="/study-guides/mpsc-negative-marking">MPSC Negative Marking</Link> guide
            for the exact guessing strategy that protects your score.
          </p>

          <h3>2. Subject-wise weightage (indicative)</h3>
          <p>
            The 100 questions are distributed across nine areas at roughly ten questions each. The
            precise split moves a little year to year, so treat this as a planning guide and always
            confirm against the latest official syllabus PDF on{" "}
            <a href="https://mpsc.gov.in" target="_blank" rel="noopener">mpsc.gov.in</a>.
          </p>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Approx. questions</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Marathi (grammar &amp; comprehension)</td><td>~10</td><td>High — scoring</td></tr>
              <tr><td>English (grammar &amp; comprehension)</td><td>~10</td><td>High — scoring</td></tr>
              <tr><td>General Knowledge &amp; Current Affairs</td><td>~12–15</td><td>High</td></tr>
              <tr><td>Mathematics &amp; Reasoning (aptitude)</td><td>~12–15</td><td>High — scoring</td></tr>
              <tr><td>Indian Polity &amp; Constitution</td><td>~10</td><td>High — scoring</td></tr>
              <tr><td>History (esp. Maharashtra)</td><td>~10</td><td>Medium</td></tr>
              <tr><td>Geography (esp. Maharashtra)</td><td>~10</td><td>Medium</td></tr>
              <tr><td>Economics</td><td>~8</td><td>Medium</td></tr>
              <tr><td>General Science</td><td>~10</td><td>Medium</td></tr>
            </tbody>
          </table>
          <p>
            The four <em>scoring</em> blocks — Marathi, English, Aptitude/Reasoning and Polity —
            together carry close to 45 marks and are almost entirely memory- or logic-based. A
            Group C aspirant who locks these down reliably starts every paper near the cut-off
            before touching the current-affairs and science questions.
          </p>

          {/* Mid-article ad — high viewability as the reader scrolls. */}
          <DisplayAd adsenseSlot={IN_CONTENT_AD_SLOT} ezoicKey="contentInline" className="my-8 not-prose" />

          <h3>3. Detailed prelims syllabus by subject</h3>

          <h4>3.1 Marathi</h4>
          <p>
            Grammar (व्याकरण): samas, sandhi, alankar, vibhakti, prayog, kaal, shabd-siddhi,
            vachya; vocabulary — synonyms (samanarthi), antonyms (virudhdharthi), idioms (mhani &amp;
            wakprachar); comprehension passage with inference questions.
          </p>

          <h4>3.2 English</h4>
          <p>
            Grammar — tenses, articles, prepositions, active/passive voice, direct/indirect speech,
            subject-verb agreement; vocabulary — synonyms, antonyms, one-word substitutions, idioms
            &amp; phrases; error spotting; a reading-comprehension passage.
          </p>

          <h4>3.3 General Knowledge &amp; Current Affairs</h4>
          <p>
            National and Maharashtra current affairs of the last 8–12 months — government schemes,
            appointments, awards, sports, summits and important days; static GK — books &amp;
            authors, important organisations, and general awareness. This section moves most, so
            keep a rolling notebook.
          </p>

          <h4>3.4 Mathematics &amp; Reasoning</h4>
          <p>
            Arithmetic — percentage, profit &amp; loss, ratio &amp; proportion, average, time &amp;
            work, time-speed-distance, simple &amp; compound interest, number system; reasoning —
            series, coding-decoding, blood relations, direction sense, syllogism, seating
            arrangement, clocks &amp; calendars, Venn diagrams. All at roughly Class X level.
          </p>

          <h4>3.5 Indian Polity &amp; Constitution</h4>
          <p>
            Preamble, Fundamental Rights &amp; Duties, DPSPs, Union &amp; State executive,
            Parliament and the Maharashtra legislature, judiciary, Panchayati Raj (73rd/74th
            amendments), constitutional bodies and key amendments. Our{" "}
            <Link href="/study-guides/indian-polity-for-mpsc">Indian Polity for MPSC</Link> guide
            covers this section in full.
          </p>

          <h4>3.6 History (with emphasis on Maharashtra)</h4>
          <p>
            Modern India and the freedom struggle, the Maratha empire and Chhatrapati Shivaji
            Maharaj, the social-reform movement in Maharashtra, and the 1960 formation of the state.
            See the <Link href="/study-guides/maharashtra-history">Maharashtra History</Link> guide.
          </p>

          <h4>3.7 Geography (with emphasis on Maharashtra)</h4>
          <p>
            Physical divisions, rivers, climate, soils, agriculture, minerals and the power sector
            of Maharashtra, plus basic Indian and physical geography. Use the{" "}
            <Link href="/study-guides/maharashtra-geography">Maharashtra Geography</Link> guide and
            the interactive <Link href="/map">Maharashtra map</Link>.
          </p>

          <h4>3.8 Economics</h4>
          <p>
            Basics of the Indian and Maharashtra economy, government schemes, banking and the RBI,
            budget and fiscal terms, poverty and employment, and agriculture &amp; industry in
            Maharashtra.
          </p>

          <h4>3.9 General Science</h4>
          <p>
            Class 8–10 level physics, chemistry and biology — human physiology, diseases, everyday
            chemistry, basic physics concepts, plus applied and current science (space, health,
            technology).
          </p>

          <h3>4. MPSC Group C mains pattern</h3>
          <ul>
            <li>Candidates who clear the prelims are called for the mains for their chosen post.</li>
            <li><strong>Two papers of 100 marks each.</strong></li>
            <li><strong>Paper I (common):</strong> Marathi, English and General Knowledge.</li>
            <li><strong>Paper II (post-specific):</strong> subject content relevant to Tax Assistant / Clerk-Typist / Industry Inspector.</li>
            <li>Negative marking of 1/4th applies to the mains objective papers as well.</li>
            <li><strong>Skill test:</strong> Clerk-Typist candidates clear a typing test (Marathi 30 wpm, English 40 wpm).</li>
          </ul>

          <h3>5. Cut-off trends (General category, indicative)</h3>
          <p>
            Group C prelims cut-offs for the General (Open) category have recently ranged from{" "}
            <strong>about 55 to 65 out of 100</strong>, varying with paper difficulty, the post and
            the number of vacancies. Reserved-category cut-offs run 5–15 marks lower. The official
            cut-off is published on mpsc.gov.in after each result.
          </p>

          <h3>6. How to prepare — the efficient path</h3>
          <ul>
            <li>Lock the four scoring blocks (Marathi, English, Aptitude, Polity) first — they are the most reliable marks.</li>
            <li>Solve the last 5–7 years of <Link href="/exams">Group C previous-year papers</Link> to learn the exact question style and repeat topics.</li>
            <li>Take timed <Link href="/?mode=mock">mock tests</Link> under real negative-marking conditions.</li>
            <li>Maintain a one-page current-affairs notebook for the fast-moving GK section.</li>
            <li>Follow the <Link href="/study-guides/mpsc-preparation-strategy">MPSC Preparation Strategy</Link> guide for a week-by-week plan.</li>
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
            <li>Attempt the most recent <Link href="/exams">Group C prelims paper</Link> to set a baseline.</li>
            <li>Read the <Link href="/study-guides/mpsc-negative-marking">MPSC Negative Marking</Link> guide to stop losing marks to guessing.</li>
            <li>Compare all exams in the <Link href="/study-guides/mpsc-exam-pattern">MPSC Exam Pattern</Link> guide.</li>
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
