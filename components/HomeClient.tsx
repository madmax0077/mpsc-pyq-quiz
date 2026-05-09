"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import type { Language } from "@/lib/types";
import StudentView from "@/components/StudentView";
import Leaderboard from "@/components/Leaderboard";
import NotesView from "@/components/NotesView";

type AppMode = "home" | "subject" | "topic" | "leaderboard" | "notes";
const GUEST_NAME_KEY = "mpsc_guest_name";
const GUEST_ID_KEY = "mpsc_guest_id";

function makeGuestId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `guest_${crypto.randomUUID()}`;
  return `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export default function HomeClient() {
  const { loading, studentUser, logoutStudent } = useAuth();
  const [language, setLanguage] = useState<Language>("english");
  const [dark, setDark] = useState(false);
  const [homeKey, setHomeKey] = useState(0);
  const [challenge, setChallenge] = useState<{ quizId: string; name: string; score: number; total: number } | null>(null);
  const [appMode, setAppMode] = useState<AppMode>("home");
  const [guestName, setGuestName] = useState("");
  const [guestId, setGuestId] = useState("");
  const [guestNameInput, setGuestNameInput] = useState("");

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const savedName = localStorage.getItem(GUEST_NAME_KEY) || "";
    let savedId = localStorage.getItem(GUEST_ID_KEY) || "";
    if (!savedId) {
      savedId = makeGuestId();
      localStorage.setItem(GUEST_ID_KEY, savedId);
    }
    setGuestName(savedName);
    setGuestNameInput(savedName);
    setGuestId(savedId);
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
    seo.style.display = "none";
  }, []);

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

  const displayName = studentUser?.displayName || guestName || "Aspirant";
  const guestIdentity = studentUser
    ? null
    : guestId
      ? { userId: guestId, displayName, photoURL: null }
      : null;

  const saveGuestName = () => {
    const cleaned = guestNameInput.trim().slice(0, 40) || "Aspirant";
    setGuestName(cleaned);
    localStorage.setItem(GUEST_NAME_KEY, cleaned);
    if (!guestId) {
      const nextId = makeGuestId();
      setGuestId(nextId);
      localStorage.setItem(GUEST_ID_KEY, nextId);
    }
  };

  const resetGuestName = () => {
    setGuestName("");
    setGuestNameInput("");
    localStorage.removeItem(GUEST_NAME_KEY);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
      {!studentUser && !guestName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl text-white shadow-lg">
              🎓
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">What should we call you?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              No login needed. Your name is only used for quiz progress and the daily leaderboard.
            </p>
            <input
              value={guestNameInput}
              onChange={(e) => setGuestNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveGuestName();
              }}
              placeholder="Enter your name"
              className="mt-5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-indigo-900/40"
              autoFocus
            />
            <button
              onClick={saveGuestName}
              className="mt-4 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:from-indigo-700 hover:to-purple-700 dark:shadow-indigo-950/40"
            >
              Start Practicing
            </button>
            <button
              onClick={() => {
                setGuestNameInput("Aspirant");
                setGuestName("Aspirant");
                localStorage.setItem(GUEST_NAME_KEY, "Aspirant");
              }}
              className="mt-3 w-full text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              Continue as Aspirant
            </button>
          </div>
        </div>
      )}

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

            {studentUser?.photoURL && (
              <img
                src={studentUser.photoURL}
                alt=""
                className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 rounded-full ring-2 ring-white"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="hidden sm:block min-w-0">
              <p className="text-xs font-semibold text-slate-700 leading-tight truncate dark:text-slate-200">
                {displayName}
              </p>
              <p className="text-[10px] text-slate-400 truncate dark:text-slate-500">
                {studentUser?.email || "Guest mode"}
              </p>
            </div>
            <button
              onClick={studentUser ? logoutStudent : resetGuestName}
              className="shrink-0 rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
            >
              {studentUser ? "Logout" : "Name"}
            </button>
          </div>
        </div>
      </header>

      {/* ---- Main Content ---- */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {appMode === "home" ? (
          <div className="flex flex-col items-center gap-8 py-4 sm:py-8">
            <section className="relative w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-xl shadow-indigo-100/60 ring-1 ring-slate-900/5 dark:border-slate-700/70 dark:bg-slate-900/80 dark:shadow-black/20 sm:p-8">
              <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-700/20" />
              <div className="absolute -bottom-28 -right-16 h-64 w-64 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-700/20" />
              <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div className="text-center lg:text-left">
                  <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 lg:mx-0">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    Live Study Arena
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                    LET THE BRAIN BATTLE BEGIN
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base lg:mx-0">
                    Pick a mode, solve focused sets, and watch your preparation turn into daily momentum.
                    PYQs, topic tests, notes and leaderboard now feel like one clean study cockpit.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">5-question topic sets</span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">Marathi + English</span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">Daily rank push</span>
                  </div>
                </div>
                <StudyScene />
              </div>
            </section>

            <div className="grid w-full max-w-3xl gap-5 sm:grid-cols-2">
              <LeaderboardTile onClick={() => setAppMode("leaderboard")} className="sm:col-span-2" />
              {/* Subject Wise */}
              <button
                onClick={() => setAppMode("subject")}
                className="group relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-7 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100 dark:border-indigo-800 dark:from-indigo-950/50 dark:via-slate-900 dark:to-purple-950/50 dark:hover:border-indigo-600 dark:hover:shadow-black/20"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-indigo-200/40 blur-2xl transition-transform group-hover:scale-125 dark:bg-indigo-500/10" />
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
                className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-7 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100 dark:border-emerald-800 dark:from-emerald-950/50 dark:via-slate-900 dark:to-cyan-950/50 dark:hover:border-emerald-600 dark:hover:shadow-black/20"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-emerald-200/40 blur-2xl transition-transform group-hover:scale-125 dark:bg-emerald-500/10" />
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
                className="group relative overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-rose-50 p-7 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100 dark:border-orange-800 dark:from-orange-950/50 dark:via-slate-900 dark:to-rose-950/50 dark:hover:border-orange-600 dark:hover:shadow-black/20 sm:col-span-2"
              >
                <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-orange-200/40 blur-2xl transition-transform group-hover:scale-125 dark:bg-orange-500/10" />
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
          <StudentView language={language} challenge={challenge} homeKey={homeKey} topicMode={appMode === "topic"} guestUser={guestIdentity} />
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
      className={`group relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-100 dark:border-amber-800 dark:from-amber-950/40 dark:via-slate-900 dark:to-orange-950/40 dark:hover:border-amber-600 dark:hover:shadow-black/20 sm:p-6 ${className}`}
    >
      <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-amber-200/50 blur-2xl transition-transform group-hover:scale-125 dark:bg-amber-500/10" />
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

function StudyScene() {
  return (
    <div className="study-scene mx-auto w-full max-w-sm" aria-hidden="true">
      <div className="study-orbit">
        <span className="study-chip study-chip-one">PYQ</span>
        <span className="study-chip study-chip-two">Map</span>
        <span className="study-chip study-chip-three">Notes</span>
      </div>
      <div className="study-stage">
        <div className="study-book study-book-back" />
        <div className="study-book study-book-mid" />
        <div className="study-book study-book-front">
          <span className="study-book-title">MPSC</span>
          <span className="study-book-line" />
          <span className="study-book-line short" />
        </div>
        <div className="study-lamp">
          <span className="study-lamp-head" />
          <span className="study-lamp-neck" />
          <span className="study-lamp-glow" />
        </div>
        <div className="study-card">
          <span>Daily</span>
          <strong>Top 5</strong>
        </div>
      </div>
    </div>
  );
}
