"use client";

/**
 * RiverTributaryQuiz — MPSC PYQ quiz on Maharashtra rivers.
 *
 * Every question is a real Previous-Year Question from an MPSC paper
 * (2010 – 2025), hand-curated from /public/*.json. Each one carries an
 * exam tag like "MPSC PSI Pre 2010" so candidates can see exactly where
 * the question came from.
 */

import { useMemo, useState, useCallback } from "react";
import { RIVER_PYQS, type RiverPyq } from "@/lib/mapData/riverPyqs";

type Letter = "A" | "B" | "C" | "D";

interface SavedAnswer {
  questionId: string;
  picked: Letter;
  correct: boolean;
}

const LETTERS: Letter[] = ["A", "B", "C", "D"];

/* Small colour scheme for the exam-year chips: keeps them visually
 * distinct without overwhelming the question itself. */
function chipColor(year: number): string {
  const palette = [
    "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-200",
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
    "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200",
    "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  ];
  return palette[year % palette.length];
}

export default function RiverTributaryQuiz() {
  /* The PYQs are sorted by year ascending then by exam — so a learner
   * naturally progresses from oldest to newest. */
  const questions = useMemo<RiverPyq[]>(() => {
    return RIVER_PYQS.slice().sort((a, b) =>
      a.year !== b.year ? a.year - b.year : a.exam.localeCompare(b.exam),
    );
  }, []);

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Letter | null>(null);
  const [answers, setAnswers] = useState<SavedAnswer[]>([]);
  const [done, setDone] = useState(false);

  const q = questions[idx];
  const score = useMemo(() => answers.filter((a) => a.correct).length, [answers]);

  const submit = useCallback(() => {
    if (!picked || !q) return;
    const correct = picked === q.answer;
    setAnswers((prev) => {
      const next = prev.filter((a) => a.questionId !== q.id);
      next.push({ questionId: q.id, picked, correct });
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
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${chipColor(qq.year)}`}>{qq.exam}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{qq.topic}</span>
                    </div>
                    <p className="mt-1 whitespace-pre-line font-semibold text-slate-800 dark:text-slate-100">
                      Q{i + 1}. {qq.text}
                    </p>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300">Correct:</span> {qq.answer}. {qq.options[qq.answer]}
                      {!ok && a && (
                        <>
                          <span className="mx-1 text-slate-300">·</span>
                          <span className="font-semibold text-rose-700 dark:text-rose-300">You:</span> {a.picked}. {qq.options[a.picked]}
                        </>
                      )}
                    </p>
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

  /* ───── Question screen ───── */

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-7">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
            Q {idx + 1} / {questions.length}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${chipColor(q.year)}`}>{q.exam}</span>
          <span className="hidden text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:inline">
            {q.topic}
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
          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all"
          style={{ width: `${((idx + (submitted ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <h3 className="whitespace-pre-line text-base font-semibold leading-relaxed text-slate-900 dark:text-slate-50 sm:text-lg">
        {q.text}
      </h3>

      {/* Options */}
      <div className="mt-4 grid gap-2.5">
        {LETTERS.map((L) => {
          const isCorrect = L === q.answer;
          const isPicked = picked === L;
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
              key={L}
              onClick={() => !submitted && setPicked(L)}
              disabled={submitted}
              className={`group flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${cls}`}
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">
                {L}
              </span>
              <span className="flex-1 whitespace-pre-line">{q.options[L]}</span>
              {submitted && isCorrect && <span className="mt-1 text-emerald-600 dark:text-emerald-300">✓</span>}
              {submitted && isPicked && !isCorrect && <span className="mt-1 text-rose-600 dark:text-rose-300">✗</span>}
            </button>
          );
        })}
      </div>

      {/* Feedback + actions */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-h-[28px] text-sm">
          {showCorrect && (
            <p className="font-semibold text-emerald-700 dark:text-emerald-300">
              ✓ Correct! Answer: <span className="underline">{q.answer}. {q.options[q.answer]}</span>
            </p>
          )}
          {showWrong && (
            <p className="font-semibold text-rose-700 dark:text-rose-300">
              ✗ Not quite. Correct: <span className="underline">{q.answer}. {q.options[q.answer]}</span>
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
    </div>
  );
}
