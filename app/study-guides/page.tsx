import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MPSC Study Guides — Free Long-Form Notes for Geography, History, Polity & Strategy",
  description:
    "Free MPSC study guides covering Maharashtra geography, Maharashtra history, Indian polity, MPSC exam pattern and a full preparation strategy. Long-form, exam-focused notes for Group B, Group C, PSI and Gazetted prelims.",
  keywords: [
    "MPSC study guides",
    "MPSC notes free",
    "MPSC geography notes",
    "MPSC history notes",
    "MPSC polity notes",
    "MPSC preparation strategy",
    "MPSC exam pattern",
    "Maharashtra geography for MPSC",
    "Maharashtra history for MPSC",
    "MPSC Talathi exam",
    "Talathi Bharti 2026",
    "Talithi exam",
    "UPSC CSAT practice",
    "UPSC CSAT Paper 2",
    "MPSC Group C exam pattern 2026",
    "MPSC Group C subject wise weightage",
    "MPSC Group B previous year question paper",
    "MPSC Combine question paper",
    "Talathi Bharti 2026",
    "RTO AMVI exam",
    "MPSC AMVI",
  ],
  alternates: { canonical: "/study-guides" },
};

const GUIDES = [
  {
    href: "/study-guides/maharashtra-geography",
    emoji: "🗺️",
    title: "Maharashtra Geography",
    blurb:
      "Physical divisions, river systems, climate, soils, agriculture, minerals and natural landmarks of Maharashtra — everything tested in MPSC prelims.",
    minutes: 14,
  },
  {
    href: "/study-guides/maharashtra-history",
    emoji: "🏛️",
    title: "Maharashtra History",
    blurb:
      "Ancient Satavahanas to the Maratha Empire under Chhatrapati Shivaji Maharaj, the Peshwas, the British era and modern Maharashtra after the 1960 reorganisation.",
    minutes: 16,
  },
  {
    href: "/study-guides/indian-polity-for-mpsc",
    emoji: "⚖️",
    title: "Indian Polity for MPSC",
    blurb:
      "Constitution basics, Fundamental Rights, DPSPs, Parliament, the Maharashtra state government, Panchayati Raj, and the high-yield articles you must memorise.",
    minutes: 15,
  },
  {
    href: "/study-guides/mpsc-exam-pattern",
    emoji: "📋",
    title: "MPSC Exam Pattern",
    blurb:
      "Detailed pattern for Group B, Group C, PSI Pre, Gazetted Civil Services and Gazetted Technical Services prelims — marks, sections, syllabus, negative marking, cut-offs.",
    minutes: 12,
  },
  {
    href: "/study-guides/mpsc-group-c-syllabus",
    emoji: "📝",
    title: "MPSC Group C Syllabus",
    blurb:
      "Complete Group C Combined syllabus and exam pattern — prelims (100 questions/100 marks/1 hour), subject-wise weightage, detailed topics, mains, skill test and cut-off trends.",
    minutes: 10,
  },
  {
    href: "/study-guides/mpsc-group-c-exam-pattern-2026",
    emoji: "📌",
    title: "MPSC Group C Exam Pattern 2026",
    blurb:
      "Focused 2026 pattern page — prelims marks/time, negative marking, mains & skill-test stages, plus free PYQ and mock links for Combined Group C.",
    minutes: 9,
  },
  {
    href: "/study-guides/mpsc-group-c-subject-wise-weightage",
    emoji: "📊",
    title: "MPSC Group C Subject Wise Weightage",
    blurb:
      "Approximate marks map for Marathi, English, GK, Aptitude, Polity, History, Geography, Economics and Science — with a practical scoring plan.",
    minutes: 8,
  },
  {
    href: "/study-guides/mpsc-group-b-previous-year-question-paper",
    emoji: "📄",
    title: "MPSC Group B Previous Year Question Paper",
    blurb:
      "Group B Combined Pre PYQ hub — practise papers with answers online, PSI/STI/ASO path overview, and a 7-day revision plan.",
    minutes: 7,
  },
  {
    href: "/study-guides/mpsc-combine-question-paper",
    emoji: "🧩",
    title: "MPSC Combine Question Paper",
    blurb:
      "What “Combine / GAT C / GAT K” searches mean, Group B vs Group C Combined practice paths, and free online PYQ + mock workflow.",
    minutes: 8,
  },
  {
    href: "/study-guides/mpsc-talathi-exam",
    emoji: "🏞️",
    title: "MPSC Talathi Exam",
    blurb:
      "Talathi (तलाठी) Bharti 2026 — syllabus blocks, exam pattern, land-revenue focus, a four-week plan, and how it overlaps with Group C. Also covers the common “Talithi exam” search spelling.",
    minutes: 11,
  },
  {
    href: "/study-guides/mpsc-talathi-bharti-2026",
    emoji: "🌾",
    title: "Talathi Bharti 2026 — तलाठी भरती",
    blurb:
      "English + मराठी strategy blog: 1,539 posts, Combined-gate reality, Land Revenue edge, cut-off thinking and a 90-day plan. Toggle language on the page.",
    minutes: 16,
  },
  {
    href: "/study-guides/mpsc-rto-amvi-exam",
    emoji: "🚗",
    title: "RTO AMVI Exam — आरटीओ एएमव्हीआय",
    blurb:
      "English + मराठी AMVI guide — prelims trap vs technical mains, Section A/B/C, Motor Vehicle Act focus, PYQ method and free RTO practice. Language toggle on page.",
    minutes: 17,
  },
  {
    href: "/study-guides/mpsc-csat-preparation",
    emoji: "🧮",
    title: "MPSC & UPSC CSAT Preparation",
    blurb:
      "Rajyaseva Paper II decoded — and how the same aptitude practice helps UPSC CSE CSAT. Syllabus, topic checklist, 90-second time plan and an eight-week schedule.",
    minutes: 12,
  },
  {
    href: "/study-guides/upsc-csat-practice",
    emoji: "🇮🇳",
    title: "UPSC CSAT Practice",
    blurb:
      "Free UPSC CSAT Paper II aptitude practice — topic lessons, 3,800+ questions with worked explanations and timed speed tests in English and Marathi.",
    minutes: 4,
  },
  {
    href: "/study-guides/mpsc-negative-marking",
    emoji: "➖",
    title: "MPSC Negative Marking",
    blurb:
      "How the 1/4th negative-marking rule works across Group B, Group C, PSI, CSAT and Rajyaseva — with worked examples and a mathematically sound guessing strategy.",
    minutes: 8,
  },
  {
    href: "/study-guides/mpsc-preparation-strategy",
    emoji: "🎯",
    title: "MPSC Preparation Strategy",
    blurb:
      "A practical 6-month plan: book list, daily routine, how to use PYQs, subject-wise weightage, mock-test strategy and last-month revision blueprint.",
    minutes: 15,
  },
];

export default function StudyGuidesHub() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Back to home"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="break-words text-lg font-bold leading-snug text-slate-800 dark:text-slate-100">MPSC Study Guides</h1>
            <p className="break-words text-xs text-slate-500 dark:text-slate-400">Free long-form notes for MPSC aspirants</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <section>
          <h2 className="text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl dark:text-slate-100">
            Free MPSC Study Guides
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Long-form, exam-focused notes written specifically for the Maharashtra Public Service
            Commission prelims (Group B, Group C, PSI, Gazetted Civil Services and Gazetted Technical
            Services). Each guide is a self-contained reference that you can read in one sitting and
            return to during revision. Pair them with the {""}
            <Link href="/exams" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
              previous-year question practice
            </Link>{" "}
            and the {""}
            <Link href="/map" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
              interactive map of Maharashtra
            </Link>{" "}
            for the most efficient prep cycle.
          </p>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          {GUIDES.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-600"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl" aria-hidden>{g.emoji}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="break-words font-bold text-slate-800 group-hover:text-indigo-700 dark:text-slate-100 dark:group-hover:text-indigo-400">
                    {g.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{g.blurb}</p>
                  <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">~{g.minutes} min read</p>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            How to use these guides
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            We deliberately wrote these as compact reference articles rather than as a full textbook.
            Use them in three passes:
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
            <li>
              <strong>First read</strong> — go through the entire guide once at normal speed. Highlight
              or note the names, dates, articles and statistics that you don&apos;t already know.
            </li>
            <li>
              <strong>Apply</strong> — open the matching paper on the {""}
              <Link href="/exams" className="text-indigo-600 hover:underline">/exams</Link> page and
              attempt 10–15 PYQs on the same topic. Score yourself with the instant grader.
            </li>
            <li>
              <strong>Revise</strong> — re-read only the bullet points and tables. The guides are
              structured so the second pass takes a quarter of the time of the first.
            </li>
          </ol>
        </section>

        <section className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-6 dark:border-indigo-800 dark:bg-indigo-900/30">
          <h2 className="text-lg font-bold text-indigo-800 dark:text-indigo-200">
            About the source material
          </h2>
          <p className="mt-2 text-sm text-indigo-900/80 dark:text-indigo-200/80">
            Every guide is written using the official MPSC syllabus, NCERT textbooks (Classes 6–12
            for History, Geography and Polity), the Constitution of India bare act, and the
            Government of Maharashtra&apos;s public statistical handbooks and Economic Surveys. Where
            we quote a fact (population figures, capacity numbers, dates), we use the most recent
            publicly available figure at the time of writing. Spotted something out of date? Email
            us at <a className="underline" href="mailto:dontknowacademy@gmail.com">dontknowacademy@gmail.com</a>
            {" "}and we&apos;ll fix it within 48 hours.
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Why long-form guides beat scattered notes
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Most MPSC study material online is a jumble of one-line facts pulled from
            various coaching-institute handouts. That format is convenient to skim but
            hostile to retention — the human brain remembers structured, causal narratives
            far better than isolated bullet points. Our study guides are written as
            self-contained arcs: for Geography, we start from the geological formation of
            the Deccan Trap and end at present-day power and mineral distribution; for
            History, we walk from the Satavahanas of Junnar-Paithan-Nashik through the
            Maratha coronation at Raigad in 1674 and the Peshwa era to the 1960 Samyukta
            Maharashtra reorganisation; for Polity, we start with the Constituent Assembly
            debates and end at the working constitutional bodies as of 2026. This narrative
            spine is what makes the material re-readable, and re-reading is what MPSC
            success actually rewards.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Each guide takes twelve to sixteen minutes to read in full, which fits into a
            single evening study session. During the last-month revision cycle the guides
            act as a rapid re-loader — most aspirants can re-read the entire five-guide set
            in a single Saturday afternoon and walk into the exam hall with the major
            factual anchors freshly rehearsed. That is a deliberate design choice, not an
            accident of length.
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            The MPSC prelims syllabus at a glance
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Across the five major MPSC preliminary examinations (Group B, Group C, PSI,
            Gazetted Civil Services, Gazetted Technical Services), the General Studies
            syllabus is broadly identical. It has ten major weightage buckets:{" "}
            <strong>Indian Polity and Governance</strong> (roughly 12–18 marks in a 100-mark
            paper), <strong>Modern Indian History (with special emphasis on Maharashtra)</strong>{" "}
            (10–15 marks), <strong>Physical, Human and Economic Geography of India and
            Maharashtra</strong> (10–15 marks), <strong>General Science</strong> (10–15 marks),
            <strong> Current Affairs — National and State</strong> (10–15 marks),{" "}
            <strong>Indian and Maharashtra Economy</strong> (8–12 marks), <strong>Environment
            and Ecology</strong> (5–8 marks), <strong>Basic Numeracy and Mental Ability</strong>{" "}
            (5–10 marks), <strong>Marathi Grammar and Comprehension</strong> (5–10 marks) and
            <strong> English Grammar and Comprehension</strong> (5–10 marks). No single
            subject dominates, so an aspirant who scores 60 percent across ten sections will
            comfortably clear the cut-off in most years — whereas an aspirant who scores 90
            percent in one section but 30 percent in three others typically will not.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            The five study guides above cover the three heaviest content-based subjects
            (Polity, Geography, History) with the depth necessary to hit that 60-percent
            floor comfortably, plus the meta-guides on exam pattern and preparation
            strategy to help you plan the remaining seven sections. For hands-on practice,
            use the {""}
            <Link href="/exams" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700 dark:text-indigo-400">
              previous-year papers
            </Link>{" "}
            page — every paper carries the official Set A answer key and the option-by-option
            explanations we have added for indexed questions.
          </p>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 py-6 dark:border-slate-700/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-slate-400 dark:text-slate-500">MPSC PYQ QUIZ &middot; Don&apos;t know Academy</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
              <Link href="/" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Home</Link>
              <span>|</span>
              <Link href="/exams" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Exam Papers</Link>
              <span>|</span>
              <Link href="/map" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Maharashtra Map</Link>
              <span>|</span>
              <Link href="/about" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">About</Link>
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
