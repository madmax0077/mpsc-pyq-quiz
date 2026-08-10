"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import type { Category, Language } from "@/lib/types";
import { loadSavedLanguage, saveLanguage, t } from "@/lib/i18n";
import StudentView from "@/components/StudentView";
import Leaderboard from "@/components/Leaderboard";
import NotesView from "@/components/NotesView";
import MockTestView from "@/components/MockTestView";
import CsatView from "@/components/CsatView";
import Analytics from "@/components/Analytics";
import DisplayAd from "@/components/DisplayAd";
import { getStreak } from "@/lib/streak";
import { getSummary } from "@/lib/analytics";

type AppMode = "home" | "subject" | "topic" | "topic-tests" | "leaderboard" | "notes" | "rto-amvi" | "mock" | "csat";

/** In-flow display ad on the landing page (below the Topic Tests section). */
const LANDING_AD_SLOT = "2086515932";

const GK_MARATHON_TOPIC: { category: Category; topic: string } = {
  category: "Current Affairs",
  topic: "GK 2025-26 Marathon",
};
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
  const [pendingDirectTopic, setPendingDirectTopic] = useState<{ category: Category; topic: string } | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestId, setGuestId] = useState("");
  const [guestNameInput, setGuestNameInput] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [streak, setStreak] = useState(0);
  const [statsPreview, setStatsPreview] = useState({ totalQuizzes: 0, accuracy: 0 });

  useEffect(() => {
    // Stop the browser from restoring the previous scroll position on reload,
    // and always start at the top of the page.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    setDark(document.documentElement.classList.contains("dark"));
    setLanguage(loadSavedLanguage());
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
    const cat = params.get("cat") as Category | null;
    const topic = params.get("topic");
    if (mode === "leaderboard") {
      setAppMode("leaderboard");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (mode === "notes") {
      setAppMode("notes");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (mode === "subject" || mode === "topic" || mode === "topic-tests" || mode === "rto-amvi" || mode === "mock" || mode === "csat") {
      if ((mode === "topic" || mode === "topic-tests") && cat && topic) {
        setPendingDirectTopic({ category: cat, topic });
      }
      setAppMode(mode);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  // Refresh streak / attempt counts whenever the user returns to home.
  useEffect(() => {
    if (appMode !== "home") return;
    setStreak(getStreak());
    const summary = getSummary();
    setStatsPreview({ totalQuizzes: summary.totalQuizzes, accuracy: summary.accuracy });
  }, [appMode, homeKey]);

  // NOTE (AdSense fix): we used to hide the #seo-landing section from real
  // users after mount, keeping it visible only to search-engine crawlers.
  // Google/AdSense uses a real Chrome browser for review, so it saw the
  // content appear and then vanish - a classic cloaking pattern that has
  // been contributing to repeated AdSense rejections.  The SEO section is
  // now shown to everyone below the interactive UI.

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
              No login needed to practice. Your name is used for the daily leaderboard. Sign in anytime to sync progress across devices.
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
            <a
              href="/login"
              className="mt-4 block text-center text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Sign in to sync progress
            </a>
          </div>
        </div>
      )}

      {/* ---- Top Navigation Bar ---- */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/95">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-3 py-2.5 sm:px-6 sm:py-3">
          {/* Brand must never shrink — nav was collapsing logo + name to 0 width */}
          <button
            type="button"
            onClick={() => { setHomeKey((k) => k + 1); setPendingDirectTopic(null); setAppMode("home"); setMobileNavOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex max-w-[58%] shrink-0 items-center gap-2 cursor-pointer overflow-hidden bg-transparent border-none p-0 sm:max-w-none sm:gap-2.5"
            aria-label="MPSC PYQ QUIZ — Don't know Academy home"
          >
            <img
              src="/logo-mark.png"
              alt=""
              width={44}
              height={44}
              decoding="async"
              onError={(e) => {
                const el = e.currentTarget;
                if (el.dataset.fallback === "1") return;
                el.dataset.fallback = "1";
                el.src = "/logo.png";
              }}
              className="h-9 w-9 sm:h-11 sm:w-11 shrink-0 rounded-full bg-white object-contain p-0.5 shadow-sm ring-1 ring-slate-300 dark:bg-slate-800 dark:ring-slate-600"
            />
            <div className="min-w-0 text-left leading-tight">
              <h1 className="truncate text-[13px] sm:text-base font-extrabold text-slate-900 dark:text-white">
                MPSC PYQ QUIZ
              </h1>
              <p className="truncate text-[9px] sm:text-[11px] font-semibold text-indigo-600 dark:text-indigo-300">
                Don&apos;t know Academy
              </p>
            </div>
          </button>

          <div className="ml-auto flex min-w-0 items-center gap-1 sm:gap-2">
            <nav className="hidden min-w-0 items-center gap-0.5 overflow-x-auto text-xs font-semibold lg:flex">
              <button
                onClick={() => { setAppMode("notes"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="rounded-lg px-2.5 py-2 text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors dark:text-slate-300 dark:hover:bg-orange-900/30 dark:hover:text-orange-400"
              >
                📝 {t("notes", language)}
              </button>
              <button
                onClick={() => { setAppMode("leaderboard"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="rounded-lg px-2.5 py-2 text-slate-600 hover:bg-amber-50 hover:text-amber-600 transition-colors dark:text-slate-300 dark:hover:bg-amber-900/30 dark:hover:text-amber-400"
              >
                🏆 {t("leaderboard", language)}
              </button>
              <a
                href="/map"
                className="rounded-lg px-2.5 py-2 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors dark:text-slate-300 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
              >
                🗺️ {t("map", language)}
              </a>
              <a
                href="/census-2011-maharashtra"
                className="hidden xl:inline-flex rounded-lg px-2.5 py-2 text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-colors dark:text-slate-300 dark:hover:bg-sky-900/30 dark:hover:text-sky-400"
              >
                📊 {t("census", language)}
              </a>
              <a
                href="/rivers-maharashtra"
                className="hidden xl:inline-flex rounded-lg px-2.5 py-2 text-slate-600 hover:bg-cyan-50 hover:text-cyan-600 transition-colors dark:text-slate-300 dark:hover:bg-cyan-900/30 dark:hover:text-cyan-400"
              >
                🏞️ {t("rivers", language)}
              </a>
              <a
                href="/exams"
                className="rounded-lg px-2.5 py-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors dark:text-slate-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
              >
                {t("exams", language)}
              </a>
              <a
                href="/about"
                className="rounded-lg px-2.5 py-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors dark:text-slate-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
              >
                {t("about", language)}
              </a>
              <a
                href="/contact"
                className="rounded-lg px-2.5 py-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors dark:text-slate-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
              >
                {t("contact", language)}
              </a>
            </nav>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden lg:block" />

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
              onChange={(e) => {
                const next = e.target.value as Language;
                setLanguage(next);
                saveLanguage(next);
              }}
              className="shrink-0 rounded-lg border border-slate-200 bg-white px-1.5 py-1 sm:px-2 sm:py-1.5 text-[11px] sm:text-xs font-medium text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              aria-label="Language"
            >
              <option value="english">EN</option>
              <option value="marathi">मराठी</option>
            </select>

            {!studentUser && (
              <a
                href="/login"
                className="shrink-0 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-[11px] sm:px-3 sm:text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
              >
                {t("signIn", language)}
              </a>
            )}

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
                {studentUser?.email || t("guestMode", language)}
              </p>
            </div>
            <button
              onClick={studentUser ? logoutStudent : resetGuestName}
              aria-label={studentUser ? t("logout", language) : t("name", language)}
              className="shrink-0 rounded-lg p-1.5 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
            >
              <span className="sm:hidden" aria-hidden="true">
                {studentUser ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                )}
              </span>
              <span className="hidden sm:inline">{studentUser ? t("logout", language) : t("name", language)}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileNavOpen((o) => !o)}
              className="shrink-0 rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav-panel"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
            >
              {mobileNavOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

      </header>

      {/* Mobile / tablet slide-over nav (matches lg:hidden hamburger) */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px]"
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <div
            id="mobile-nav-panel"
            className="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Menu</p>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-3 text-sm font-semibold">
              <div className="grid gap-1">
                <button
                  type="button"
                  onClick={() => { setAppMode("notes"); setMobileNavOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="rounded-xl px-3 py-2.5 text-left text-slate-700 hover:bg-orange-50 dark:text-slate-200 dark:hover:bg-orange-900/30"
                >
                  📝 {t("notes", language)}
                </button>
                <button
                  type="button"
                  onClick={() => { setAppMode("leaderboard"); setMobileNavOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="rounded-xl px-3 py-2.5 text-left text-slate-700 hover:bg-amber-50 dark:text-slate-200 dark:hover:bg-amber-900/30"
                >
                  🏆 {t("leaderboard", language)}
                </button>
                <a href="/map" className="rounded-xl px-3 py-2.5 text-slate-700 hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-emerald-900/30">
                  🗺️ {t("map", language)}
                </a>
                <a href="/census-2011-maharashtra" className="rounded-xl px-3 py-2.5 text-slate-700 hover:bg-sky-50 dark:text-slate-200 dark:hover:bg-sky-900/30">
                  📊 {t("census", language)}
                </a>
                <a href="/rivers-maharashtra" className="rounded-xl px-3 py-2.5 text-slate-700 hover:bg-cyan-50 dark:text-slate-200 dark:hover:bg-cyan-900/30">
                  🏞️ {t("rivers", language)}
                </a>
                <a href="/exams" className="rounded-xl px-3 py-2.5 text-slate-700 hover:bg-indigo-50 dark:text-slate-200 dark:hover:bg-indigo-900/30">
                  {t("exams", language)}
                </a>
                <a href="/study-guides" className="rounded-xl px-3 py-2.5 text-slate-700 hover:bg-indigo-50 dark:text-slate-200 dark:hover:bg-indigo-900/30">
                  {t("studyGuides", language)}
                </a>
                <a href="/about" className="rounded-xl px-3 py-2.5 text-slate-700 hover:bg-indigo-50 dark:text-slate-200 dark:hover:bg-indigo-900/30">
                  {t("about", language)}
                </a>
                <a href="/contact" className="rounded-xl px-3 py-2.5 text-slate-700 hover:bg-indigo-50 dark:text-slate-200 dark:hover:bg-indigo-900/30">
                  {t("contact", language)}
                </a>
                <a href="/donate" className="rounded-xl px-3 py-2.5 text-slate-700 hover:bg-indigo-50 dark:text-slate-200 dark:hover:bg-indigo-900/30">
                  {t("donate", language)}
                </a>
                {!studentUser && (
                  <a
                    href="/login"
                    className="mt-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-center text-white hover:bg-indigo-700"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {t("signIn", language)}
                  </a>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* ---- Main Content ---- */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {appMode === "home" ? (
          <div className="flex flex-col items-center gap-8 py-4 sm:py-8">
            <section className="relative w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-xl shadow-indigo-100/60 ring-1 ring-slate-900/5 dark:border-slate-700/70 dark:bg-slate-900/80 dark:shadow-black/20 sm:p-8">
              <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-700/20" />
              <div className="absolute -bottom-28 -right-16 h-64 w-64 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-700/20" />
              <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div className="text-center lg:text-left">
                  {/* Brand / USP hero stays English in both languages. */}
                  <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-indigo-700 sm:tracking-[0.22em] dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 lg:mx-0">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    Live Study Arena
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
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
              {/* My Stats — home landing (covers subject / topic / CSAT / mock) */}
              <section className="sm:col-span-2 space-y-3">
                <button
                  type="button"
                  onClick={() => setShowAnalytics((v) => !v)}
                  aria-expanded={showAnalytics}
                  className={`group relative w-full overflow-hidden rounded-3xl border p-4 text-left shadow-sm transition-all sm:p-5 ${
                    showAnalytics
                      ? "border-indigo-300 bg-gradient-to-br from-indigo-100 via-white to-violet-100 ring-2 ring-indigo-200/70 dark:border-indigo-600 dark:from-indigo-950/60 dark:via-slate-900 dark:to-violet-950/50 dark:ring-indigo-800/60"
                      : "border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/70 dark:border-indigo-900/50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-violet-950/30 dark:hover:border-indigo-600 dark:hover:shadow-black/30"
                  }`}
                >
                  <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-gradient-to-br from-indigo-300/50 via-violet-300/35 to-fuchsia-300/30 blur-3xl transition-transform duration-500 group-hover:scale-125 dark:from-indigo-500/15 dark:via-violet-500/10 dark:to-fuchsia-500/10" />
                  <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200/60 ring-2 ring-white/70 dark:shadow-indigo-950/40 dark:ring-indigo-500/20">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 sm:text-lg">
                            {t("myStats", language)}
                          </h3>
                          {streak > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-bold text-orange-700 ring-1 ring-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:ring-orange-800">
                              🔥 {streak} day{streak !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                        <p className="text-xs leading-5 text-slate-500 dark:text-slate-400 sm:text-sm">
                          {statsPreview.totalQuizzes > 0
                            ? language === "marathi"
                              ? `${statsPreview.totalQuizzes} प्रयत्न · ${statsPreview.accuracy}% अचूकता — विषय, टॉपिक, CSAT आणि मॉक`
                              : `${statsPreview.totalQuizzes} attempts · ${statsPreview.accuracy}% accuracy — subject, topic, CSAT & mock`
                            : language === "marathi"
                              ? "क्विझ, टॉपिक, CSAT किंवा मॉक पूर्ण केल्यावर येथे प्रगती दिसेल"
                              : "Finish a quiz, topic set, CSAT or mock to unlock score history here"}
                        </p>
                        {statsPreview.totalQuizzes > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            <span className="rounded-md bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-slate-600 ring-1 ring-indigo-100 dark:bg-slate-900/60 dark:text-slate-300 dark:ring-indigo-900/50">
                              {statsPreview.totalQuizzes} {language === "marathi" ? "प्रयत्न" : "attempts"}
                            </span>
                            <span className="rounded-md bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-slate-600 ring-1 ring-indigo-100 dark:bg-slate-900/60 dark:text-slate-300 dark:ring-indigo-900/50">
                              {statsPreview.accuracy}% {language === "marathi" ? "अचूकता" : "accuracy"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <span
                      className={`inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold shadow-md transition-all sm:w-auto ${
                        showAnalytics
                          ? "bg-white text-indigo-700 ring-1 ring-indigo-200 group-hover:bg-indigo-50 dark:bg-slate-800 dark:text-indigo-300 dark:ring-indigo-700"
                          : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-200/60 group-hover:from-indigo-500 group-hover:to-violet-500 group-hover:shadow-lg dark:shadow-indigo-950/40"
                      }`}
                    >
                      {showAnalytics ? (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                          </svg>
                          {language === "marathi" ? "आकडेवारी लपवा" : "Hide stats"}
                        </>
                      ) : (
                        <>
                          {language === "marathi" ? "आकडेवारी पहा" : "View stats"}
                          <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </>
                      )}
                    </span>
                  </div>
                </button>
                {showAnalytics && (
                  <Analytics streak={streak} onClose={() => setShowAnalytics(false)} />
                )}
              </section>

              <LeaderboardTile language={language} onClick={() => setAppMode("leaderboard")} className="sm:col-span-2" />

              {/* Mock Test — full-length timed test (Set A pattern) */}
              <button
                onClick={() => { setAppMode("mock"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="group relative overflow-hidden rounded-3xl border border-violet-200/80 bg-gradient-to-br from-violet-50 via-white to-purple-50 p-4 text-left sm:p-7 shadow-sm ring-1 ring-violet-100/50 transition-all hover:-translate-y-1 hover:border-violet-400 hover:shadow-xl hover:shadow-violet-200/60 dark:border-violet-900/70 dark:from-violet-950/40 dark:via-slate-900 dark:to-purple-950/40 dark:ring-violet-900/30 dark:hover:border-violet-600 dark:hover:shadow-black/40 sm:col-span-2"
              >
                <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-gradient-to-br from-violet-300/60 via-purple-300/40 to-fuchsia-300/40 blur-3xl transition-transform duration-500 group-hover:scale-125 dark:from-violet-500/15 dark:via-purple-500/10 dark:to-fuchsia-500/15" />
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100 dark:via-white/10" />

                <div className="relative flex items-start gap-5">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-200 via-purple-200 to-fuchsia-200 shadow-lg shadow-violet-200/50 ring-2 ring-white/60 dark:from-violet-300 dark:via-purple-300 dark:to-fuchsia-300 dark:shadow-violet-950/40 dark:ring-violet-500/20">
                    <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-base shadow ring-1 ring-violet-200 dark:bg-slate-800 dark:ring-violet-600">
                      ⏱️
                    </span>
                    <div className="flex flex-col items-center leading-none text-violet-900">
                      <span className="text-2xl font-black tracking-tight drop-shadow-sm">100</span>
                      <span className="text-[8px] font-semibold uppercase tracking-wider opacity-80">Qs</span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent dark:from-violet-300 dark:via-purple-300 dark:to-fuchsia-300 sm:text-2xl">
                        {t("mockTest", language)}
                      </h3>
                      <span className="relative inline-flex items-center gap-1 rounded-full bg-violet-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                          <span className="relative flex h-2 w-2 rounded-full bg-white" />
                        </span>
                        {t("newBadge", language)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-violet-300/80 bg-violet-100/80 px-2 py-0.5 text-[10px] font-semibold text-violet-800 dark:border-violet-700 dark:bg-violet-900/40 dark:text-violet-200">
                        🕒 {t("mockTimed", language)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {t("mockDesc", language)}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-0.5 text-slate-700 ring-1 ring-violet-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-violet-900/40">
                        ⏱️ 120 / 60 min
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-0.5 text-slate-700 ring-1 ring-violet-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-violet-900/40">
                        ➖ {t("negativeMarking", language)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-0.5 text-slate-700 ring-1 ring-violet-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-violet-900/40">
                        🔀 {t("randomised", language)}
                      </span>
                    </div>

                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-violet-200/50 transition-all group-hover:shadow-lg group-hover:shadow-violet-300/50 dark:shadow-violet-950/40">
                      {t("mockStart", language)}
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>

              {/* Study modes — aligned in one row of three equal tiles */}
              <div className="grid gap-5 sm:col-span-2 md:grid-cols-3">
              {/* Subject Wise */}
              <button
                onClick={() => setAppMode("subject")}
                className="group relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 text-left sm:p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100 dark:border-indigo-800 dark:from-indigo-950/50 dark:via-slate-900 dark:to-purple-950/50 dark:hover:border-indigo-600 dark:hover:shadow-black/20"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-indigo-200/40 blur-2xl transition-transform group-hover:scale-125 dark:bg-indigo-500/10" />
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md mb-4">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-2">
                  {t("subjectWise", language)}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t("subjectWiseDesc", language)}
                </p>
                <div className="mt-4 flex items-center text-xs font-semibold text-indigo-500 dark:text-indigo-400">
                  {t("startPracticing", language)}
                  <svg className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </button>

              {/* Topic Wise */}
              <button
                onClick={() => { setPendingDirectTopic(null); setAppMode("topic"); }}
                className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4 text-left sm:p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100 dark:border-emerald-800 dark:from-emerald-950/50 dark:via-slate-900 dark:to-cyan-950/50 dark:hover:border-emerald-600 dark:hover:shadow-black/20"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-emerald-200/40 blur-2xl transition-transform group-hover:scale-125 dark:bg-emerald-500/10" />
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md mb-4">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                  {t("topicWisePyq", language)}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t("topicWiseDesc", language)}
                </p>
                <div className="mt-4 flex items-center text-xs font-semibold text-emerald-500 dark:text-emerald-400">
                  {t("exploreTopics", language)}
                  <svg className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </button>

              {/* Topic Tests — curated chapter-wise sets (other than PYQ) */}
              <button
                onClick={() => { setPendingDirectTopic(null); setAppMode("topic-tests"); }}
                className="group relative overflow-hidden rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4 text-left sm:p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-100 dark:border-amber-800 dark:from-amber-950/50 dark:via-slate-900 dark:to-orange-950/50 dark:hover:border-amber-600 dark:hover:shadow-black/20"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-amber-200/40 blur-2xl transition-transform group-hover:scale-125 dark:bg-amber-500/10" />
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md mb-4">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                </div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold text-amber-700 dark:text-amber-300">
                    {t("topicTests", language)}
                  </h3>
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                    {t("otherThanPyq", language)}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t("topicTestsDesc", language)}
                </p>
                <div className="mt-4 flex items-center text-xs font-semibold text-amber-500 dark:text-amber-400">
                  {t("browseTests", language)}
                  <svg className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </button>
              </div>

              {/* In-flow ad — centered, below the Topic Tests (non-PYQ) section */}
              <div className="sm:col-span-2">
                <DisplayAd adsenseSlot={LANDING_AD_SLOT} ezoicKey="landing" minHeight={250} className="w-full" />
              </div>

              {/* GK 2025-26 — last 6 months current affairs */}
              <button
                onClick={() => {
                  setPendingDirectTopic(GK_MARATHON_TOPIC);
                  setAppMode("topic");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 text-left sm:p-7 shadow-sm ring-1 ring-slate-200/50 transition-all hover:-translate-y-1 hover:border-slate-400 hover:shadow-xl hover:shadow-slate-200/60 dark:border-slate-700/70 dark:from-slate-900/60 dark:via-slate-900 dark:to-slate-800/60 dark:ring-slate-700/30 dark:hover:border-slate-500 dark:hover:shadow-black/40 sm:col-span-2"
              >
                {/* subtle graphite glow corners */}
                <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-gradient-to-br from-slate-300/60 via-slate-200/40 to-slate-400/40 blur-3xl transition-transform duration-500 group-hover:scale-125 dark:from-slate-600/20 dark:via-slate-500/10 dark:to-slate-700/20" />
                <div className="absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-gradient-to-tr from-slate-400/40 via-slate-200/40 to-slate-300/30 blur-3xl dark:from-slate-700/20 dark:via-slate-500/10 dark:to-slate-600/10" />
                {/* subtle moving sheen on hover */}
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100 dark:via-white/10" />

                <div className="relative flex items-start gap-5">
                  {/* Big "500" badge */}
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900 shadow-lg shadow-slate-400/40 ring-2 ring-white/60 dark:shadow-slate-950/40 dark:ring-slate-500/20">
                    <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-base shadow ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-600">
                      🔥
                    </span>
                    <div className="flex flex-col items-center leading-none text-white">
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-90">Top</span>
                      <span className="text-2xl font-black tracking-tight drop-shadow-sm">500</span>
                      <span className="text-[8px] font-semibold uppercase tracking-wider opacity-80">MCQs</span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 via-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-100 dark:via-white dark:to-slate-300 sm:text-2xl">
                        {t("gkMarathon", language)}
                      </h3>
                      {/* Pulsing NEW badge */}
                      <span className="relative inline-flex items-center gap-1 rounded-full bg-slate-700 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                        </span>
                        {t("newBadge", language)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-300/80 bg-slate-100/80 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-200">
                        📰 {t("currentAffairs", language)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {t("gkDesc", language)}
                    </p>

                    {/* stats row */}
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-0.5 text-slate-700 ring-1 ring-slate-200/70 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-slate-700/50">
                        ✅ {t("verified", language)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-0.5 text-slate-700 ring-1 ring-slate-200/70 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-slate-700/50">
                        ⚡ {t("fiveQSets", language)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-0.5 text-slate-700 ring-1 ring-slate-200/70 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-slate-700/50">
                        🎯 {t("examReady", language)}
                      </span>
                    </div>

                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-slate-400/40 transition-all group-hover:shadow-lg group-hover:shadow-slate-500/50 dark:shadow-slate-950/40">
                      {t("startMarathon", language)}
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>

              {/* RTO AMVI — separate exam section */}
              <button
                onClick={() => { setAppMode("rto-amvi"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="group relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-4 text-left sm:p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100 dark:border-blue-800 dark:from-blue-950/40 dark:via-slate-900 dark:to-sky-950/40 dark:hover:border-blue-500 dark:hover:shadow-black/20 sm:col-span-2"
              >
                <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-blue-200/40 blur-2xl transition-transform group-hover:scale-125 dark:bg-blue-500/10" />
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-sky-600 text-white shadow-md">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0M19.5 18.75a1.5 1.5 0 01-3 0M2.25 15.75v-6A2.25 2.25 0 014.5 7.5h15a2.25 2.25 0 012.25 2.25v6a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25zM5.25 11.25h13.5" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300">
                        {t("rtoAmvi", language)}
                      </h3>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                        {t("newBadge", language)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                        {t("free", language)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {t("rtoDesc", language)}
                    </p>
                    <div className="mt-3 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {t("openRto", language)}
                      <svg className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>

              {/* Notes */}
              <button
                onClick={() => setAppMode("notes")}
                className="group relative overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-rose-50 p-4 text-left sm:p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100 dark:border-orange-800 dark:from-orange-950/50 dark:via-slate-900 dark:to-rose-950/50 dark:hover:border-orange-600 dark:hover:shadow-black/20 sm:col-span-2"
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
                        {t("notesTitle", language)}
                      </h3>
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                        {t("newBadge", language)}
                      </span>
                      <span
                        className="hidden items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 sm:inline-flex dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        title="Read-only — copy disabled"
                      >
                        🔒 {t("readOnly", language)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {t("notesDesc", language)}
                    </p>
                    <div className="mt-3 flex items-center text-xs font-semibold text-orange-500 dark:text-orange-400">
                      {t("openNotes", language)}
                      <svg className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>

              {/* CSAT & Aptitude — training, topic practice and speed tests */}
              <button
                onClick={() => { setAppMode("csat"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="group relative overflow-hidden rounded-3xl border border-sky-200/80 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-4 text-left sm:p-7 shadow-sm ring-1 ring-sky-100/50 transition-all hover:-translate-y-1 hover:border-sky-400 hover:shadow-xl hover:shadow-sky-200/60 dark:border-sky-900/70 dark:from-sky-950/40 dark:via-slate-900 dark:to-indigo-950/40 dark:ring-sky-900/30 dark:hover:border-sky-600 dark:hover:shadow-black/40 sm:col-span-2"
              >
                <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-gradient-to-br from-sky-300/60 via-blue-300/40 to-indigo-300/40 blur-3xl transition-transform duration-500 group-hover:scale-125 dark:from-sky-500/15 dark:via-blue-500/10 dark:to-indigo-500/15" />
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100 dark:via-white/10" />

                <div className="relative flex items-start gap-5">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-200 via-blue-200 to-indigo-200 shadow-lg shadow-sky-200/50 ring-2 ring-white/60 dark:from-sky-300 dark:via-blue-300 dark:to-indigo-300 dark:shadow-sky-950/40 dark:ring-sky-500/20">
                    <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-base shadow ring-1 ring-sky-200 dark:bg-slate-800 dark:ring-sky-600">
                      🧠
                    </span>
                    <div className="flex flex-col items-center leading-none text-sky-900">
                      <span className="text-2xl font-black tracking-tight drop-shadow-sm">20</span>
                      <span className="text-[8px] font-semibold uppercase tracking-wider opacity-80">{t("topicsLabel", language)}</span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-sky-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent dark:from-sky-300 dark:via-blue-300 dark:to-indigo-300 sm:text-2xl">
                        {t("csatTitle", language)}
                      </h3>
                      <span className="relative inline-flex items-center gap-1 rounded-full bg-sky-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                        </span>
                        {t("newBadge", language)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {t("csatDesc", language)}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-0.5 text-slate-700 ring-1 ring-sky-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-sky-900/40">
                        📖 {t("deepLessons", language)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-0.5 text-slate-700 ring-1 ring-sky-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-sky-900/40">
                        ✍️ {t("topicPractice", language)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-0.5 text-slate-700 ring-1 ring-sky-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-sky-900/40">
                        ⏱️ {t("speedTest", language)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-0.5 text-slate-700 ring-1 ring-sky-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-sky-900/40">
                        MPSC + UPSC CSAT
                      </span>
                    </div>

                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-sky-200/50 transition-all group-hover:shadow-lg group-hover:shadow-sky-300/50 dark:shadow-sky-950/40">
                      {t("openCsat", language)}
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>

              {/* Rivers of Maharashtra — district-wise 2D map + MPSC PYQ quiz */}
              <a
                href="/rivers-maharashtra"
                className="group relative overflow-hidden rounded-3xl border border-cyan-200/80 bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 p-4 text-left sm:p-7 shadow-sm ring-1 ring-cyan-100/50 transition-all hover:-translate-y-1 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-200/60 dark:border-cyan-900/70 dark:from-cyan-950/40 dark:via-teal-950/40 dark:to-emerald-950/40 dark:ring-cyan-900/30 dark:hover:border-cyan-600 dark:hover:shadow-black/40 sm:col-span-2"
              >
                <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-gradient-to-br from-cyan-300/60 via-teal-300/40 to-emerald-300/40 blur-3xl transition-transform duration-500 group-hover:scale-125 dark:from-cyan-500/15 dark:via-teal-500/10 dark:to-emerald-500/15" />
                <div className="absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-gradient-to-tr from-emerald-300/40 via-teal-200/40 to-cyan-200/30 blur-3xl dark:from-emerald-500/15 dark:via-teal-500/10 dark:to-cyan-500/10" />
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100 dark:via-white/10" />

                <div className="relative flex items-start gap-5">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-600 shadow-lg shadow-cyan-300/40 ring-2 ring-white/60 dark:shadow-cyan-900/40 dark:ring-cyan-300/20">
                    <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-base shadow ring-1 ring-cyan-200 dark:bg-slate-800 dark:ring-cyan-700">
                      🏞️
                    </span>
                    <div className="flex flex-col items-center leading-none text-white">
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-90">All</span>
                      <span className="text-2xl font-black tracking-tight drop-shadow-sm">50+</span>
                      <span className="text-[8px] font-semibold uppercase tracking-wider opacity-80">Rivers</span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-700 via-teal-700 to-emerald-700 bg-clip-text text-transparent dark:from-cyan-300 dark:via-teal-300 dark:to-emerald-300 sm:text-2xl">
                        {t("riversTitle", language)}
                      </h3>
                      <span className="relative inline-flex items-center gap-1 rounded-full bg-cyan-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                        </span>
                        {t("newBadge", language)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-teal-300/80 bg-teal-100/80 px-2 py-0.5 text-[10px] font-semibold text-teal-800 dark:border-teal-700 dark:bg-teal-900/40 dark:text-teal-200">
                        🗺️ {t("districtMap", language)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/80 bg-emerald-100/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                        📜 {t("mpscPyqs", language)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {t("riversDesc", language)}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-0.5 text-slate-700 ring-1 ring-cyan-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-cyan-900/40">
                        🟣 Godavari
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-0.5 text-slate-700 ring-1 ring-cyan-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-cyan-900/40">
                        🟢 Krishna
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-0.5 text-slate-700 ring-1 ring-cyan-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-cyan-900/40">
                        🟠 Tapi
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-0.5 text-slate-700 ring-1 ring-cyan-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-cyan-900/40">
                        🔵 Konkan
                      </span>
                    </div>

                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-600 to-teal-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-cyan-300/40 transition-all group-hover:shadow-lg group-hover:shadow-cyan-400/50 dark:shadow-cyan-900/40">
                      {t("openMapQuiz", language)}
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>

              {/* Census 2011 Memory Game (placed last per user request) */}
              <a
                href="/census-2011-maharashtra"
                className="group relative overflow-hidden rounded-3xl border border-sky-200/80 bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 p-4 text-left sm:p-7 shadow-sm ring-1 ring-sky-100/50 transition-all hover:-translate-y-1 hover:border-sky-400 hover:shadow-xl hover:shadow-sky-200/60 dark:border-sky-900/70 dark:from-sky-950/40 dark:via-cyan-950/40 dark:to-blue-950/40 dark:ring-sky-900/30 dark:hover:border-sky-600 dark:hover:shadow-black/40 sm:col-span-2"
              >
                <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-gradient-to-br from-sky-300/60 via-cyan-300/40 to-blue-300/40 blur-3xl transition-transform duration-500 group-hover:scale-125 dark:from-sky-500/15 dark:via-cyan-500/10 dark:to-blue-500/15" />
                <div className="absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-gradient-to-tr from-blue-300/40 via-sky-200/40 to-cyan-200/30 blur-3xl dark:from-blue-500/15 dark:via-sky-500/10 dark:to-cyan-500/10" />
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100 dark:via-white/10" />

                <div className="relative flex items-start gap-5">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600 shadow-lg shadow-sky-300/40 ring-2 ring-white/60 dark:shadow-sky-900/40 dark:ring-sky-300/20">
                    <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-base shadow ring-1 ring-sky-200 dark:bg-slate-800 dark:ring-sky-700">
                      📊
                    </span>
                    <div className="flex flex-col items-center leading-none text-white">
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-90">All</span>
                      <span className="text-2xl font-black tracking-tight drop-shadow-sm">35</span>
                      <span className="text-[8px] font-semibold uppercase tracking-wider opacity-80">Dists</span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-sky-700 via-cyan-700 to-blue-700 bg-clip-text text-transparent dark:from-sky-300 dark:via-cyan-300 dark:to-blue-300 sm:text-2xl">
                        {t("censusTitle", language)}
                      </h3>
                      <span className="relative inline-flex items-center gap-1 rounded-full bg-sky-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                        </span>
                        {t("newBadge", language)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/80 bg-cyan-100/80 px-2 py-0.5 text-[10px] font-semibold text-cyan-800 dark:border-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-200">
                        🎓 Maharashtra GS
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {t("censusDesc", language)}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-0.5 text-slate-700 ring-1 ring-sky-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-sky-900/40">
                        🏆 Top / Bottom 10
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-0.5 text-slate-700 ring-1 ring-sky-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-sky-900/40">
                        🎯 Rank Race
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-0.5 text-slate-700 ring-1 ring-sky-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-sky-900/40">
                        ❓ 10-Q quiz
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-0.5 text-slate-700 ring-1 ring-sky-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-sky-900/40">
                        🧠 Flashcards
                      </span>
                    </div>

                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-600 to-cyan-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-sky-300/40 transition-all group-hover:shadow-lg group-hover:shadow-sky-400/50 dark:shadow-sky-900/40">
                      {t("playGame", language)}
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-600 text-center max-w-md">
              {t("logoTip", language)}
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
              {t("backToHome", language)}
            </button>
            <Leaderboard guestUserId={guestIdentity?.userId} />
          </div>
        ) : appMode === "notes" ? (
          <div className="py-2 sm:py-4">
            <NotesView
              language={language}
              onBack={() => {
                setAppMode("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onOpenTopicPractice={({ category, topic, source }) => {
                setPendingDirectTopic({ category, topic });
                setAppMode(source === "pyq" ? "topic" : "topic-tests");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        ) : appMode === "rto-amvi" ? (
          <div className="space-y-4 py-2 sm:py-4">
            <button
              onClick={() => { setAppMode("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t("backToHome", language)}
            </button>
            <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-white to-yellow-50 p-5 dark:border-amber-800/70 dark:from-amber-950/30 dark:via-slate-900 dark:to-yellow-950/30">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0M19.5 18.75a1.5 1.5 0 01-3 0M2.25 15.75v-6A2.25 2.25 0 014.5 7.5h15a2.25 2.25 0 012.25 2.25v6a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25zM5.25 11.25h13.5" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-amber-700 dark:text-amber-300">RTO AMVI</h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Assistant Motor Vehicle Inspector · past papers + 2020-pattern mock
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setAppMode("mock"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="shrink-0 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700"
                >
                  RTO Mock Test
                </button>
              </div>
            </div>
            <StudentView language={language} challenge={null} homeKey={homeKey} topicMode={false} guestUser={guestIdentity} directTopic={null} examFilter="RTO_AMVI" />
          </div>
        ) : appMode === "mock" ? (
          <MockTestView
            onExit={() => { setAppMode("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          />
        ) : appMode === "csat" ? (
          <CsatView
            language={language}
            onLanguageChange={(next) => {
              setLanguage(next);
              saveLanguage(next);
            }}
            onExit={() => { setAppMode("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          />
        ) : (
          <StudentView language={language} challenge={challenge} homeKey={homeKey} topicMode={appMode === "topic" || appMode === "topic-tests"} topicSource={appMode === "topic-tests" ? "catalog" : "pyq"} guestUser={guestIdentity} directTopic={pendingDirectTopic} />
        )}
      </main>

      {/* Ad slot temporarily removed during AdSense approval phase. */}

      {/* ---- Footer ---- */}
      <footer className="border-t border-slate-200/80 py-6 dark:border-slate-700/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              MPSC PYQ QUIZ &middot; Don&apos;t know Academy
            </p>
            <p className="text-[10px] text-slate-300 dark:text-slate-600">
              {t("footerTagline", language)}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <a href="/about" className="text-xs text-slate-400 underline-offset-2 hover:text-indigo-600 hover:underline dark:text-slate-500 dark:hover:text-indigo-400">
                {t("about", language)}
              </a>
              <a href="/contact" className="text-xs text-slate-400 underline-offset-2 hover:text-indigo-600 hover:underline dark:text-slate-500 dark:hover:text-indigo-400">
                {t("contact", language)}
              </a>
              <a href="/donate" className="text-xs text-slate-400 underline-offset-2 hover:text-indigo-600 hover:underline dark:text-slate-500 dark:hover:text-indigo-400">
                {t("donate", language)}
              </a>
              <a href="/exams" className="text-xs text-slate-400 underline-offset-2 hover:text-indigo-600 hover:underline dark:text-slate-500 dark:hover:text-indigo-400">
                {t("exams", language)}
              </a>
              <a href="/map" className="text-xs text-slate-400 underline-offset-2 hover:text-indigo-600 hover:underline dark:text-slate-500 dark:hover:text-indigo-400">
                {t("map", language)}
              </a>
              <a href="/study-guides" className="text-xs text-slate-400 underline-offset-2 hover:text-indigo-600 hover:underline dark:text-slate-500 dark:hover:text-indigo-400">
                {t("studyGuides", language)}
              </a>
              <a href="/privacy" className="text-xs text-slate-400 underline-offset-2 hover:text-indigo-600 hover:underline dark:text-slate-500 dark:hover:text-indigo-400">
                {t("privacy", language)}
              </a>
              <a href="/terms" className="text-xs text-slate-400 underline-offset-2 hover:text-indigo-600 hover:underline dark:text-slate-500 dark:hover:text-indigo-400">
                {t("terms", language)}
              </a>
              <a href="/disclaimer" className="text-xs text-slate-400 underline-offset-2 hover:text-indigo-600 hover:underline dark:text-slate-500 dark:hover:text-indigo-400">
                {t("disclaimer", language)}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LeaderboardTile({
  onClick,
  className = "",
  language,
}: {
  onClick: () => void;
  className?: string;
  language: Language;
}) {
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
          <div className="mb-0.5 flex flex-wrap items-center gap-2">
            <h3 className="min-w-0 break-words text-lg font-bold text-amber-700 sm:text-xl dark:text-amber-300">
              {t("leaderboardTileTitle", language)}
            </h3>
            <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              {t("live", language)}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("leaderboardTileDesc", language)}
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
