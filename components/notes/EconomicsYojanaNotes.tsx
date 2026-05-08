"use client";

import {
  YOJANA_GROUPS,
  YOJANA_STATS,
  YOJANA_MCQS,
  YOJANA_TOTAL_GROUPS,
  YOJANA_TOTAL_MCQS,
  type YojanaGroup,
  type YojanaItem,
} from "@/lib/notesData/economicsYojana";

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

/**
 * Render a single yojana group's items. The PDF source mixes three kinds
 * of lines: dates (start dates of sub-schemes), sub-headings (sub-scheme
 * names with abbreviation in parens), and ordinary objective bullets.
 *
 * `subhead` items render as their own rounded chip + title block, so the
 * sub-scheme is visually separated from its parent. `date` items render
 * inline next to the most recent subhead. `para` items render as bullets.
 */
function GroupItems({ items }: { items: YojanaItem[] }) {
  // Group items into "cards" - each card starts at a `subhead` (or is
  // an "intro" card for paragraphs that come before the first subhead).
  type Card = {
    subhead?: string;
    date?: string;
    bullets: string[];
  };
  const cards: Card[] = [];
  let cur: Card = { bullets: [] };

  const pushCur = () => {
    if (cur.subhead || cur.date || cur.bullets.length > 0) {
      cards.push(cur);
    }
  };

  for (const it of items) {
    if (it.kind === "subhead") {
      pushCur();
      cur = { subhead: it.text, bullets: [] };
    } else if (it.kind === "date") {
      // Attach the date to the most recent (still-open) card. If we don't
      // yet have a card, start one.
      if (!cur.subhead && !cur.date && cur.bullets.length === 0) {
        cur.date = it.text;
      } else if (!cur.date) {
        cur.date = it.text;
      } else {
        // Multiple dates - just append as bullet so we don't lose info
        cur.bullets.push(it.text);
      }
    } else {
      cur.bullets.push(it.text);
    }
  }
  pushCur();

  return (
    <div className="mt-3 space-y-3">
      {cards.map((c, i) => {
        const hasHeader = Boolean(c.subhead || c.date);
        return (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            {hasHeader && (
              <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                {c.subhead && (
                  <h5 className="text-base font-bold text-emerald-700 dark:text-emerald-300">
                    {c.subhead}
                  </h5>
                )}
                {c.date && (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-700/40">
                    📅 {c.date}
                  </span>
                )}
              </div>
            )}
            {c.bullets.length > 0 && (
              <ul className="space-y-1.5">
                {c.bullets.map((b, j) => (
                  <li
                    key={j}
                    className="flex gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200"
                  >
                    <span aria-hidden className="mt-1 text-emerald-500">
                      ▸
                    </span>
                    <span className="flex-1">{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

function GroupSection({ group, idx }: { group: YojanaGroup; idx: number }) {
  return (
    <section
      id={`yojana-${group.id}`}
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/50 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 text-sm font-bold text-white shadow-sm">
          {idx + 1}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="text-lg font-extrabold leading-tight text-slate-900 dark:text-slate-100 sm:text-xl">
            {group.titleMr}
          </h4>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-emerald-700/80 dark:text-emerald-300/80">
            {group.titleEn}
          </p>
        </div>
      </div>
      <GroupItems items={group.items} />
    </section>
  );
}

export default function EconomicsYojanaNotes() {
  return (
    <article lang="mr" className="space-y-10">
      {/* Cover / Hero */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-8 text-white shadow-lg sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-100/90">
          Don&apos;t know Academy · Notes
        </p>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
          अर्थशास्त्र — महत्त्वाच्या योजना
        </h2>
        <p className="mt-2 text-base font-medium text-emerald-50 sm:text-lg">
          Indian Government Schemes — संदर्भ तक्ता आणि{" "}
          <strong>{YOJANA_TOTAL_MCQS} PYQ MCQ</strong> (उत्तरांसह)
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/20 backdrop-blur">
            📚 MPSC Group B · Group C · Rajyaseva · STI · ASO · UPSC
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/20 backdrop-blur">
            🏛️ {YOJANA_TOTAL_GROUPS} योजना गट
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/20 backdrop-blur">
            📊 आकडेवारी (Dec 2023)
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/20 backdrop-blur">
            ✅ {YOJANA_TOTAL_MCQS} MCQ
          </span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#yojana-reference"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            📖 योजना तक्ता
          </a>
          <a
            href="#yojana-stats"
            className="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/20"
          >
            📊 आकडेवारी
          </a>
          <a
            href="#yojana-mcqs"
            className="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/20"
          >
            📝 {YOJANA_TOTAL_MCQS} MCQ
          </a>
        </div>
      </section>

      {/* About */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          या नोट्सबद्दल
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <strong>अर्थशास्त्र विषयातील महत्त्वाच्या केंद्र-शासित योजना</strong>{" "}
          हा MPSC, UPSC, STI, ASO आणि कृषी सेवा प्रत्येक प्रिलिम्स आणि
          मुख्यमध्ये दरवर्षी <strong>2–4 प्रश्न</strong> देणारा
          high-yield घटक आहे. या नोट्समध्ये MGNREGA, DAY-NRLM, DAY-NULM, PMJDY,
          PM-Kisan, PMAY, Ayushman Bharat, PM-SVANidhi, PM Vishwakarma आणि
          अलीकडच्या Gati-Shakti, MISHTI, PM-SHRI सारख्या{" "}
          <strong>{YOJANA_TOTAL_GROUPS} योजना गट</strong> सुरुवात-वर्ष,
          उद्दिष्टे, अंमलबजावणी मंत्रालय आणि अद्ययावत आकडेवारीसह क्रमाने मांडले
          आहेत. शेवटी{" "}
          <strong>{YOJANA_TOTAL_MCQS} PYQ बहुपर्यायी प्रश्न</strong> ज्यांची
          उत्तरे हिरव्या रंगात दाखवली आहेत.
        </p>
      </section>

      {/* Quick nav */}
      <nav
        aria-label="योजना नेविगेशन"
        className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 dark:border-emerald-900/40 dark:bg-emerald-900/10"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
          Quick Jump · {YOJANA_TOTAL_GROUPS} Schemes
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {YOJANA_GROUPS.map((g, i) => (
            <a
              key={g.id}
              href={`#yojana-${g.id}`}
              className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-medium text-emerald-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-400 hover:text-emerald-900 dark:border-emerald-700/40 dark:bg-slate-800 dark:text-emerald-200 dark:hover:border-emerald-500"
            >
              <span className="mr-1 font-bold text-emerald-500">{i + 1}.</span>
              {g.titleEn}
            </a>
          ))}
        </div>
      </nav>

      {/* Reference - all groups */}
      <section id="yojana-reference" className="scroll-mt-24">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              विभाग १ · Reference
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-3xl">
              योजना तक्ता — {YOJANA_TOTAL_GROUPS} महत्त्वाच्या योजना
            </h3>
          </div>
          <span className="hidden shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 sm:inline-block">
            {YOJANA_TOTAL_GROUPS} schemes
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          प्रत्येक योजनेसाठी सुरुवात-वर्ष, उद्दिष्टे आणि उप-योजनांची माहिती.
          ऐतिहासिक उत्क्रांती (NREP → RLEGP → JRY → SGRY → MGNREGA अशी)
          टप्प्या-टप्प्याने स्पष्ट केलेली आहे.
        </p>

        <div className="mt-6 space-y-5">
          {YOJANA_GROUPS.map((g, i) => (
            <GroupSection key={g.id} group={g} idx={i} />
          ))}
        </div>
      </section>

      {/* Stats */}
      {YOJANA_STATS.length > 0 && (
        <section id="yojana-stats" className="scroll-mt-24">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                विभाग २ · Latest Figures
              </p>
              <h3 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-3xl">
                योजनासंबंधी महत्त्वाची आकडेवारी
              </h3>
              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                डिसेंबर 2023 पर्यंत · सरकारी सूत्रांवर आधारित
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {YOJANA_STATS.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50 to-emerald-50/50 p-4 shadow-sm dark:border-teal-900/40 dark:from-teal-900/20 dark:to-emerald-900/10"
              >
                <span
                  aria-hidden
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white"
                >
                  📊
                </span>
                <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-100">
                  {s}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MCQs */}
      <section id="yojana-mcqs" className="scroll-mt-24">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
              विभाग ३ · Practice
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-3xl">
              {YOJANA_TOTAL_MCQS} PYQ बहुपर्यायी प्रश्न (उत्तरांसह)
            </h3>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              MPSC राज्यसेवा · STI · PSI · ASO · वनसेवा · कृषी सेवा (2011–2023)
            </p>
          </div>
          <span className="hidden shrink-0 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 sm:inline-block">
            {YOJANA_TOTAL_MCQS} questions
          </span>
        </div>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          योग्य उत्तर हिरव्या रंगात आणि{" "}
          <span className="text-emerald-600">✓</span> चिन्हाने दाखवले आहे.
          प्रत्येक प्रश्नासोबत मूळ परीक्षेचा संदर्भ दिला आहे.
        </p>

        <div className="mt-6 space-y-3">
          {YOJANA_MCQS.map((m) => (
            <div
              key={m.n}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                  {m.n}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="whitespace-pre-line text-sm font-semibold leading-relaxed text-slate-900 dark:text-slate-100 sm:text-base">
                    {m.q}
                  </p>
                  {m.tag && (
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-violet-600/80 dark:text-violet-300/80">
                      📜 {m.tag}
                    </p>
                  )}
                </div>
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
      <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-900/80 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200/80">
        <p>
          <strong>Source:</strong> Government of India scheme guidelines (rural
          development, urban affairs, social-security, finance, fisheries,
          skill development), MPSC Rajyaseva &amp; STI/PSI/ASO PYQ archive
          (2011–2023) आणि सार्वजनिक सूत्रे. अद्ययावत केले: डिसेंबर 2023. या
          नोट्समध्ये कोणतीही चूक आढळल्यास{" "}
          <a className="underline" href="mailto:dontknowacademy@gmail.com">
            dontknowacademy@gmail.com
          </a>{" "}
          वर कळवा — 48 तासांत सुधारणा करू.
        </p>
      </section>
    </article>
  );
}
