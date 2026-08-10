"use client";

import { useMemo, useState } from "react";
import {
  getSummary,
  getCategoryAccuracy,
  getScoreTimeline,
  getModeCounts,
  PRACTICE_MODES,
  PRACTICE_MODE_LABELS,
  type PracticeMode,
  type TimelinePoint,
} from "@/lib/analytics";
import { CATEGORIES } from "@/lib/types";

const CAT_COLORS: Record<string, string> = {
  "Indian Polity": "#3b82f6",
  History: "#f59e0b",
  Geography: "#10b981",
  Science: "#8b5cf6",
  "Current Affairs": "#ec4899",
  Economics: "#14b8a6",
  Aptitude: "#f97316",
  Environment: "#84cc16",
  Uncategorized: "#94a3b8",
};

export default function Analytics({ streak, onClose }: { streak: number; onClose: () => void }) {
  const summary = useMemo(() => getSummary(), []);
  const catAccuracy = useMemo(() => getCategoryAccuracy(), []);
  const modeCounts = useMemo(() => getModeCounts(), []);
  const defaultMode = useMemo<PracticeMode>(() => {
    const withData = PRACTICE_MODES.find((m) => modeCounts[m] > 0);
    return withData || "subject";
  }, [modeCounts]);
  const [activeMode, setActiveMode] = useState<PracticeMode>(defaultMode);

  const timeline = useMemo(() => getScoreTimeline(activeMode), [activeMode]);

  const sortedCats = useMemo(() => {
    const entries = Object.entries(catAccuracy).filter(
      ([c]) => CATEGORIES.includes(c as never) || c === "Uncategorized",
    );
    entries.sort((a, b) => b[1].pct - a[1].pct);
    return entries;
  }, [catAccuracy]);

  const strongest = sortedCats.length > 0 ? sortedCats[0] : null;
  const weakest = sortedCats.length > 1 ? sortedCats[sortedCats.length - 1] : null;

  const hasData = summary.totalQuizzes > 0;
  const usesNetScore = activeMode === "mock" || activeMode === "csat";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:bg-slate-800 dark:border-slate-700">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">My Performance</h2>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Score history by practice mode
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Close stats"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {!hasData ? (
        <div className="py-10 text-center">
          <p className="mb-3 text-4xl">📊</p>
          <p className="text-slate-500 dark:text-slate-400">
            No quiz data yet. Complete a quiz, topic set, CSAT or mock to see your stats!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryCard label="Attempts" value={String(summary.totalQuizzes)} icon="📝" />
            <SummaryCard label="Questions" value={String(summary.totalQuestions)} icon="❓" />
            <SummaryCard label="Accuracy" value={`${summary.accuracy}%`} icon="🎯" />
            <SummaryCard label="Streak" value={`${streak} day${streak !== 1 ? "s" : ""}`} icon="🔥" />
          </div>

          {strongest && weakest && strongest[0] !== weakest[0] && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                <p className="mb-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">Strongest</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{strongest[0]}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">{strongest[1].pct}% accuracy</p>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <p className="mb-1 text-xs font-medium text-red-600 dark:text-red-400">Needs Work</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{weakest[0]}</p>
                <p className="text-xs text-red-600 dark:text-red-400">{weakest[1].pct}% accuracy</p>
              </div>
            </div>
          )}

          {sortedCats.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">Category-wise Accuracy</h3>
              <div className="space-y-2.5">
                {sortedCats.map(([cat, data]) => (
                  <div key={cat}>
                    <div className="mb-1 flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                      <span className="min-w-0 break-words text-xs font-medium text-slate-600 dark:text-slate-300">{cat}</span>
                      <span className="shrink-0 text-xs font-bold text-slate-500 dark:text-slate-400">
                        {data.pct}% ({data.correct}/{data.total})
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${data.pct}%`, backgroundColor: CAT_COLORS[cat] || "#94a3b8" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-200">Score History</h3>
            <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {PRACTICE_MODES.map((mode) => {
                const count = modeCounts[mode];
                const active = activeMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setActiveMode(mode)}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                      active
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                    }`}
                  >
                    {PRACTICE_MODE_LABELS[mode]}
                    <span className={`ml-1 tabular-nums ${active ? "text-indigo-100" : "text-slate-400 dark:text-slate-500"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {timeline.length > 0 ? (
              <ScoreHistory
                title={PRACTICE_MODE_LABELS[activeMode]}
                timeline={timeline}
                scoreUnit={usesNetScore ? "net" : "correct"}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center dark:border-slate-700 dark:bg-slate-900/50">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  No {PRACTICE_MODE_LABELS[activeMode]} attempts yet
                </p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  Finish a set in this mode to unlock its score history.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function scoreTone(pct: number): { bar: string; chip: string; text: string } {
  if (pct >= 70) {
    return {
      bar: "from-emerald-400 to-teal-500",
      chip: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
      text: "text-emerald-600 dark:text-emerald-400",
    };
  }
  if (pct >= 40) {
    return {
      bar: "from-amber-400 to-orange-500",
      chip: "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
      text: "text-amber-600 dark:text-amber-400",
    };
  }
  return {
    bar: "from-rose-400 to-red-500",
    chip: "bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    text: "text-rose-600 dark:text-rose-400",
  };
}

function formatShortDate(date: string): string {
  const parts = date.split("-");
  if (parts.length !== 3) return date;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (!m || !d || m < 1 || m > 12) return date;
  return `${d} ${months[m - 1]}`;
}

function ScoreHistory({
  title,
  timeline,
  scoreUnit,
}: {
  title: string;
  timeline: TimelinePoint[];
  scoreUnit: "correct" | "net";
}) {
  const avg = Math.round(timeline.reduce((s, t) => s + t.pct, 0) / timeline.length);
  const best = Math.max(...timeline.map((t) => t.pct));
  const latest = timeline[timeline.length - 1]?.pct ?? 0;
  const prev = timeline.length > 1 ? timeline[timeline.length - 2].pct : null;
  const delta = prev == null ? null : latest - prev;
  const avgTone = scoreTone(avg);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Last {timeline.length} attempt{timeline.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${avgTone.chip}`}>Avg {avg}%</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            Best {best}%
          </span>
          {delta != null && (
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                delta > 0
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                  : delta < 0
                    ? "bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              {delta > 0 ? `↑ +${delta}%` : delta < 0 ? `↓ ${delta}%` : "→ same"}
            </span>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 p-4 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 sm:p-5">
        <div className="relative h-44 sm:h-48">
          <div className="pointer-events-none absolute inset-x-0 bottom-8 top-5 flex flex-col justify-between">
            {[100, 75, 50, 25, 0].map((y) => (
              <div key={y} className="flex items-center gap-2">
                <span className="w-7 shrink-0 text-right text-[9px] font-medium tabular-nums text-slate-300 dark:text-slate-600">
                  {y}
                </span>
                <div className="h-px flex-1 border-t border-dashed border-slate-200/90 dark:border-slate-700/80" />
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 left-9 right-0 top-0 flex items-end gap-1.5 sm:gap-2.5">
            {timeline.map((t, i) => {
              const tone = scoreTone(t.pct);
              const height = Math.max(t.pct, t.pct === 0 ? 0 : 4);
              const isLatest = i === timeline.length - 1;
              return (
                <div
                  key={`${t.date}-${t.label}-${i}`}
                  className="group relative flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                  title={`${t.label} · ${t.pct}% · ${t.date}`}
                >
                  <div className="pointer-events-none absolute bottom-[calc(100%-0.25rem)] z-10 mb-1 hidden w-max max-w-[11rem] -translate-y-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-left text-[10px] leading-snug text-white opacity-0 shadow-lg transition group-hover:block group-hover:opacity-100 dark:bg-slate-100 dark:text-slate-900">
                    <p className="font-bold">{t.pct}%</p>
                    <p className="mt-0.5 line-clamp-2 opacity-90">{t.label}</p>
                    <p className="mt-0.5 opacity-70">{formatShortDate(t.date)}</p>
                  </div>

                  <span className={`mb-1 text-[10px] font-bold tabular-nums sm:text-[11px] ${tone.text}`}>
                    {t.pct}%
                  </span>
                  <div className="relative flex w-full max-w-[2.75rem] flex-1 items-end justify-center">
                    <div
                      className={`w-full rounded-t-lg bg-gradient-to-t ${tone.bar} shadow-sm transition-all duration-500 ease-out ${
                        isLatest ? "ring-2 ring-indigo-400/60 ring-offset-1 ring-offset-white dark:ring-offset-slate-900" : ""
                      } group-hover:brightness-110`}
                      style={{ height: `${height}%`, minHeight: t.pct === 0 ? "2px" : undefined }}
                    />
                  </div>
                  <p className="mt-1.5 w-full truncate text-center text-[9px] font-medium text-slate-400 dark:text-slate-500">
                    {formatShortDate(t.date)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <ul className="mt-4 divide-y divide-slate-100 border-t border-slate-100 pt-3 dark:divide-slate-800 dark:border-slate-800">
          {[...timeline].reverse().slice(0, 5).map((t, i) => {
            const tone = scoreTone(t.pct);
            return (
              <li key={`row-${t.date}-${t.label}-${i}`} className="flex items-center gap-3 py-2 first:pt-0">
                <span className={`w-12 shrink-0 rounded-md px-1.5 py-1 text-center text-[11px] font-bold tabular-nums ${tone.chip}`}>
                  {t.pct}%
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">{t.label}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    {formatShortDate(t.date)}
                    {scoreUnit === "net"
                      ? ` · ${t.score}/${t.total} marks`
                      : ` · ${t.score}/${t.total} correct`}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-700 dark:bg-slate-900">
      <p className="mb-1 text-2xl">{icon}</p>
      <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{value}</p>
      <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}
