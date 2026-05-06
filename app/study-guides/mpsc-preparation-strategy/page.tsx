import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MPSC Preparation Strategy 2026 — 6-Month Study Plan, Books, PYQ & Mock-Test Routine",
  description:
    "Practical MPSC preparation strategy: 6-month study plan, recommended book list, daily routine, how to use previous-year questions, subject-wise weightage, mock-test approach and last-month revision blueprint for Group B, Group C, PSI and Gazetted prelims.",
  keywords: [
    "MPSC preparation strategy",
    "MPSC study plan",
    "MPSC books list",
    "MPSC daily routine",
    "MPSC PYQ strategy",
    "MPSC revision plan",
    "MPSC mock test strategy",
    "MPSC time table",
  ],
  alternates: { canonical: "/study-guides/mpsc-preparation-strategy" },
};

export default function MpscPrepStrategyGuide() {
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
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">MPSC Preparation Strategy</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">MPSC Study Guide · ~15 min read</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <article className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:prose-invert dark:border-slate-700 dark:bg-slate-800 sm:p-9">
          <h2>MPSC Preparation Strategy — 6-Month Plan</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: April 2026 · Reading time: ~15 minutes
          </p>

          <p>
            The MPSC preliminary examination is not a test of how much you know. It is a test of
            how reliably you can recall a finite set of high-frequency facts under time pressure
            with negative marking. This guide is the playbook we wish someone had given us when we
            started — a 6-month plan, a tight book list, a realistic daily routine, the right way
            to use previous year questions, and a last-month revision blueprint that actually fits
            in 30 days. Pair it with the {""}
            <Link href="/study-guides/mpsc-exam-pattern">MPSC Exam Pattern</Link> guide so you know
            exactly what you&apos;re preparing for.
          </p>

          <h3>1. The right mindset before you start</h3>
          <ul>
            <li><strong>One source per subject</strong>. The biggest single mistake is collecting four polity books and finishing none. Pick one, finish it, revise it three times. Revision &gt; new content.</li>
            <li><strong>PYQ is the syllabus</strong>. The official syllabus tells you the perimeter. The previous papers tell you the exact line. Solve every PYQ from the last 10 years before reading any chapter.</li>
            <li><strong>Static first, current after</strong>. Build the static base in months 1–4. Layer current affairs only after polity, geography and history are at 70% accuracy.</li>
            <li><strong>Timed mocks every week</strong>. Speed and stamina are skills, not knowledge. Build them deliberately.</li>
            <li><strong>Be honest with your weak topics</strong>. Maintain a single notebook of mistakes. Re-attempt them every 2 weeks.</li>
          </ul>

          <h3>2. Recommended book list (lean, finishable)</h3>

          <h4>2.1 General Studies (English / Marathi)</h4>
          <ul>
            <li><strong>Polity</strong>: M. Laxmikanth, &quot;Indian Polity&quot; (English) or B. L. Fadia&apos;s Marathi version. Plus the Constitution bare-act for high-yield articles.</li>
            <li><strong>Geography</strong>: NCERT Class 11 (Fundamentals of Physical Geography + India Physical Environment) and NCERT Class 12 (India: People and Economy). Add a state book for Maharashtra (Sudhir Mahadik or A. B. Savadi).</li>
            <li><strong>History</strong>: NCERT Class 11 (Themes in World History) and NCERT Class 12 (Themes in Indian History I, II, III). Bipan Chandra&apos;s &quot;India&apos;s Struggle for Independence&quot; for the freedom movement. For Maharashtra-specific history use Gathal&apos;s &quot;Maharashtracha Itihas&quot; (Marathi) or our <Link href="/study-guides/maharashtra-history">Maharashtra History guide</Link>.</li>
            <li><strong>Economy</strong>: Ramesh Singh, &quot;Indian Economy&quot;. Skim-read the latest Economic Survey and Maharashtra Economic Survey for current data.</li>
            <li><strong>Environment</strong>: Shankar IAS, &quot;Environment&quot;.</li>
            <li><strong>Science &amp; Tech</strong>: NCERT Class 6–10 Science. For current S&amp;T, follow PIB and the science section of The Hindu.</li>
            <li><strong>Maharashtra Geography</strong>: our <Link href="/study-guides/maharashtra-geography">Maharashtra Geography guide</Link> covers the entire syllabus in 14 minutes; supplement with the <Link href="/map">interactive map</Link> for visual recall.</li>
          </ul>

          <h4>2.2 CSAT (Gazetted CS Paper II only)</h4>
          <ul>
            <li>R. S. Aggarwal, &quot;Quantitative Aptitude&quot; — selected chapters (percentages, ratio, time-speed, profit-loss, simple/compound interest, mensuration, data interpretation).</li>
            <li>Wren &amp; Martin for English grammar; PYQ comprehension passages for practice.</li>
            <li>Daily 30 minutes of reasoning puzzles is enough — CSAT is qualifying.</li>
          </ul>

          <h4>2.3 Marathi &amp; English (Group B / C)</h4>
          <ul>
            <li>Bal Mahabal&apos;s &quot;Marathi Vyakaran&quot; (grammar).</li>
            <li>For English grammar: K. S. Patil or any standard SSC-CGL book covering tenses, articles, voice, narration, sentence improvement.</li>
            <li>Daily reading of one editorial in each language builds vocabulary faster than rote learning.</li>
          </ul>

          <h4>2.4 Current affairs</h4>
          <ul>
            <li>One newspaper, daily, for 30 minutes — The Hindu (English) or Loksatta / Sakal (Marathi). Focus on the front page, edit/op-ed, and the national news section.</li>
            <li>One monthly current-affairs magazine — Vision IAS, ForumIAS, Yojana or the official MPSC current affairs PDF if released.</li>
            <li>For Maharashtra-specific current affairs follow Maharashtra Times and the GR (Government Resolution) section of the state government website.</li>
          </ul>

          <h3>3. The 6-month plan</h3>

          <h4>Month 1 — orientation and Polity</h4>
          <ul>
            <li>Read the official syllabus PDF for your target exam end-to-end.</li>
            <li>Solve one full PYQ paper (don&apos;t worry about the score — establish a baseline).</li>
            <li>Finish Polity (Laxmikanth) chapters 1–18. Make a one-page sheet per chapter.</li>
            <li>Daily current affairs starts from day 1.</li>
            <li>Goal: complete Constitution, Fundamental Rights, DPSP, Parliament, Centre-State relations.</li>
          </ul>

          <h4>Month 2 — Geography</h4>
          <ul>
            <li>NCERT Class 11 Physical + India Physical Environment.</li>
            <li>Maharashtra Geography from our <Link href="/study-guides/maharashtra-geography">guide</Link> + interactive <Link href="/map">map</Link>.</li>
            <li>Solve at least 100 geography PYQs from the <Link href="/exams">/exams</Link> page.</li>
            <li>Continue Polity revision once a week.</li>
          </ul>

          <h4>Month 3 — History</h4>
          <ul>
            <li>Ancient + Medieval (NCERT Class 11–12) — focus on Mauryas, Guptas, Bhakti movement, Delhi Sultanate, Mughals.</li>
            <li>Modern India + Freedom Movement (Bipan Chandra) — INC sessions, Gandhian movements (Champaran 1917, Kheda 1918, Non-Cooperation 1920–22, Civil Disobedience 1930, Quit India 1942).</li>
            <li>Maharashtra History — Satavahanas → Yadavas → Maratha Empire → Peshwas → 1857 → State formation 1960. Use our <Link href="/study-guides/maharashtra-history">Maharashtra History guide</Link>.</li>
            <li>Polity + Geography revision once a week.</li>
          </ul>

          <h4>Month 4 — Economy + Environment + Science</h4>
          <ul>
            <li>Ramesh Singh selected chapters: Planning, Banking &amp; Monetary Policy, Fiscal Policy, External Sector, Inflation, Indian Agriculture, Industries, Service sector.</li>
            <li>Shankar IAS Environment full read.</li>
            <li>NCERT Class 9–10 Science — Physics, Chemistry, Biology core concepts.</li>
            <li>Maharashtra-specific economy from the latest Maharashtra Economic Survey (selected chapters: agriculture, irrigation, power, industry, employment).</li>
          </ul>

          <h4>Month 5 — full-length practice + revision pass-2</h4>
          <ul>
            <li>One full-length mock per week, simulating exam timings.</li>
            <li>One subject revision per day in 30-minute slots.</li>
            <li>Re-attempt every wrongly answered PYQ.</li>
            <li>Build the &quot;facts notebook&quot; — names, dates, articles, figures.</li>
          </ul>

          <h4>Month 6 — peak revision + tactical fixes</h4>
          <ul>
            <li>Two full-length mocks per week.</li>
            <li>Skim every NCERT once.</li>
            <li>Read 6 months of compiled current affairs.</li>
            <li>Last 10 days: <strong>only revision</strong>. No new content. No new books.</li>
            <li>Sleep 7+ hours/night. The night before the exam: don&apos;t study after 7 PM.</li>
          </ul>

          <h3>4. A realistic daily routine</h3>
          <p>For a working professional with 3–4 hours/day:</p>
          <ul>
            <li><strong>06:00–07:00</strong> — newspaper + 10 PYQs.</li>
            <li><strong>21:00–23:00</strong> — main study block (one subject, deep read).</li>
            <li><strong>Weekend</strong> — 5 hours each day. Saturday: full-length mock. Sunday: review of the mock + revision of the week&apos;s topic.</li>
          </ul>
          <p>For a full-time aspirant with 8–10 hours/day:</p>
          <ul>
            <li><strong>06:00–08:00</strong> — newspaper + 30 PYQs + current affairs note.</li>
            <li><strong>09:00–12:00</strong> — primary subject study (deep read + notes).</li>
            <li><strong>14:00–16:00</strong> — secondary subject (revision or new chapter).</li>
            <li><strong>17:00–18:00</strong> — CSAT/aptitude practice (if applicable).</li>
            <li><strong>20:00–22:00</strong> — revision of yesterday + answer-writing for mains aspirants.</li>
            <li><strong>One full-length mock every Saturday, no exceptions</strong>.</li>
          </ul>

          <h3>5. How to use PYQs the right way</h3>
          <p>
            PYQs are not just for practice — they are diagnostic tools. After every paper:
          </p>
          <ol>
            <li>Score honestly with negative marking applied.</li>
            <li>Categorise every wrong answer into one of three buckets: <em>knowledge gap</em> (didn&apos;t know the fact), <em>application gap</em> (knew the fact, misread the question), <em>guess</em> (genuine 50–50).</li>
            <li>For knowledge gaps — open the relevant chapter and re-read.</li>
            <li>For application gaps — slow down on similar question types in the next paper.</li>
            <li>For guesses — check the elimination logic again. PYQ options follow patterns; learn them.</li>
          </ol>
          <p>
            Our <Link href="/exams">/exams</Link> page lets you attempt every paper online with
            instant scoring and Set A answer key marking. The <Link href="/?mode=leaderboard">daily
            leaderboard</Link> gives you a relative benchmark against other aspirants practicing
            the same day.
          </p>

          <h3>6. Subject-wise weightage (last 5 prelims, indicative)</h3>
          <table>
            <thead>
              <tr><th>Subject</th><th>Group B / C</th><th>Gazetted CS Pre Paper I</th></tr>
            </thead>
            <tbody>
              <tr><td>Indian Polity</td><td>10–15%</td><td>15–20%</td></tr>
              <tr><td>Geography (India + Maharashtra)</td><td>15–20%</td><td>15–20%</td></tr>
              <tr><td>History (India + Maharashtra)</td><td>15–20%</td><td>15–20%</td></tr>
              <tr><td>Economy</td><td>10–12%</td><td>10–15%</td></tr>
              <tr><td>Science &amp; Tech</td><td>10–15%</td><td>8–12%</td></tr>
              <tr><td>Environment</td><td>5–8%</td><td>5–10%</td></tr>
              <tr><td>Current Affairs</td><td>15–20%</td><td>15–25%</td></tr>
              <tr><td>Marathi + English (Group B/C only)</td><td>20–25%</td><td>—</td></tr>
            </tbody>
          </table>

          <h3>7. Mock-test strategy</h3>
          <ul>
            <li><strong>Frequency</strong>: months 1–3 — none. Month 4 — 1/week. Month 5 — 1/week + 5 sectional. Month 6 — 2/week.</li>
            <li><strong>Difficulty</strong>: don&apos;t chase low-quality online tests. Stick to PYQ-based mocks plus 2–3 reputed test series.</li>
            <li><strong>Analysis &gt; attempt</strong>: spend twice as long analysing a mock as you spent attempting it. The analysis is where the learning happens.</li>
            <li><strong>OMR practice</strong>: every full-length mock should be on a printed OMR sheet. The bubble-shading habit needs reps.</li>
          </ul>

          <h3>8. Common mistakes to avoid</h3>
          <ul>
            <li>Reading 5 polity books instead of revising one 5 times.</li>
            <li>Skipping Marathi grammar because you &quot;already know it&quot; — Group B/C papers reward grammatical precision.</li>
            <li>Following 7 YouTube channels for current affairs. Pick one. Stick to it.</li>
            <li>Ignoring the negative marking calculus on the actual exam day. Marginal questions decide the cut-off.</li>
            <li>Cramming the night before. The brain consolidates during sleep — revise on D-2, sleep on D-1.</li>
          </ul>

          <h3>Next steps</h3>
          <ul>
            <li>Read the <Link href="/study-guides/mpsc-exam-pattern">MPSC Exam Pattern</Link> guide if you haven&apos;t.</li>
            <li>Sign in on the <Link href="/">home page</Link> and take the most recent paper of your target exam — that&apos;s your baseline.</li>
            <li>Open the <Link href="/study-guides/maharashtra-geography">Maharashtra Geography</Link> and <Link href="/study-guides/maharashtra-history">Maharashtra History</Link> guides — these two together account for ~25% of GS prelims marks.</li>
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
