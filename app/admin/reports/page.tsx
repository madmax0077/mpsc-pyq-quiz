"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { fetchReports, resolveReport, deleteReport, type QuestionReport } from "@/lib/firebase";

export default function AdminReportsPage() {
  const { loading, isAdmin, loginAdmin, logoutAdmin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  const [reports, setReports] = useState<QuestionReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "resolved">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadReports = async () => {
    setLoadingReports(true);
    const data = await fetchReports();
    setReports(data);
    setLoadingReports(false);
  };

  useEffect(() => {
    if (isAdmin) loadReports();
  }, [isAdmin]);

  const handleResolve = async (id: string) => {
    setActionLoading(id);
    await resolveReport(id);
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: "resolved" } : r)));
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    await deleteReport(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
    setActionLoading(null);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    const ok = loginAdmin(username.trim(), password);
    if (!ok) setAdminError("Invalid credentials. Please try again.");
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
            <img src="/logo.png" alt="MPSC Logo" className="mx-auto mb-4 h-20 w-20 rounded-full object-cover shadow-lg ring-4 ring-white" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">MPSC PYQ QUIZ</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Admin Access Required</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-900/50">
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" placeholder="Enter admin username" required />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" placeholder="Enter admin password" required />
              </div>
              {adminError && <p className="text-sm text-red-500">{adminError}</p>}
              <button type="submit" className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md">Sign In</button>
            </form>
            <Link href="/admin" className="mt-4 block text-center text-xs text-slate-400 hover:text-indigo-500 dark:text-slate-500 dark:hover:text-indigo-400">&larr; Back to Admin Panel</Link>
          </div>
        </div>
      </div>
    );
  }

  const filtered = filter === "all" ? reports : reports.filter((r) => r.status === filter);
  const pendingCount = reports.filter((r) => r.status === "pending").length;
  const resolvedCount = reports.filter((r) => r.status === "resolved").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <img src="/logo.png" alt="MPSC Logo" className="h-10 w-10 rounded-full object-cover shadow-sm ring-1 ring-slate-200 dark:ring-slate-700" />
            <div>
              <h1 className="text-base font-bold leading-tight text-slate-800 dark:text-slate-100">MPSC PYQ QUIZ</h1>
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">Admin &mdash; Reports</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 no-underline dark:text-slate-400 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400">
              <svg className="mr-1 inline h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Admin
            </Link>
            <button onClick={logoutAdmin} className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/30 dark:hover:text-red-400">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
              <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Reported Questions</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{reports.length} total reports</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadReports} disabled={loadingReports} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
              {loadingReports ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex gap-2">
          {(["all", "pending", "resolved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                filter === f
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {f === "all" ? `All (${reports.length})` : f === "pending" ? `Pending (${pendingCount})` : `Resolved (${resolvedCount})`}
            </button>
          ))}
        </div>

        {/* Reports List */}
        {loadingReports ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
            <p className="text-sm text-slate-500">Loading reports...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
            <svg className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No {filter !== "all" ? filter : ""} reports found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((report) => (
              <div key={report.id} className={`rounded-xl border p-5 transition-colors ${
                report.status === "resolved"
                  ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10"
                  : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
              }`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        report.status === "pending"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      }`}>
                        {report.status === "pending" ? "Pending" : "Resolved"}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {report.createdAt ? new Date(report.createdAt.seconds * 1000).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—"}
                      </span>
                    </div>

                    <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                      <span className="text-slate-400 dark:text-slate-500">Quiz: </span>{report.quizTitle || "Unknown"}
                    </p>

                    <div className="mb-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-700/40">
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-1">Question</p>
                      <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line">{report.questionText}</p>
                    </div>

                    <div className="mb-3 rounded-lg border border-red-100 bg-red-50/50 p-3 dark:border-red-900/30 dark:bg-red-900/10">
                      <p className="text-xs font-medium text-red-400 dark:text-red-500 mb-1">Reported Issue</p>
                      <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line">{report.reason}</p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      <span>{report.reporterName}</span>
                      <span className="text-slate-300 dark:text-slate-600">|</span>
                      <span>{report.reporterEmail}</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 sm:flex-col">
                    {report.status === "pending" && (
                      <button
                        onClick={() => handleResolve(report.id)}
                        disabled={actionLoading === report.id}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {actionLoading === report.id ? "..." : "Resolve"}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(report.id)}
                      disabled={actionLoading === report.id}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      {actionLoading === report.id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
