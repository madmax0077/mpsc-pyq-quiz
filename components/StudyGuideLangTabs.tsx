"use client";

import { useState, type ReactNode } from "react";
import { STUDY_GUIDE_PROSE_CLASS } from "@/lib/studyGuideStyles";

type Props = {
  english: ReactNode;
  marathi: ReactNode;
};

export default function StudyGuideLangTabs({ english, marathi }: Props) {
  const [lang, setLang] = useState<"en" | "mr">("en");

  return (
    <div>
      {/* not-prose ONLY on the tab bar — never wrap the article body in not-prose
          or Tailwind Typography will strip bullets / list spacing from children. */}
      <div
        className="not-prose sticky top-0 z-10 mb-8 flex gap-1 rounded-2xl border border-slate-200/90 bg-slate-100/95 p-1.5 shadow-sm backdrop-blur dark:border-slate-600 dark:bg-slate-900/95"
        role="tablist"
        aria-label="Language"
      >
        <button
          type="button"
          role="tab"
          aria-selected={lang === "en"}
          onClick={() => setLang("en")}
          className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
            lang === "en"
              ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-800 dark:text-indigo-300"
              : "text-slate-500 hover:bg-white/50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
          }`}
        >
          English
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={lang === "mr"}
          onClick={() => setLang("mr")}
          className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
            lang === "mr"
              ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-800 dark:text-indigo-300"
              : "text-slate-500 hover:bg-white/50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
          }`}
        >
          मराठी
        </button>
      </div>

      <div
        role="tabpanel"
        lang={lang === "en" ? "en" : "mr"}
        className={`study-guide-prose ${STUDY_GUIDE_PROSE_CLASS}`}
      >
        {lang === "en" ? english : marathi}
      </div>
    </div>
  );
}
