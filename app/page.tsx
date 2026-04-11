"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import type { Language } from "@/lib/types";
import LoginPage from "@/components/LoginPage";
import StudentView from "@/components/StudentView";

export default function Home() {
  const { loading, studentUser, logoutStudent } = useAuth();
  const [language, setLanguage] = useState<Language>("english");
  const [dark, setDark] = useState(false);
  const [challenge, setChallenge] = useState<{ quizId: string; name: string; score: number; total: number } | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const params = new URLSearchParams(window.location.search);
    const cq = params.get("cq");
    const cs = params.get("cs");
    const ct = params.get("ct");
    const cn = params.get("cn");
    if (cq && cs && ct) {
      setChallenge({ quizId: cq, name: cn || "A friend", score: parseInt(cs, 10), total: parseInt(ct, 10) });
      window.history.replaceState({}, "", window.location.pathname);
    }
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

  if (!studentUser) return <LoginPage />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
      {/* ---- Top Navigation Bar ---- */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <img src="/logo.png" alt="MPSC Logo" className="h-10 w-10 rounded-full object-cover shadow-sm ring-1 ring-slate-200 dark:ring-slate-700" />
            <div>
              <h1 className="text-base font-bold leading-tight text-slate-800 dark:text-slate-100">MPSC PYQ QUIZ</h1>
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">Don&apos;t know Academy</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              {dark ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <option value="english">English</option>
                <option value="marathi">मराठी</option>
              </select>
              <div className="flex items-center gap-2">
                {studentUser.photoURL && (
                  <img
                    src={studentUser.photoURL}
                    alt=""
                    className="h-8 w-8 rounded-full ring-2 ring-white"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-slate-700 leading-tight dark:text-slate-200">
                    {studentUser.displayName || "Aspirant"}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">{studentUser.email}</p>
                </div>
              </div>
              <button
                onClick={logoutStudent}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ---- Main Content ---- */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <StudentView language={language} challenge={challenge} />
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
