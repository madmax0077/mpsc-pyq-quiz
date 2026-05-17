"use client";

/**
 * RiverTributaryQuiz — 100-question MCQ quiz about which river is a
 * tributary of which.
 *
 * Questions are generated deterministically (seeded RNG) from
 * lib/mapData/maharashtra.ts (parent links) + lib/mapData/riversMeta.ts
 * (origin / mouth metadata), then trimmed to exactly 100. The mix is:
 *   - "X is a tributary of which river?"
 *   - "Which of these IS a tributary of Y?"
 *   - "Which of these is NOT a tributary of Y?"
 *   - "Where does X originate?"
 *   - "Where does X meet its main river?"
 *
 * The quiz lives entirely inside this component — its own progress,
 * score and per-question feedback are kept in local state.
 */

import { useMemo, useState, useCallback } from "react";
import { RIVERS } from "@/lib/mapData/maharashtra";
import { RIVER_META, BASIN_COLOR, BASIN_LABEL, type Basin } from "@/lib/mapData/riversMeta";

interface Question {
  id: string;
  type: "tributaryOf" | "isTributaryOf" | "notTributaryOf" | "origin" | "mouth";
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
}

/* — Tiny seeded RNG (Mulberry32) so the quiz order is deterministic. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* — Build the full question bank. */
function buildQuestions(): Question[] {
  const rng = mulberry32(20260517); // fixed seed → stable order
  const out: Question[] = [];

  // Map: river id → display name
  const nameOf: Record<string, string> = {};
  for (const r of RIVERS) nameOf[r.id] = r.name;

  // Parent map: from RIVERS' explicit parent field …
  const parentOf: Record<string, string> = {};
  for (const r of RIVERS) if (r.parent) parentOf[r.id] = r.parent;

  // … plus a few conceptual additions that aren't in RIVERS as
  // explicit parents but are universally taught as tributaries:
  const conceptualParents: Array<[string, string, string]> = [
    // [tribId, parentId, displayName for the parent in MCQ]
    ["bhima", "krishna", "Krishna"],
    ["wainganga", "wardha", "Wardha"], // Wainganga + Wardha → Pranhita → Godavari
    ["painganga", "wardha", "Wardha"], // Painganga joins Wardha at Wadhona
    ["kanhan", "wainganga", "Wainganga"], // already there as parent, double-safe
  ];
  for (const [trib, par] of conceptualParents) {
    if (!parentOf[trib]) parentOf[trib] = par;
  }

  // Inverse: parent → tributary list
  const tribsOf: Record<string, string[]> = {};
  for (const [trib, par] of Object.entries(parentOf)) {
    (tribsOf[par] ||= []).push(trib);
  }

  // All "main" river ids worth using as wrong-answer distractors
  // (every river that is itself a known main — i.e. someone's parent
  // OR has no parent of its own AND is in RIVER_META).
  const mainIds = new Set<string>();
  for (const par of Object.keys(tribsOf)) mainIds.add(par);
  for (const r of RIVERS) {
    if (!r.parent && RIVER_META[r.id]) mainIds.add(r.id);
  }
  // Friendly names for the main rivers (may differ slightly from data id)
  const mainList = Array.from(mainIds);

  /* — Helper: pick N distractors from `pool` excluding `exclude` */
  const pickDistractors = (pool: string[], excludeSet: Set<string>, n: number): string[] => {
    const cand = shuffle(pool.filter((p) => !excludeSet.has(p)), rng);
    return cand.slice(0, n);
  };

  /* ─── Type A: "X is a tributary of which river?" ─── */
  const aTribs = shuffle(Object.keys(parentOf), rng);
  for (const trib of aTribs) {
    const par = parentOf[trib];
    if (!par || !nameOf[trib]) continue;
    const parName = nameOf[par] || par;
    const distractors = pickDistractors(mainList, new Set([par, trib]), 3).map((id) => nameOf[id] || id);
    const options = shuffle([parName, ...distractors], rng);
    const answerIndex = options.indexOf(parName);
    if (answerIndex < 0) continue;
    out.push({
      id: `A-${trib}`,
      type: "tributaryOf",
      prompt: `The ${nameOf[trib]} river is a tributary of which river?`,
      options,
      answerIndex,
      explanation: RIVER_META[trib]?.mouth
        ? `${nameOf[trib]} joins the ${parName} — ${RIVER_META[trib]?.mouth}.`
        : `${nameOf[trib]} is a tributary of the ${parName}.`,
    });
  }

  /* ─── Type B: "Which of these IS a tributary of Y?" ─── */
  const bParents = shuffle(Object.keys(tribsOf).filter((p) => tribsOf[p].length >= 2), rng);
  for (const par of bParents) {
    const tribs = shuffle(tribsOf[par], rng);
    const parName = nameOf[par] || par;
    // Produce up to 2 questions per parent for variety
    const wanted = Math.min(2, tribs.length);
    for (let i = 0; i < wanted; i++) {
      const correct = tribs[i];
      // Distractors: rivers that are NOT tributaries of par
      const allOtherRiverIds = RIVERS.filter((r) => !tribsOf[par].includes(r.id) && r.id !== par && r.id !== correct).map((r) => r.id);
      const wrongs = pickDistractors(allOtherRiverIds, new Set(), 3).map((id) => nameOf[id] || id);
      if (wrongs.length < 3) continue;
      const correctName = nameOf[correct] || correct;
      const options = shuffle([correctName, ...wrongs], rng);
      const answerIndex = options.indexOf(correctName);
      out.push({
        id: `B-${par}-${i}`,
        type: "isTributaryOf",
        prompt: `Which of the following is a tributary of the ${parName}?`,
        options,
        answerIndex,
        explanation: `${correctName} is a tributary of the ${parName}.`,
      });
    }
  }

  /* ─── Type C: "Which of these is NOT a tributary of Y?" ─── */
  const cParents = shuffle(Object.keys(tribsOf).filter((p) => tribsOf[p].length >= 3), rng);
  for (const par of cParents) {
    const parName = nameOf[par] || par;
    const tribs = shuffle(tribsOf[par], rng);
    // Pick 3 real tributaries + 1 NON-tributary as the answer
    const correctTribs = tribs.slice(0, 3).map((id) => nameOf[id] || id);
    const nonTribPool = RIVERS.filter((r) => !tribsOf[par].includes(r.id) && r.id !== par).map((r) => r.id);
    const wrong = pickDistractors(nonTribPool, new Set(), 1)[0];
    if (!wrong) continue;
    const wrongName = nameOf[wrong] || wrong;
    const options = shuffle([...correctTribs, wrongName], rng);
    const answerIndex = options.indexOf(wrongName);
    out.push({
      id: `C-${par}`,
      type: "notTributaryOf",
      prompt: `Which of the following is NOT a tributary of the ${parName}?`,
      options,
      answerIndex,
      explanation: `${wrongName} is not a tributary of the ${parName}. The other three are.`,
    });
  }

  /* ─── Type D: "Where does X originate?" ─── */
  const originRivers = shuffle(
    RIVERS.filter((r) => RIVER_META[r.id]?.origin),
    rng,
  );
  for (const r of originRivers) {
    const correct = RIVER_META[r.id]!.origin!;
    const otherOrigins = Array.from(
      new Set(
        RIVERS
          .filter((x) => x.id !== r.id && RIVER_META[x.id]?.origin && RIVER_META[x.id]!.origin !== correct)
          .map((x) => RIVER_META[x.id]!.origin!),
      ),
    );
    if (otherOrigins.length < 3) continue;
    const wrongs = shuffle(otherOrigins, rng).slice(0, 3);
    const options = shuffle([correct, ...wrongs], rng);
    const answerIndex = options.indexOf(correct);
    out.push({
      id: `D-${r.id}`,
      type: "origin",
      prompt: `Where does the ${r.name} river originate?`,
      options,
      answerIndex,
      explanation: `${r.name} originates at ${correct}.`,
    });
  }

  /* ─── Type E: "Where does X meet its main river?" ─── */
  const mouthRivers = shuffle(
    RIVERS.filter((r) => r.parent && RIVER_META[r.id]?.mouth),
    rng,
  );
  for (const r of mouthRivers) {
    const correct = RIVER_META[r.id]!.mouth!;
    const otherMouths = Array.from(
      new Set(
        RIVERS
          .filter((x) => x.id !== r.id && RIVER_META[x.id]?.mouth && RIVER_META[x.id]!.mouth !== correct)
          .map((x) => RIVER_META[x.id]!.mouth!),
      ),
    );
    if (otherMouths.length < 3) continue;
    const wrongs = shuffle(otherMouths, rng).slice(0, 3);
    const options = shuffle([correct, ...wrongs], rng);
    const answerIndex = options.indexOf(correct);
    out.push({
      id: `E-${r.id}`,
      type: "mouth",
      prompt: `Where does the ${r.name} meet its main river?`,
      options,
      answerIndex,
      explanation: `${r.name}: ${correct}`,
    });
  }

  // Deterministic final shuffle, then take exactly 100 questions.
  const final = shuffle(out, rng).slice(0, 100);
  return final;
}

/* ──────────────────────────────────────────────────────────────────── */
/*  UI                                                                  */
/* ──────────────────────────────────────────────────────────────────── */

function basinForRiver(name: string): Basin | null {
  const r = RIVERS.find((x) => x.name === name);
  if (!r) return null;
  return RIVER_META[r.id]?.basin ?? null;
}

interface SavedAnswer {
  questionId: string;
  pickedIndex: number;
  correct: boolean;
}

export default function RiverTributaryQuiz() {
  const questions = useMemo(() => buildQuestions(), []);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<SavedAnswer[]>([]);
  const [done, setDone] = useState(false);

  const q = questions[idx];

  const score = useMemo(() => answers.filter((a) => a.correct).length, [answers]);

  const submit = useCallback(() => {
    if (picked === null || !q) return;
    const correct = picked === q.answerIndex;
    setAnswers((prev) => {
      const next = prev.filter((a) => a.questionId !== q.id);
      next.push({ questionId: q.id, pickedIndex: picked, correct });
      return next;
    });
  }, [picked, q]);

  const next = useCallback(() => {
    if (idx + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setIdx(idx + 1);
    setPicked(null);
  }, [idx, questions.length]);

  const restart = useCallback(() => {
    setIdx(0);
    setPicked(null);
    setAnswers([]);
    setDone(false);
  }, []);

  if (!q) return null;

  const submitted = answers.some((a) => a.questionId === q.id);
  const lastAnswer = answers.find((a) => a.questionId === q.id);
  const showCorrect = submitted && lastAnswer?.correct === true;
  const showWrong = submitted && lastAnswer?.correct === false;

  /* ───── Done screen ───── */
  if (done) {
    const correctCount = score;
    const total = questions.length;
    const pct = Math.round((correctCount / total) * 100);
    const verdict =
      pct >= 90 ? "🏆 Brilliant — river-master level!" :
      pct >= 75 ? "🥈 Strong grasp of Maharashtra rivers." :
      pct >= 60 ? "📘 Solid base — revise the misses and you're set." :
      pct >= 40 ? "🌊 Time to study the basin maps again." :
                  "🪨 Hit the geography notes hard, then come back.";
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="text-5xl font-black text-teal-600 dark:text-teal-300">{correctCount} / {total}</div>
          <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{verdict}</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
            {pct}% correct
          </div>
        </div>

        <div className="mt-6 max-h-96 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-900/40">
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {questions.map((qq, i) => {
              const a = answers.find((x) => x.questionId === qq.id);
              const ok = a?.correct;
              return (
                <li key={qq.id} className="flex items-start gap-3 p-3 text-xs">
                  <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-bold text-white ${ok ? "bg-emerald-500" : "bg-rose-500"}`}>
                    {ok ? "✓" : "✗"}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">Q{i + 1}. {qq.prompt}</p>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300">Correct:</span> {qq.options[qq.answerIndex]}
                      {!ok && a && (
                        <>
                          <span className="mx-1 text-slate-300">·</span>
                          <span className="font-semibold text-rose-700 dark:text-rose-300">You:</span> {qq.options[a.pickedIndex]}
                        </>
                      )}
                    </p>
                    {qq.explanation && (
                      <p className="mt-0.5 text-[11px] italic text-slate-500 dark:text-slate-400">{qq.explanation}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={restart}
            className="rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-2 text-sm font-bold text-white shadow-md transition hover:shadow-lg"
          >
            Restart the quiz
          </button>
        </div>
      </div>
    );
  }

  const correctName = q.options[q.answerIndex];
  const correctBasin = basinForRiver(correctName);
  const accent = correctBasin ? BASIN_COLOR[correctBasin] : "#0d9488";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-7">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
            Q {idx + 1} / {questions.length}
          </span>
          <span className="hidden text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:inline">
            {q.type === "tributaryOf" && "Tributary → Main"}
            {q.type === "isTributaryOf" && "Pick a tributary"}
            {q.type === "notTributaryOf" && "Spot the non-tributary"}
            {q.type === "origin" && "River origin"}
            {q.type === "mouth" && "Confluence point"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            ✓ {score}
          </span>
          <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
            ✗ {answers.length - score}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${((idx + (submitted ? 1 : 0)) / questions.length) * 100}%`, background: accent }}
        />
      </div>

      {/* Question */}
      <h3 className="text-base font-semibold leading-relaxed text-slate-900 dark:text-slate-50 sm:text-lg">
        {q.prompt}
      </h3>

      {/* Options */}
      <div className="mt-4 grid gap-2.5">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.answerIndex;
          const isPicked = picked === i;
          let cls = "border-slate-200 bg-white text-slate-800 hover:border-teal-300 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-teal-700 dark:hover:bg-teal-900/30";
          if (submitted) {
            if (isCorrect) cls = "border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100";
            else if (isPicked) cls = "border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-100";
            else cls = "border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400";
          } else if (isPicked) {
            cls = "border-teal-500 bg-teal-50 text-teal-900 ring-2 ring-teal-200 dark:border-teal-500 dark:bg-teal-900/30 dark:text-teal-100 dark:ring-teal-800";
          }
          return (
            <button
              key={opt + i}
              onClick={() => !submitted && setPicked(i)}
              disabled={submitted}
              className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${cls}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
              {submitted && isCorrect && <span className="text-emerald-600 dark:text-emerald-300">✓</span>}
              {submitted && isPicked && !isCorrect && <span className="text-rose-600 dark:text-rose-300">✗</span>}
            </button>
          );
        })}
      </div>

      {/* Feedback + actions */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-h-[28px] text-sm">
          {showCorrect && (
            <p className="font-semibold text-emerald-700 dark:text-emerald-300">
              ✓ Correct!{q.explanation ? ` ${q.explanation}` : ""}
            </p>
          )}
          {showWrong && (
            <p className="font-semibold text-rose-700 dark:text-rose-300">
              ✗ Not quite. Answer: <span className="underline">{q.options[q.answerIndex]}</span>
              {q.explanation ? `. ${q.explanation}` : ""}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!submitted ? (
            <button
              onClick={submit}
              disabled={picked === null}
              className="rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-2 text-sm font-bold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              Check answer
            </button>
          ) : (
            <button
              onClick={next}
              className="rounded-full bg-gradient-to-r from-slate-700 to-slate-900 px-5 py-2 text-sm font-bold text-white shadow-md transition hover:shadow-lg dark:from-slate-200 dark:to-slate-50 dark:text-slate-900"
            >
              {idx + 1 >= questions.length ? "See results →" : "Next question →"}
            </button>
          )}
        </div>
      </div>

      {/* Tiny legend (basin colour of correct answer) */}
      {correctBasin && submitted && (
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: accent }} />
          {BASIN_LABEL[correctBasin]}
        </div>
      )}
    </div>
  );
}
