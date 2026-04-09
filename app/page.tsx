"use client";

import { useState } from "react";
import { AppMode } from "@/lib/types";
import AdminView from "@/components/AdminView";
import StudentView from "@/components/StudentView";

export default function Home() {
  const [mode, setMode] = useState<AppMode>("admin");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50">
      {/* ---- Top Navigation Bar ---- */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MPSC Logo" className="h-10 w-10 rounded-full object-cover shadow-sm ring-1 ring-slate-200" />
            <div>
              <h1 className="text-base font-bold leading-tight text-slate-800">MPSC PYQ Quiz</h1>
              <p className="text-[10px] font-medium text-slate-400">Don&apos;t know Academy</p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setMode("admin")}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                mode === "admin"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin
            </button>
            <button
              onClick={() => setMode("student")}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                mode === "student"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
              Student
            </button>
          </div>
        </div>
      </header>

      {/* ---- Main Content ---- */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Mode Indicator */}
        <div className="mb-6 flex items-center gap-2">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              mode === "admin" ? "bg-amber-400" : "bg-emerald-400"
            }`}
          />
          <span className="text-sm font-medium text-slate-500">
            {mode === "admin" ? "Admin Mode — Create & manage quizzes" : "Student Mode — Take a quiz"}
          </span>
        </div>

        {mode === "admin" ? <AdminView /> : <StudentView />}
      </main>

      {/* ---- Footer ---- */}
      <footer className="border-t border-slate-200/80 py-6 text-center text-xs text-slate-400">
        MPSC PYQ Quiz &middot; Don&apos;t know Academy
      </footer>
    </div>
  );
}
