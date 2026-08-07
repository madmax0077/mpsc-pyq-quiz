import Link from "next/link";
import type { Metadata } from "next";
import { getQuizMeta } from "@/lib/quizMeta";
import { getSlugByTitle } from "@/lib/examPapers";

const meta = getQuizMeta();

export const metadata: Metadata = {
  title: `MPSC Previous Year Question Papers (${meta.minYear}–${meta.maxYear}) — Free Online Practice`,
  description: `Practice MPSC previous year question papers online for free. ${meta.totalQuestions}+ questions from ${meta.totalPapers} exam papers (${meta.minYear}–${meta.maxYear}). English & Marathi. Official answer keys included.`,
  keywords: [
    "MPSC previous year papers", "MPSC question papers", "MPSC PYQ",
    "MPSC Group B question paper", "MPSC Group C question paper",
    "MPSC PSI question paper", "MPSC prelims papers",
    "MPSC Gazetted Services paper", "MPSC answer key",
    "MPSC online test", "MPSC mock test free",
  ],
  alternates: { canonical: "/exams" },
};

export default function ExamsPage() {
  const { exams, years, totalQuestions, totalPapers } = meta;
  const slugByTitle = getSlugByTitle();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">MPSC Previous Year Question Papers</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Free online practice — {totalQuestions}+ questions</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-slate-100">
            MPSC Previous Year Question Papers — Free Online Practice
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Practice with {totalQuestions}+ questions from {totalPapers} MPSC exam papers spanning {years[years.length - 1]} to {years[0]}.
            Every paper includes the official Set A answer key. Available in both <strong>English</strong> and <strong>Marathi</strong>.
            Sign in on the <Link href="/" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">home page</Link> to start practicing instantly.
          </p>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-center dark:border-indigo-800 dark:bg-indigo-900/30">
            <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{totalPapers}</p>
            <p className="text-sm text-indigo-600 dark:text-indigo-300">Exam Papers</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-900/30">
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{totalQuestions}+</p>
            <p className="text-sm text-emerald-600 dark:text-emerald-300">Questions</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center dark:border-amber-800 dark:bg-amber-900/30">
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{years.length}</p>
            <p className="text-sm text-amber-600 dark:text-amber-300">Years Covered</p>
          </div>
        </div>

        {years.map((year) => {
          const yearExams = exams.filter((e) => e.year === year);
          if (yearExams.length === 0) return null;
          return (
            <section key={year} className="mb-10">
              <h3 className="mb-4 text-xl font-bold text-slate-800 border-b border-slate-200 pb-2 dark:text-slate-100 dark:border-slate-700">
                MPSC {year} Question Papers
              </h3>
              <div className="space-y-4">
                {yearExams.map((exam) => {
                  const slug = slugByTitle.get(exam.title);
                  const card = (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="break-words font-semibold text-slate-800 dark:text-slate-100">{exam.title}</h4>
                          <p className="mt-1 break-words text-sm text-slate-600 dark:text-slate-300">{exam.description}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                          {exam.questions} Qs
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="rounded bg-slate-100 px-2 py-0.5 font-medium dark:bg-slate-700">{exam.type}</span>
                        <span>English + Marathi</span>
                        <span>Official Answer Key (Set A)</span>
                        {slug && (
                          <span className="w-full font-semibold text-indigo-600 sm:ml-auto sm:w-auto dark:text-indigo-400">View paper &amp; answers →</span>
                        )}
                      </div>
                    </>
                  );
                  return slug ? (
                    <Link
                      key={exam.title}
                      href={`/exams/${slug}`}
                      className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-700 dark:hover:bg-indigo-900/20"
                    >
                      {card}
                    </Link>
                  ) : (
                    <article key={exam.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                      {card}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}

        <div className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 p-6 text-center dark:border-indigo-800 dark:from-indigo-900/30 dark:to-violet-900/30">
          <h3 className="text-lg font-bold text-indigo-700 dark:text-indigo-300">Ready to Practice?</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Sign in on the home page to start solving MPSC previous year questions with instant scoring and detailed answers.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            Start Practicing — It&apos;s Free
          </Link>
        </div>

        <div className="mt-10">
          <h3 className="mb-4 text-lg font-bold text-slate-800 dark:text-slate-100">About MPSC Exams</h3>
          <div className="prose prose-slate max-w-none text-sm dark:prose-invert">
            <p>
              The Maharashtra Public Service Commission (MPSC) is the constitutional authority
              established under Article 315 of the Constitution of India. It is headquartered
              in Mumbai and is responsible for recruiting candidates to civil services and
              civil posts under the Government of Maharashtra. Every year the MPSC conducts
              seven to ten major recruitment examinations covering both the classical
              generalist services and specialised technical / departmental services. The
              major exams for which previous-year papers are archived on MPSC PYQ QUIZ
              include:
            </p>
            <ul>
              <li><strong>MPSC Group B (Subordinate Services)</strong> — combined preliminary examination for Deputy Collector, Deputy Superintendent of Police (DySP), Assistant Regional Transport Officer, Section Officer / Assistant Section Officer and equivalent Group B gazetted / non-gazetted posts.</li>
              <li><strong>MPSC Group C (Subordinate Services)</strong> — combined preliminary examination for Industry Inspector, Sub-Registrar &amp; Inspector of Stamps, Tax Assistant, Technical Assistant and equivalent Group C posts.</li>
              <li><strong>MPSC PSI (Police Sub-Inspector)</strong> — direct recruitment to the Police Sub-Inspector cadre in Maharashtra Police, one of the largest state police forces in India.</li>
              <li><strong>MPSC Gazetted Civil Services (formerly State Services)</strong> — the flagship examination for higher gazetted administrative posts including Deputy Collector, DySP (State), BDO, Tehsildar, Assistant Commissioner (Sales Tax), Assistant Director (School Education) and roughly forty other cadres.</li>
              <li><strong>MPSC Gazetted Technical Services</strong> — for gazetted technical posts requiring specialised engineering, agriculture, veterinary or forestry qualifications.</li>
              <li><strong>MPSC RTO Assistant Motor Vehicle Inspector (AMVI)</strong> — specialised technical examination for Motor Vehicles Department recruitment, with a dedicated automobile-engineering paper alongside General Studies.</li>
            </ul>
            <p>
              All preliminary examinations use the objective (MCQ) format with negative
              marking of one-fourth mark per wrong answer. The General Studies syllabus
              covers Indian Polity, History of India and Maharashtra, Physical, Human and
              Economic Geography of India and Maharashtra, General Science, Current Affairs
              (national and state), Environment and Ecology, Indian Economy and Maharashtra
              Economy, Basic Numeracy and Mental Ability. Papers are set in both English
              and Marathi in parallel — aspirants can attempt either version and both
              language versions appear on this platform for every paper archived.
            </p>
            <p>
              Practising previous-year papers is widely acknowledged to be the single most
              productive activity in MPSC preparation. Three reasons make PYQ practice
              disproportionately valuable: (i) MPSC recycles roughly 20 to 30 percent of its
              factual anchors — the same dates, articles, ratios, districts and events
              appear across paper cycles with only the option-craft rearranged; (ii) the
              option-framing style is highly consistent across years, so aspirants who have
              seen the traps once learn to anticipate them; and (iii) the cognitive load per
              question is roughly a quarter of a fresh coaching-institute mock, allowing an
              aspirant to build stamina for the 100-question 90-minute prelim by starting
              with familiar territory. Our platform surfaces the entire archive above by
              year and by paper, with a dedicated Topic Wise practice mode for aspirants who
              prefer to drill a single subject at a time.
            </p>
            <p>
              For a preparation roadmap that lays out how to sequence PYQ practice against
              full-length mocks and syllabus reading, see our detailed {""}
              <Link href="/study-guides/mpsc-preparation-strategy" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700 dark:text-indigo-400">
                MPSC Preparation Strategy guide
              </Link>{" "}
              and the {""}
              <Link href="/study-guides/mpsc-exam-pattern" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700 dark:text-indigo-400">
                MPSC Exam Pattern guide
              </Link>. For subject-specific deep dives, our {""}
              <Link href="/study-guides" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700 dark:text-indigo-400">
                Study Guides hub
              </Link>{" "}
              carries long-form articles on Indian Polity, Maharashtra Geography and
              Maharashtra History.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/80 py-6 dark:border-slate-700/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-slate-400 dark:text-slate-500">MPSC PYQ QUIZ &middot; Don&apos;t know Academy</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
              <Link href="/" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Home</Link>
              <Link href="/about" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">About</Link>
              <Link href="/contact" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Contact</Link>
              <Link href="/privacy" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Privacy</Link>
              <Link href="/terms" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Terms</Link>
              <Link href="/disclaimer" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Disclaimer</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
