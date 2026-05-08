import Link from "next/link";
import type { Metadata } from "next";
import { WRITER_GROUPS, MCQS } from "@/lib/newspapersData";

export const metadata: Metadata = {
  title:
    "वृत्तपत्र (वर्तमानपत्र) — संस्थापक, संपादक व 100 MCQ | MPSC, राज्यसेवा, RTO AMVI, UPSC",
  description:
    "भारतीय स्वातंत्र्यलढ्यातील 70+ वृत्तपत्रे आणि 50+ संस्थापक/संपादक यांचा संपूर्ण संदर्भ तक्ता आणि MPSC Group B, Group C, Rajyaseva, RTO AMVI व UPSC परीक्षांसाठी 100 बहुपर्यायी प्रश्न (उत्तरांसह). जलद उजळणीसाठी अनुकूल — मोफत.",
  keywords: [
    "वर्तमानपत्र संस्थापक",
    "वृत्तपत्र संपादक",
    "MPSC newspapers",
    "newspapers founders India MPSC",
    "Indian newspapers history MPSC",
    "newspapers MCQ Marathi",
    "MPSC current affairs newspapers",
    "Rajyaseva newspapers",
    "RTO AMVI newspapers",
    "UPSC newspapers founders",
    "Don't know Academy newspapers",
  ],
  alternates: { canonical: "/newspapers" },
  openGraph: {
    title:
      "वृत्तपत्र — संस्थापक, संपादक व 100 MCQ | MPSC, Rajyaseva, RTO AMVI, UPSC",
    description:
      "70+ वृत्तपत्रे · 50+ संपादक · 100 MCQ — संदर्भ तक्ता आणि सरावाचे प्रश्न. Don't know Academy.",
    url: "/newspapers",
    type: "article",
  },
};

const TOTAL_WRITERS = WRITER_GROUPS.reduce(
  (acc, g) => acc + g.writers.length,
  0,
);
const TOTAL_PAPERS = WRITER_GROUPS.reduce(
  (acc, g) => acc + g.writers.reduce((a, w) => a + w.papers.length, 0),
  0,
);
const OPTION_LABELS = ["A", "B", "C", "D"] as const;

export default function NewspapersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/85">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Back to home"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-slate-800 dark:text-slate-100">
              वृत्तपत्र — संस्थापक, संपादक व 100 MCQ
            </h1>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              Newspapers · Founders, Editors &amp; 100 MCQs · MPSC / Rajyaseva /
              RTO AMVI / UPSC
            </p>
          </div>
          <Link
            href="/exams"
            className="hidden rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 sm:inline-block"
          >
            Practice PYQs
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10" lang="mr">
        {/* Cover / Hero */}
        <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-500 to-red-600 p-8 text-white shadow-lg sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-100/90">
            Don&apos;t know Academy · mpscs.in
          </p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
            वर्तमानपत्र — संस्थापक व संपादक
          </h2>
          <p className="mt-2 text-base font-medium text-orange-50 sm:text-lg">
            संदर्भ तक्ता आणि <strong>100 बहुपर्यायी प्रश्न</strong> (उत्तरांसह)
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/20 backdrop-blur">
              📚 MPSC Group B · Group C · Rajyaseva · RTO AMVI · UPSC
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/20 backdrop-blur">
              🗞️ {TOTAL_PAPERS}+ वृत्तपत्रे
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/20 backdrop-blur">
              ✍️ {TOTAL_WRITERS}+ संपादक
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/20 backdrop-blur">
              ✅ 100 MCQ
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#reference"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              📖 संदर्भ तक्ता पाहा
            </a>
            <a
              href="#mcqs"
              className="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/20"
            >
              📝 100 MCQ सोडवा
            </a>
            <Link
              href="/exams"
              className="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/20"
            >
              🎯 PYQ सराव
            </Link>
          </div>
        </section>

        {/* About / Why */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            या पानाबद्दल
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <strong>आधुनिक भारताच्या इतिहासातील वृत्तपत्र व संपादक</strong> हा
            एक उच्च-गुणांचा (high-yield) घटक आहे. MPSC Group B, Group C,
            Rajyaseva, RTO AMVI आणि UPSC प्रत्येक प्रिलिम्समध्ये दरवर्षी
            <strong> 1–3 प्रश्न</strong> या घटकातून येतात. हे पान दोन भागांत
            विभागले आहे — पहिला भाग म्हणजे <em>संदर्भ तक्ता</em> (writer-grouped
            reference) ज्यामध्ये एका दृष्टिक्षेपात पूर्ण यादी मिळते; दुसरा भाग
            म्हणजे <em>100 बहुपर्यायी प्रश्न</em> ज्यांची उत्तरे हिरव्या रंगात
            दाखवली आहेत. {" "}
            <Link
              href="/study-guides"
              className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              इतर MPSC अभ्यास मार्गदर्शिका
            </Link>{" "}
            आणि {" "}
            <Link
              href="/exams"
              className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              मागील वर्षांचे प्रश्न (PYQ)
            </Link>{" "}
            यांच्यासह वापरा.
          </p>
        </section>

        {/* Reference section */}
        <section id="reference" className="mt-10 scroll-mt-20">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                विभाग १ · Reference
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-3xl">
                संदर्भ तक्ता — संपादक व त्यांची वृत्तपत्रे
              </h2>
            </div>
            <span className="hidden shrink-0 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 sm:inline-block">
              {TOTAL_WRITERS} writers
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            कालक्रमानुसार आणि चळवळीच्या टप्प्यानुसार 6 गटांत विभागलेला तक्ता.
            प्रत्येक कार्डात संपादकाचे नाव (इंग्रजी लिप्यंतरणासह) आणि त्यांच्या
            वृत्तपत्रांची यादी आहे.
          </p>

          {WRITER_GROUPS.map((group) => (
            <div key={group.title} className="mt-6">
              <h3 className="rounded-lg border-l-4 border-orange-500 bg-orange-50 px-4 py-2 text-base font-bold text-slate-800 dark:bg-orange-900/20 dark:text-slate-100">
                {group.title}
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {group.writers.map((w) => (
                  <div
                    key={`${group.title}-${w.name}`}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {w.name}
                      </span>
                      {w.latin && (
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                          {w.latin}
                        </span>
                      )}
                    </div>
                    <ul className="mt-2 space-y-1">
                      {w.papers.map((p) => (
                        <li
                          key={p}
                          className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"
                        >
                          <span aria-hidden className="text-orange-500">
                            •
                          </span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* MCQ section */}
        <section id="mcqs" className="mt-12 scroll-mt-20">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                विभाग २ · Practice
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-3xl">
                100 बहुपर्यायी प्रश्न (उत्तरांसह)
              </h2>
            </div>
            <span className="hidden shrink-0 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 sm:inline-block">
              {MCQS.length} questions
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            योग्य उत्तर हिरव्या रंगात आणि <span className="text-emerald-600">✓</span>{" "}
            चिन्हाने दाखवले आहे. <strong>उजळणीच्या वेळी</strong> प्रत्येक
            प्रश्न वाचा आणि स्वतः मनात उत्तर द्या; नंतर खालचे योग्य उत्तर
            पडताळून पाहा.
          </p>

          <div className="mt-6 space-y-3">
            {MCQS.map((m, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100 sm:text-base">
                    {m.q}
                  </p>
                </div>
                <div className="mt-3 grid gap-2 sm:ml-10 sm:grid-cols-2">
                  {m.opts.map((opt, j) => {
                    const isCorrect = j === m.correct;
                    return (
                      <div
                        key={j}
                        className={
                          isCorrect
                            ? "flex items-start gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100"
                            : "flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300"
                        }
                      >
                        <span
                          className={
                            isCorrect
                              ? "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white"
                              : "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-300 text-[10px] font-bold text-slate-500 dark:border-slate-600 dark:text-slate-400"
                          }
                        >
                          {OPTION_LABELS[j]}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isCorrect && (
                          <span aria-hidden className="text-emerald-600 dark:text-emerald-400">
                            ✓
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips / Strategy */}
        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            उत्तम लक्षात ठेवण्याचा मार्ग
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
            <li>
              <strong>पहिले संदर्भ तक्ता वाचा</strong> — कोण कुठल्या वृत्तपत्राशी
              जोडले आहे ते एकदा संपूर्ण फिरवा. ज्ञात नावांना मनात अधोरेखित करा.
            </li>
            <li>
              <strong>नंतर 100 MCQ सोडवा</strong> — उत्तर पाहण्याआधी दर
              प्रश्नाला 5–7 सेकंद थांबा.
            </li>
            <li>
              <strong>चुकलेले प्रश्न पुन्हा वाचा</strong> — चुकलेल्या प्रश्नांची
              यादी करून त्या जोड्या (writer ↔ paper) पुन्हा संदर्भ तक्त्यात
              पडताळा.
            </li>
            <li>
              <strong>परीक्षेच्या आदल्या दिवशी</strong> केवळ 6 गटांची शीर्षके
              आणि कार्ड्स वाचा — संपूर्ण विषय 10–12 मिनिटांत उजळवता येतो.
            </li>
          </ol>
        </section>

        {/* Related */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/exams"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-600"
          >
            <p className="text-2xl">🎯</p>
            <h3 className="mt-2 font-bold text-slate-800 group-hover:text-indigo-700 dark:text-slate-100 dark:group-hover:text-indigo-400">
              Practice MPSC PYQ
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              मागील वर्षांचे प्रश्न सोडवा — Group B, Group C, PSI, Gazetted साठी.
            </p>
          </Link>
          <Link
            href="/study-guides"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-600"
          >
            <p className="text-2xl">📚</p>
            <h3 className="mt-2 font-bold text-slate-800 group-hover:text-indigo-700 dark:text-slate-100 dark:group-hover:text-indigo-400">
              MPSC Study Guides
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Maharashtra geography, history, Indian polity, exam pattern आणि strategy.
            </p>
          </Link>
          <Link
            href="/map"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-600"
          >
            <p className="text-2xl">🗺️</p>
            <h3 className="mt-2 font-bold text-slate-800 group-hover:text-indigo-700 dark:text-slate-100 dark:group-hover:text-indigo-400">
              Interactive Maharashtra Map
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              नद्या, घाट, धरणे, किल्ले, ऊर्जा प्रकल्प आणि UNESCO स्थळे — एका नकाशावर.
            </p>
          </Link>
          <Link
            href="/?mode=leaderboard"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-600"
          >
            <p className="text-2xl">🏆</p>
            <h3 className="mt-2 font-bold text-slate-800 group-hover:text-indigo-700 dark:text-slate-100 dark:group-hover:text-indigo-400">
              Daily Leaderboard
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              आजच्या टॉप 3 स्कोअरर्सची यादी — दररोज रिसेट होणारा आगगबाब रँकर.
            </p>
          </Link>
        </section>

        {/* Source / disclaimer */}
        <section className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-5 text-sm text-indigo-900/80 dark:border-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-200/80">
          <p>
            <strong>Source:</strong> NCERT (Modern Indian History), Bipan
            Chandra&apos;s <em>India&apos;s Struggle for Independence</em>,
            MPSC Rajyaseva PYQ archive (1995–2024), MPSC Group B/C combine PYQs
            (2018–2024) आणि सार्वजनिक स्रोत. कोणतीही चूक आढळल्यास {" "}
            <a className="underline" href="mailto:dontknowacademy@gmail.com">
              dontknowacademy@gmail.com
            </a>{" "}
            वर कळवा — 48 तासांत सुधारणा करू.
          </p>
        </section>
      </main>

      <footer className="mt-6 border-t border-slate-200/80 py-6 dark:border-slate-700/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              MPSC PYQ QUIZ &middot; Don&apos;t know Academy
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
              <Link
                href="/"
                className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400"
              >
                Home
              </Link>
              <span>|</span>
              <Link
                href="/exams"
                className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400"
              >
                Exam Papers
              </Link>
              <span>|</span>
              <Link
                href="/study-guides"
                className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400"
              >
                Study Guides
              </Link>
              <span>|</span>
              <Link
                href="/map"
                className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400"
              >
                Maharashtra Map
              </Link>
              <span>|</span>
              <Link
                href="/about"
                className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400"
              >
                About
              </Link>
              <span>|</span>
              <Link
                href="/contact"
                className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400"
              >
                Contact
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
