"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  subscribeAttemptsByDate,
  subscribeLeaderboardByDate,
  todayKey,
  type LeaderboardEntry,
  type LeaderboardRow,
} from "@/lib/leaderboard";

/**
 * Admin-only: full ranked list of every signed-in user who submitted at least
 * one quiz on a given day (defaults to today), plus their individual attempts.
 *
 * Important: this page must NOT change anything aspirants see — the public
 * leaderboard component (`components/Leaderboard.tsx`) is untouched. We just
 * reuse the same `leaderboard` Firestore collection.
 */
export default function AdminTodayPage() {
  const { loading, isAdmin, loginAdmin, logoutAdmin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  const [selectedDate, setSelectedDate] = useState<string>(todayKey());
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [attempts, setAttempts] = useState<LeaderboardEntry[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isAdmin) return;
    setLoadingData(true);
    setErrorMsg(null);

    let firstRowsArrived = false;
    let firstAttemptsArrived = false;

    const unsubRows = subscribeLeaderboardByDate(
      selectedDate,
      (next) => {
        setRows(next);
        firstRowsArrived = true;
        if (firstRowsArrived && firstAttemptsArrived) setLoadingData(false);
      },
      (err) => {
        setErrorMsg(err.message || "Could not load leaderboard.");
        setLoadingData(false);
      },
    );

    const unsubAttempts = subscribeAttemptsByDate(
      selectedDate,
      (next) => {
        setAttempts(next);
        firstAttemptsArrived = true;
        if (firstRowsArrived && firstAttemptsArrived) setLoadingData(false);
      },
      (err) => {
        setErrorMsg(err.message || "Could not load attempts.");
        setLoadingData(false);
      },
    );

    return () => {
      unsubRows();
      unsubAttempts();
    };
  }, [isAdmin, selectedDate]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    const ok = loginAdmin(username.trim(), password);
    if (!ok) setAdminError("Invalid credentials. Please try again.");
  };

  const attemptsByUser = useMemo(() => {
    const map = new Map<string, LeaderboardEntry[]>();
    for (const a of attempts) {
      const list = map.get(a.userId);
      if (list) list.push(a);
      else map.set(a.userId, [a]);
    }
    for (const list of map.values()) {
      list.sort((a, b) => {
        const ta = a.createdAt?.toMillis() ?? 0;
        const tb = b.createdAt?.toMillis() ?? 0;
        return tb - ta;
      });
    }
    return map;
  }, [attempts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.displayName.toLowerCase().includes(q));
  }, [rows, search]);

  const totals = useMemo(() => {
    const totalAttempts = rows.reduce((s, r) => s + r.attemptCount, 0);
    const totalQuestions = rows.reduce((s, r) => s + r.totalQuestions, 0);
    const totalCorrect = rows.reduce((s, r) => s + r.totalScore, 0);
    const avgPct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    return {
      users: rows.length,
      attempts: totalAttempts,
      questions: totalQuestions,
      correct: totalCorrect,
      avgPct,
    };
  }, [rows]);

  const toggleExpand = (userId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const downloadCsv = () => {
    const header = [
      "rank",
      "userId",
      "displayName",
      "attempts",
      "questionsAttempted",
      "correctAnswers",
      "scorePct",
      "latestQuiz",
      "firstAttemptAt",
    ].join(",");

    const escape = (v: string) => {
      const s = String(v ?? "");
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const lines = rows.map((r, i) =>
      [
        i + 1,
        r.userId,
        escape(r.displayName),
        r.attemptCount,
        r.totalQuestions,
        r.totalScore,
        r.scorePct,
        escape(r.latestQuizTitle),
        new Date(r.earliestAt).toISOString(),
      ].join(","),
    );

    const blob = new Blob([header + "\n" + lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mpsc-leaderboard-${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-50 px-4 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <img
              src="/logo.png"
              alt="MPSC Logo"
              className="mx-auto mb-4 h-20 w-20 rounded-full object-cover shadow-lg ring-4 ring-white"
            />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">MPSC PYQ QUIZ</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Admin Access Required</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-900/50">
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                  placeholder="Enter admin username"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              {adminError && <p className="text-sm text-red-500">{adminError}</p>}
              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
              >
                Sign In
              </button>
            </form>
            <Link
              href="/admin"
              className="mt-4 block text-center text-xs text-slate-400 hover:text-indigo-500 dark:text-slate-500 dark:hover:text-indigo-400"
            >
              &larr; Back to Admin Panel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isToday = selectedDate === todayKey();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <img
              src="/logo.png"
              alt="MPSC Logo"
              className="h-10 w-10 rounded-full object-cover shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <div>
              <h1 className="text-base font-bold leading-tight text-slate-800 dark:text-slate-100">
                MPSC PYQ QUIZ
              </h1>
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                Admin &mdash; Today&apos;s Activity
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 no-underline dark:text-slate-400 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
            >
              <svg className="mr-1 inline h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Admin
            </Link>
            <button
              onClick={logoutAdmin}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Title row */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
              <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {isToday ? "Today's Activity" : "Activity for " + selectedDate}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Full ranked list of signed-in users who submitted at least one quiz
                {isToday ? " today" : " on this day"}. Auto-refreshes live.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              max={todayKey()}
              onChange={(e) => setSelectedDate(e.target.value || todayKey())}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            />
            {!isToday && (
              <button
                onClick={() => setSelectedDate(todayKey())}
                className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
              >
                Jump to today
              </button>
            )}
            <button
              onClick={downloadCsv}
              disabled={rows.length === 0}
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
            >
              <svg className="mr-1 inline h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <StatCard label="Users" value={totals.users} accent="indigo" />
          <StatCard label="Attempts" value={totals.attempts} accent="violet" />
          <StatCard label="Questions" value={totals.questions} accent="sky" />
          <StatCard label="Correct" value={totals.correct} accent="emerald" />
          <StatCard label="Avg %" value={`${totals.avgPct}%`} accent="amber" />
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.35-5.4a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
            />
          </div>
        </div>

        {/* List */}
        {loadingData ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
            <p className="text-sm text-slate-500">Loading activity…</p>
          </div>
        ) : errorMsg ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
            {errorMsg}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
            <svg className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {rows.length === 0
                ? `No quiz submissions ${isToday ? "yet today" : "on this day"}.`
                : "No users match the search."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <table className="w-full table-fixed">
              <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-900/40 dark:text-slate-400">
                <tr>
                  <th className="w-14 px-4 py-3">#</th>
                  <th className="px-4 py-3">User</th>
                  <th className="w-20 px-4 py-3 text-right">Tries</th>
                  <th className="w-24 px-4 py-3 text-right">Correct</th>
                  <th className="w-24 px-4 py-3 text-right">Of</th>
                  <th className="w-20 px-4 py-3 text-right">Score</th>
                  <th className="w-12 px-2 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((row, idx) => {
                  const rank = rows.indexOf(row) + 1;
                  const userAttempts = attemptsByUser.get(row.userId) ?? [];
                  const isOpen = expanded.has(row.userId);
                  return (
                    <FragmentRow
                      key={row.userId}
                      row={row}
                      rank={rank}
                      attempts={userAttempts}
                      isOpen={isOpen}
                      onToggle={() => toggleExpand(row.userId)}
                      isStripe={idx % 2 === 1}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-center text-[11px] text-slate-400 dark:text-slate-500">
          Ranking rule: sum(correct) / sum(attempted) across all today&apos;s
          submissions. Tie-break: more questions attempted, then earliest
          submission. Live-updates via Firestore.
        </p>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent: "indigo" | "violet" | "sky" | "emerald" | "amber";
}) {
  const palette: Record<typeof accent, string> = {
    indigo: "from-indigo-50 to-white text-indigo-700 dark:from-indigo-900/30 dark:to-slate-800/40 dark:text-indigo-300",
    violet: "from-violet-50 to-white text-violet-700 dark:from-violet-900/30 dark:to-slate-800/40 dark:text-violet-300",
    sky: "from-sky-50 to-white text-sky-700 dark:from-sky-900/30 dark:to-slate-800/40 dark:text-sky-300",
    emerald: "from-emerald-50 to-white text-emerald-700 dark:from-emerald-900/30 dark:to-slate-800/40 dark:text-emerald-300",
    amber: "from-amber-50 to-white text-amber-700 dark:from-amber-900/30 dark:to-slate-800/40 dark:text-amber-300",
  };
  return (
    <div className={`rounded-xl border border-slate-200 bg-gradient-to-br p-3 dark:border-slate-700 ${palette[accent]}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-1 text-2xl font-extrabold">{value}</p>
    </div>
  );
}

function FragmentRow({
  row,
  rank,
  attempts,
  isOpen,
  onToggle,
  isStripe,
}: {
  row: LeaderboardRow;
  rank: number;
  attempts: LeaderboardEntry[];
  isOpen: boolean;
  onToggle: () => void;
  isStripe: boolean;
}) {
  const rankColor =
    rank === 1
      ? "bg-amber-500 text-white"
      : rank === 2
        ? "bg-slate-500 text-white"
        : rank === 3
          ? "bg-orange-500 text-white"
          : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";

  return (
    <>
      <tr
        onClick={onToggle}
        className={`cursor-pointer transition-colors hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 ${
          isStripe ? "bg-slate-50/50 dark:bg-slate-900/20" : ""
        }`}
      >
        <td className="px-4 py-3 align-middle">
          <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${rankColor}`}>
            {rank}
          </span>
        </td>
        <td className="px-4 py-3 align-middle">
          <div className="flex items-center gap-3 min-w-0">
            {row.photoURL ? (
              <img
                src={row.photoURL}
                alt={row.displayName}
                className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                {row.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{row.displayName}</p>
              <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
                {row.latestQuizTitle || "—"}
              </p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-right align-middle text-sm font-semibold tabular-nums text-slate-700 dark:text-slate-300">
          {row.attemptCount}
        </td>
        <td className="px-4 py-3 text-right align-middle text-sm font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
          {row.totalScore}
        </td>
        <td className="px-4 py-3 text-right align-middle text-sm font-semibold tabular-nums text-slate-700 dark:text-slate-300">
          {row.totalQuestions}
        </td>
        <td className="px-4 py-3 text-right align-middle">
          <span className="inline-block min-w-[3rem] rounded-full bg-indigo-100 px-2 py-0.5 text-center text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            {row.scorePct}%
          </span>
        </td>
        <td className="px-2 py-3 text-right align-middle text-slate-400">
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </td>
      </tr>
      {isOpen && (
        <tr className="bg-slate-50 dark:bg-slate-900/30">
          <td colSpan={7} className="px-4 py-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Individual attempts ({attempts.length})
              </p>
              {attempts.length === 0 ? (
                <p className="py-2 text-sm text-slate-400">No attempts loaded.</p>
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                  {attempts.map((a) => {
                    const ts = a.createdAt?.toMillis();
                    const when = ts
                      ? new Date(ts).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                          month: "short",
                          day: "2-digit",
                        })
                      : "—";
                    return (
                      <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-slate-700 dark:text-slate-200">{a.quizTitle || a.quizId}</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">{when}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3 text-xs tabular-nums">
                          <span className="text-slate-500 dark:text-slate-400">
                            <strong className="text-emerald-600 dark:text-emerald-400">{a.score}</strong> / {a.total}
                          </span>
                          <span className="rounded-full bg-indigo-100 px-2 py-0.5 font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                            {a.scorePct}%
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
