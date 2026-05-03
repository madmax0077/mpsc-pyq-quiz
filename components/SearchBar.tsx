"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Question, OptionKey } from "@/lib/types";
import { isQuestionCancelled, optionText } from "@/lib/questionUtils";

export interface SearchNavigatePayload {
  question: Question;
  quizId: string;
  quizTitle: string;
}

export interface SearchResult {
  question: Question;
  quizTitle: string;
  quizId: string;
}

interface Props {
  allQuestions: SearchResult[];
  onNavigateToQuestion?: (payload: SearchNavigatePayload) => void;
  navigateLabel?: (payload: SearchNavigatePayload) => string;
}

export default function SearchBar({ allQuestions, onNavigateToQuestion, navigateLabel }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const lower = query.toLowerCase();
    return allQuestions
      .filter(
        (r) =>
          r.question.text.toLowerCase().includes(lower) ||
          Object.values(r.question.options).some((o) => String(o).toLowerCase().includes(lower)),
      )
      .slice(0, 15);
  }, [query, allQuestions]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setExpandedKey(null);
  };

  const navigate = (r: SearchResult) => {
    if (!onNavigateToQuestion) return;
    onNavigateToQuestion({
      question: r.question,
      quizId: r.quizId,
      quizTitle: r.quizTitle,
    });
    close();
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-400 shadow-sm hover:border-indigo-300 hover:text-indigo-500 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500 dark:hover:border-indigo-600 dark:hover:text-indigo-400"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <span className="hidden sm:inline">Search</span>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/30 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:bg-slate-800 dark:border-slate-700"
        role="dialog"
        aria-modal="true"
        aria-label="Search questions"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setExpandedKey(null);
            }}
            placeholder="Search questions by keyword..."
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none dark:text-slate-100 dark:placeholder-slate-500"
          />
          <button
            type="button"
            onClick={() => close()}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.length < 2 ? (
            <p className="px-3 py-6 text-center text-sm text-slate-400 dark:text-slate-500">Type at least 2 characters to search...</p>
          ) : results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-slate-400 dark:text-slate-500">No questions found for &ldquo;{query}&rdquo;</p>
          ) : (
            <div className="space-y-1">
              {results.map((r, idx) => {
                const rowKey = `${r.quizId}::${r.question.id}::${idx}`;
                const isExpanded = expandedKey === rowKey;
                return (
                  <div
                    key={rowKey}
                    className="rounded-lg px-3 py-2.5 hover:bg-slate-50 transition-colors dark:hover:bg-slate-700/50"
                  >
                    <div className="flex items-start gap-2">
                      <button
                        type="button"
                        onClick={() => setExpandedKey(isExpanded ? null : rowKey)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <p className="text-sm text-slate-700 dark:text-slate-200 line-clamp-2">
                          {highlightMatch(r.question.text.split("\n")[0], query)}
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                          {r.quizTitle}
                          {r.question.category && (
                            <span className="ml-1.5 rounded bg-indigo-100 px-1.5 py-0.5 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                              {r.question.category}
                            </span>
                          )}
                        </p>
                      </button>
                      {onNavigateToQuestion && (
                        <button
                          type="button"
                          title="Go to this question"
                          onClick={() => navigate(r)}
                          className="shrink-0 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                        >
                          Go
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setExpandedKey(isExpanded ? null : rowKey)}
                        className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? "Hide details" : "Show details"}
                      >
                        <svg
                          className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="mt-2 rounded-lg bg-slate-100 p-3 text-xs dark:bg-slate-900">
                        {isQuestionCancelled(r.question) && (
                          <p className="mb-2 rounded bg-amber-100 px-2 py-1.5 font-medium text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">
                            Cancelled by MPSC — no official key (X).
                          </p>
                        )}
                        {(["A", "B", "C", "D"] as OptionKey[]).map((k) => (
                          <div
                            key={k}
                            className={`flex items-start gap-2 rounded px-2 py-1 ${
                              !isQuestionCancelled(r.question) && k === r.question.correctAnswer
                                ? "bg-emerald-100 text-emerald-800 font-semibold dark:bg-emerald-900/30 dark:text-emerald-300"
                                : "text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            <span className="font-bold shrink-0">{k}.</span>
                            <span>{optionText(r.question, k)}</span>
                            {!isQuestionCancelled(r.question) && k === r.question.correctAnswer && (
                              <span className="ml-auto shrink-0">✓</span>
                            )}
                          </div>
                        ))}
                        {onNavigateToQuestion && (
                          <button
                            type="button"
                            onClick={() => navigate(r)}
                            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                            {navigateLabel
                              ? navigateLabel({
                                  question: r.question,
                                  quizId: r.quizId,
                                  quizTitle: r.quizTitle,
                                })
                              : r.question.category
                                ? `Practice in ${r.question.category}`
                                : "Go to Question"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-yellow-900 rounded dark:bg-yellow-800 dark:text-yellow-100">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}
