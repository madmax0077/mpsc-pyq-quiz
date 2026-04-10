"use client";

import { useMemo } from "react";
import { getSummary, getCategoryAccuracy, getScoreTimeline } from "@/lib/analytics";
import { CATEGORIES } from "@/lib/types";

const CAT_COLORS: Record<string, string> = {
  Polity: "#3b82f6",
  History: "#f59e0b",
  Geography: "#10b981",
  Science: "#8b5cf6",
  "Current Affairs": "#ec4899",
  Economics: "#14b8a6",
  Aptitude: "#f97316",
  Uncategorized: "#94a3b8",
};

export default function Analytics({ streak, onClose }: { streak: number; onClose: () => void }) {
  const summary = useMemo(() => getSummary(), []);
  const catAccuracy = useMemo(() => getCategoryAccuracy(), []);
  const timeline = useMemo(() => getScoreTimeline(), []);

  const sortedCats = useMemo(() => {
    const entries = Object.entries(catAccuracy).filter(([c]) => CATEGORIES.includes(c as never) || c === "Uncategorized");
    entries.sort((a, b) => b[1].pct - a[1].pct);
    return entries;
  }, [catAccuracy]);

  const strongest = sortedCats.length > 0 ? sortedCats[0] : null;
  const weakest = sortedCats.length > 1 ? sortedCats[sortedCats.length - 1] : null;

  const hasData = summary.totalQuizzes > 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">My Performance</h2>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {!hasData ? (
        <div className="text-center py-10">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-slate-500 dark:text-slate-400">No quiz data yet. Complete a quiz to see your stats!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryCard label="Quizzes Taken" value={String(summary.totalQuizzes)} icon="📝" />
            <SummaryCard label="Questions" value={String(summary.totalQuestions)} icon="❓" />
            <SummaryCard label="Accuracy" value={`${summary.accuracy}%`} icon="🎯" />
            <SummaryCard label="Streak" value={`${streak} day${streak !== 1 ? "s" : ""}`} icon="🔥" />
          </div>

          {/* Strongest / Weakest */}
          {strongest && weakest && strongest[0] !== weakest[0] && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:bg-emerald-900/20 dark:border-emerald-800">
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">Strongest</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{strongest[0]}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">{strongest[1].pct}% accuracy</p>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:bg-red-900/20 dark:border-red-800">
                <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">Needs Work</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{weakest[0]}</p>
                <p className="text-xs text-red-600 dark:text-red-400">{weakest[1].pct}% accuracy</p>
              </div>
            </div>
          )}

          {/* Category Accuracy Bars */}
          {sortedCats.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Category-wise Accuracy</h3>
              <div className="space-y-2.5">
                {sortedCats.map(([cat, data]) => (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{cat}</span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{data.pct}% ({data.correct}/{data.total})</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
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

          {/* Score Timeline Chart */}
          {timeline.length > 1 && (
            <div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Score History</h3>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:bg-slate-900 dark:border-slate-700">
                <svg viewBox={`0 0 ${Math.max(timeline.length * 40, 200)} 120`} className="w-full h-32" preserveAspectRatio="none">
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={110 - y * 1.1}
                      x2={timeline.length * 40}
                      y2={110 - y * 1.1}
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-700"
                      strokeWidth="0.5"
                    />
                  ))}
                  {/* Line */}
                  <polyline
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={timeline.map((t, i) => `${i * 40 + 20},${110 - t.pct * 1.1}`).join(" ")}
                  />
                  {/* Dots */}
                  {timeline.map((t, i) => (
                    <circle
                      key={i}
                      cx={i * 40 + 20}
                      cy={110 - t.pct * 1.1}
                      r="4"
                      fill="#6366f1"
                      className="drop-shadow-sm"
                    />
                  ))}
                  {/* Labels */}
                  {timeline.map((t, i) => (
                    <text
                      key={`lbl-${i}`}
                      x={i * 40 + 20}
                      y={105 - t.pct * 1.1}
                      textAnchor="middle"
                      className="text-[8px] fill-indigo-600 dark:fill-indigo-400 font-bold"
                    >
                      {t.pct}%
                    </text>
                  ))}
                </svg>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-1">Last {timeline.length} quiz scores</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center dark:bg-slate-900 dark:border-slate-700">
      <p className="text-2xl mb-1">{icon}</p>
      <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{value}</p>
      <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}
