"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { OptionKey, Quiz } from "@/lib/types";
import { normalizeQuiz } from "@/lib/questionUtils";
import { mergeBundledAndLocal } from "@/lib/quizCatalog";
import { getAllQuizzes } from "@/lib/storage";
import AdUnit from "@/components/AdUnit";
import {
  MOCK_CONFIGS,
  NEGATIVE_MARK,
  TOTAL_QUESTIONS,
  buildMockTest,
  scoreMock,
  type MockConfig,
  type MockQuestion,
  type MockScore,
  type MockText,
} from "@/lib/mockTest";

type Stage = "select" | "running" | "reveal" | "result";

/**
 * Two display ad units shown on the interstitial before results.
 * Replace these with the real data-ad-slot IDs from
 * AdSense → Ads → By ad unit → Display ads.
 */
const RESULT_AD_SLOTS = ["5827404689", "2086515932"] as const;

/** Seconds the user waits on the ad interstitial before results unlock. */
const REVEAL_SECONDS = 5;

interface MockTestViewProps {
  onExit: () => void;
}

const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];

function formatTime(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** One language block: heading tag, question text, and its four options. */
function LanguageBlock({
  tag,
  content,
  selected,
  correctAnswer,
  showResult,
  onSelect,
}: {
  tag: string;
  content: MockText;
  selected: OptionKey | undefined;
  correctAnswer: OptionKey;
  showResult: boolean;
  onSelect?: (k: OptionKey) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-700 dark:text-slate-300">
          {tag}
        </span>
      </div>
      <p className="text-[15px] font-semibold leading-7 text-slate-900 dark:text-slate-100">{content.text}</p>
      <div className="mt-3 grid gap-2">
        {OPTION_KEYS.map((k) => {
          const isSelected = selected === k;
          let cls: string;
          if (showResult) {
            const isCorrect = k === correctAnswer;
            const isUserWrong = selected === k && !isCorrect;
            cls = isCorrect
              ? "border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200"
              : isUserWrong
                ? "border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-600 dark:bg-rose-900/30 dark:text-rose-200"
                : "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300";
          } else {
            cls = isSelected
              ? "border-indigo-400 bg-indigo-50 text-indigo-900 dark:border-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-200"
              : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/40 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:border-indigo-700";
          }
          return (
            <button
              key={k}
              onClick={() => onSelect?.(k)}
              disabled={showResult}
              className={"flex items-start gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-colors " + cls + (showResult ? " cursor-default" : "")}
            >
              <span
                className={
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold " +
                  (isSelected && !showResult
                    ? "bg-indigo-600 text-white"
                    : showResult && k === correctAnswer
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300")
                }
              >
                {k}
              </span>
              <span className="leading-6">{content.options[k]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function MockTestView({ onExit }: MockTestViewProps) {
  const [stage, setStage] = useState<Stage>("select");
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [config, setConfig] = useState<MockConfig | null>(null);
  const [test, setTest] = useState<MockQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, OptionKey>>({});
  const [current, setCurrent] = useState(1);
  const [remaining, setRemaining] = useState(0);
  const [result, setResult] = useState<MockScore | null>(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [revealLeft, setRevealLeft] = useState(REVEAL_SECONDS);
  const submittedRef = useRef(false);

  // Load the merged quiz catalog once.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/quizzes.json", { cache: "no-store" });
        const raw = (await res.json()) as Quiz[];
        const bundled = raw.map(normalizeQuiz);
        const merged = mergeBundledAndLocal(bundled, getAllQuizzes());
        if (alive) setQuizzes(merged);
      } catch {
        if (alive) setLoadError("Could not load the question bank. Please refresh and try again.");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const finishTest = useCallback((questions: MockQuestion[], ans: Record<number, OptionKey>) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setResult(scoreMock(questions, ans));
    setRevealLeft(REVEAL_SECONDS);
    setStage("reveal");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Countdown on the ad interstitial before the result unlocks.
  useEffect(() => {
    if (stage !== "reveal" || revealLeft <= 0) return;
    const id = setTimeout(() => setRevealLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [stage, revealLeft]);

  // Countdown timer while running.
  useEffect(() => {
    if (stage !== "running") return;
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          finishTest(test, answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [stage, test, answers, finishTest]);

  const startMock = (cfg: MockConfig) => {
    if (!quizzes) return;
    const { questions } = buildMockTest(quizzes, cfg);
    submittedRef.current = false;
    setConfig(cfg);
    setTest(questions);
    setAnswers({});
    setCurrent(1);
    setResult(null);
    setConfirmSubmit(false);
    setRemaining(cfg.durationMinutes * 60);
    setStage("running");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToSelect = () => {
    submittedRef.current = false;
    setStage("select");
    setConfig(null);
    setTest([]);
    setAnswers({});
    setResult(null);
    setConfirmSubmit(false);
  };

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  /* ----------------------------- SELECT STAGE ----------------------------- */
  if (stage === "select") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <button
          onClick={onExit}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to home
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-slate-100">
            Full-Length Mock Test
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            A {TOTAL_QUESTIONS}-question timed test built to mirror the real MPSC Set&nbsp;A pattern. Every
            question is shown in <strong>Marathi and English</strong>. Questions are drawn fresh each attempt
            from previous-year papers, with Current Affairs from the GK Marathon set. Negative marking of{" "}
            {NEGATIVE_MARK} is applied for each wrong answer.
          </p>
        </div>

        {loadError && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-300">
            {loadError}
          </div>
        )}

        <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Choose your mock:</p>
        <div className="space-y-4">
          {MOCK_CONFIGS.map((cfg) => (
            <div
              key={cfg.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{cfg.label}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{cfg.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                      {TOTAL_QUESTIONS} questions
                    </span>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                      {cfg.durationMinutes} min
                    </span>
                    <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                      −{NEGATIVE_MARK} per wrong
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => startMock(cfg)}
                  disabled={!quizzes}
                  className="shrink-0 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {quizzes ? "Start Test" : "Loading…"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ---------------------------- REVEAL STAGE ------------------------------ */
  if (stage === "reveal" && result && config) {
    const ready = revealLeft <= 0;
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-6 text-center shadow-sm dark:border-indigo-800 dark:from-indigo-950/40 dark:to-violet-950/40">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
            {config.label}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Your result is ready!
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {ready
              ? "Tap below to see your detailed scorecard."
              : `Preparing your scorecard… please wait ${revealLeft}s.`}
          </p>
        </div>

        <AdUnit slot={RESULT_AD_SLOTS[0]} className="mt-6" minHeight={250} />
        <AdUnit slot={RESULT_AD_SLOTS[1]} className="mt-6" minHeight={250} />

        {/* Clear separation from the ads to avoid accidental clicks (AdSense policy). */}
        <div className="mt-10 flex justify-center border-t border-slate-100 pt-8 dark:border-slate-800">
          <button
            onClick={() => {
              setStage("result");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={!ready}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {ready ? "View my result" : `View my result in ${revealLeft}s`}
          </button>
        </div>
      </div>
    );
  }

  /* ----------------------------- RESULT STAGE ----------------------------- */
  if (stage === "result" && result && config) {
    const pct = result.percent;
    const pctLabel = `${pct >= 0 ? "" : "−"}${Math.abs(pct).toFixed(1)}%`;
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-6 text-center shadow-sm dark:border-indigo-800 dark:from-indigo-950/40 dark:to-violet-950/40">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
            {config.label} — Result
          </p>
          <p className="mt-2 text-4xl font-black text-slate-900 dark:text-slate-100">
            {result.net.toFixed(2)}
            <span className="text-xl font-bold text-slate-400"> / {result.total}</span>
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Net marks after negative marking ({pctLabel})
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/70 p-3 dark:bg-slate-800/70">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{result.correct}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Correct</p>
            </div>
            <div className="rounded-xl bg-white/70 p-3 dark:bg-slate-800/70">
              <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{result.wrong}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Wrong</p>
            </div>
            <div className="rounded-xl bg-white/70 p-3 dark:bg-slate-800/70">
              <p className="text-2xl font-bold text-slate-500 dark:text-slate-300">{result.skipped}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Skipped</p>
            </div>
          </div>
        </div>

        {/* Subject-wise breakdown */}
        <section className="mt-6">
          <h3 className="mb-3 text-lg font-bold text-slate-800 dark:text-slate-100">Subject-wise performance</h3>
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-2">Subject</th>
                  <th className="px-3 py-2 text-center">Correct</th>
                  <th className="px-3 py-2 text-center">Wrong</th>
                  <th className="px-3 py-2 text-center">Skipped</th>
                  <th className="px-3 py-2 text-center">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {result.bySubject.map((s) => (
                  <tr key={s.category} className="bg-white dark:bg-slate-900/40">
                    <td className="px-4 py-2 font-medium text-slate-700 dark:text-slate-200">{s.category}</td>
                    <td className="px-3 py-2 text-center text-emerald-600 dark:text-emerald-400">{s.correct}</td>
                    <td className="px-3 py-2 text-center text-rose-600 dark:text-rose-400">{s.wrong}</td>
                    <td className="px-3 py-2 text-center text-slate-500">{s.skipped}</td>
                    <td className="px-3 py-2 text-center text-slate-500">{s.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Answer review */}
        <section className="mt-6">
          <h3 className="mb-3 text-lg font-bold text-slate-800 dark:text-slate-100">Review answers</h3>
          <div className="space-y-3">
            {test.map((q) => {
              const userAns = answers[q.key];
              const correct = userAns === q.correctAnswer;
              return (
                <div key={q.key} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      Q{q.key}
                    </span>
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                      {q.category}
                    </span>
                    {!userAns ? (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-700">Skipped</span>
                    ) : correct ? (
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Correct</span>
                    ) : (
                      <span className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">Wrong</span>
                    )}
                  </div>
                  <div className="space-y-4">
                    {q.marathi && (
                      <LanguageBlock tag="मराठी" content={q.marathi} selected={userAns} correctAnswer={q.correctAnswer} showResult />
                    )}
                    <div className={q.marathi ? "border-t border-dashed border-slate-200 pt-4 dark:border-slate-700" : ""}>
                      <LanguageBlock tag="English" content={q.english} selected={userAns} correctAnswer={q.correctAnswer} showResult />
                    </div>
                  </div>
                  {(q.marathi?.explanation || q.english.explanation) && (
                    <div className="mt-3 space-y-1 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
                      {q.marathi?.explanation && <p className="whitespace-pre-line">{q.marathi.explanation}</p>}
                      {q.english.explanation && <p className="whitespace-pre-line">{q.english.explanation}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={backToSelect} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
            Take another mock
          </button>
          <button onClick={onExit} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">
            Back to home
          </button>
        </div>
      </div>
    );
  }

  /* ----------------------------- RUNNING STAGE ---------------------------- */
  if (stage === "running" && config && test.length > 0) {
    const q = test[current - 1];
    const lowTime = remaining <= 300; // last 5 minutes
    const selectOption = (k: OptionKey) => setAnswers((prev) => ({ ...prev, [q.key]: k }));
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        {/* Sticky status bar */}
        <div className="sticky top-2 z-10 mb-5 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-2.5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/95">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{config.shortLabel}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Answered {answeredCount}/{test.length}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div
              className={
                "rounded-lg px-2 py-1 text-center font-mono text-sm font-bold tabular-nums " +
                (lowTime
                  ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                  : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300")
              }
              aria-live="polite"
            >
              {formatTime(remaining)}
            </div>
            <button
              onClick={() => setConfirmSubmit(true)}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Current question (bilingual) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-md bg-indigo-100 px-2.5 py-1 text-sm font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              Q{q.key}
            </span>
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
              {q.category}
            </span>
          </div>

          <div className="space-y-4">
            {q.marathi ? (
              <LanguageBlock tag="मराठी" content={q.marathi} selected={answers[q.key]} correctAnswer={q.correctAnswer} showResult={false} onSelect={selectOption} />
            ) : (
              <p className="text-xs italic text-slate-400 dark:text-slate-500">Current Affairs question — available in English only.</p>
            )}
            <div className={q.marathi ? "border-t border-dashed border-slate-200 pt-4 dark:border-slate-700" : ""}>
              <LanguageBlock tag="English" content={q.english} selected={answers[q.key]} correctAnswer={q.correctAnswer} showResult={false} onSelect={selectOption} />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setAnswers((prev) => { const n = { ...prev }; delete n[q.key]; return n; })}
              disabled={!answers[q.key]}
              className="text-xs font-semibold text-slate-500 hover:text-rose-600 disabled:opacity-40 dark:text-slate-400"
            >
              Clear response
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrent((c) => Math.max(1, c - 1))}
                disabled={current === 1}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40 dark:border-slate-600 dark:text-slate-200"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrent((c) => Math.min(test.length, c + 1))}
                disabled={current === test.length}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40 hover:bg-indigo-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Question palette */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Question palette</span>
            <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-emerald-500" /> Answered</span>
            <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-slate-200 dark:bg-slate-600" /> Not answered</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {test.map((item) => {
              const done = !!answers[item.key];
              const isCurrent = item.key === current;
              return (
                <button
                  key={item.key}
                  onClick={() => setCurrent(item.key)}
                  className={
                    "flex h-7 w-7 items-center justify-center rounded text-[11px] font-bold transition-colors " +
                    (isCurrent ? "ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-800 " : "") +
                    (done
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300")
                  }
                >
                  {item.key}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit confirmation */}
        {confirmSubmit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Submit the test?</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                You answered <strong>{answeredCount}</strong> of {test.length} questions.
                {test.length - answeredCount > 0 && (
                  <> {test.length - answeredCount} will be marked as skipped.</>
                )}
              </p>
              <div className="mt-5 flex justify-end gap-3">
                <button
                  onClick={() => setConfirmSubmit(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
                >
                  Keep solving
                </button>
                <button
                  onClick={() => { setConfirmSubmit(false); finishTest(test, answers); }}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Submit now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback (e.g. building) — should be brief.
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-500 dark:text-slate-400">
      Preparing your mock test…
    </div>
  );
}
