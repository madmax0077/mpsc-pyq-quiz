"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { subscribeTodayLeaderboard, type LeaderboardRow } from "@/lib/leaderboard";

const PODIUM_TONES: Record<number, { ring: string; bg: string; chip: string; medal: string; label: string }> = {
  0: {
    ring: "ring-amber-300 dark:ring-amber-500",
    bg: "from-amber-50 via-yellow-50 to-amber-100 dark:from-amber-900/40 dark:via-yellow-900/30 dark:to-amber-900/40",
    chip: "bg-amber-500 text-white",
    medal: "🥇",
    label: "1st",
  },
  1: {
    ring: "ring-slate-300 dark:ring-slate-500",
    bg: "from-slate-50 via-slate-100 to-slate-200 dark:from-slate-800/60 dark:via-slate-800/40 dark:to-slate-700/60",
    chip: "bg-slate-500 text-white",
    medal: "🥈",
    label: "2nd",
  },
  2: {
    ring: "ring-orange-300 dark:ring-orange-500",
    bg: "from-orange-50 via-amber-50 to-orange-100 dark:from-orange-900/40 dark:via-amber-900/30 dark:to-orange-900/40",
    chip: "bg-orange-500 text-white",
    medal: "🥉",
    label: "3rd",
  },
};

export default function Leaderboard() {
  const { studentUser } = useAuth();
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const unsub = subscribeTodayLeaderboard(
      (next) => {
        setRows(next);
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Could not load leaderboard.");
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  const top3 = useMemo(() => rows.slice(0, 3), [rows]);
  const myRank = useMemo(() => {
    if (!studentUser) return null;
    const idx = rows.findIndex((r) => r.userId === studentUser.uid);
    return idx === -1 ? null : { rank: idx + 1, row: rows[idx], total: rows.length };
  }, [rows, studentUser]);

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "short",
        timeZone: "Asia/Kolkata",
      }).format(new Date()),
    [],
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm dark:bg-slate-800 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            <span aria-hidden>🏆</span> Today&apos;s Top Scorers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {todayLabel} &middot; aggregate of all your tests today &middot; resets midnight IST
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
          ● LIVE
        </span>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && top3.length === 0 && (
        <EmptyState />
      )}

      {!loading && !error && top3.length > 0 && (
        <>
          <Podium rows={top3} highlightUserId={studentUser?.uid} />

          {/* Your-rank panel */}
          {studentUser ? (
            <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-900/60 dark:bg-indigo-900/20">
              {myRank ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={myRank.row.displayName} src={myRank.row.photoURL} size={40} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                        You — {myRank.row.displayName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {myRank.row.attemptCount} {myRank.row.attemptCount === 1 ? "test" : "tests"} today &middot; latest: {myRank.row.latestQuizTitle}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      Rank #{myRank.rank} of {myRank.total}
                    </p>
                    <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                      {myRank.row.scorePct}%{" "}
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        ({myRank.row.totalScore}/{myRank.row.totalQuestions})
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-300 text-center">
                  Take a quiz today to appear on the leaderboard.
                </p>
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-900/20 dark:text-amber-200">
              Sign in to compete and appear on today&apos;s leaderboard.
            </div>
          )}
        </>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 py-10 text-center">
      <div className="text-4xl mb-2">📭</div>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No scores yet today</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
        Be the first to take a quiz and claim the top spot!
      </p>
    </div>
  );
}

function Podium({ rows, highlightUserId }: { rows: LeaderboardRow[]; highlightUserId?: string }) {
  // For visual variety on desktop we present 2nd, 1st, 3rd in that horizontal order.
  // On mobile we stack in straight rank order.
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 sm:items-end">
      {rows.map((row, idx) => {
        const rank = idx; // 0=gold, 1=silver, 2=bronze
        const tone = PODIUM_TONES[rank];
        const isMe = highlightUserId && row.userId === highlightUserId;
        // Visual height: 1st tallest, 2nd medium, 3rd shortest
        const heightClass = rank === 0 ? "sm:py-7" : rank === 1 ? "sm:py-5" : "sm:py-4";
        // Display order on sm+: silver | gold | bronze
        const order = rank === 0 ? "sm:order-2" : rank === 1 ? "sm:order-1" : "sm:order-3";
        const attemptLabel = `${row.attemptCount} ${row.attemptCount === 1 ? "test" : "tests"} today`;
        return (
          <div
            key={row.userId}
            className={`${order} relative rounded-2xl bg-gradient-to-br ${tone.bg} ring-2 ${tone.ring} ${heightClass} p-4 shadow-sm transition-transform hover:scale-[1.02]`}
          >
            <div className="absolute -top-2 left-3 flex items-center gap-1.5">
              <span className={`rounded-full ${tone.chip} px-2 py-0.5 text-[10px] font-bold tracking-wide`}>
                {tone.label}
              </span>
              {isMe && (
                <span className="rounded-full bg-indigo-600 text-white px-2 py-0.5 text-[10px] font-bold tracking-wide">
                  YOU
                </span>
              )}
            </div>

            <div className="flex flex-col items-center text-center pt-2">
              <div className="relative">
                <Avatar name={row.displayName} src={row.photoURL} size={rank === 0 ? 72 : 60} />
                <div className="absolute -bottom-1 -right-1 text-2xl drop-shadow-sm" aria-hidden>
                  {tone.medal}
                </div>
              </div>
              <p
                className="mt-3 max-w-full truncate text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100"
                title={row.displayName}
              >
                {row.displayName}
              </p>
              <p
                className="mt-0.5 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1"
                title={attemptLabel}
              >
                {attemptLabel}
              </p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                  {row.scorePct}%
                </span>
              </div>
              <p className="mt-0.5 text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
                {row.totalScore}/{row.totalQuestions} correct
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Avatar({ name, src, size }: { name: string; src: string | null; size: number }) {
  const initials = (name || "?")
    .split(/\s+/)
    .map((p) => p[0] || "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
  if (src) {
    return (
      <img
        src={src}
        alt=""
        referrerPolicy="no-referrer"
        style={{ width: size, height: size }}
        className="rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-sm"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold ring-2 ring-white dark:ring-slate-800 shadow-sm"
    >
      <span style={{ fontSize: size * 0.4 }}>{initials || "?"}</span>
    </div>
  );
}
