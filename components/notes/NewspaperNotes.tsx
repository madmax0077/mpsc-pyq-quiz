"use client";

import { WRITER_GROUPS, NEWSPAPER_MCQS } from "@/lib/notesData/newspapers";

const TOTAL_WRITERS = WRITER_GROUPS.reduce(
  (acc, g) => acc + g.writers.length,
  0,
);
const TOTAL_PAPERS = WRITER_GROUPS.reduce(
  (acc, g) => acc + g.writers.reduce((a, w) => a + w.papers.length, 0),
  0,
);
const OPTION_LABELS = ["A", "B", "C", "D"] as const;

export default function NewspaperNotes() {
  return (
    <article lang="mr" className="space-y-10">
      {/* Cover / Hero */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-500 to-red-600 p-8 text-white shadow-lg sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-100/90">
          Don&apos;t know Academy · Notes
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
            📖 संदर्भ तक्ता
          </a>
          <a
            href="#mcqs"
            className="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/20"
          >
            📝 100 MCQ
          </a>
        </div>
      </section>

      {/* About */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          या नोट्सबद्दल
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <strong>आधुनिक भारताच्या इतिहासातील वृत्तपत्र व संपादक</strong> हा एक
          उच्च-गुणांचा (high-yield) घटक आहे. MPSC Group B, Group C, Rajyaseva,
          RTO AMVI आणि UPSC प्रत्येक प्रिलिम्समध्ये दरवर्षी
          <strong> 1–3 प्रश्न</strong> या घटकातून येतात. खालील पान दोन भागांत
          विभागले आहे — <em>संदर्भ तक्ता</em> (writer-grouped reference) आणि
          <em> 100 बहुपर्यायी प्रश्न</em> ज्यांची उत्तरे हिरव्या रंगात दाखवली
          आहेत.
        </p>
      </section>

      {/* Reference */}
      <section id="reference" className="scroll-mt-24">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-400">
              विभाग १ · Reference
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-3xl">
              संदर्भ तक्ता — संपादक व त्यांची वृत्तपत्रे
            </h3>
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
            <h4 className="rounded-lg border-l-4 border-orange-500 bg-orange-50 px-4 py-2 text-base font-bold text-slate-800 dark:bg-orange-900/20 dark:text-slate-100">
              {group.title}
            </h4>
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

      {/* MCQs */}
      <section id="mcqs" className="scroll-mt-24">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              विभाग २ · Practice
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-3xl">
              100 बहुपर्यायी प्रश्न (उत्तरांसह)
            </h3>
          </div>
          <span className="hidden shrink-0 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 sm:inline-block">
            {NEWSPAPER_MCQS.length} questions
          </span>
        </div>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          योग्य उत्तर हिरव्या रंगात आणि{" "}
          <span className="text-emerald-600">✓</span> चिन्हाने दाखवले आहे.
          उजळणीच्या वेळी प्रत्येक प्रश्न वाचा, मनात उत्तर द्या, मग खालचे योग्य
          उत्तर पडताळून पाहा.
        </p>

        <div className="mt-6 space-y-3">
          {NEWSPAPER_MCQS.map((m, i) => (
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
                        <span
                          aria-hidden
                          className="text-emerald-600 dark:text-emerald-400"
                        >
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

      {/* Source / footer */}
      <section className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 text-sm text-indigo-900/80 dark:border-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-200/80">
        <p>
          <strong>Source:</strong> NCERT (Modern Indian History), Bipan
          Chandra&apos;s <em>India&apos;s Struggle for Independence</em>, MPSC
          Rajyaseva PYQ archive (1995–2024), MPSC Group B/C combine PYQs
          (2018–2024) आणि सार्वजनिक स्रोत. कोणतीही चूक आढळल्यास{" "}
          <a className="underline" href="mailto:dontknowacademy@gmail.com">
            dontknowacademy@gmail.com
          </a>{" "}
          वर कळवा — 48 तासांत सुधारणा करू.
        </p>
      </section>
    </article>
  );
}
