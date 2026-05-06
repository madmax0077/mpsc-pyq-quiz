import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MPSC Exam Pattern — Group B, Group C, PSI, Gazetted CS & TS Prelims (Complete 2026 Guide)",
  description:
    "Detailed MPSC exam pattern for Group B, Group C, PSI, Gazetted Civil Services and Gazetted Technical Services preliminary exams: marks distribution, syllabus, subjects, negative marking, time, qualifying criteria, mains overview and cut-offs.",
  keywords: [
    "MPSC exam pattern",
    "MPSC Group B pattern",
    "MPSC Group C pattern",
    "MPSC PSI exam pattern",
    "MPSC Gazetted Civil Services pattern",
    "MPSC syllabus 2026",
    "MPSC negative marking",
    "MPSC prelims marks",
  ],
  alternates: { canonical: "/study-guides/mpsc-exam-pattern" },
};

export default function MpscExamPatternGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
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
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">MPSC Exam Pattern</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">MPSC Study Guide · ~12 min read</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <article className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:prose-invert dark:border-slate-700 dark:bg-slate-800 sm:p-9">
          <h2>MPSC Exam Pattern — A Complete Reference</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: April 2026 · Reading time: ~12 minutes
          </p>

          <p>
            The Maharashtra Public Service Commission (MPSC) conducts five major recruitment exams
            every year. Although they all share an objective preliminary stage, the marks
            distribution, syllabus weightage and the structure of the mains differ from exam to
            exam. This guide collects the official pattern for each so you can compare them on a
            single page and plan your preparation accordingly. Pair it with the {""}
            <Link href="/study-guides/mpsc-preparation-strategy">MPSC Preparation Strategy</Link>
            {" "}guide for the day-to-day study plan.
          </p>

          <h3>1. The five MPSC exams at a glance</h3>
          <table>
            <thead>
              <tr>
                <th>Exam</th>
                <th>Stage</th>
                <th>Total prelims marks</th>
                <th>Negative marking</th>
                <th>Mode</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Gazetted Civil Services Combined Pre (formerly Rajyaseva)</td><td>Pre + Mains + Interview</td><td>400 (200 GS + 200 CSAT)</td><td>1/4 mark</td><td>Offline OMR</td></tr>
              <tr><td>Gazetted Technical Services Combined Pre</td><td>Pre + Mains + Interview</td><td>200 (single GS paper)</td><td>1/4 mark</td><td>Offline OMR</td></tr>
              <tr><td>Group B Combined Pre (PSI / STI / ASO)</td><td>Pre + Mains + Physical (PSI) / Skill (STI) / Interview</td><td>100</td><td>1/4 mark</td><td>Offline OMR</td></tr>
              <tr><td>Group C Combined Pre (Tax Asst / Clerk-Typist / Industry Inspector)</td><td>Pre + Mains + Skill</td><td>100</td><td>1/4 mark</td><td>Offline OMR</td></tr>
              <tr><td>Sub Inspector State Excise (under Group B)</td><td>Pre + Mains + Physical + Interview</td><td>100</td><td>1/4 mark</td><td>Offline OMR</td></tr>
            </tbody>
          </table>
          <p>
            Note: From 2025 onwards, MPSC has moved to a unified UPSC-style pattern for the
            <strong> Rajyaseva (Gazetted CS)</strong> mains — nine descriptive papers, including an
            essay and a compulsory Marathi paper. The pattern below reflects that change. Always
            verify the official notification on <a href="https://mpsc.gov.in" target="_blank" rel="noopener">mpsc.gov.in</a>
            {" "}before applying — the commission does revise patterns periodically.
          </p>

          <h3>2. Gazetted Civil Services Combined Preliminary Examination</h3>
          <p>
            The flagship MPSC exam, recruiting Deputy Collectors, DSPs, Tahsildars, BDOs,
            Assistant Commissioners and other Class-I/II officers.
          </p>

          <h4>2.1 Prelims pattern</h4>
          <ul>
            <li><strong>Paper I — General Studies</strong>: 100 questions, 200 marks, 2 hours.</li>
            <li><strong>Paper II — CSAT (Aptitude)</strong>: 80 questions, 200 marks, 2 hours. Qualifying — minimum 33% required.</li>
            <li>Both papers are conducted on the same day.</li>
            <li>Negative marking: <strong>1/4 of the marks of the question</strong> for each wrong answer in both papers.</li>
            <li>Selection to mains is based on <strong>Paper I marks only</strong> (provided you cleared the 33% qualifying in Paper II).</li>
          </ul>

          <h4>2.2 Prelims syllabus — Paper I (GS)</h4>
          <ol>
            <li>Current events of state, national and international importance.</li>
            <li>History of India and the freedom movement, with special reference to Maharashtra.</li>
            <li>Maharashtra, Indian and World Geography (Physical, Social and Economic).</li>
            <li>Indian Polity &amp; Governance, Constitution, Panchayati Raj, Public Policy, Rights Issues.</li>
            <li>Economic and Social Development, Sustainable Development, Poverty, Inclusion, Demographics.</li>
            <li>General issues on Environmental Ecology, Bio-diversity and Climate Change.</li>
            <li>General Science.</li>
          </ol>

          <h4>2.3 Prelims syllabus — Paper II (CSAT)</h4>
          <ol>
            <li>Comprehension (English &amp; Marathi).</li>
            <li>Interpersonal skills including communication.</li>
            <li>Logical reasoning and analytical ability.</li>
            <li>Decision-making and problem-solving.</li>
            <li>General mental ability.</li>
            <li>Basic numeracy (Class X level), data interpretation.</li>
          </ol>

          <h4>2.4 Mains pattern (UPSC-style, from 2025)</h4>
          <p>Nine descriptive papers, total 1,750 marks.</p>
          <ul>
            <li><strong>Paper A</strong>: Marathi (qualifying, 300 marks).</li>
            <li><strong>Paper B</strong>: English (qualifying, 300 marks).</li>
            <li><strong>Paper I</strong>: Essay (250 marks, written in Marathi or English).</li>
            <li><strong>Paper II</strong>: General Studies I — History, Geography, Society (250).</li>
            <li><strong>Paper III</strong>: General Studies II — Polity, Governance, International Relations (250).</li>
            <li><strong>Paper IV</strong>: General Studies III — Economy, Science &amp; Technology, Environment, Security, Disaster Management (250).</li>
            <li><strong>Paper V</strong>: General Studies IV — Ethics, Integrity, Aptitude (250).</li>
            <li><strong>Paper VI &amp; VII</strong>: Optional subject (one subject, two papers, 250 + 250).</li>
            <li><strong>Personality test (interview)</strong>: 275 marks.</li>
          </ul>

          <h3>3. Gazetted Technical Services Combined Preliminary Examination</h3>
          <p>
            For posts that need a specific engineering or technical qualification — Assistant
            Engineer (Civil/Mechanical/Electrical), Assistant Geologist, Town Planner, Assistant
            Director of Industries and similar.
          </p>
          <ul>
            <li>Prelims: <strong>single paper of 100 questions / 200 marks / 2 hours</strong>.</li>
            <li>Syllabus: General Studies (similar scope to GS Paper I above), with around 30% weightage to the candidate&apos;s technical discipline at Class XII level.</li>
            <li>Mains: stream-specific descriptive papers + a General Paper.</li>
            <li>Negative marking: <strong>1/4</strong>.</li>
          </ul>

          <h3>4. Group B (Subordinate Services) Combined Preliminary Examination</h3>
          <p>
            Recruits the Police Sub-Inspector (PSI), State Tax Inspector (STI) and Assistant
            Section Officer (ASO/Mantralaya). The prelims is common; mains and physical/skill tests
            are stream-specific.
          </p>
          <ul>
            <li>Prelims: <strong>100 questions / 100 marks / 1 hour</strong>.</li>
            <li>Subjects: Marathi (12), English (12), General Knowledge (15), Polity &amp; Governance (15), Geography of India &amp; Maharashtra (15), History of India &amp; Maharashtra (15), Economy &amp; Planning (15), Science &amp; Technology (15), Current Affairs &amp; Reasoning embedded across topics. Exact distribution varies year to year — refer to the official syllabus PDF.</li>
            <li>Negative marking: <strong>1/4</strong>.</li>
            <li>Mains: two papers of 100 marks each (Paper I common — Marathi, English, GK; Paper II stream-specific).</li>
            <li>PSI: physical test + interview after mains. STI / ASO: skill test / interview.</li>
          </ul>

          <h3>5. Group C (Subordinate Services) Combined Preliminary Examination</h3>
          <p>
            Recruits Tax Assistant, Clerk-Typist (Mantralaya), Industry Inspector and similar
            Group C cadre.
          </p>
          <ul>
            <li>Prelims: <strong>100 questions / 100 marks / 1 hour</strong>.</li>
            <li>Subjects: Marathi, English, General Knowledge, Mathematics &amp; Reasoning, Indian Polity &amp; Constitution, History (esp. Maharashtra), Geography (esp. Maharashtra), Economics, Science. Distribution roughly 10 questions per subject.</li>
            <li>Negative marking: <strong>1/4</strong>.</li>
            <li>Mains: two papers, both 100 marks. Paper I common, Paper II stream-specific.</li>
            <li>Skill test for Clerk-Typist (Marathi typing 30 wpm, English 40 wpm).</li>
          </ul>

          <h3>6. Sub Inspector State Excise</h3>
          <p>
            Conducted under the broader Group B Combined umbrella but with a dedicated mains paper.
            Prelims and negative marking are identical to PSI/STI/ASO above. Adds a physical
            standard test (height, chest, running).
          </p>

          <h3>7. How marks and negative marking really work</h3>
          <p>
            All MPSC objective papers carry <strong>1/4 negative marking</strong>. That means a
            wrong answer to a 1-mark question deducts 0.25 marks. Tactics:
          </p>
          <ul>
            <li>If you can eliminate even 2 of the 4 options, the expected value of guessing is positive (50% chance of +1, 50% of −0.25 → +0.375 expected). Guess.</li>
            <li>If you can eliminate 1 of 4, expected value is roughly +0.083. Marginal — guess only if you have time and the topic is in your strong area.</li>
            <li>If you have no idea, leaving it blank protects your score.</li>
            <li>Tick the OMR <em>after</em> double-checking the question number on every fifth row to avoid catastrophic shifts.</li>
          </ul>

          <h3>8. Cut-off ranges (recent trends)</h3>
          <p>
            Cut-offs vary year-to-year with the difficulty of the paper and number of vacancies. The
            ranges below are indicative for the General (Open) category over the last 5–6 cycles:
          </p>
          <ul>
            <li><strong>Gazetted CS Pre Paper I (out of 200)</strong>: typically <strong>95–115</strong>.</li>
            <li><strong>Gazetted TS Pre (out of 200)</strong>: typically <strong>85–110</strong>, varying by stream.</li>
            <li><strong>PSI Pre (out of 100)</strong>: typically <strong>62–72</strong>.</li>
            <li><strong>STI / ASO Pre (out of 100)</strong>: typically <strong>58–68</strong>.</li>
            <li><strong>Group C Pre (out of 100)</strong>: typically <strong>55–65</strong>, varying by post.</li>
          </ul>
          <p>
            For SC, ST, OBC, EWS, Female and Person-with-Disability categories the cut-off is
            5–15 marks lower depending on the year. These are guidance numbers only — the official
            cut-off PDF appears on mpsc.gov.in after each result.
          </p>

          <h3>9. How to use PYQs against this pattern</h3>
          <p>
            The single highest-leverage activity is solving the previous year question papers from
            the exam you are targeting. The PYQs immediately reveal:
          </p>
          <ul>
            <li>Which static topics dominate (typically 60–70% of GS marks come from a small set of repeating themes).</li>
            <li>How factual vs. analytical the paper is.</li>
            <li>The trap-question pattern (e.g., assertion-reason in Polity, statement-elimination in Geography).</li>
          </ul>
          <p>
            All five exams are indexed paper-by-paper on our {""}
            <Link href="/exams">/exams</Link> page. Go year-by-year, attempt at least 5 papers of
            your target exam, and run a personal weak-topic list.
          </p>

          <h3>10. Application process and notification calendar</h3>
          <ul>
            <li>Notifications are released on <a href="https://mpsc.gov.in" target="_blank" rel="noopener">mpsc.gov.in</a> typically March–June each year.</li>
            <li>Online application is the only mode (mpsconline.gov.in).</li>
            <li>Application fee: ₹394 for Open, ₹294 for Reserved (subject to change).</li>
            <li>Age limits: 19–38 for General (with caste/disability relaxations) — refer to the latest notification.</li>
            <li>Educational qualification: graduation (any discipline) for most posts; technical posts require the relevant degree.</li>
            <li>Photo + signature must be in JPG/JPEG, specific dimensions (refer to notification).</li>
          </ul>

          <h3>Next steps</h3>
          <ul>
            <li>Pick your target exam from the list above.</li>
            <li>Read the matching syllabus PDF on the official website end-to-end.</li>
            <li>Move to the <Link href="/study-guides/mpsc-preparation-strategy">MPSC Preparation Strategy</Link> guide for the actual study plan.</li>
            <li>Solve the most recent paper from the <Link href="/exams">/exams</Link> page to set a baseline score.</li>
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
