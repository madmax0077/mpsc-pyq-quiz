"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import type { Language } from "@/lib/types";
import LoginPage from "@/components/LoginPage";
import StudentView from "@/components/StudentView";
import Leaderboard from "@/components/Leaderboard";
import NotesView from "@/components/NotesView";

type AppMode = "home" | "subject" | "topic" | "leaderboard" | "notes";

export default function HomeClient() {
  const { loading, studentUser, logoutStudent } = useAuth();
  const [language, setLanguage] = useState<Language>("english");
  const [dark, setDark] = useState(false);
  const [homeKey, setHomeKey] = useState(0);
  const [challenge, setChallenge] = useState<{ quizId: string; name: string; score: number; total: number } | null>(null);
  const [appMode, setAppMode] = useState<AppMode>("home");

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const params = new URLSearchParams(window.location.search);
    const cq = params.get("cq");
    const cs = params.get("cs");
    const ct = params.get("ct");
    const cn = params.get("cn");
    if (cq && cs && ct) {
      setChallenge({ quizId: cq, name: cn || "A friend", score: parseInt(cs, 10), total: parseInt(ct, 10) });
      setAppMode("subject");
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }
    const mode = params.get("mode");
    if (mode === "leaderboard") {
      setAppMode("leaderboard");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (mode === "notes") {
      setAppMode("notes");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (mode === "subject" || mode === "topic") {
      setAppMode(mode);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const seo = document.getElementById("seo-landing");
    if (!seo) return;
    seo.style.display = studentUser ? "none" : "";
  }, [studentUser]);

  const toggleDark = useCallback(() => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }, [dark]);

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

  if (!studentUser) return <LoginPage />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
      {/* ---- Top Navigation Bar ---- */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-3">
          <button onClick={() => { setHomeKey((k) => k + 1); setAppMode("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex items-center gap-2 sm:gap-3 cursor-pointer bg-transparent border-none p-0 shrink-0">
            <img src="/logo.png" alt="MPSC Logo" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover shadow-sm ring-1 ring-slate-200 dark:ring-slate-700" />
            <div className="text-left">
              <h1 className="text-sm sm:text-base font-bold leading-tight text-slate-800 dark:text-slate-100">MPSC PYQ QUIZ</h1>
              <p className="text-[9px] sm:text-[10px] font-medium text-slate-400 dark:text-slate-500">Don&apos;t know Academy</p>
            </div>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <nav className="hidden sm:flex items-center gap-1 text-xs font-semibold">
              <button
                onClick={() => { setAppMode("notes"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="rounded-lg px-3 py-2 text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors dark:text-slate-300 dark:hover:bg-orange-900/30 dark:hover:text-orange-400"
              >
                📝 Notes
              </button>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <button
                onClick={() => { setAppMode("leaderboard"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="rounded-lg px-3 py-2 text-slate-600 hover:bg-amber-50 hover:text-amber-600 transition-colors dark:text-slate-300 dark:hover:bg-amber-900/30 dark:hover:text-amber-400"
              >
                🏆 Leaderboard
              </button>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <a
                href="/map"
                className="rounded-lg px-3 py-2 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors dark:text-slate-300 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
              >
                🗺️ Map
              </a>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <a
                href="/exams"
                className="rounded-lg px-3 py-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors dark:text-slate-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
              >
                Exams
              </a>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <a
                href="/about"
                className="rounded-lg px-3 py-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors dark:text-slate-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
              >
                About
              </a>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <a
                href="/contact"
                className="rounded-lg px-3 py-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors dark:text-slate-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
              >
                Contact
              </a>
            </nav>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

            <button
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              className="shrink-0 rounded-lg p-1.5 sm:p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              {dark ? (
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="shrink-0 rounded-lg border border-slate-200 bg-white px-1.5 py-1 sm:px-2 sm:py-1.5 text-[11px] sm:text-xs font-medium text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <option value="english">EN</option>
              <option value="marathi">मराठी</option>
            </select>

            {studentUser.photoURL && (
              <img
                src={studentUser.photoURL}
                alt=""
                className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 rounded-full ring-2 ring-white"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="hidden sm:block min-w-0">
              <p className="text-xs font-semibold text-slate-700 leading-tight truncate dark:text-slate-200">
                {studentUser.displayName || "Aspirant"}
              </p>
              <p className="text-[10px] text-slate-400 truncate dark:text-slate-500">{studentUser.email}</p>
            </div>
            <button
              onClick={logoutStudent}
              className="shrink-0 rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ---- Main Content ---- */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {appMode === "home" ? (
          <div className="flex flex-col items-center gap-8 py-6 sm:py-10">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                Let the Brain Battle Begin
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
                Warm up those neurons. MPSC questions are waiting with a whistle and a stopwatch.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 w-full max-w-2xl">
              <LeaderboardTile onClick={() => setAppMode("leaderboard")} className="sm:col-span-2" />
              {/* Subject Wise */}
              <button
                onClick={() => setAppMode("subject")}
                className="group relative overflow-hidden rounded-2xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 p-8 text-left shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all dark:from-indigo-950/50 dark:via-violet-950/50 dark:to-purple-950/50 dark:border-indigo-800 dark:hover:border-indigo-600"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md mb-4">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-2">
                  📚 Subject Wise
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Practice by full exam papers or subjects like History, Geography, Polity, Science and more.
                </p>
                <div className="mt-4 flex items-center text-xs font-semibold text-indigo-500 dark:text-indigo-400">
                  Start Practicing
                  <svg className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </button>

              {/* Topic Wise */}
              <button
                onClick={() => setAppMode("topic")}
                className="group relative overflow-hidden rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-8 text-left shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-cyan-950/50 dark:border-emerald-800 dark:hover:border-emerald-600"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md mb-4">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                  🎯 Topic Wise
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Practice curated topic-wise question sets. Select a subject, then dive into specific topics added by admin.
                </p>
                <div className="mt-4 flex items-center text-xs font-semibold text-emerald-500 dark:text-emerald-400">
                  Explore Topics
                  <svg className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </button>

              {/* Notes */}
              <button
                onClick={() => setAppMode("notes")}
                className="group relative overflow-hidden rounded-2xl border-2 border-orange-100 bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 p-8 text-left shadow-sm hover:shadow-lg hover:border-orange-300 transition-all dark:from-orange-950/50 dark:via-amber-950/50 dark:to-rose-950/50 dark:border-orange-800 dark:hover:border-orange-600 sm:col-span-2"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-md">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold text-orange-700 dark:text-orange-300">
                        📝 Notes
                      </h3>
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                        New
                      </span>
                      <span
                        className="hidden items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 sm:inline-flex dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        title="Read-only — copy disabled"
                      >
                        🔒 Read-only
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Curated revision notes by Don&apos;t know Academy. First in the series:
                      <strong> वर्तमानपत्र — संस्थापक व संपादक</strong> (70+ newspapers, 50+ editors, 100 MCQs with answers).
                    </p>
                    <div className="mt-3 flex items-center text-xs font-semibold text-orange-500 dark:text-orange-400">
                      Open Notes
                      <svg className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-600 text-center max-w-md">
              💡 Click the logo at any time to return to this screen
            </p>
          </div>
        ) : appMode === "leaderboard" ? (
          <div className="space-y-4 py-2 sm:py-4">
            <button
              onClick={() => { setAppMode("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Home
            </button>
            <Leaderboard />
          </div>
        ) : appMode === "notes" ? (
          <div className="py-2 sm:py-4">
            <NotesView
              onBack={() => {
                setAppMode("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        ) : (
          <StudentView language={language} challenge={challenge} homeKey={homeKey} topicMode={appMode === "topic"} />
        )}
      </main>

      {/* ---- Footer ---- */}
      <footer className="border-t border-slate-200/80 py-6 dark:border-slate-700/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              MPSC PYQ QUIZ &middot; Don&apos;t know Academy
            </p>
            <p className="text-[10px] text-slate-300 dark:text-slate-600">
              Free PYQ practice for MPSC aspirants
            </p>
            <div className="flex items-center gap-4">
              <a href="/about" className="text-xs text-slate-400 underline-offset-2 hover:text-indigo-600 hover:underline dark:text-slate-500 dark:hover:text-indigo-400">
                About
              </a>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <a href="/contact" className="text-xs text-slate-400 underline-offset-2 hover:text-indigo-600 hover:underline dark:text-slate-500 dark:hover:text-indigo-400">
                Contact
              </a>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <a href="/exams" className="text-xs text-slate-400 underline-offset-2 hover:text-indigo-600 hover:underline dark:text-slate-500 dark:hover:text-indigo-400">
                Exams
              </a>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <a href="/map" className="text-xs text-slate-400 underline-offset-2 hover:text-indigo-600 hover:underline dark:text-slate-500 dark:hover:text-indigo-400">
                Map
              </a>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <a href="/privacy" className="text-xs text-slate-400 underline-offset-2 hover:text-indigo-600 hover:underline dark:text-slate-500 dark:hover:text-indigo-400">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LeaderboardTile({ onClick, className = "" }: { onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-5 sm:p-6 text-left shadow-sm hover:shadow-lg hover:border-amber-400 transition-all dark:from-amber-950/40 dark:via-yellow-950/40 dark:to-orange-950/40 dark:border-amber-800 dark:hover:border-amber-600 ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-3xl text-white shadow-md">
          🏆
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-lg sm:text-xl font-bold text-amber-700 dark:text-amber-300">
              Today&apos;s Leaderboard
            </h3>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              ● LIVE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            See today&apos;s top 5 scorers and check your rank.
          </p>
        </div>
        <svg className="h-5 w-5 shrink-0 text-amber-500 transition-transform group-hover:translate-x-1 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </button>
  );
}
