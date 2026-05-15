"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CENSUS_DISTRICTS,
  FACTS,
  HIGHLIGHTS,
  METRIC_ICON,
  METRIC_LABEL,
  METRIC_UNIT,
  STATE_TOTALS,
  formatMetric,
  sortByMetric,
  type CensusDistrict,
  type FactCard,
  type Metric,
} from "@/lib/censusData";

type Mode = "reveal" | "rank" | "quiz" | "flash";

const MODES: { id: Mode; label: string; icon: string; tag: string; tag2: string }[] = [
  { id: "reveal", label: "Reveal",     icon: "🏆", tag: "Top 10 / Bottom 10", tag2: "Browse rankings" },
  { id: "rank",   label: "Rank Race",  icon: "🎯", tag: "Order 5 districts",  tag2: "Beat the clock" },
  { id: "quiz",   label: "MCQ Quiz",   icon: "❓", tag: "10 questions",       tag2: "Auto-scored" },
  { id: "flash",  label: "Flashcards", icon: "🧠", tag: "20 key facts",       tag2: "Tap to flip" },
];

const METRICS: Metric[] = ["population", "growth", "sexRatio", "literacy", "density"];

export default function CensusGameClient() {
  const [mode, setMode] = useState<Mode>("reveal");

  return (
    <div className="space-y-5">
      <StateBanner />

      {/* Mode picker */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {MODES.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={
                "group relative overflow-hidden rounded-2xl border p-3 text-left transition-all sm:p-4 " +
                (active
                  ? "border-indigo-400 bg-gradient-to-br from-indigo-50 via-white to-purple-50 shadow-lg shadow-indigo-100 dark:border-indigo-500 dark:from-indigo-950/60 dark:via-slate-900 dark:to-purple-950/60 dark:shadow-black/40"
                  : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-600")
              }
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{m.icon}</span>
                <span className={"font-bold " + (active ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-200")}>
                  {m.label}
                </span>
              </div>
              <div className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {m.tag}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500">{m.tag2}</div>
            </button>
          );
        })}
      </div>

      {/* Active mode body */}
      {mode === "reveal" && <RevealMode />}
      {mode === "rank"   && <RankRaceMode />}
      {mode === "quiz"   && <QuizMode />}
      {mode === "flash"  && <FlashMode />}
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Shared widgets                                                            */
/* ------------------------------------------------------------------------- */

function StateBanner() {
  return (
    <section className="overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-4 shadow-sm ring-1 ring-slate-900/5 dark:border-indigo-900 dark:from-indigo-950/40 dark:via-slate-900 dark:to-emerald-950/40 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white sm:text-xl">Maharashtra · Census 2011 — at a glance</h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            All 35 districts. Palghar was carved out of Thane in <strong>2014</strong>, so Thane&apos;s number below includes it.
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
          ● 2nd in India after UP
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatCell icon="👥" label="Population" value={`${(STATE_TOTALS.population / 1e7).toFixed(2)} cr`} />
        <StatCell icon="📈" label="Decadal growth" value={`${STATE_TOTALS.decadalGrowth}%`} />
        <StatCell icon="🏙️" label="Density" value={`${STATE_TOTALS.density}/km²`} />
        <StatCell icon="⚖️" label="Sex ratio" value={`${STATE_TOTALS.sexRatio}`} />
        <StatCell icon="📚" label="Literacy" value={`${STATE_TOTALS.literacy}%`} />
        <StatCell icon="👨" label="Male literacy" value={`${STATE_TOTALS.maleLiteracy}%`} />
        <StatCell icon="👩" label="Female literacy" value={`${STATE_TOTALS.femaleLiteracy}%`} />
        <StatCell icon="🏘️" label="Urban %" value={`${STATE_TOTALS.urbanPercent}%`} />
      </div>
    </section>
  );
}

function StatCell({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/80 px-3 py-2 ring-1 ring-slate-200/70 dark:bg-slate-800/70 dark:ring-slate-700">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="mt-0.5 text-sm font-black text-slate-800 dark:text-slate-100 sm:text-base">{value}</div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Mode 1 — REVEAL (top 10 / bottom 10 / all 35 by metric)                   */
/* ------------------------------------------------------------------------- */

function RevealMode() {
  const [metric, setMetric] = useState<Metric>("population");
  const [view, setView] = useState<"top" | "bottom" | "all">("top");

  const list = useMemo(() => {
    if (view === "top")    return HIGHLIGHTS[metric].top;
    if (view === "bottom") return HIGHLIGHTS[metric].bottom;
    return sortByMetric(metric, "desc");
  }, [metric, view]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
      {/* Metric pills */}
      <div className="flex flex-wrap gap-2">
        {METRICS.map((m) => {
          const active = m === metric;
          return (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition " +
                (active
                  ? "border-indigo-400 bg-indigo-500 text-white shadow"
                  : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300")
              }
            >
              <span className="mr-1">{METRIC_ICON[m]}</span>
              {METRIC_LABEL[m]}
            </button>
          );
        })}
      </div>

      {/* View segmented control */}
      <div className="mt-4 inline-flex rounded-xl bg-slate-100 p-1 text-xs font-bold dark:bg-slate-700">
        {(["top", "bottom", "all"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={
              "rounded-lg px-3 py-1.5 transition " +
              (view === v
                ? "bg-white text-indigo-700 shadow dark:bg-slate-900 dark:text-indigo-300"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200")
            }
          >
            {v === "top" ? "🔝 Top 10" : v === "bottom" ? "🔻 Bottom 10" : "📋 All 35"}
          </button>
        ))}
      </div>

      {/* Ranked list */}
      <ol className="mt-4 space-y-1.5">
        {list.map((d, idx) => {
          const displayRank =
            view === "top"
              ? idx + 1
              : view === "bottom"
                ? 35 - idx
                : sortByMetric(metric, "desc").findIndex((x) => x.name === d.name) + 1;
          return <RankRow key={d.name} d={d} displayRank={displayRank} metric={metric} view={view} />;
        })}
      </ol>

      {/* Memorable callout */}
      <Callout metric={metric} view={view} />
    </section>
  );
}

function RankRow({
  d,
  displayRank,
  metric,
  view,
}: {
  d: CensusDistrict;
  displayRank: number;
  metric: Metric;
  view: "top" | "bottom" | "all";
}) {
  const badge =
    view === "top" && displayRank <= 3
      ? "bg-amber-500 text-white shadow"
      : view === "bottom" && displayRank >= 33
        ? "bg-rose-500 text-white shadow"
        : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200";
  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2 transition hover:bg-white dark:border-slate-700/60 dark:bg-slate-700/40 dark:hover:bg-slate-700/60">
      <span className={"flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black " + badge}>
        {displayRank}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
        {d.name}
        <span className="ml-2 hidden text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:inline">{d.region}</span>
      </span>
      <span className="shrink-0 text-right">
        <span className="block text-sm font-bold text-indigo-700 dark:text-indigo-300">{formatMetric(d, metric)}</span>
        <span className="block text-[10px] text-slate-400">{METRIC_LABEL[metric]}{METRIC_UNIT[metric] ? "" : ""}</span>
      </span>
    </li>
  );
}

function Callout({ metric, view }: { metric: Metric; view: "top" | "bottom" | "all" }) {
  // Hand-picked callouts per (metric, view)
  const text = (() => {
    if (metric === "population" && view === "top")
      return "👉 Top 3 alone account for nearly 27% of Maharashtra's population. Thane is so big that even after Palghar split off in 2014, it remained the No. 1 district.";
    if (metric === "population" && view === "bottom")
      return "👉 Sindhudurg is the smallest by population. The bottom 10 are mostly Vidarbha (Gondia, Wardha, Bhandara, Washim, Gadchiroli) + 3 Konkan/north districts.";
    if (metric === "growth" && view === "top")
      return "👉 Thane (+36.01%) led the decade by huge migration. Aurangabad (+27.76%) & Nandurbar (+25.66%) round out the top three.";
    if (metric === "growth" && view === "bottom")
      return "👉 Three districts saw NEGATIVE growth (2001–2011): Mumbai City (−7.57%), Ratnagiri (−4.82%), Sindhudurg (−2.21%). Out-migration!";
    if (metric === "sexRatio" && view === "top")
      return "👉 Konkan dominates: Ratnagiri (1122), Sindhudurg (1036) — the only two districts with sex ratio > 1000.";
    if (metric === "sexRatio" && view === "bottom")
      return "👉 Mumbai City (832), Mumbai Suburban (860), Thane (886) — urban + male-migration belt has the worst sex ratios.";
    if (metric === "literacy" && view === "top")
      return "👉 Mumbai Suburban (89.91%) tops the list. Nagpur, Akola, Amravati show Vidarbha's strong literacy belt.";
    if (metric === "literacy" && view === "bottom")
      return "👉 Nandurbar (64.38%) — lowest literacy in the state. Jalna, Dhule, Parbhani, Gadchiroli follow.";
    if (metric === "density" && view === "top")
      return "👉 Mumbai Suburban (20,980) & Mumbai City (19,652) are among the densest districts in the WORLD, not just India.";
    if (metric === "density" && view === "bottom")
      return "👉 Gadchiroli (74/km²) — least dense district in Maharashtra by a wide margin. Forests & tribal belt.";
    return null;
  })();
  if (!text) return null;
  return (
    <div className="mt-5 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-500 dark:bg-amber-950/40 dark:text-amber-200">
      {text}
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Mode 2 — RANK RACE                                                        */
/* ------------------------------------------------------------------------- */

function RankRaceMode() {
  const [metric, setMetric] = useState<Metric>("population");
  const [round, setRound] = useState(0); // bumps to generate a new round
  const [picks, setPicks] = useState<string[]>([]); // ordered selections
  const [finished, setFinished] = useState(false);

  // Random 5 districts for this round
  const slate = useMemo(() => {
    const arr = [...CENSUS_DISTRICTS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, metric]);

  const correctOrder = useMemo(
    () => [...slate].sort((a, b) => b[metric] - a[metric]),
    [slate, metric],
  );

  const newRound = useCallback(() => {
    setRound((r) => r + 1);
    setPicks([]);
    setFinished(false);
  }, []);

  // When all 5 picked, finish
  useEffect(() => {
    if (picks.length === 5) setFinished(true);
  }, [picks]);

  const score = useMemo(() => {
    if (!finished) return 0;
    let s = 0;
    for (let i = 0; i < 5; i++) if (picks[i] === correctOrder[i].name) s++;
    return s;
  }, [picks, correctOrder, finished]);

  const togglePick = (name: string) => {
    if (finished) return;
    if (picks.includes(name)) {
      setPicks(picks.filter((p) => p !== name));
    } else {
      setPicks([...picks, name]);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 sm:text-lg">
            🎯 Order these 5 districts — <span className="text-indigo-700 dark:text-indigo-300">highest to lowest {METRIC_LABEL[metric]}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Tap a district to add it to your ranking. Tap again to remove.</p>
        </div>
        <button
          onClick={newRound}
          className="rounded-full bg-indigo-500 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-indigo-600"
        >
          🔄 New round
        </button>
      </div>

      {/* Metric picker */}
      <div className="mt-3 flex flex-wrap gap-2">
        {METRICS.map((m) => (
          <button
            key={m}
            onClick={() => {
              setMetric(m);
              setPicks([]);
              setFinished(false);
              setRound((r) => r + 1);
            }}
            className={
              "rounded-full border px-3 py-1 text-[11px] font-semibold transition " +
              (m === metric
                ? "border-indigo-400 bg-indigo-500 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300")
            }
          >
            {METRIC_ICON[m]} {METRIC_LABEL[m]}
          </button>
        ))}
      </div>

      {/* Player slots */}
      <div className="mt-4 grid grid-cols-5 gap-2">
        {Array.from({ length: 5 }).map((_, i) => {
          const picked = picks[i];
          const correctName = correctOrder[i]?.name;
          const isRight = finished && picked === correctName;
          return (
            <div
              key={i}
              className={
                "flex h-20 flex-col items-center justify-center rounded-xl border-2 border-dashed p-1 text-center text-[10px] sm:text-xs " +
                (!picked
                  ? "border-slate-300 bg-slate-50 text-slate-400 dark:border-slate-600 dark:bg-slate-700/50"
                  : finished
                    ? isRight
                      ? "border-emerald-400 bg-emerald-50 text-emerald-800 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200"
                      : "border-rose-400 bg-rose-50 text-rose-800 dark:border-rose-500 dark:bg-rose-950/40 dark:text-rose-200"
                    : "border-indigo-400 bg-indigo-50 text-indigo-800 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-200")
              }
            >
              <span className="text-[9px] font-bold uppercase opacity-70">#{i + 1}</span>
              <span className="px-1 font-bold leading-tight">{picked || "—"}</span>
              {finished && !isRight && (
                <span className="text-[9px] opacity-80">→ {correctName}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Choices */}
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {slate.map((d) => {
          const order = picks.indexOf(d.name);
          const isPicked = order !== -1;
          return (
            <button
              key={d.name}
              onClick={() => togglePick(d.name)}
              disabled={finished}
              className={
                "flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition " +
                (isPicked
                  ? "border-indigo-400 bg-indigo-100 font-bold text-indigo-800 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-200"
                  : finished
                    ? "border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-700/50"
                    : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200")
              }
            >
              <span className="flex items-center gap-2">
                {isPicked && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-black text-white">
                    {order + 1}
                  </span>
                )}
                <span>{d.name}</span>
              </span>
              {finished && (
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {formatMetric(d, metric)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {finished && (
        <div
          className={
            "mt-4 rounded-xl p-3 text-center text-sm font-bold " +
            (score === 5
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
              : score >= 3
                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
                : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200")
          }
        >
          {score === 5 ? "🏆 PERFECT! All 5 correct." : `Score ${score}/5 — try another round!`}
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------------- */
/* Mode 3 — QUIZ (10 random MCQs)                                            */
/* ------------------------------------------------------------------------- */

interface MCQ {
  q: string;
  options: string[];
  answer: string;
  note?: string;
}

function generateQuestions(): MCQ[] {
  const out: MCQ[] = [];
  const pool = [...CENSUS_DISTRICTS];

  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const pickThreeDistractors = (correct: string) =>
    shuffle(pool.filter((p) => p.name !== correct)).slice(0, 3).map((p) => p.name);

  const buildExtreme = (metric: Metric, dir: "max" | "min"): MCQ => {
    const sorted = sortByMetric(metric, dir === "max" ? "desc" : "asc");
    const correct = sorted[0];
    const opts = shuffle([correct.name, ...pickThreeDistractors(correct.name)]);
    const label = METRIC_LABEL[metric];
    return {
      q: `Which Maharashtra district has the ${dir === "max" ? "HIGHEST" : "LOWEST"} ${label} (Census 2011)?`,
      options: opts,
      answer: correct.name,
      note: `${correct.name}: ${formatMetric(correct, metric)}`,
    };
  };

  const buildRank = (): MCQ => {
    const rankPick = Math.floor(Math.random() * 10) + 1;
    const target = CENSUS_DISTRICTS.find((d) => d.rank === rankPick)!;
    const opts = shuffle([target.name, ...pickThreeDistractors(target.name)]);
    return {
      q: `Which district holds rank #${rankPick} by population in Maharashtra (Census 2011)?`,
      options: opts,
      answer: target.name,
      note: `${target.name} (${target.population.toLocaleString("en-IN")}) sits at rank ${rankPick}.`,
    };
  };

  const buildValue = (metric: Metric): MCQ => {
    const target = pool[Math.floor(Math.random() * pool.length)];
    const correct = formatMetric(target, metric);
    const distractorVals = shuffle(pool.filter((p) => p.name !== target.name))
      .slice(0, 3)
      .map((p) => formatMetric(p, metric));
    const opts = shuffle([correct, ...distractorVals]);
    return {
      q: `What is the ${METRIC_LABEL[metric]} of ${target.name} (Census 2011)?`,
      options: opts,
      answer: correct,
    };
  };

  // 5 extreme questions
  const metrics: Metric[] = ["population", "growth", "sexRatio", "literacy", "density"];
  const shuffledMetrics = shuffle(metrics);
  for (let i = 0; i < 3; i++) out.push(buildExtreme(shuffledMetrics[i], i % 2 === 0 ? "max" : "min"));
  // 2 rank questions
  out.push(buildRank());
  out.push(buildRank());
  // 5 value questions
  const valueMetrics = shuffle(metrics).slice(0, 5);
  valueMetrics.forEach((m) => out.push(buildValue(m)));

  return shuffle(out).slice(0, 10);
}

function QuizMode() {
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => generateQuestions(), [seed]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const restart = () => {
    setSeed((s) => s + 1);
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  const q = questions[idx];
  const isCorrect = picked === q.answer;

  const next = () => {
    if (picked === null) return;
    const nextIdx = idx + 1;
    if (nextIdx >= questions.length) {
      setDone(true);
    } else {
      setIdx(nextIdx);
      setPicked(null);
    }
  };

  if (done) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl text-white shadow-lg">
          {score >= 8 ? "🏆" : score >= 5 ? "👍" : "💪"}
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
          Score {score} / {questions.length}
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {score >= 8
            ? "Brilliant! You really know your Maharashtra Census."
            : score >= 5
              ? "Solid. Run the Reveal mode to plug a few gaps."
              : "Keep going — try Reveal mode first, then come back."}
        </p>
        <button
          onClick={restart}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-2 text-sm font-bold text-white shadow hover:bg-indigo-600"
        >
          🔄 Play again
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
        <span>Question {idx + 1} of {questions.length}</span>
        <span>Score {score}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
          style={{ width: `${(idx / questions.length) * 100}%` }}
        />
      </div>

      <p className="mt-4 text-base font-bold leading-snug text-slate-800 dark:text-slate-100 sm:text-lg">{q.q}</p>

      <div className="mt-3 grid gap-2">
        {q.options.map((opt) => {
          const chosen = picked === opt;
          const correct = q.answer === opt;
          let cls =
            "rounded-xl border px-4 py-3 text-left text-sm font-semibold transition border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200";
          if (picked !== null) {
            if (correct) cls = "rounded-xl border px-4 py-3 text-left text-sm font-bold border-emerald-400 bg-emerald-50 text-emerald-800 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200";
            else if (chosen) cls = "rounded-xl border px-4 py-3 text-left text-sm font-bold border-rose-400 bg-rose-50 text-rose-800 dark:border-rose-500 dark:bg-rose-950/40 dark:text-rose-200";
            else cls = "rounded-xl border px-4 py-3 text-left text-sm font-semibold border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-700/40";
          }
          return (
            <button
              key={opt}
              onClick={() => {
                if (picked !== null) return;
                setPicked(opt);
                if (opt === q.answer) setScore((s) => s + 1);
              }}
              className={cls}
              disabled={picked !== null}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div
          className={
            "mt-3 rounded-xl p-3 text-xs " +
            (isCorrect
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
              : "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200")
          }
        >
          <strong>{isCorrect ? "✓ Correct." : `✗ Correct answer: ${q.answer}.`}</strong>
          {q.note && <span className="ml-1">{q.note}</span>}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button
          onClick={next}
          disabled={picked === null}
          className={
            "rounded-full px-5 py-2 text-sm font-bold transition " +
            (picked === null
              ? "bg-slate-200 text-slate-400 dark:bg-slate-700"
              : "bg-indigo-500 text-white shadow hover:bg-indigo-600")
          }
        >
          {idx + 1 === questions.length ? "Finish →" : "Next →"}
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- */
/* Mode 4 — FLASHCARDS                                                       */
/* ------------------------------------------------------------------------- */

function FlashMode() {
  const [order, setOrder] = useState<FactCard[]>(() => shuffle([...FACTS]));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = order[idx];

  const advance = (gotIt: boolean) => {
    setFlipped(false);
    const nextIdx = idx + 1;
    if (nextIdx >= order.length) {
      // shuffle & restart at end
      setOrder(shuffle([...order]));
      setIdx(0);
    } else {
      setIdx(nextIdx);
    }
    // gotIt currently just controls UI feedback; could later move "Review" cards to a stack.
    void gotIt;
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
        <span>Card {idx + 1} of {order.length}</span>
        <span>{card.tag}</span>
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className={
          "relative mt-3 flex h-56 w-full items-center justify-center rounded-3xl border-2 px-5 text-center font-bold leading-snug transition-all duration-300 sm:h-64 " +
          (flipped
            ? "border-emerald-400 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 text-emerald-900 dark:border-emerald-500 dark:from-emerald-950/50 dark:via-slate-900 dark:to-cyan-950/50 dark:text-emerald-100"
            : "border-indigo-400 bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-indigo-900 dark:border-indigo-500 dark:from-indigo-950/50 dark:via-slate-900 dark:to-purple-950/50 dark:text-indigo-100")
        }
      >
        <span className="absolute right-3 top-2 text-[10px] font-semibold uppercase tracking-wider opacity-60">
          {flipped ? "Answer" : "Tap to flip"}
        </span>
        <span className="text-base sm:text-xl">{flipped ? card.a : card.q}</span>
      </button>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => advance(false)}
          className="rounded-full bg-rose-100 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:bg-rose-900/50"
        >
          🔁 Review again
        </button>
        <button
          onClick={() => advance(true)}
          className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:hover:bg-emerald-900/50"
        >
          ✅ Got it
        </button>
        <button
          onClick={() => {
            setOrder(shuffle([...FACTS]));
            setIdx(0);
            setFlipped(false);
          }}
          className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
        >
          🔀 Shuffle deck
        </button>
      </div>
    </section>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
